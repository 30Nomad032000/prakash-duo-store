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

    // Get current inventory
    const { data: currentInv, error: getError } = await supabase
      .from('product_inventory')
      .select('quantity')
      .eq('product_id', productId)
      .eq('size', size)
      .single();

    if (getError) {
      return NextResponse.json(
        { success: false, error: 'Inventory not found' },
        { status: 404 }
      );
    }

    let newQuantity: number;
    const previousQuantity = currentInv.quantity;

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

    // Update inventory
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

    // Log the stock change
    await supabase.from('stock_changes').insert({
      product_id: productId,
      size,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      change_type: 'manual',
      notes: `Manual update: ${action} ${quantity}`,
    });

    return NextResponse.json({
      success: true,
      previousQuantity,
      newQuantity,
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}
