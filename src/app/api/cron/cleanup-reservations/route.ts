import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { releaseStock } from '@/lib/supabase-orders';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const STALE_MINUTES = 30;

/**
 * Cleanup stale stock reservations.
 * Finds orders that are still pending (unpaid) and older than 30 minutes,
 * releases their reserved stock, and marks them as cancelled.
 *
 * Call via Vercel Cron or manually: POST /api/cron/cleanup-reservations
 * Secured by CRON_SECRET header.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret — fail closed
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
    }
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();

    const cutoff = new Date(Date.now() - STALE_MINUTES * 60 * 1000).toISOString();

    // Find stale pending orders
    const { data: staleOrders, error } = await supabase
      .from('orders')
      .select('order_id, order_items(*)')
      .eq('status', 'pending')
      .eq('payment_status', 'pending')
      .lt('created_at', cutoff);

    if (error) {
      console.error('Failed to query stale orders:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!staleOrders || staleOrders.length === 0) {
      return NextResponse.json({ success: true, cleaned: 0 });
    }

    let cleaned = 0;

    for (const order of staleOrders) {
      try {
        // Release stock
        const stockItems = order.order_items.map((item: { product_id: string; size: string; quantity: number }) => ({
          productId: item.product_id,
          size: item.size,
          quantity: item.quantity,
        }));

        await releaseStock(stockItems);

        // Mark as cancelled
        await supabase
          .from('orders')
          .update({ status: 'cancelled', payment_status: 'failed' })
          .eq('order_id', order.order_id);

        cleaned++;
        console.log(`Cleaned up stale order: ${order.order_id}`);
      } catch (orderErr) {
        console.error(`Failed to cleanup order ${order.order_id}:`, orderErr);
      }
    }

    return NextResponse.json({ success: true, cleaned });
  } catch (error) {
    console.error('Cleanup cron error:', error);
    return NextResponse.json({ success: false, error: 'Cleanup failed' }, { status: 500 });
  }
}
