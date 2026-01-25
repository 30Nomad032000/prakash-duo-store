'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CartItem from '@/components/cart/CartItem';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, itemCount } = useCart();

  // Redirect to cart if empty
  useEffect(() => {
    if (state.isLoaded && state.items.length === 0) {
      router.push('/cart');
    }
  }, [state.isLoaded, state.items.length, router]);

  if (!state.isLoaded || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-charcoal/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cashfree SDK */}
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-ivory noise-overlay">
        {/* Header */}
        <section className="py-4 bg-white border-b border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-charcoal/50 hover:text-gold transition-colors">Home</Link>
              <span className="text-charcoal/30">/</span>
              <Link href="/cart" className="text-charcoal/50 hover:text-gold transition-colors">Cart</Link>
              <span className="text-charcoal/30">/</span>
              <span className="text-charcoal font-medium">Checkout</span>
            </nav>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 md:mb-12"
            >
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-charcoal/60 hover:text-gold transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
              <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
                Checkout
              </h1>
              <div className="mt-4 w-24 h-[1px] bg-gradient-to-r from-gold to-transparent" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <CheckoutForm />
              </div>

              {/* Order Items & Trust Badges */}
              <div className="lg:col-span-1 space-y-6">
                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-medium text-charcoal mb-4 flex items-center justify-between">
                    Your Items
                    <span className="text-sm font-normal text-charcoal/50">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </h3>
                  <div className="max-h-80 overflow-y-auto">
                    {state.items.map((item) => (
                      <CartItem
                        key={`${item.productId}-${item.size}`}
                        item={item}
                        compact
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-medium text-charcoal mb-4">
                    Why Shop With Us
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        icon: Shield,
                        title: 'Secure Payment',
                        desc: '100% secure payment with SSL encryption',
                      },
                      {
                        icon: Truck,
                        title: 'Free Shipping',
                        desc: 'Free delivery on orders above ₹999',
                      },
                      {
                        icon: RotateCcw,
                        title: 'Easy Returns',
                        desc: '7-day hassle-free return policy',
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal">{item.title}</p>
                          <p className="text-xs text-charcoal/50">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-sm font-medium text-charcoal mb-3">
                    We Accept
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['UPI', 'Cards', 'Net Banking', 'Wallets'].map((method) => (
                      <span
                        key={method}
                        className="px-3 py-1 text-xs bg-stone-100 text-charcoal/70 rounded-full"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
