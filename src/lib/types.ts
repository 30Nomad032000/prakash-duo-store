// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

// Customer Types
export interface Customer {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

// Address Types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderId: string;
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Razorpay Types
export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  orderId: string;
  amount: number;
  keyId: string;
}

export interface RazorpayVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string; // our internal order ID
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface VerifyPaymentResponse {
  verified: boolean;
  orderId: string;
  paymentStatus: string;
  message: string;
}
