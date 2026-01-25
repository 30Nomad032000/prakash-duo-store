import crypto from 'crypto';
import type { CashfreeOrderRequest, CashfreeOrderResponse, CashfreePaymentVerification } from './types';

// Cashfree API configuration
const CASHFREE_BASE_URL = process.env.CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-client-id': CASHFREE_APP_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01',
  };
}

// Create a Cashfree order session
export async function createCashfreeOrder(
  request: CashfreeOrderRequest
): Promise<CashfreeOrderResponse> {
  const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      order_id: request.orderId,
      order_amount: request.orderAmount,
      order_currency: request.orderCurrency,
      customer_details: {
        customer_id: request.customerDetails.customerId,
        customer_email: request.customerDetails.customerEmail,
        customer_phone: request.customerDetails.customerPhone,
        customer_name: request.customerDetails.customerName,
      },
      order_meta: {
        return_url: request.orderMeta.returnUrl,
        notify_url: request.orderMeta.notifyUrl,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create Cashfree order');
  }

  const data = await response.json();

  return {
    cfOrderId: data.cf_order_id,
    orderId: data.order_id,
    entity: data.entity,
    orderCurrency: data.order_currency,
    orderAmount: data.order_amount,
    orderStatus: data.order_status,
    paymentSessionId: data.payment_session_id,
    orderExpiryTime: data.order_expiry_time,
    orderNote: data.order_note,
    createdAt: data.created_at,
    orderSplits: data.order_splits,
    customerDetails: {
      customerId: data.customer_details.customer_id,
      customerName: data.customer_details.customer_name,
      customerEmail: data.customer_details.customer_email,
      customerPhone: data.customer_details.customer_phone,
    },
    orderMeta: {
      returnUrl: data.order_meta.return_url,
      notifyUrl: data.order_meta.notify_url,
      paymentMethods: data.order_meta.payment_methods,
    },
    payments: data.payments,
    settlements: data.settlements,
    refunds: data.refunds,
  };
}

// Get order payment status
export async function getOrderPayments(orderId: string): Promise<CashfreePaymentVerification[]> {
  const response = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}/payments`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get order payments');
  }

  const data = await response.json();

  return data.map((payment: Record<string, unknown>) => ({
    cfPaymentId: payment.cf_payment_id,
    orderId: payment.order_id,
    orderAmount: payment.order_amount,
    paymentStatus: payment.payment_status,
    paymentMessage: payment.payment_message,
    paymentTime: payment.payment_time,
    bankReference: payment.bank_reference,
    authId: payment.auth_id,
    paymentMethod: payment.payment_method,
  }));
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  timestamp: string,
  signature: string
): boolean {
  const message = timestamp + payload;
  const expectedSignature = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(message)
    .digest('base64');

  return signature === expectedSignature;
}

// Generate unique order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `PD-${timestamp}-${randomPart}`.toUpperCase();
}

// Calculate shipping cost
export function calculateShipping(subtotal: number): number {
  const FREE_SHIPPING_THRESHOLD = 999;
  const SHIPPING_COST = 99;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

// Calculate order totals
export function calculateOrderTotals(items: Array<{ price: number; quantity: number }>) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const tax = 0; // No separate tax for now, included in price
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}
