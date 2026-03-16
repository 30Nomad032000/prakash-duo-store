import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const { size, quantity, action } = body;

    if (!size || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Size and quantity are required' },
        { status: 400 }
      );
    }

    const supabase = getUntypedClient();

    // Get current inventory (may not exist for new sizes)
    const { data: currentInv } = await supabase
      .from('product_inventory')
      .select('quantity')
      .eq('product_id', productId)
      .eq('size', size)
      .single();

    const previousQuantity = currentInv?.quantity ?? 0;
    const exists = !!currentInv;

    let newQuantity: number;
    switch (action) {
      case 'add':
        newQuantity = previousQuantity + quantity;
        break;
      case 'subtract':
        newQuantity = Math.max(0, previousQuantity - quantity);
        break;
      case 'set':
      default:
        newQuantity = quantity;
        break;
    }

    if (exists) {
      // Update existing inventory
      const { error: updateError } = await supabase
        .from('product_inventory')
        .update({ quantity: newQuantity })
        .eq('product_id', productId)
        .eq('size', size);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      // Insert new size
      const { error: insertError } = await supabase
        .from('product_inventory')
        .insert({
          product_id: productId,
          size,
          quantity: newQuantity,
          reserved_quantity: 0,
          low_stock_threshold: 5,
        });

      if (insertError) {
        return NextResponse.json(
          { success: false, error: insertError.message },
          { status: 500 }
        );
      }

      // Also add the size to the product's sizes array
      const { data: product } = await supabase
        .from('products')
        .select('sizes')
        .eq('id', productId)
        .single();

      if (product && !product.sizes.includes(size)) {
        await supabase
          .from('products')
          .update({ sizes: [...product.sizes, size] })
          .eq('id', productId);
      }
    }

    // Log the stock change
    await supabase.from('stock_changes').insert({
      product_id: productId,
      size,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      change_type: 'manual',
      notes: exists
        ? `Manual update: ${action} ${quantity}`
        : `New size added with quantity ${newQuantity}`,
    });

    return NextResponse.json({
      success: true,
      previousQuantity,
      newQuantity,
      created: !exists,
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}
