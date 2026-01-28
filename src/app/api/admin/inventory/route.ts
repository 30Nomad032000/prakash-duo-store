import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const filter = searchParams.get('filter') || '';

    const supabase = getUntypedClient();

    // Get all products with inventory
    let query = supabase
      .from('products')
      .select('id, name, images, category, product_inventory(*)')
      .eq('is_active', true)
      .order('name');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Flatten to inventory items
    let inventory: {
      product_id: string;
      product_name: string;
      product_image: string;
      category: string;
      size: string;
      quantity: number;
      reserved_quantity: number;
      low_stock_threshold: number;
    }[] = [];

    products?.forEach((product) => {
      product.product_inventory?.forEach((inv: {
        size: string;
        quantity: number;
        reserved_quantity: number;
        low_stock_threshold: number;
      }) => {
        inventory.push({
          product_id: product.id,
          product_name: product.name,
          product_image: product.images?.[0] || '',
          category: product.category,
          size: inv.size,
          quantity: inv.quantity,
          reserved_quantity: inv.reserved_quantity,
          low_stock_threshold: inv.low_stock_threshold,
        });
      });
    });

    // Apply filters
    if (filter === 'low') {
      inventory = inventory.filter(
        (item) => item.quantity > 0 && item.quantity <= item.low_stock_threshold
      );
    } else if (filter === 'out') {
      inventory = inventory.filter((item) => item.quantity === 0);
    } else if (filter === 'in') {
      inventory = inventory.filter((item) => item.quantity > item.low_stock_threshold);
    }

    // Get categories for filter
    const { data: categoriesData } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true);

    const categories = Array.from(new Set(categoriesData?.map((p) => p.category))).sort();

    return NextResponse.json({
      success: true,
      inventory,
      categories,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
