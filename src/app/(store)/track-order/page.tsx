'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Clock, MapPin, Truck, Sparkles, CheckCircle, ArrowRight, XCircle, Loader2 } from 'lucide-react';
import { PageLoader } from '@/components/ui/Loader';
import PageSeo from '@/components/seo/PageSeo';
import type { Order } from '@/lib/types';

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

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('order_id') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const features = [
    {
      icon: Package,
      title: "Real-time Updates",
      desc: "Track your order status instantly"
    },
    {
      icon: Truck,
      title: "Courier Partner",
      desc: "Reliable delivery across India"
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      desc: "Know exactly where your order is"
    },
  ];

  const getTrackingSteps = (order: ExtendedOrder | null) => {
    if (!order) {
      return [
        { icon: CheckCircle, title: "Order Placed", desc: "Your order has been placed successfully", completed: false },
        { icon: Package, title: "Processing", desc: "Your order is being prepared", completed: false },
        { icon: Truck, title: "Shipped", desc: "Your order is on its way", completed: false },
        { icon: MapPin, title: "Delivered", desc: "Package delivered", completed: false },
      ];
    }

    const isConfirmed = ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status);
    const isProcessing = ['processing', 'shipped', 'delivered'].includes(order.status);
    const isShipped = ['shipped', 'delivered'].includes(order.status);
    const isDelivered = order.status === 'delivered';

    // Build shipped description with tracking info
    let shippedDesc = isShipped ? "Your order is on its way" : "Your order is being prepared";
    if (isShipped && order.trackingInfo?.shippedAt) {
      shippedDesc = `Shipped on ${new Date(order.trackingInfo.shippedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    }

    // Build delivered description
    let deliveredDesc = "Estimated 3-5 business days";
    if (isDelivered && order.trackingInfo?.deliveredAt) {
      deliveredDesc = `Delivered on ${new Date(order.trackingInfo.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else if (order.trackingInfo?.estimatedDelivery) {
      deliveredDesc = `Expected by ${new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    }

    return [
      {
        icon: CheckCircle,
        title: "Order Placed",
        desc: `Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        completed: true
      },
      {
        icon: Package,
        title: isConfirmed ? "Order Confirmed" : "Awaiting Payment",
        desc: isConfirmed ? "Payment received, preparing your order" : "Waiting for payment confirmation",
        completed: isConfirmed
      },
      {
        icon: Truck,
        title: isShipped ? "Shipped" : "Processing",
        desc: shippedDesc,
        completed: isProcessing
      },
      {
        icon: MapPin,
        title: "Delivered",
        desc: deliveredDesc,
        completed: isDelivered
      },
    ];
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/orders?order_id=${orderId.trim()}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Order not found');
        setOrder(null);
      }
    } catch {
      setError('Failed to fetch order. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if order_id is in URL
  useEffect(() => {
    if (initialOrderId) {
      handleSearch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderId]);

  const trackingSteps = getTrackingSteps(order);

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Track Your Order"
        description="Track your Prakash Duo order status and DTDC shipping updates."
        canonical="https://banglesbyprakashduo.store/track-order"
      />
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 bg-raw-umber overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-deep-ochre/20 mb-6">
              <Package className="w-4 h-4 text-deep-ochre" />
              <span className="text-deep-ochre text-sm font-medium tracking-widest uppercase">
                Order Tracking
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Track Your <span className="gradient-text">Order</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Enter your order ID to get real-time updates on your shipment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Track Order Form */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative bg-warm-ivory rounded-3xl p-8 md:p-12 border border-deep-ochre/10 shadow-xl overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-deep-ochre/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-deep-ochre/20" />

              <div className="relative">
                <div className="mb-8">
                  <h2 className="font-display text-2xl text-raw-umber mb-2">
                    Enter Order ID
                  </h2>
                  <p className="text-raw-umber/60">
                    You can find your order ID in the confirmation email sent to you
                  </p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g., PD-XXXXX-XXXX"
                      className="w-full px-6 py-4 bg-warm-ivory border-2 border-deep-ochre/20 rounded-lg focus:outline-none focus:border-deep-ochre transition-colors text-raw-umber placeholder:text-raw-umber/40"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!orderId.trim() || loading}
                    className="group inline-flex items-center justify-center gap-2 bg-raw-umber hover:bg-crimson-thread text-white px-8 py-4 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Track Order
                  </button>
                </form>

                {/* Search Results */}
                {searched && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 pt-8 border-t border-deep-ochre/10"
                  >
                    {error ? (
                      /* Order Not Found */
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                          <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="font-display text-xl text-raw-umber mb-2">Order Not Found</h3>
                        <p className="text-raw-umber/60 mb-4">{error}</p>
                        <p className="text-sm text-raw-umber/50">
                          Please check the order ID and try again, or contact support if you need help.
                        </p>
                      </div>
                    ) : order ? (
                      /* Order Found */
                      <>
                        {/* Order Found Header */}
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-display text-xl text-raw-umber">Order Found</h3>
                            <p className="text-raw-umber/60">Order ID: {order.orderId}</p>
                          </div>
                          <div className="ml-auto">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-700'
                                : order.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'failed' ? 'Payment Failed' : 'Pending Payment'}
                            </span>
                          </div>
                        </div>

                        {/* Tracking Timeline */}
                        <div className="space-y-0 mb-8">
                          {trackingSteps.map((step, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  step.completed
                                    ? 'bg-deep-ochre text-white'
                                    : 'bg-raw-umber/10 text-raw-umber/40'
                                }`}>
                                  <step.icon className="w-5 h-5" />
                                </div>
                                {i < trackingSteps.length - 1 && (
                                  <div className={`w-0.5 h-16 mt-2 ${
                                    step.completed ? 'bg-deep-ochre' : 'bg-raw-umber/10'
                                  }`} />
                                )}
                              </div>
                              <div className="flex-1 pt-3 pb-8">
                                <h4 className={`font-display text-lg ${
                                  step.completed ? 'text-raw-umber' : 'text-raw-umber/40'
                                }`}>
                                  {step.title}
                                </h4>
                                <p className={`text-sm ${
                                  step.completed ? 'text-raw-umber/60' : 'text-raw-umber/30'
                                }`}>
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* DTDC Tracking Info */}
                        {order.trackingInfo?.trackingId && (
                          <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-display text-lg text-raw-umber">Courier Tracking</h4>
                                <p className="text-sm text-raw-umber/60">Track via {order.trackingInfo.carrier}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-raw-umber/50 uppercase tracking-wider mb-1">Tracking ID</p>
                                <p className="font-mono font-semibold text-raw-umber">{order.trackingInfo.trackingId}</p>
                              </div>
                              {order.trackingInfo.estimatedDelivery && (
                                <div>
                                  <p className="text-xs text-raw-umber/50 uppercase tracking-wider mb-1">Expected Delivery</p>
                                  <p className="font-semibold text-raw-umber">
                                    {new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString('en-IN', {
                                      weekday: 'short',
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                            {order.trackingInfo.notes && (
                              <p className="text-sm text-raw-umber/70 mb-4 p-3 bg-white/50 rounded">{order.trackingInfo.notes}</p>
                            )}
                            <a
                              href={`https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${order.trackingInfo.trackingId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                            >
                              <Truck className="w-4 h-4" />
                              Track on DTDC Website
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {/* Order Items */}
                        <div className="mb-8 p-4 bg-warm-ivory rounded-lg">
                          <h4 className="font-medium text-raw-umber mb-4">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-raw-umber truncate">{item.name}</p>
                                  <p className="text-xs text-raw-umber/50">Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-raw-umber">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="p-6 bg-gradient-to-br from-blush-dust to-warm-ivory rounded-lg border border-deep-ochre/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-raw-umber/50 mb-1">Shipping To</p>
                              <p className="font-display text-raw-umber">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                              </p>
                              <p className="text-sm text-raw-umber/60">
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-raw-umber/50 mb-1">Order Total</p>
                              <p className="font-display text-lg text-deep-ochre">₹{order.total.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </motion.div>
                )}

                {/* Features Grid (when not searched) */}
                {!searched && (
                  <div className="mt-12 pt-8 border-t border-deep-ochre/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                      <div key={i} className="text-center group">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-deep-ochre/10 to-deep-ochre/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <feature.icon className="w-7 h-7 text-deep-ochre" />
                        </div>
                        <h3 className="font-display text-raw-umber mb-1">{feature.title}</h3>
                        <p className="text-raw-umber/60 text-sm">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Help Section */}
          <AnimatedSection delay={0.2} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-warm-ivory rounded-3xl p-6 border border-deep-ochre/10 hover:border-deep-ochre/30 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-deep-ochre/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-deep-ochre" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-raw-umber mb-2">Order Not Found?</h3>
                    <p className="text-raw-umber/60 text-sm mb-3">
                      It may take up to 24 hours for tracking information to appear after your order is placed.
                    </p>
                    <Link href="/faq" className="text-deep-ochre hover:text-crimson-thread text-sm font-medium inline-flex items-center gap-1 transition-colors">
                      View FAQs <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-warm-ivory rounded-3xl p-6 border border-deep-ochre/10 hover:border-deep-ochre/30 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-deep-ochre/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-deep-ochre" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-raw-umber mb-2">Need Help?</h3>
                    <p className="text-raw-umber/60 text-sm mb-3">
                      Our customer support team is available to assist you with any queries.
                    </p>
                    <Link href="/contact" className="text-deep-ochre hover:text-crimson-thread text-sm font-medium inline-flex items-center gap-1 transition-colors">
                      Contact Us <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Shipping Info Banner */}
      <section className="py-12 bg-raw-umber">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-deep-ochre/20 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-deep-ochre" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-white">Fast & Reliable Shipping</h3>
                  <p className="text-white/60 text-sm">3-5 business days delivery across India</p>
                </div>
              </div>
              <Link
                href="/shipping"
                className="text-deep-ochre hover:text-deep-ochre/80 font-medium transition-colors flex items-center gap-2"
              >
                View shipping policy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <PageLoader />
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
