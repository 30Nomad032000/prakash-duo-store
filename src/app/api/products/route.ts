import { NextResponse } from 'next/server';
import { getAllProducts, getProductById } from '@/lib/products';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Merge live Supabase inventory and prices into static product data
async function mergeLiveData(products: ReturnType<typeof getAllProducts>) {
  try {
    const supabase = getSupabase();
    const productIds = products.map((p) => p.id);

    // Fetch live inventory and prices from Supabase in parallel
    const [inventoryResult, productsResult] = await Promise.all([
      supabase
        .from('product_inventory')
        .select('product_id, size, quantity, reserved_quantity')
        .in('product_id', productIds),
      supabase
        .from('products')
        .select('id, price')
        .in('id', productIds),
    ]);

    const inventoryRows = inventoryResult.data;
    const dbProducts = productsResult.data;

    // Build price map from Supabase
    const priceMap = new Map<string, number>();
    if (dbProducts) {
      for (const row of dbProducts) {
        if (row.price != null) {
          priceMap.set(row.id, row.price);
        }
      }
    }

    // Build inventory map
    const inventoryMap = new Map<string, { size: string; quantity: string }[]>();
    if (inventoryRows) {
      for (const row of inventoryRows) {
        const available = Math.max(0, row.quantity - (row.reserved_quantity || 0));
        if (!inventoryMap.has(row.product_id)) {
          inventoryMap.set(row.product_id, []);
        }
        inventoryMap.get(row.product_id)!.push({
          size: row.size,
          quantity: String(available),
        });
      }
    }

    // Merge into products
    return products.map((p) => {
      const liveInventory = inventoryMap.get(p.id);
      const livePrice = priceMap.get(p.id);
      return {
        ...p,
        ...(livePrice != null ? { price: livePrice } : {}),
        ...(liveInventory ? { inventory: liveInventory } : {}),
      };
    });
  } catch (error) {
    console.error('Failed to fetch live data, using static data:', error);
    return products;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('id')) {
    const product = getProductById(searchParams.get('id')!);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Merge live inventory for single product
    const [merged] = await mergeLiveData([product]);
    return NextResponse.json(merged);
  }

  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const products = getAllProducts(limit);

  // Merge live inventory for all products
  const merged = await mergeLiveData(products);
  return NextResponse.json(merged);
}
