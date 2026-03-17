'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
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
  Printer,
  Ban,
  AlertTriangle,
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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
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
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

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

  const cancelOrder = async () => {
    if (!order || !cancelReason.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setCancelModal(false);
        setCancelReason('');
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-ochre"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-4 text-charcoal/30" />
        <p className="text-charcoal/50">Order not found</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex items-center gap-2 text-deep-ochre hover:text-deep-ochre/80"
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
            className="p-2 hover:bg-charcoal/5 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-charcoal">{order.orderId}</h1>
            <p className="text-sm text-charcoal/50">
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
          <Link
            href={`/admin/orders/${order.orderId}/invoice`}
            target="_blank"
            className="px-4 py-2 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 flex items-center gap-2 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </Link>
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
          <h2 className="text-lg font-semibold text-charcoal mb-6">
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
                          : 'bg-charcoal/10 text-charcoal/40'
                      } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isCompleted ? 'text-green-600' : 'text-charcoal/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-charcoal/10 -z-0">
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
            {['pending', 'confirmed', 'processing'].includes(order.status) && (
              <button
                onClick={() => setCancelModal(true)}
                disabled={updating}
                className="ml-auto px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 disabled:opacity-50 flex items-center gap-2 text-sm transition-all"
              >
                <Ban className="w-3.5 h-3.5" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tracking Info */}
      {order.trackingInfo?.trackingId && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">
            Shipping Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-charcoal/50">Carrier</p>
              <p className="font-medium">{order.trackingInfo.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-charcoal/50">Tracking ID</p>
              <p className="font-mono font-medium">
                {order.trackingInfo.trackingId}
              </p>
            </div>
            {order.trackingInfo.shippedAt && (
              <div>
                <p className="text-sm text-charcoal/50">Shipped At</p>
                <p className="font-medium">
                  {new Date(order.trackingInfo.shippedAt).toLocaleDateString(
                    'en-IN'
                  )}
                </p>
              </div>
            )}
            {order.trackingInfo.estimatedDelivery && (
              <div>
                <p className="text-sm text-charcoal/50">Est. Delivery</p>
                <p className="font-medium">
                  {new Date(
                    order.trackingInfo.estimatedDelivery
                  ).toLocaleDateString('en-IN')}
                </p>
              </div>
            )}
          </div>
          {order.trackingInfo.notes && (
            <div className="mt-4 p-3 bg-warm-ivory/50 rounded-lg">
              <p className="text-sm text-charcoal/60">{order.trackingInfo.notes}</p>
            </div>
          )}
          <a
            href={`https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${order.trackingInfo.trackingId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-deep-ochre hover:text-deep-ochre/80 text-sm font-medium"
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
            <h2 className="text-lg font-semibold text-charcoal">Order Items</h2>
          </div>
          <div className="divide-y">
            {order.items.map((item, index) => (
              <div key={index} className="p-6 flex gap-4">
                <div className="relative w-20 h-20 bg-charcoal/5 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-charcoal/50 mt-1">Size: {item.size}</p>
                  <p className="text-sm text-charcoal/50">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-charcoal">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-charcoal/50">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-warm-ivory/50 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/50">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/50">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? 'Free'
                    : `₹${order.shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/50">Tax</span>
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
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              Customer
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-charcoal/40" />
                <span>
                  {order.customer.firstName} {order.customer.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-charcoal/40" />
                <a
                  href={`mailto:${order.customer.email}`}
                  className="text-deep-ochre hover:text-deep-ochre/80"
                >
                  {order.customer.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-charcoal/40" />
                <a
                  href={`tel:${order.customer.phone}`}
                  className="text-deep-ochre hover:text-deep-ochre/80"
                >
                  {order.customer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              Shipping Address
            </h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-charcoal/40 mt-1" />
              <div className="text-sm text-charcoal/60">
                <p className="font-medium text-charcoal">
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
            <h2 className="text-lg font-semibold text-charcoal mb-4">Payment</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-charcoal/40" />
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
                    <Calendar className="w-4 h-4 text-charcoal/40" />
                    <span className="text-sm">Session ID</span>
                  </div>
                  <span className="text-xs font-mono text-charcoal/50">
                    {order.paymentSessionId.slice(0, 12)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-raw-umber/60 backdrop-blur-sm"
            onClick={() => setCancelModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Red accent bar */}
              <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />

              <div className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal">Cancel Order</h3>
                      <p className="text-xs text-charcoal/40 font-mono mt-0.5">{order?.orderId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCancelModal(false)}
                    className="p-1.5 hover:bg-charcoal/5 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-charcoal/40" />
                  </button>
                </div>

                <p className="text-sm text-charcoal/60 mb-5 leading-relaxed">
                  This will cancel the order and notify the customer via email.
                  {order?.paymentStatus === 'paid' && (
                    <span className="block mt-1.5 text-amber-700 font-medium text-xs bg-amber-50 rounded px-2 py-1.5 border border-amber-200">
                      This is a paid order — payment will be marked as refunded.
                    </span>
                  )}
                </p>

                <div className="mb-5">
                  <label className="block text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">
                    Reason for cancellation
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                    required
                    placeholder="Item out of stock, customer requested, unable to fulfil..."
                    className="w-full px-4 py-3 border border-charcoal/10 rounded-xl text-sm focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none resize-none bg-charcoal/[0.02] placeholder:text-charcoal/25 transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 p-3.5 bg-red-50/70 rounded-xl mb-6 border border-red-100">
                  <Mail className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600/80 leading-relaxed">
                    A cancellation email with this reason will be sent to <span className="font-medium">{order?.customer.email}</span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModal(false)}
                    className="flex-1 px-4 py-3 border border-charcoal/10 rounded-xl text-sm font-medium text-charcoal/60 hover:bg-charcoal/[0.03] hover:border-charcoal/20 transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={cancelOrder}
                    disabled={updating || !cancelReason.trim()}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-sm shadow-red-600/20"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    {updating ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <h3 className="text-lg font-semibold text-charcoal">
                  Add Shipping Details
                </h3>
                <button
                  onClick={() => {
                    setTrackingModal(false);
                    router.replace(`/admin/orders/${id}`);
                  }}
                  className="p-2 hover:bg-charcoal/5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={addTracking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    DTDC Tracking ID *
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    required
                    placeholder="e.g., D12345678"
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={trackingNotes}
                    onChange={(e) => setTrackingNotes(e.target.value)}
                    rows={3}
                    placeholder="Any additional notes..."
                    className="w-full px-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none resize-none"
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
                    className="flex-1 px-4 py-2.5 border border-charcoal/15 rounded-lg hover:bg-deep-ochre/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating || !trackingId}
                    className="flex-1 px-4 py-2.5 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 disabled:opacity-50"
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
