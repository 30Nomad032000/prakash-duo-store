import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendShippingNotification } from '@/lib/email/send';
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
    const body = await request.json();
    const { trackingId, estimatedDelivery, notes } = body;

    if (!trackingId) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID is required' },
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

    // Check if tracking already exists
    const { data: existingTracking } = await supabase
      .from('shipping_tracking')
      .select('id')
      .eq('order_id', order.id)
      .single();

    const trackingData = {
      carrier: 'DTDC',
      tracking_id: trackingId,
      shipped_at: new Date().toISOString(),
      estimated_delivery: estimatedDelivery || null,
      notes: notes || null,
    };

    if (existingTracking) {
      // Update existing tracking
      await supabase
        .from('shipping_tracking')
        .update(trackingData)
        .eq('order_id', order.id);
    } else {
      // Create new tracking
      await supabase.from('shipping_tracking').insert({
        order_id: order.id,
        ...trackingData,
      });
    }

    // Update order status to shipped
    await supabase
      .from('orders')
      .update({ status: 'shipped' })
      .eq('id', order.id);

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
      status: 'shipped',
      paymentStatus: order.payment_status,
      paymentSessionId: order.payment_session_id || undefined,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    // Send shipping notification email
    await sendShippingNotification(orderForEmail, {
      carrier: 'DTDC',
      trackingId,
      estimatedDelivery,
    });

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
    console.error('Error adding tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add tracking' },
      { status: 500 }
    );
  }
}
