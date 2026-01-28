'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Calendar,
  X,
  Send,
} from 'lucide-react';
import type { Order } from '@/lib/types';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface TrackingInfo {
  carrier: string;
  trackingId: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  estimatedDelivery: string | null;
  notes: string | null;
}

interface ExtendedOrder extends Order {
  trackingInfo?: TrackingInfo;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showShipModal = searchParams.get('action') === 'ship';

  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingModal, setTrackingModal] = useState(showShipModal);
  const [trackingId, setTrackingId] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [trackingNotes, setTrackingNotes] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const addTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          estimatedDelivery,
          notes: trackingNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setTrackingModal(false);
        setTrackingId('');
        setEstimatedDelivery('');
        setTrackingNotes('');
        router.replace(`/admin/orders/${id}`);
      }
    } catch (error) {
      console.error('Failed to add tracking:', error);
    } finally {
      setUpdating(false);
    }
  };

  const markDelivered = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/delivered`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to mark as delivered:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentStatusIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex((s) => s.key === order.status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Order not found</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.orderId}</h1>
            <p className="text-sm text-gray-500">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[order.status]
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Order Status
          </h2>
          <div className="relative">
            <div className="flex justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {order.status === 'pending' && order.paymentStatus === 'paid' && (
              <button
                onClick={() => updateStatus('confirmed')}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm Order
              </button>
            )}
            {order.status === 'confirmed' && (
              <button
                onClick={() => updateStatus('processing')}
                disabled={updating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Start Processing
              </button>
            )}
            {(order.status === 'confirmed' ||
              order.status === 'processing') && (
              <button
                onClick={() => setTrackingModal(true)}
                disabled={updating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Add Tracking & Ship
              </button>
            )}
            {order.status === 'shipped' && (
              <button
                onClick={markDelivered}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tracking Info */}
      {order.trackingInfo?.trackingId && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Carrier</p>
              <p className="font-medium">{order.trackingInfo.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="font-mono font-medium">
                {order.trackingInfo.trackingId}
              </p>
            </div>
            {order.trackingInfo.shippedAt && (
              <div>
                <p className="text-sm text-gray-500">Shipped At</p>
                <p className="font-medium">
                  {new Date(order.trackingInfo.shippedAt).toLocaleDateString(
                    'en-IN'
                  )}
                </p>
              </div>
            )}
            {order.trackingInfo.estimatedDelivery && (
              <div>
                <p className="text-sm text-gray-500">Est. Delivery</p>
                <p className="font-medium">
                  {new Date(
                    order.trackingInfo.estimatedDelivery
                  ).toLocaleDateString('en-IN')}
                </p>
              </div>
            )}
          </div>
          {order.trackingInfo.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{order.trackingInfo.notes}</p>
            </div>
          )}
          <a
            href={`https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${order.trackingInfo.trackingId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            <Truck className="w-4 h-4" />
            Track on DTDC Website
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y">
            {order.items.map((item, index) => (
              <div key={index} className="p-6 flex gap-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? 'Free'
                    : `₹${order.shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span>
                  {order.customer.firstName} {order.customer.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${order.customer.email}`}
                  className="text-amber-600 hover:text-amber-700"
                >
                  {order.customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a
                  href={`tel:${order.customer.phone}`}
                  className="text-amber-600 hover:text-amber-700"
                >
                  {order.customer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.pincode}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Status</span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </div>
              {order.paymentSessionId && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Session ID</span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {order.paymentSessionId.slice(0, 12)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setTrackingModal(false);
              router.replace(`/admin/orders/${id}`);
            }}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Shipping Details
                </h3>
                <button
                  onClick={() => {
                    setTrackingModal(false);
                    router.replace(`/admin/orders/${id}`);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={addTracking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DTDC Tracking ID *
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    required
                    placeholder="e.g., D12345678"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    rows={3}
                    placeholder="Any additional notes..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    A shipping notification email will be sent to the customer.
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingModal(false);
                      router.replace(`/admin/orders/${id}`);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating || !trackingId}
                    className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Add & Ship'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
