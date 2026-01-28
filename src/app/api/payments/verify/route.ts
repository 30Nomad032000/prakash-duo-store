import { NextRequest, NextResponse } from 'next/server';
import { getOrderPayments } from '@/lib/cashfree';
import { getOrderByOrderId, updatePaymentStatus, commitStockSale } from '@/lib/supabase-orders';
import { sendOrderConfirmation } from '@/lib/email/send';
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

    const order = await getOrderByOrderId(orderId);

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

        // Update order status in Supabase
        await updatePaymentStatus(orderId, 'paid');

        // Commit stock sale (deduct from inventory)
        const stockItems = order.items.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        }));
        await commitStockSale(stockItems);

        // Send order confirmation email
        const updatedOrder = await getOrderByOrderId(orderId);
        if (updatedOrder) {
          await sendOrderConfirmation(updatedOrder);
        }
      } else if (payments.some(p => p.paymentStatus === 'FAILED')) {
        paymentStatus = 'failed';
        message = 'Payment failed';

        await updatePaymentStatus(orderId, 'failed');
      }
    } catch (cashfreeError) {
      console.error('Cashfree verification error:', cashfreeError);
      // In development without Cashfree, assume success for testing
      if (process.env.NODE_ENV === 'development' && !process.env.CASHFREE_APP_ID) {
        paymentStatus = 'paid';
        message = 'Payment verified (test mode)';

        await updatePaymentStatus(orderId, 'paid');

        // Send order confirmation email
        const updatedOrder = await getOrderByOrderId(orderId);
        if (updatedOrder) {
          await sendOrderConfirmation(updatedOrder);
        }
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
