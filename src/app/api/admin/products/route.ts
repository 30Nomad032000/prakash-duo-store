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
    const showInactive = searchParams.get('inactive') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = getUntypedClient();

    // Build query
    let query = supabase
      .from('products')
      .select('*, product_inventory(*)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (!showInactive) {
      query = query.eq('is_active', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Get categories for filter
    const { data: categoriesData } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true);

    const categories = Array.from(new Set(categoriesData?.map((p) => p.category))).sort();

    // Transform products
    const transformedProducts = products?.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      sizes: product.sizes,
      is_active: product.is_active,
      inventory: product.product_inventory?.map((inv: {
        size: string;
        quantity: number;
      }) => ({
        size: inv.size,
        quantity: inv.quantity,
      })),
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      total: count || 0,
      categories,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, price, category, subcategory, sizes, images, inventory } = body;

    if (!id || !name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getUntypedClient();

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        id,
        name,
        price,
        category,
        subcategory: subcategory || '',
        sizes: sizes || [],
        images: images || [],
        is_active: true,
      })
      .select()
      .single();

    if (productError) {
      return NextResponse.json(
        { success: false, error: productError.message },
        { status: 500 }
      );
    }

    // Insert inventory
    if (inventory && inventory.length > 0) {
      const inventoryToInsert = inventory.map((inv: { size: string; quantity: number }) => ({
        product_id: id,
        size: inv.size,
        quantity: inv.quantity || 0,
        reserved_quantity: 0,
        low_stock_threshold: 5,
      }));

      await supabase.from('product_inventory').insert(inventoryToInsert);
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
