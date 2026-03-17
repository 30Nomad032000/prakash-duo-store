import { NextRequest, NextResponse } from 'next/server';
import { createOrderRequestSchema } from '@/lib/schemas';
import { createRazorpayOrder, generateOrderId, validateAndCalculateOrderTotals } from '@/lib/razorpay';
import { createOrder, getOrderByOrderId, reserveStock } from '@/lib/supabase-orders';
import type { Order, CreateOrderResponse, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request structure
    const result = createOrderRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: result.error.issues.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, items } = result.data;

    // Server-side price validation — never trust client prices
    let totals;
    try {
      totals = validateAndCalculateOrderTotals(
        items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        }))
      );
    } catch (validationError) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: validationError instanceof Error ? validationError.message : 'Invalid cart items',
        },
        { status: 400 }
      );
    }

    const { subtotal, shipping, tax, total, validatedItems } = totals;

    // Check live inventory and reserve stock
    const stockItems = validatedItems.map((item) => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
    }));

    const stockReserved = await reserveStock(stockItems);
    if (!stockReserved) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'One or more items are out of stock. Please update your cart and try again.',
        },
        { status: 409 }
      );
    }

    // Generate cryptographically random order ID
    const orderId = generateOrderId();

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: total,
      receipt: orderId,
      notes: {
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
      },
    });

    // Create order in Supabase
    await createOrder({
      orderId,
      customer,
      shippingAddress,
      items: validatedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentSessionId: razorpayOrder.id, // store razorpay_order_id
    });

    return NextResponse.json<ApiResponse<CreateOrderResponse>>({
      success: true,
      data: {
        orderId,
        razorpayOrderId: razorpayOrder.id,
        keyId: process.env.RAZORPAY_KEY_ID!,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        prefill: {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          contact: customer.phone,
        },
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

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

    // Validate order ID format to prevent enumeration
    // Accepts both old format (base36) and new format (hex)
    if (!/^PD-[A-Z0-9]{5,8}-[A-Z0-9]{5,10}$/.test(orderId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid order ID format' },
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

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get order',
      },
      { status: 500 }
    );
  }
}
