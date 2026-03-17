import crypto from 'crypto';
import Razorpay from 'razorpay';
import { getProductById } from './products';

// Razorpay instance (lazy initialized)
let razorpayInstance: InstanceType<typeof Razorpay> | null = null;

function getRazorpay(): InstanceType<typeof Razorpay> {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured');
    }
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

// Create a Razorpay order
export async function createRazorpayOrder(params: {
  amount: number; // in rupees — will be converted to paise
  receipt: string; // our order ID
  currency?: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string; receipt: string }> {
  const razorpay = getRazorpay();
  const amountInPaise = Math.round(params.amount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: params.currency || 'INR',
    receipt: params.receipt,
    notes: params.notes || {},
  });

  return {
    id: order.id,
    amount: order.amount as number,
    currency: order.currency,
    receipt: order.receipt || params.receipt,
  };
}

// Verify payment signature (client-side callback verification)
// Uses: razorpay_order_id|razorpay_payment_id signed with key_secret
export function verifyPaymentSignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('Razorpay key secret not configured');
  }

  const body = params.razorpay_order_id + '|' + params.razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(params.razorpay_signature, 'hex')
    );
  } catch {
    return false;
  }
}

// Verify webhook signature
// Razorpay signs the raw request body with the webhook secret
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Razorpay webhook secret not configured');
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

// Fetch payment details from Razorpay API (server-side verification)
export async function fetchPayment(paymentId: string) {
  const razorpay = getRazorpay();
  return razorpay.payments.fetch(paymentId);
}

// Generate cryptographically random order ID
export function generateOrderId(): string {
  const randomBytes = crypto.randomBytes(8).toString('hex');
  return `PD-${randomBytes.slice(0, 6).toUpperCase()}-${randomBytes.slice(6).toUpperCase()}`;
}

// Calculate shipping cost
export function calculateShipping(subtotal: number): number {
  const FREE_SHIPPING_THRESHOLD = 599;
  const SHIPPING_COST = 99;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

// Server-side price validation: look up real prices from product data
// Never trust client-sent prices
export function validateAndCalculateOrderTotals(
  items: Array<{ productId: string; size: string; quantity: number }>
): { subtotal: number; shipping: number; tax: number; total: number; validatedItems: Array<{ productId: string; name: string; price: number; image: string; size: string; quantity: number }> } {
  const validatedItems: Array<{ productId: string; name: string; price: number; image: string; size: string; quantity: number }> = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (!product.sizes.includes(item.size)) {
      throw new Error(`Invalid size "${item.size}" for product: ${product.name}`);
    }

    if (item.quantity < 1 || item.quantity > 10) {
      throw new Error(`Invalid quantity for product: ${product.name}`);
    }

    validatedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: item.size,
      quantity: item.quantity,
    });

    subtotal += product.price * item.quantity;
  }

  const shipping = calculateShipping(subtotal);
  const tax = 0;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total, validatedItems };
}
