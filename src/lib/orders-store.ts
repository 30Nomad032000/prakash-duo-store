import type { Order } from './types';

// In-memory store for orders (in production, use a database)
// Note: This will reset on server restart. For production, use a proper database.
const orders = new Map<string, Order>();

export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId);
}

export function setOrder(orderId: string, order: Order): void {
  orders.set(orderId, order);
}

export function hasOrder(orderId: string): boolean {
  return orders.has(orderId);
}

export function deleteOrder(orderId: string): boolean {
  return orders.delete(orderId);
}
