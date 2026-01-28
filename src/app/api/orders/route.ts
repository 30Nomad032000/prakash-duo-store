import { NextRequest, NextResponse } from 'next/server';
import { createOrderRequestSchema } from '@/lib/schemas';
import { createCashfreeOrder, generateOrderId, calculateOrderTotals } from '@/lib/cashfree';
import { createOrder, getOrderByOrderId } from '@/lib/supabase-orders';
import type { Order, CreateOrderResponse, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
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

    // Calculate totals
    const { subtotal, shipping, tax, total } = calculateOrderTotals(items);

    // Generate order ID
    const orderId = generateOrderId();
    const customerId = `CUST-${Date.now().toString(36)}`.toUpperCase();

    // Create Cashfree order session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    let paymentSessionId: string;

    try {
      const cashfreeOrder = await createCashfreeOrder({
        orderId,
        orderAmount: total,
        orderCurrency: 'INR',
        customerDetails: {
          customerId,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerName: `${customer.firstName} ${customer.lastName}`,
        },
        orderMeta: {
          returnUrl: `${baseUrl}/order-confirmation?order_id=${orderId}`,
          notifyUrl: `${baseUrl}/api/payments/webhook`,
        },
      });

      paymentSessionId = cashfreeOrder.paymentSessionId;
    } catch (cashfreeError) {
      console.error('Cashfree error:', cashfreeError);
      // For development/testing without Cashfree credentials, generate a mock session
      if (process.env.NODE_ENV === 'development' && !process.env.CASHFREE_APP_ID) {
        paymentSessionId = `mock_session_${Date.now()}`;
      } else {
        throw cashfreeError;
      }
    }

    // Create order in Supabase
    await createOrder({
      orderId,
      customer,
      shippingAddress,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentSessionId,
    });

    return NextResponse.json<ApiResponse<CreateOrderResponse>>({
      success: true,
      data: {
        orderId,
        paymentSessionId,
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
