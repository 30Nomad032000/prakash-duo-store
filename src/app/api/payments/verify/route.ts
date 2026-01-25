import { NextRequest, NextResponse } from 'next/server';
import { getOrderPayments } from '@/lib/cashfree';
import { getOrder, setOrder } from '@/lib/orders-store';
import type { ApiResponse, VerifyPaymentResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = getOrder(orderId);

    if (!order) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // If already verified, return cached status
    if (order.paymentStatus === 'paid') {
      return NextResponse.json<ApiResponse<VerifyPaymentResponse>>({
        success: true,
        data: {
          verified: true,
          orderId: order.orderId,
          paymentStatus: order.paymentStatus,
          message: 'Payment successful',
        },
      });
    }

    let paymentStatus = 'pending';
    let message = 'Payment pending';

    try {
      // Get payment status from Cashfree
      const payments = await getOrderPayments(orderId);
      const successfulPayment = payments.find(p => p.paymentStatus === 'SUCCESS');

      if (successfulPayment) {
        paymentStatus = 'paid';
        message = 'Payment successful';

        // Update order status
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.updatedAt = new Date().toISOString();
        setOrder(orderId, order);
      } else if (payments.some(p => p.paymentStatus === 'FAILED')) {
        paymentStatus = 'failed';
        message = 'Payment failed';

        order.paymentStatus = 'failed';
        order.updatedAt = new Date().toISOString();
        setOrder(orderId, order);
      }
    } catch (cashfreeError) {
      console.error('Cashfree verification error:', cashfreeError);
      // In development without Cashfree, assume success for testing
      if (process.env.NODE_ENV === 'development' && !process.env.CASHFREE_APP_ID) {
        paymentStatus = 'paid';
        message = 'Payment verified (test mode)';

        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.updatedAt = new Date().toISOString();
        setOrder(orderId, order);
      }
    }

    return NextResponse.json<ApiResponse<VerifyPaymentResponse>>({
      success: true,
      data: {
        verified: paymentStatus === 'paid',
        orderId: order.orderId,
        paymentStatus,
        message,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment',
      },
      { status: 500 }
    );
  }
}
