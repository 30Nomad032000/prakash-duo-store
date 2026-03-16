import { NextResponse } from 'next/server';
import { getAllProducts, getProductById } from '@/lib/products';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Merge live Supabase inventory into static product data
async function mergeInventory(products: ReturnType<typeof getAllProducts>) {
  try {
    const supabase = getSupabase();
    const productIds = products.map((p) => p.id);

    const { data: inventoryRows } = await supabase
      .from('product_inventory')
      .select('product_id, size, quantity, reserved_quantity')
      .in('product_id', productIds);

    if (!inventoryRows || inventoryRows.length === 0) return products;

    // Group inventory by product_id
    const inventoryMap = new Map<string, { size: string; quantity: string }[]>();
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

    // Merge into products
    return products.map((p) => {
      const liveInventory = inventoryMap.get(p.id);
      if (liveInventory) {
        return { ...p, inventory: liveInventory };
      }
      return p;
    });
  } catch (error) {
    console.error('Failed to fetch live inventory, using static data:', error);
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
    const [merged] = await mergeInventory([product]);
    return NextResponse.json(merged);
  }

  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const products = getAllProducts(limit);

  // Merge live inventory for all products
  const merged = await mergeInventory(products);
  return NextResponse.json(merged);
}
