import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getUntypedClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*), shipping_tracking(*)')
      .eq('order_id', id)
      .single();

    if (orderError) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const transformedOrder = {
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
        apartment: order.shipping_apartment,
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
      status: order.status,
      paymentStatus: order.payment_status,
      paymentSessionId: order.payment_session_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      trackingInfo: order.shipping_tracking?.[0]
        ? {
            carrier: order.shipping_tracking[0].carrier,
            trackingId: order.shipping_tracking[0].tracking_id,
            shippedAt: order.shipping_tracking[0].shipped_at,
            deliveredAt: order.shipping_tracking[0].delivered_at,
            estimatedDelivery: order.shipping_tracking[0].estimated_delivery,
            notes: order.shipping_tracking[0].notes,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate allowed transitions
    const allowedTransitions: Record<string, string[]> = {
      pending: ['confirmed'],
      confirmed: ['processing'],
      processing: [], // processing → shipped goes through /tracking endpoint
      shipped: ['delivered'],
    };

    const supabase = getUntypedClient();

    // Get current order status
    const { data: currentOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('status')
      .eq('order_id', id)
      .single();

    if (fetchErr || !currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const allowed = allowedTransitions[currentOrder.status] || [];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Cannot transition from "${currentOrder.status}" to "${status}"` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Fetch updated order
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*), shipping_tracking(*)')
      .eq('order_id', id)
      .single();

    const transformedOrder = {
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
        apartment: order.shipping_apartment,
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
      status: order.status,
      paymentStatus: order.payment_status,
      paymentSessionId: order.payment_session_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      trackingInfo: order.shipping_tracking?.[0]
        ? {
            carrier: order.shipping_tracking[0].carrier,
            trackingId: order.shipping_tracking[0].tracking_id,
            shippedAt: order.shipping_tracking[0].shipped_at,
            deliveredAt: order.shipping_tracking[0].delivered_at,
            estimatedDelivery: order.shipping_tracking[0].estimated_delivery,
            notes: order.shipping_tracking[0].notes,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
