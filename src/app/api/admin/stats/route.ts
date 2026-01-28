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

    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Orders today
    const { count: todayOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .eq('payment_status', 'paid');

    // Orders this week
    const { count: weekOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfWeek.toISOString())
      .eq('payment_status', 'paid');

    // Revenue this month
    const { data: monthData } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', startOfMonth.toISOString())
      .eq('payment_status', 'paid');

    const monthRevenue = monthData?.reduce((sum, order) => sum + order.total, 0) || 0;

    // Pending orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid')
      .in('status', ['pending', 'confirmed', 'processing']);

    // Low stock count
    const { data: lowStockData } = await supabase
      .from('low_stock_products')
      .select('*');

    // Total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    return NextResponse.json({
      success: true,
      stats: {
        todayOrders: todayOrders || 0,
        weekOrders: weekOrders || 0,
        monthRevenue,
        pendingOrders: pendingOrders || 0,
        lowStockCount: lowStockData?.length || 0,
        totalProducts: totalProducts || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
