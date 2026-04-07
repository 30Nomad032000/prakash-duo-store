'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import PageSeo from '@/components/seo/PageSeo';

export default function CartPage() {
  const { state, clearCart, itemCount } = useCart();

  return (
    <div className="min-h-screen bg-warm-ivory noise-overlay pt-20">
      <PageSeo
        title="Shopping Bag"
        description="Review items in your shopping bag."
        canonical="https://banglesbyprakashduo.store/cart"
      />
      {/* Header */}
      <section className="py-4 bg-warm-ivory border-b border-deep-ochre/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-raw-umber/50 hover:text-deep-ochre transition-colors">Home</Link>
            <span className="text-raw-umber/30">/</span>
            <span className="text-raw-umber font-medium">Shopping Bag</span>
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
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-8 h-8 text-deep-ochre" />
              <h1 className="font-display text-3xl md:text-4xl text-raw-umber">
                Shopping Bag
              </h1>
              {itemCount > 0 && (
                <span className="px-3 py-1 text-sm font-medium bg-deep-ochre/10 text-deep-ochre rounded-full">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <div className="mt-4 w-24 h-[1px] bg-gradient-to-r from-deep-ochre to-transparent" />
          </motion.div>

          {state.items.length === 0 ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-blush-dust flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-raw-umber/30" />
              </div>
              <h2 className="text-2xl font-display text-raw-umber mb-3">
                Your bag is empty
              </h2>
              <p className="text-raw-umber/60 mb-8 max-w-md mx-auto">
                Looks like you haven&apos;t added any items to your bag yet.
                Explore our exquisite collection of handcrafted bangles.
              </p>
              <Button
                asChild
                className="bg-crimson-thread hover:bg-crimson-thread/90 text-warm-ivory rounded-full px-10 py-6 text-base"
              >
                <Link href="/categories" className="flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <div className="bg-warm-ivory rounded-3xl p-6 md:p-8 shadow-sm border border-raw-umber/10">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-raw-umber/10">
                    <h2 className="text-lg font-medium text-raw-umber">
                      Your Items
                    </h2>
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-2 text-sm text-raw-umber/50 hover:text-crimson-thread transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {state.items.map(item => (
                      <CartItem
                        key={`${item.productId}-${item.size}`}
                        item={item}
                        compact={false}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Continue Shopping */}
                  <div className="mt-6 pt-6 border-t border-raw-umber/10">
                    <Link
                      href="/categories"
                      className="inline-flex items-center gap-2 text-raw-umber/60 hover:text-deep-ochre transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-warm-ivory rounded-3xl p-6 md:p-8 shadow-sm border border-raw-umber/10 sticky top-8">
                  <h2 className="text-lg font-medium text-raw-umber mb-6 pb-4 border-b border-raw-umber/10">
                    Order Summary
                  </h2>

                  <CartSummary showShipping={true} />

                  <div className="mt-6 pt-6 border-t border-raw-umber/10 space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        className="w-full bg-crimson-thread hover:bg-crimson-thread/90 text-warm-ivory py-4 rounded-full font-medium"
                      >
                        <Link href="/checkout" className="flex items-center justify-center gap-2">
                          Proceed to Checkout
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </Button>
                    </motion.div>

                    <p className="text-xs text-center text-raw-umber/50">
                      Secure checkout powered by Razorpay
                    </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-8 pt-6 border-t border-raw-umber/10 space-y-3">
                    {[
                      { title: 'Free Shipping', desc: 'On orders above ₹599' },
                      { title: 'Secure Payment', desc: '100% secure transactions' },
                      { title: 'No Returns', desc: 'Only for damaged products' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-deep-ochre text-sm">✓</span>
                        <div>
                          <p className="text-sm font-medium text-raw-umber">{item.title}</p>
                          <p className="text-xs text-raw-umber/50">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
