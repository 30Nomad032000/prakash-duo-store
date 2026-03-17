'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PageLoader } from '@/components/ui/Loader';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import type { Order } from '@/lib/types';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const orderResponse = await fetch(`/api/orders?order_id=${orderId}`);
        const orderData = await orderResponse.json();

        if (orderData.success) {
          setOrder(orderData.data);
          if (orderData.data.paymentStatus === "paid") {
            clearCart();
          }
        } else {
          setError(orderData.error || "Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <PageLoader label="Fetching your order details..." />
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="font-display text-4xl text-raw-umber mb-4">
              Order Not Found
            </h1>
            <p className="text-raw-umber/60 mb-8 max-w-md mx-auto">
              {error || "We couldn't find your order. Please check your order ID and try again."}
            </p>
            <Button asChild className="bg-crimson-thread hover:bg-crimson-thread/90 text-warm-ivory rounded-full px-8">
              <Link href="/">Return to Home</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="min-h-screen bg-warm-ivory noise-overlay pt-20">
      {/* Success Header */}
      <section className="py-16 bg-warm-ivory border-b border-deep-ochre/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl md:text-4xl text-raw-umber mb-3"
          >
            {isPaid ? 'Thank You for Your Order!' : 'Order Received'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-raw-umber/60 mb-4"
          >
            {isPaid
              ? 'Your order has been confirmed and is being processed.'
              : 'Your order has been received and is awaiting payment confirmation.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-deep-ochre/10 rounded-full"
          >
            <span className="text-sm text-raw-umber/60">Order ID:</span>
            <span className="text-sm font-semibold text-raw-umber">{order.orderId}</span>
          </motion.div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-warm-ivory rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-medium text-raw-umber mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-deep-ochre" />
                Order Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-raw-umber">Order Placed</p>
                    <p className="text-sm text-raw-umber/50">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isPaid ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}>
                    {isPaid ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-raw-umber">
                      {isPaid ? 'Payment Confirmed' : 'Awaiting Payment'}
                    </p>
                    <p className="text-sm text-raw-umber/50">
                      {isPaid ? 'Payment received successfully' : 'Verifying payment...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blush-dust/30 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-raw-umber/40" />
                  </div>
                  <div>
                    <p className="font-medium text-raw-umber/50">Shipping</p>
                    <p className="text-sm text-raw-umber/40">Estimated 3-5 business days</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-warm-ivory rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-medium text-raw-umber mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-deep-ochre" />
                Shipping Address
              </h2>

              <div className="text-raw-umber/80">
                <p className="font-medium text-raw-umber">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.pincode}
                </p>
                <p className="mt-2 text-raw-umber/60">Phone: {order.shippingAddress.phone}</p>
              </div>
            </motion.div>
          </div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-warm-ivory rounded-3xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-medium text-raw-umber mb-6">Order Items</h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 py-4 border-b border-raw-umber/10 last:border-0"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-blush-dust/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-raw-umber">{item.name}</h3>
                    <p className="text-sm text-raw-umber/50">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-raw-umber">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-raw-umber/10 space-y-2">
              <div className="flex justify-between text-sm text-raw-umber/70">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-raw-umber/70">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-raw-umber pt-2 border-t border-raw-umber/10">
                <span>Total</span>
                <span className="text-deep-ochre">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              className="bg-crimson-thread hover:bg-crimson-thread/90 text-warm-ivory rounded-full px-8"
            >
              <Link href="/categories" className="flex items-center gap-2">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 border-raw-umber/20 hover:border-deep-ochre hover:bg-deep-ochre/5"
            >
              <Link href={`/track-order?order_id=${order.orderId}`}>Track Order</Link>
            </Button>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 text-center text-sm text-raw-umber/50"
          >
            <p>
              A confirmation email has been sent to{' '}
              <span className="font-medium text-raw-umber">{order.customer.email}</span>
            </p>
            <p className="mt-2">
              Questions? Contact us at{' '}
              <a href="mailto:support@banglesbyprakashduo.store" className="text-deep-ochre hover:underline">
                support@banglesbyprakashduo.store
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <PageLoader />
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
