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

// Cashfree Types
export interface CashfreeOrderRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl?: string;
  };
}

export interface CashfreeOrderResponse {
  cfOrderId: string;
  orderId: string;
  entity: string;
  orderCurrency: string;
  orderAmount: number;
  orderStatus: string;
  paymentSessionId: string;
  orderExpiryTime: string;
  orderNote: string | null;
  createdAt: string;
  orderSplits: unknown[];
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl: string | null;
    paymentMethods: string | null;
  };
  payments: {
    url: string;
  };
  settlements: {
    url: string;
  };
  refunds: {
    url: string;
  };
}

export interface CashfreePaymentVerification {
  cfPaymentId: string;
  orderId: string;
  orderAmount: number;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED' | 'VOID' | 'CANCELLED' | 'NOT_ATTEMPTED';
  paymentMessage: string;
  paymentTime: string;
  bankReference: string;
  authId: string | null;
  paymentMethod: {
    [key: string]: unknown;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  paymentSessionId: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  orderId: string;
  paymentStatus: string;
  message: string;
}
