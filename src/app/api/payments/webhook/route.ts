import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/cashfree';
import { getOrder, setOrder } from '@/lib/orders-store';

interface CashfreeWebhookPayload {
  type: string;
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_status: string;
    };
    payment: {
      cf_payment_id: string;
      payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED' | 'VOID' | 'CANCELLED';
      payment_amount: number;
      payment_currency: string;
      payment_message: string;
      payment_time: string;
      bank_reference: string;
      auth_id: string | null;
      payment_method: {
        [key: string]: unknown;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const signature = request.headers.get('x-webhook-signature') || '';

    // Verify webhook signature (skip in development without credentials)
    if (process.env.CASHFREE_SECRET_KEY) {
      const isValid = verifyWebhookSignature(payload, timestamp, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const webhookData: CashfreeWebhookPayload = JSON.parse(payload);
    console.log('Webhook received:', webhookData.type, webhookData.data.order.order_id);

    const { order: orderData, payment } = webhookData.data;
    const orderId = orderData.order_id;

    // Get order from store
    const order = getOrder(orderId);

    if (!order) {
      console.error('Order not found for webhook:', orderId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order based on payment status
    switch (payment.payment_status) {
      case 'SUCCESS':
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        console.log(`Order ${orderId} payment successful`);
        break;

      case 'FAILED':
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
        console.log(`Order ${orderId} payment failed: ${payment.payment_message}`);
        break;

      case 'USER_DROPPED':
      case 'CANCELLED':
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
        console.log(`Order ${orderId} payment cancelled/dropped`);
        break;

      default:
        console.log(`Order ${orderId} payment status: ${payment.payment_status}`);
    }

    order.updatedAt = new Date().toISOString();
    setOrder(orderId, order);

    // Return success to Cashfree
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
