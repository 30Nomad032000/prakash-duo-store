/**
 * Migration script to populate Supabase database with existing data
 * Run with: npx ts-node --esm scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
const envPath = path.join(__dirname, '..', '.env.local');
console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Service Key:', supabaseServiceKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\nMissing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface InventoryItem {
  size: string;
  quantity: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  inventory: InventoryItem[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
}

async function migrateCategories() {
  console.log('\n📁 Migrating categories...');

  const categoriesPath = path.join(__dirname, '../src/data/categories.json');
  const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  const categories: Category[] = categoriesData.categories;

  const categoriesToInsert = categories.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    is_active: true,
    sort_order: index,
  }));

  const { data, error } = await supabase
    .from('categories')
    .upsert(categoriesToInsert, { onConflict: 'id' });

  if (error) {
    console.error('Error migrating categories:', error);
    throw error;
  }

  console.log(`✅ Migrated ${categoriesToInsert.length} categories`);
}

async function migrateProducts() {
  console.log('\n📦 Migrating products...');

  const productsPath = path.join(__dirname, '../src/data/products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  const products: Product[] = productsData.products;

  // Insert products
  const productsToInsert = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory || '',
    sizes: product.sizes,
    is_active: true,
  }));

  console.log(`Inserting ${productsToInsert.length} products...`);

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < productsToInsert.length; i += batchSize) {
    const batch = productsToInsert.slice(i, i + batchSize);
    const { error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error migrating products batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToInsert.length / batchSize)} completed`);
  }

  console.log(`✅ Migrated ${productsToInsert.length} products`);

  // Migrate inventory
  console.log('\n📊 Migrating inventory...');

  const inventoryToInsert: {
    product_id: string;
    size: string;
    quantity: number;
    reserved_quantity: number;
    low_stock_threshold: number;
  }[] = [];

  for (const product of products) {
    if (product.inventory && product.inventory.length > 0) {
      for (const inv of product.inventory) {
        // Parse quantity - handle "set", numeric strings, etc.
        let quantity = 0;
        if (inv.quantity === 'set') {
          quantity = 1; // Treat "set" as 1 unit
        } else {
          const parsed = parseInt(inv.quantity, 10);
          quantity = isNaN(parsed) ? 0 : parsed;
        }

        inventoryToInsert.push({
          product_id: product.id,
          size: inv.size,
          quantity,
          reserved_quantity: 0,
          low_stock_threshold: 5,
        });
      }
    } else if (product.sizes && product.sizes.length > 0) {
      // If no inventory but has sizes, create inventory with 0 quantity
      for (const size of product.sizes) {
        inventoryToInsert.push({
          product_id: product.id,
          size,
          quantity: 0,
          reserved_quantity: 0,
          low_stock_threshold: 5,
        });
      }
    }
  }

  // Insert inventory in batches
  for (let i = 0; i < inventoryToInsert.length; i += batchSize) {
    const batch = inventoryToInsert.slice(i, i + batchSize);
    const { error } = await supabase
      .from('product_inventory')
      .upsert(batch, { onConflict: 'product_id,size' });

    if (error) {
      console.error(`Error migrating inventory batch ${i / batchSize + 1}:`, error);
      throw error;
    }
  }

  console.log(`✅ Migrated ${inventoryToInsert.length} inventory records`);
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');

  // Check categories
  const { count: categoryCount, error: catError } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (catError) throw catError;
  console.log(`  Categories: ${categoryCount}`);

  // Check products
  const { count: productCount, error: prodError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (prodError) throw prodError;
  console.log(`  Products: ${productCount}`);

  // Check inventory
  const { count: inventoryCount, error: invError } = await supabase
    .from('product_inventory')
    .select('*', { count: 'exact', head: true });

  if (invError) throw invError;
  console.log(`  Inventory records: ${inventoryCount}`);

  // Check low stock products
  const { data: lowStock, error: lowError } = await supabase
    .from('low_stock_products')
    .select('*')
    .limit(5);

  if (lowError) {
    console.log('  Low stock view may not exist yet');
  } else {
    console.log(`  Low stock products (sample): ${lowStock?.length || 0}`);
  }

  console.log('\n✅ Migration verification complete!');
}

async function main() {
  console.log('🚀 Starting Supabase migration...');
  console.log(`URL: ${supabaseUrl}`);

  try {
    await migrateCategories();
    await migrateProducts();
    await verifyMigration();

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
