import { NextRequest, NextResponse } from 'next/server';
import { getOrderByOrderId, releaseStock, updateOrderStatus } from '@/lib/supabase-orders';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await getOrderByOrderId(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Only release stock for pending unpaid orders
    if (order.paymentStatus !== 'pending' || order.status !== 'pending') {
      return NextResponse.json({ success: true, message: 'No action needed' });
    }

    // Release reserved stock
    const stockItems = order.items.map((item) => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
    }));

    await releaseStock(stockItems);
    await updateOrderStatus(id, 'cancelled');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Release stock error:', error);
    return NextResponse.json({ success: false, error: 'Failed to release stock' }, { status: 500 });
  }
}
