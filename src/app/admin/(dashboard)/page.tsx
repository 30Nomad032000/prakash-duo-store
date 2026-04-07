import { Suspense } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { getAdminClient } from '@/lib/supabase/admin';
import type { LowStockProduct, DbOrder } from '@/lib/supabase/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

async function getStats() {
  const supabase = getAdminClient();

  // Get date ranges — use separate Date objects to avoid mutation bugs
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  startOfWeekDate.setDate(startOfWeekDate.getDate() - startOfWeekDate.getDay());
  const startOfWeek = startOfWeekDate.toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Orders today
  const { count: todayOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfToday)
    .eq('payment_status', 'paid');

  // Orders this week
  const { count: weekOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfWeek)
    .eq('payment_status', 'paid');

  // Revenue this month
  const { data: monthData } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', startOfMonth)
    .eq('payment_status', 'paid');

  const monthRevenue = (monthData as { total: number }[] | null)?.reduce((sum, order) => sum + order.total, 0) || 0;

  // Pending orders
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'paid')
    .in('status', ['pending', 'confirmed', 'processing']);

  // Low stock products
  const { data: lowStockData } = await supabase
    .from('low_stock_products')
    .select('*')
    .limit(10);

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    todayOrders: todayOrders || 0,
    weekOrders: weekOrders || 0,
    monthRevenue,
    pendingOrders: pendingOrders || 0,
    lowStockProducts: (lowStockData || []) as LowStockProduct[],
    recentOrders: (recentOrders || []) as DbOrder[],
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Card className="border-charcoal/10 bg-warm-ivory/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium font-body text-charcoal/50">{title}</p>
            <p className="text-2xl font-bold font-display text-charcoal mt-1">{value}</p>
            {trend && (
              <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function DashboardContent() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={ShoppingBag}
          iconBg="bg-deep-ochre/15"
          iconColor="text-deep-ochre"
        />
        <StatCard
          title="This Week"
          value={stats.weekOrders}
          icon={Package}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Month Revenue"
          value={`₹${stats.monthRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          iconBg="bg-deep-ochre/15"
          iconColor="text-deep-ochre"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          iconBg="bg-crimson-thread/10"
          iconColor="text-crimson-thread"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="border-charcoal/10 bg-warm-ivory/50 shadow-sm">
          <CardHeader className="border-b border-gold/10 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-deep-ochre" />
                <CardTitle className="text-lg font-display text-charcoal">
                  Low Stock Alerts
                </CardTitle>
              </div>
              <Link
                href="/admin/inventory"
                className="text-sm text-deep-ochre hover:text-deep-ochre/80 font-medium font-body"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gold/10">
              {stats.lowStockProducts.length === 0 ? (
                <div className="p-6 text-center text-charcoal/50">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <p className="font-body">All products are well stocked!</p>
                </div>
              ) : (
                stats.lowStockProducts.map((product) => (
                  <div
                    key={`${product.product_id}-${product.size}`}
                    className="p-4 flex items-center justify-between hover:bg-deep-ochre/5 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal text-sm font-body">
                        {product.name}
                      </p>
                      <p className="text-xs text-charcoal/50 font-body">
                        Size: {product.size} | Category: {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.quantity === 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {product.quantity === 0
                          ? 'Out of Stock'
                          : `${product.quantity} left`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-charcoal/10 bg-warm-ivory/50 shadow-sm">
          <CardHeader className="border-b border-gold/10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display text-charcoal">
                Recent Orders
              </CardTitle>
              <Link
                href="/admin/orders"
                className="text-sm text-deep-ochre hover:text-deep-ochre/80 font-medium font-body"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gold/10">
              {stats.recentOrders.length === 0 ? (
                <div className="p-6 text-center text-charcoal/50">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-charcoal/30" />
                  <p className="font-body">No orders yet</p>
                </div>
              ) : (
                stats.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.order_id}`}
                    className="p-4 flex items-center justify-between hover:bg-deep-ochre/5 block transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal text-sm font-mono">
                        {order.order_id}
                      </p>
                      <p className="text-xs text-charcoal/50 font-body">
                        {order.customer_first_name} {order.customer_last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-charcoal text-sm font-body">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-charcoal/10 bg-warm-ivory/50 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/products/new"
              className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-charcoal/10 hover:border-deep-ochre/30 hover:bg-deep-ochre/5 transition"
            >
              <Package className="w-8 h-8 text-deep-ochre mb-2" />
              <span className="text-sm font-medium font-body text-charcoal/70">
                Add Product
              </span>
            </Link>
            <Link
              href="/admin/orders?status=pending"
              className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-charcoal/10 hover:border-deep-ochre/30 hover:bg-deep-ochre/5 transition"
            >
              <Clock className="w-8 h-8 text-deep-ochre mb-2" />
              <span className="text-sm font-medium font-body text-charcoal/70">
                Pending Orders
              </span>
            </Link>
            <Link
              href="/admin/inventory?filter=low"
              className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-charcoal/10 hover:border-deep-ochre/30 hover:bg-deep-ochre/5 transition"
            >
              <AlertTriangle className="w-8 h-8 text-deep-ochre mb-2" />
              <span className="text-sm font-medium font-body text-charcoal/70">
                Low Stock
              </span>
            </Link>
            <Link
              href="/admin/orders?status=shipped"
              className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-charcoal/10 hover:border-deep-ochre/30 hover:bg-deep-ochre/5 transition"
            >
              <Truck className="w-8 h-8 text-deep-ochre mb-2" />
              <span className="text-sm font-medium font-body text-charcoal/70">
                In Transit
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="border-charcoal/10 bg-warm-ivory/50 shadow-sm"
              >
                <CardContent className="p-6 animate-pulse">
                  <div className="h-4 bg-charcoal/10 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-charcoal/10 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
