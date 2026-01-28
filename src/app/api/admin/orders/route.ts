import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = getUntypedClient();

    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `order_id.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
      );
    }

    query = query.range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Transform to API format
    const transformedOrders = orders?.map((order) => ({
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
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      total: count || 0,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
