import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getUntypedClient();

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category, product_inventory(*)')
      .eq('is_active', true)
      .order('name');

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Create CSV content
    const headers = ['Product ID', 'Product Name', 'Category', 'Size', 'Quantity', 'Reserved', 'Low Stock Threshold'];
    const rows: string[][] = [];

    products?.forEach((product) => {
      product.product_inventory?.forEach((inv: {
        size: string;
        quantity: number;
        reserved_quantity: number;
        low_stock_threshold: number;
      }) => {
        rows.push([
          product.id,
          `"${product.name.replace(/"/g, '""')}"`,
          product.category,
          inv.size,
          inv.quantity.toString(),
          inv.reserved_quantity.toString(),
          inv.low_stock_threshold.toString(),
        ]);
      });
    });

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="inventory-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export inventory' },
      { status: 500 }
    );
  }
}
