/**
 * Supabase Order Operations
 * Replaces the in-memory orders-store.ts with persistent database storage
 */

import { createClient } from '@supabase/supabase-js';
import type {
  DbOrder,
  DbOrderItem,
  DbShippingTracking,
  InsertOrder,
  InsertOrderItem,
  InsertShippingTracking,
  UpdateOrder,
  OrderStatus,
  PaymentStatus,
} from '@/lib/supabase/types';
import type { Order, OrderItem } from '@/lib/types';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Convert database order to API order format
function dbOrderToApiOrder(
  dbOrder: DbOrder,
  items: DbOrderItem[],
  tracking?: DbShippingTracking | null
): Order {
  return {
    id: dbOrder.id,
    orderId: dbOrder.order_id,
    customer: {
      email: dbOrder.customer_email,
      phone: dbOrder.customer_phone,
      firstName: dbOrder.customer_first_name,
      lastName: dbOrder.customer_last_name,
    },
    shippingAddress: {
      firstName: dbOrder.shipping_first_name,
      lastName: dbOrder.shipping_last_name,
      address: dbOrder.shipping_address,
      apartment: dbOrder.shipping_apartment || undefined,
      city: dbOrder.shipping_city,
      state: dbOrder.shipping_state,
      pincode: dbOrder.shipping_pincode,
      phone: dbOrder.shipping_phone,
    },
    items: items.map((item) => ({
      productId: item.product_id,
      name: item.product_name,
      price: item.price,
      image: item.image,
      size: item.size,
      quantity: item.quantity,
    })),
    subtotal: dbOrder.subtotal,
    shipping: dbOrder.shipping,
    tax: dbOrder.tax,
    total: dbOrder.total,
    status: dbOrder.status,
    paymentStatus: dbOrder.payment_status,
    paymentSessionId: dbOrder.payment_session_id || undefined,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    // Include tracking info if available
    ...(tracking && {
      trackingInfo: {
        carrier: tracking.carrier,
        trackingId: tracking.tracking_id,
        shippedAt: tracking.shipped_at,
        deliveredAt: tracking.delivered_at,
        estimatedDelivery: tracking.estimated_delivery,
        notes: tracking.notes,
      },
    }),
  };
}

// Create a new order
export async function createOrder(
  orderData: {
    orderId: string;
    customer: Order['customer'];
    shippingAddress: Order['shippingAddress'];
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    paymentSessionId?: string;
  }
): Promise<Order> {
  const supabase = getUntypedClient();

  // Insert order
  const insertOrder: InsertOrder = {
    order_id: orderData.orderId,
    customer_email: orderData.customer.email,
    customer_phone: orderData.customer.phone,
    customer_first_name: orderData.customer.firstName,
    customer_last_name: orderData.customer.lastName,
    shipping_first_name: orderData.shippingAddress.firstName,
    shipping_last_name: orderData.shippingAddress.lastName,
    shipping_address: orderData.shippingAddress.address,
    shipping_apartment: orderData.shippingAddress.apartment || null,
    shipping_city: orderData.shippingAddress.city,
    shipping_state: orderData.shippingAddress.state,
    shipping_pincode: orderData.shippingAddress.pincode,
    shipping_phone: orderData.shippingAddress.phone,
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    tax: orderData.tax,
    total: orderData.total,
    status: 'pending',
    payment_status: 'pending',
    payment_session_id: orderData.paymentSessionId || null,
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(insertOrder)
    .select()
    .single();

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Insert order items
  const insertItems: InsertOrderItem[] = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    price: item.price,
    image: item.image,
    size: item.size,
    quantity: item.quantity,
  }));

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .insert(insertItems)
    .select();

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  return dbOrderToApiOrder(order, items);
}

// Get order by order_id (PD-XXXXX format)
export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  const supabase = getUntypedClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to get order: ${orderError.message}`);
  }

  // Get order items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) {
    throw new Error(`Failed to get order items: ${itemsError.message}`);
  }

  // Get shipping tracking
  const { data: tracking } = await supabase
    .from('shipping_tracking')
    .select('*')
    .eq('order_id', order.id)
    .single();

  return dbOrderToApiOrder(order, items || [], tracking);
}

// Get order by UUID
export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getUntypedClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get order: ${orderError.message}`);
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) {
    throw new Error(`Failed to get order items: ${itemsError.message}`);
  }

  const { data: tracking } = await supabase
    .from('shipping_tracking')
    .select('*')
    .eq('order_id', order.id)
    .single();

  return dbOrderToApiOrder(order, items || [], tracking);
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  const supabase = getUntypedClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  return getOrderByOrderId(orderId);
}

// Update payment status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<Order | null> {
  const supabase = getUntypedClient();

  // Also update order status if payment is successful
  const updates: UpdateOrder = { payment_status: paymentStatus };
  if (paymentStatus === 'paid') {
    updates.status = 'confirmed';
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('order_id', orderId);

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }

  return getOrderByOrderId(orderId);
}

