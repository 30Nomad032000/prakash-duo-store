import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOrderByOrderId, releaseStock } from '@/lib/supabase-orders';
import { sendCancellationEmail } from '@/lib/email/send';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Only these statuses can be cancelled
const CANCELLABLE_STATUSES = ['pending', 'confirmed', 'processing'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cancellation reason is required' },
        { status: 400 }
      );
    }

    const supabase = getUntypedClient();

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate the order can be cancelled
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        { success: false, error: `Cannot cancel an order with status "${order.status}". Only pending, confirmed, or processing orders can be cancelled.` },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: order.payment_status === 'paid' ? 'refunded' : order.payment_status,
      })
      .eq('id', order.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to cancel order' },
        { status: 500 }
      );
    }

    // Release reserved stock back to inventory
    const stockItems = order.order_items.map((item: { product_id: string; size: string; quantity: number }) => ({
      productId: item.product_id,
      size: item.size,
      quantity: item.quantity,
    }));

    try {
      await releaseStock(stockItems);
    } catch (stockErr) {
      console.error('Failed to release stock for cancelled order:', stockErr);
      // Don't fail the cancellation if stock release fails — can fix manually
    }

    // Send cancellation email to customer
    const orderData = await getOrderByOrderId(id);
    if (orderData) {
      await sendCancellationEmail(orderData, reason.trim()).catch((emailErr) => {
        console.error('Failed to send cancellation email:', emailErr);
      });
    }

    // Fetch updated order for response
    const { data: updatedOrder, error: refetchErr } = await supabase
      .from('orders')
      .select('*, order_items(*), shipping_tracking(*)')
      .eq('order_id', id)
      .single();

    if (refetchErr || !updatedOrder) {
      // Cancellation succeeded but refetch failed — still return success
      return NextResponse.json({ success: true, order: null });
    }

    const transformedOrder = {
      id: updatedOrder.id,
      orderId: updatedOrder.order_id,
      customer: {
        email: updatedOrder.customer_email,
        phone: updatedOrder.customer_phone,
        firstName: updatedOrder.customer_first_name,
        lastName: updatedOrder.customer_last_name,
      },
      shippingAddress: {
        firstName: updatedOrder.shipping_first_name,
        lastName: updatedOrder.shipping_last_name,
        address: updatedOrder.shipping_address,
        apartment: updatedOrder.shipping_apartment,
        city: updatedOrder.shipping_city,
        state: updatedOrder.shipping_state,
        pincode: updatedOrder.shipping_pincode,
        phone: updatedOrder.shipping_phone,
      },
      items: updatedOrder.order_items.map((item: {
        product_id: string;
        product_name: string;
        price: number;
        image: string;
        size: string;
        quantity: number;
      }) => ({
        productId: item.product_id,
        name: item.product_name,
        price: item.price,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
      })),
      subtotal: updatedOrder.subtotal,
      shipping: updatedOrder.shipping,
      tax: updatedOrder.tax,
      total: updatedOrder.total,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.payment_status,
      paymentSessionId: updatedOrder.payment_session_id,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at,
      trackingInfo: updatedOrder.shipping_tracking?.[0]
        ? {
            carrier: updatedOrder.shipping_tracking[0].carrier,
            trackingId: updatedOrder.shipping_tracking[0].tracking_id,
            shippedAt: updatedOrder.shipping_tracking[0].shipped_at,
            deliveredAt: updatedOrder.shipping_tracking[0].delivered_at,
            estimatedDelivery: updatedOrder.shipping_tracking[0].estimated_delivery,
            notes: updatedOrder.shipping_tracking[0].notes,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
