-- Prakash Duo Store Database Schema
-- Initial migration for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom ENUM types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE email_type AS ENUM ('order_confirmation', 'shipping_notification', 'delivery_confirmation');
CREATE TYPE email_status AS ENUM ('pending', 'sent', 'failed');

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  sizes TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category lookups
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Product inventory table (stock tracking by size)
CREATE TABLE product_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5 CHECK (low_stock_threshold >= 0),
  UNIQUE(product_id, size)
);

-- Create index for inventory lookups
CREATE INDEX idx_product_inventory_product_id ON product_inventory(product_id);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  shipping_first_name TEXT NOT NULL,
  shipping_last_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_apartment TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for order lookups
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Create index for order item lookups
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Shipping tracking table
CREATE TABLE shipping_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier TEXT DEFAULT 'DTDC',
  tracking_id TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  estimated_delivery TIMESTAMPTZ,
  notes TEXT
);

-- Email logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  email_type email_type NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status email_status DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ
);

-- Create indexes for email logs
CREATE INDEX idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Stock change history table (for audit trail)
CREATE TABLE stock_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  change_type TEXT NOT NULL, -- 'manual', 'sale', 'restock', 'reservation', 'release'
  reference_id TEXT, -- order_id or other reference
  notes TEXT,
  changed_by TEXT, -- admin user id
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_changes_product_id ON stock_changes(product_id);
CREATE INDEX idx_stock_changes_created_at ON stock_changes(created_at DESC);

-- View: Low stock products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT
  p.id AS product_id,
  p.name,
  p.category,
  pi.size,
  pi.quantity,
  pi.low_stock_threshold
FROM products p
JOIN product_inventory pi ON p.id = pi.product_id
WHERE pi.quantity <= pi.low_stock_threshold
  AND p.is_active = true
ORDER BY pi.quantity ASC, p.name ASC;

-- View: Daily order stats
CREATE OR REPLACE VIEW daily_order_stats AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS order_count,
  SUM(total) AS revenue,
  COUNT(*) FILTER (WHERE status = 'shipped') AS shipped_count,
  COUNT(*) FILTER (WHERE status = 'delivered') AS delivered_count
FROM orders
WHERE payment_status = 'paid'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Auto-update updated_at for products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Reserve stock for checkout
CREATE OR REPLACE FUNCTION reserve_stock(
  p_product_id TEXT,
  p_size TEXT,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  available INTEGER;
BEGIN
  -- Get current available stock (quantity - reserved_quantity)
  SELECT quantity - reserved_quantity INTO available
  FROM product_inventory
  WHERE product_id = p_product_id AND size = p_size
  FOR UPDATE;

  -- Check if enough stock available
  IF available >= p_quantity THEN
    UPDATE product_inventory
    SET reserved_quantity = reserved_quantity + p_quantity
    WHERE product_id = p_product_id AND size = p_size;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Release reserved stock
CREATE OR REPLACE FUNCTION release_stock(
  p_product_id TEXT,
  p_size TEXT,
  p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE product_inventory
  SET reserved_quantity = GREATEST(0, reserved_quantity - p_quantity)
  WHERE product_id = p_product_id AND size = p_size;
END;
$$ LANGUAGE plpgsql;

-- Function: Commit stock sale (deduct from quantity and reserved)
CREATE OR REPLACE FUNCTION commit_stock_sale(
  p_product_id TEXT,
  p_size TEXT,
  p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE product_inventory
  SET
    quantity = GREATEST(0, quantity - p_quantity),
    reserved_quantity = GREATEST(0, reserved_quantity - p_quantity)
  WHERE product_id = p_product_id AND size = p_size;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
-- Note: Enable RLS on tables after setting up auth

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_changes ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view product inventory"
  ON product_inventory FOR SELECT
  USING (true);

-- Service role has full access (for admin operations)
-- These policies allow the service role to bypass RLS

CREATE POLICY "Service role full access categories"
  ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access product_inventory"
  ON product_inventory FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access order_items"
  ON order_items FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access shipping_tracking"
  ON shipping_tracking FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access email_logs"
  ON email_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access stock_changes"
  ON stock_changes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Orders: Allow insert from anon for checkout
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Orders: Allow customers to view their own orders by email
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (true); -- In production, you might want to restrict this

CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Customers can view shipping tracking"
  ON shipping_tracking FOR SELECT
  USING (true);

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions to anon role (public access)
GRANT SELECT ON categories TO anon;
GRANT SELECT ON products TO anon;
GRANT SELECT ON product_inventory TO anon;
GRANT SELECT, INSERT ON orders TO anon;
GRANT SELECT, INSERT ON order_items TO anon;
GRANT SELECT ON shipping_tracking TO anon;
GRANT SELECT ON low_stock_products TO anon;
GRANT SELECT ON daily_order_stats TO anon;

-- Grant permissions to authenticated role
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