// Add or update shipping tracking
export async function updateShippingTracking(
  orderId: string,
  trackingData: {
    trackingId?: string;
    carrier?: string;
    estimatedDelivery?: string;
    notes?: string;
  }
): Promise<Order | null> {
  const supabase = getUntypedClient();

  // First get the order UUID
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('order_id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  // Check if tracking record exists
  const { data: existingTracking } = await supabase
    .from('shipping_tracking')
    .select('id')
    .eq('order_id', order.id)
    .single();

  const trackingUpdate: Partial<InsertShippingTracking> = {
    tracking_id: trackingData.trackingId,
    carrier: trackingData.carrier || 'DTDC',
    estimated_delivery: trackingData.estimatedDelivery,
    notes: trackingData.notes,
    shipped_at: trackingData.trackingId ? new Date().toISOString() : undefined,
  };

  if (existingTracking) {
    // Update existing
    const { error } = await supabase
      .from('shipping_tracking')
      .update(trackingUpdate)
      .eq('order_id', order.id);

    if (error) {
      throw new Error(`Failed to update tracking: ${error.message}`);
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('shipping_tracking')
      .insert({
        order_id: order.id,
        ...trackingUpdate,
      });

    if (error) {
      throw new Error(`Failed to create tracking: ${error.message}`);
    }
  }

  // Update order status to shipped if tracking ID is provided
  if (trackingData.trackingId) {
    await supabase
      .from('orders')
      .update({ status: 'shipped' })
      .eq('id', order.id);
  }

  return getOrderByOrderId(orderId);
}

// Mark order as delivered
export async function markOrderDelivered(orderId: string): Promise<Order | null> {
  const supabase = getUntypedClient();

  // Get order UUID
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('order_id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderId}`);
  }

  // Update order status
  const { error: statusError } = await supabase
    .from('orders')
    .update({ status: 'delivered' })
    .eq('id', order.id);

  if (statusError) {
    throw new Error(`Failed to update order status: ${statusError.message}`);
  }

  // Update tracking record
  await supabase
    .from('shipping_tracking')
    .update({ delivered_at: new Date().toISOString() })
    .eq('order_id', order.id);

  return getOrderByOrderId(orderId);
}

// List orders with filters
export async function listOrders(options: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: Order[]; total: number }> {
  const supabase = getUntypedClient();

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (options.status) {
    query = query.eq('status', options.status);
  }

  if (options.paymentStatus) {
    query = query.eq('payment_status', options.paymentStatus);
  }

  if (options.startDate) {
    query = query.gte('created_at', options.startDate);
  }

  if (options.endDate) {
    query = query.lte('created_at', options.endDate);
  }

  if (options.search) {
    query = query.or(
      `order_id.ilike.%${options.search}%,customer_email.ilike.%${options.search}%,customer_phone.ilike.%${options.search}%`
    );
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data: orders, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list orders: ${error.message}`);
  }

  // Fetch items and tracking for each order
  const ordersWithDetails = await Promise.all(
    (orders || []).map(async (order) => {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      const { data: tracking } = await supabase
        .from('shipping_tracking')
        .select('*')
        .eq('order_id', order.id)
        .single();

      return dbOrderToApiOrder(order, items || [], tracking);
    })
  );

  return {
    orders: ordersWithDetails,
    total: count || 0,
  };
}

// Get order stats
export async function getOrderStats(days: number = 30): Promise<{
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}> {
  const supabase = getUntypedClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('orders')
    .select('status, total, payment_status')
    .eq('payment_status', 'paid')
    .gte('created_at', startDate.toISOString());

  if (error) {
    throw new Error(`Failed to get order stats: ${error.message}`);
  }

  const stats = {
    totalOrders: data?.length || 0,
    totalRevenue: data?.reduce((sum, order) => sum + order.total, 0) || 0,
    pendingOrders: data?.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing').length || 0,
    shippedOrders: data?.filter((o) => o.status === 'shipped').length || 0,
    deliveredOrders: data?.filter((o) => o.status === 'delivered').length || 0,
  };

  return stats;
}

// Reserve stock for checkout
export async function reserveStock(
  items: { productId: string; size: string; quantity: number }[]
): Promise<boolean> {
  const supabase = getUntypedClient();

  // Use a transaction by doing all operations in sequence
  for (const item of items) {
    const { data, error } = await supabase.rpc('reserve_stock', {
      p_product_id: item.productId,
      p_size: item.size,
      p_quantity: item.quantity,
    });

    if (error || !data) {
      // Rollback by releasing any already reserved stock
      for (const reservedItem of items) {
        if (reservedItem === item) break;
        await supabase.rpc('release_stock', {
          p_product_id: reservedItem.productId,
          p_size: reservedItem.size,
          p_quantity: reservedItem.quantity,
        });
      }
      return false;
    }
  }

  return true;
}

// Release reserved stock (payment failed/cancelled)
export async function releaseStock(
  items: { productId: string; size: string; quantity: number }[]
): Promise<void> {
  const supabase = getUntypedClient();

  for (const item of items) {
    await supabase.rpc('release_stock', {
      p_product_id: item.productId,
      p_size: item.size,
      p_quantity: item.quantity,
    });
  }
}

// Commit stock sale (payment successful)
export async function commitStockSale(
  items: { productId: string; size: string; quantity: number }[]
): Promise<void> {
  const supabase = getUntypedClient();

  for (const item of items) {
    await supabase.rpc('commit_stock_sale', {
      p_product_id: item.productId,
      p_size: item.size,
      p_quantity: item.quantity,
    });
  }
}

// Check if order exists
export async function orderExists(orderId: string): Promise<boolean> {
  const supabase = getUntypedClient();

  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('order_id', orderId)
    .single();

  return !error && !!data;
}
