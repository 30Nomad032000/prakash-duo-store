// Database types for Supabase tables
// These types mirror the database schema

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type EmailType = 'order_confirmation' | 'shipping_notification' | 'delivery_confirmation' | 'new_order_notification';
export type EmailStatus = 'pending' | 'sent' | 'failed';

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProductInventory {
  id: string;
  product_id: string;
  size: string;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
}

export interface DbOrder {
  id: string;
  order_id: string;
  customer_email: string;
  customer_phone: string;
  customer_first_name: string;
  customer_last_name: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_apartment: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface DbShippingTracking {
  id: string;
  order_id: string;
  carrier: string;
  tracking_id: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  estimated_delivery: string | null;
  notes: string | null;
}

export interface DbEmailLog {
  id: string;
  order_id: string;
  email_type: EmailType;
  recipient_email: string;
  subject: string;
  status: EmailStatus;
  error_message: string | null;
  sent_at: string | null;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// View types
export interface LowStockProduct {
  product_id: string;
  name: string;
  category: string;
  size: string;
  quantity: number;
  low_stock_threshold: number;
}

export interface DailyOrderStats {
  date: string;
  order_count: number;
  revenue: number;
  shipped_count: number;
  delivered_count: number;
}

// Insert types (without auto-generated fields)
export interface InsertProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category: string;
  subcategory?: string;
  sizes?: string[];
  is_active?: boolean;
}

export interface InsertProductInventory {
  product_id: string;
  size: string;
  quantity?: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
}

export interface InsertOrder {
  order_id: string;
  customer_email: string;
  customer_phone: string;
  customer_first_name: string;
  customer_last_name: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_apartment?: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  payment_session_id?: string | null;
}

export interface InsertOrderItem {
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface InsertShippingTracking {
  order_id: string;
  carrier?: string;
  tracking_id?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  estimated_delivery?: string | null;
  notes?: string | null;
}

export interface InsertEmailLog {
  order_id: string;
  email_type: EmailType;
  recipient_email: string;
  subject: string;
  status?: EmailStatus;
  error_message?: string | null;
}

export interface InsertCategory {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateCategory {
  name?: string;
  slug?: string;
  is_active?: boolean;
  sort_order?: number;
}

// Update types
export interface UpdateProduct {
  name?: string;
  price?: number;
  images?: string[];
  category?: string;
  subcategory?: string;
  sizes?: string[];
  is_active?: boolean;
}

export interface UpdateProductInventory {
  quantity?: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
}

export interface UpdateOrder {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  payment_session_id?: string | null;
}

export interface UpdateShippingTracking {
  carrier?: string;
  tracking_id?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  estimated_delivery?: string | null;
  notes?: string | null;
}

// Full types with relations
export interface OrderWithItems extends DbOrder {
  order_items: DbOrderItem[];
  shipping_tracking?: DbShippingTracking | null;
}

export interface ProductWithInventory extends DbProduct {
  product_inventory: DbProductInventory[];
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      products: {
        Row: DbProduct;
        Insert: InsertProduct;
        Update: UpdateProduct;
      };
      product_inventory: {
        Row: DbProductInventory;
        Insert: InsertProductInventory;
        Update: UpdateProductInventory;
      };
      orders: {
        Row: DbOrder;
        Insert: InsertOrder;
        Update: UpdateOrder;
      };
      order_items: {
        Row: DbOrderItem;
        Insert: InsertOrderItem;
        Update: never;
      };
      shipping_tracking: {
        Row: DbShippingTracking;
        Insert: InsertShippingTracking;
        Update: UpdateShippingTracking;
      };
      email_logs: {
        Row: DbEmailLog;
        Insert: InsertEmailLog;
        Update: never;
      };
      categories: {
        Row: DbCategory;
        Insert: InsertCategory;
        Update: UpdateCategory;
      };
    };
    Views: {
      low_stock_products: {
        Row: LowStockProduct;
      };
      daily_order_stats: {
        Row: DailyOrderStats;
      };
    };
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      email_type: EmailType;
      email_status: EmailStatus;
    };
  };
}
