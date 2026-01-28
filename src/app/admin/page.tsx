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

async function getStats() {
  const supabase = getAdminClient();

  // Get date ranges
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const startOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay())
  ).toISOString();
  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).toISOString();

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
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
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
          color="bg-blue-500"
        />
        <StatCard
          title="This Week"
          value={stats.weekOrders}
          icon={Package}
          color="bg-green-500"
        />
        <StatCard
          title="Month Revenue"
          value={`₹${stats.monthRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="bg-amber-500"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Low Stock Alerts
                </h2>
              </div>
              <Link
                href="/admin/inventory"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {stats.lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p>All products are well stocked!</p>
              </div>
            ) : (
              stats.lowStockProducts.map((product) => (
                <div
                  key={`${product.product_id}-${product.size}`}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
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
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {stats.recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No orders yet</p>
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.order_id}`}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 block"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {order.order_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 text-sm">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition"
          >
            <Package className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Add Product
            </span>
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition"
          >
            <Clock className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Pending Orders
            </span>
          </Link>
          <Link
            href="/admin/inventory?filter=low"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition"
          >
            <AlertTriangle className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Low Stock
            </span>
          </Link>
          <Link
            href="/admin/orders?status=shipped"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition"
          >
            <Truck className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              In Transit
            </span>
          </Link>
        </div>
      </div>
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
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
