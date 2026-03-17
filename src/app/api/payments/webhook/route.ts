import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, fetchPayment } from '@/lib/razorpay';
import { getOrderByOrderId, updatePaymentStatus, updateOrderStatus, commitStockSale, releaseStock } from '@/lib/supabase-orders';
import { sendOrderConfirmation, sendNewOrderNotification } from '@/lib/email/send';

interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        description: string | null;
        email: string;
        contact: string;
        notes: Record<string, string>;
        error_code: string | null;
        error_description: string | null;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        status: string;
      };
    };
  };
  created_at: number;
}

export async function POST(request: NextRequest) {
  try {
    // Read raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // NEVER skip signature verification — fail closed
    if (!signature) {
      console.error('Webhook missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData: RazorpayWebhookPayload = JSON.parse(rawBody);
    const event = webhookData.event;

    console.log('Razorpay webhook received:', event);

    // We only care about payment events
    if (event !== 'payment.captured' && event !== 'payment.failed') {
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    const paymentEntity = webhookData.payload.payment.entity;
    const razorpayOrderId = paymentEntity.order_id;

    if (!razorpayOrderId) {
      console.error('Webhook missing order_id in payment entity');
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Find our order by the stored razorpay_order_id (stored as payment_session_id)
    // We need to look up by the razorpay order ID, which we stored in payment_session_id
    const order = await findOrderByRazorpayOrderId(razorpayOrderId);

    if (!order) {
      console.error('Order not found for razorpay order:', razorpayOrderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: skip if already processed
    if (order.paymentStatus === 'paid' && event === 'payment.captured') {
      console.log(`Order ${order.orderId} already processed, skipping`);
      return NextResponse.json({ success: true });
    }

    if (event === 'payment.captured') {
      // Verify amount matches our order total (prevent amount tampering)
      const expectedAmountInPaise = Math.round(order.total * 100);
      if (paymentEntity.amount !== expectedAmountInPaise) {
        console.error(
          `Amount mismatch for order ${order.orderId}: expected ${expectedAmountInPaise}, got ${paymentEntity.amount}`
        );
        // Still update but flag for manual review
        await updateOrderStatus(order.orderId, 'pending');
        return NextResponse.json({ error: 'Amount mismatch — flagged for review' }, { status: 400 });
      }

      // Double-check with Razorpay API (belt and suspenders)
      try {
        const payment = await fetchPayment(paymentEntity.id);
        if (payment.status !== 'captured') {
          console.error(`Payment ${paymentEntity.id} status mismatch: webhook says captured, API says ${payment.status}`);
          return NextResponse.json({ error: 'Payment status mismatch' }, { status: 400 });
        }
      } catch (fetchErr) {
        console.error('Failed to fetch payment from Razorpay API:', fetchErr);
        // Proceed with webhook data since signature was verified
      }

      await updatePaymentStatus(order.orderId, 'paid');
      await updateOrderStatus(order.orderId, 'confirmed');
      console.log(`Order ${order.orderId} payment captured`);

      // Commit stock sale
      const stockItems = order.items.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      }));
      await commitStockSale(stockItems);

      // Send order confirmation email + notify store owner
      const updatedOrder = await getOrderByOrderId(order.orderId);
      if (updatedOrder) {
        await sendOrderConfirmation(updatedOrder).catch((emailErr) => {
          console.error('Failed to send confirmation email:', emailErr);
        });

        await sendNewOrderNotification(updatedOrder).catch((emailErr) => {
          console.error('Failed to send owner notification:', emailErr);
        });
      }
    } else if (event === 'payment.failed') {
      await updatePaymentStatus(order.orderId, 'failed');
      await updateOrderStatus(order.orderId, 'cancelled');

      // Release reserved stock back to inventory
      const stockItems = order.items.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      }));
      await releaseStock(stockItems).catch((err) => {
        console.error('Failed to release stock on payment failure:', err);
      });

      console.log(`Order ${order.orderId} payment failed: ${paymentEntity.error_description}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Helper: find order by razorpay_order_id (stored in payment_session_id column)
async function findOrderByRazorpayOrderId(razorpayOrderId: string) {
  // We need to search orders by payment_session_id field
  // Using a direct Supabase query since getOrderByOrderId searches by our internal order_id
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: order, error } = await supabase
    .from('orders')
    .select('order_id')
    .eq('payment_session_id', razorpayOrderId)
    .single();

  if (error || !order) return null;

  return getOrderByOrderId(order.order_id);
}
