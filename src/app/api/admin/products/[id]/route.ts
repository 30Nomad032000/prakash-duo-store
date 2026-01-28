import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getUntypedClient();

    const { data: product, error } = await supabase
      .from('products')
      .select('*, product_inventory(*)')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const transformedProduct = {
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
    };

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, category, subcategory, sizes, images, is_active, inventory } = body;

    const supabase = getUntypedClient();

    // Update product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update({
        name,
        price,
        category,
        subcategory: subcategory || '',
        sizes: sizes || [],
        images: images || [],
        is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (productError) {
      return NextResponse.json(
        { success: false, error: productError.message },
        { status: 500 }
      );
    }

    // Update inventory
    if (inventory && inventory.length > 0) {
      for (const inv of inventory) {
        // Try to upsert inventory
        const { error: invError } = await supabase
          .from('product_inventory')
          .upsert(
            {
              product_id: id,
              size: inv.size,
              quantity: inv.quantity || 0,
            },
            { onConflict: 'product_id,size' }
          );

        if (invError) {
          console.error('Error updating inventory:', invError);
        }
      }

      // Remove sizes that are no longer in the product
      const currentSizes = inventory.map((inv: { size: string }) => inv.size);
      await supabase
        .from('product_inventory')
        .delete()
        .eq('product_id', id)
        .not('size', 'in', `(${currentSizes.map((s: string) => `'${s}'`).join(',')})`);
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = getUntypedClient();

    const { error } = await supabase.from('products').update(body).eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error patching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getUntypedClient();

    // Soft delete - just mark as inactive
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
