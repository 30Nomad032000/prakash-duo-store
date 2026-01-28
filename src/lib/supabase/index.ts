// Supabase client exports
export { createClient, getSupabaseClient } from './client';
export { createServerSupabaseClient } from './server';
export { getAdminClient, createAdminClient } from './admin';

// Type exports
export type {
  Database,
  DbProduct,
  DbProductInventory,
  DbOrder,
  DbOrderItem,
  DbShippingTracking,
  DbEmailLog,
  DbCategory,
  LowStockProduct,
  DailyOrderStats,
  InsertProduct,
  InsertProductInventory,
  InsertOrder,
  InsertOrderItem,
  InsertShippingTracking,
  InsertEmailLog,
  InsertCategory,
  UpdateProduct,
  UpdateProductInventory,
  UpdateOrder,
  UpdateShippingTracking,
  OrderWithItems,
  ProductWithInventory,
  OrderStatus,
  PaymentStatus,
  EmailType,
  EmailStatus,
} from './types';
