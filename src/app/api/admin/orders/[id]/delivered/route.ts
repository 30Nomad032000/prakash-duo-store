import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDeliveryConfirmation } from '@/lib/email/send';
import type { Order } from '@/lib/types';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update order status to delivered
    await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', order.id);

    // Update shipping tracking
    await supabase
      .from('shipping_tracking')
      .update({ delivered_at: new Date().toISOString() })
      .eq('order_id', order.id);

    // Transform order for email
    const orderForEmail: Order = {
      id: order.id,
      orderId: order.order_id,
      customer: {
        email: order.customer_email,
        phone: order.customer_phone,
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
      },
      shippingAddress: {
        firstName: order.shipping_first_name,
        lastName: order.shipping_last_name,
        address: order.shipping_address,
        apartment: order.shipping_apartment || undefined,
        city: order.shipping_city,
        state: order.shipping_state,
        pincode: order.shipping_pincode,
        phone: order.shipping_phone,
      },
      items: order.order_items.map((item: {
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
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: 'delivered',
      paymentStatus: order.payment_status,
      paymentSessionId: order.payment_session_id || undefined,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    // Send delivery confirmation email
    await sendDeliveryConfirmation(orderForEmail);

    // Fetch updated order
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('*, order_items(*), shipping_tracking(*)')
      .eq('order_id', id)
      .single();

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
    console.error('Error marking order as delivered:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark order as delivered' },
      { status: 500 }
    );
  }
}
