import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, fetchPayment } from '@/lib/razorpay';
import { getOrderByOrderId, updatePaymentStatus } from '@/lib/supabase-orders';
import type { ApiResponse, VerifyPaymentResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await getOrderByOrderId(order_id);
    if (!order) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Idempotency: already processed
    if (order.paymentStatus === 'paid') {
      return NextResponse.json<ApiResponse<VerifyPaymentResponse>>({
        success: true,
        data: {
          verified: true,
          orderId: order.orderId,
          paymentStatus: 'paid',
          message: 'Payment already verified',
        },
      });
    }

    // Verify that the razorpay_order_id matches what we stored
    if (order.paymentSessionId !== razorpay_order_id) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Order ID mismatch' },
        { status: 400 }
      );
    }

    // Step 1: Verify the signature from client callback
    const isSignatureValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isSignatureValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Step 2: Server-side verification — fetch payment from Razorpay API
    const payment = await fetchPayment(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return NextResponse.json<ApiResponse<VerifyPaymentResponse>>({
        success: true,
        data: {
          verified: false,
          orderId: order.orderId,
          paymentStatus: payment.status as string,
          message: `Payment status: ${payment.status}`,
        },
      });
    }

    // Step 3: Verify amount matches (prevent amount tampering)
    const expectedAmountInPaise = Math.round(order.total * 100);
    if ((payment.amount as number) !== expectedAmountInPaise) {
      console.error(
        `Amount mismatch for order ${order_id}: expected ${expectedAmountInPaise}, got ${payment.amount}`
      );
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Payment amount mismatch' },
        { status: 400 }
      );
    }

    // Step 4: Mark as paid — stock deduction and emails are handled
    // exclusively by the webhook to prevent double processing.
    await updatePaymentStatus(order_id, 'paid');

    return NextResponse.json<ApiResponse<VerifyPaymentResponse>>({
      success: true,
      data: {
        verified: true,
        orderId: order.orderId,
        paymentStatus: 'paid',
        message: 'Payment verified successfully',
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
