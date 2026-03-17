'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useHaptics } from '@/hooks/useHaptics';

export default function CartDrawer() {
  const { state, closeCart, itemCount } = useCart();
  const { trigger: haptic } = useHaptics();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-raw-umber/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-warm-ivory shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-raw-umber/10">
              <div className="flex items-center gap-3">
                <span className="font-display text-xl font-bold text-raw-umber tracking-tight">
                  Your Bag
                </span>
                {itemCount > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-deep-ochre/10 text-deep-ochre rounded-full tracking-wide">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => { haptic("nudge"); closeCart(); }}
                className="p-2 rounded-full hover:bg-raw-umber/5 transition-colors"
              >
                <X className="w-5 h-5 text-raw-umber/40" />
              </button>
            </div>

            {/* Content */}
            {state.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-blush-dust flex items-center justify-center mb-6">
                  <ShoppingBag className="w-9 h-9 text-raw-umber/25" />
                </div>
                <h3 className="font-display text-xl text-raw-umber mb-2">
                  Nothing here yet
                </h3>
                <p className="text-sm text-raw-umber/50 font-body mb-8 max-w-xs">
                  Discover handcrafted bangles from Thrissur, made with love by the Prakash sisters.
                </p>
                <Link
                  href="/categories"
                  onClick={closeCart}
                  className="group inline-flex items-center gap-2 bg-crimson-thread text-warm-ivory px-7 py-3 rounded-full font-body font-medium text-sm hover:bg-crimson-thread/90 transition-colors"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence mode="popLayout">
                    {state.items.map(item => (
                      <CartItem key={`${item.productId}-${item.size}`} item={item} compact />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-raw-umber/10 px-6 py-5 bg-warm-ivory">
                  <CartSummary showShipping={true} />

                  <div className="mt-5 space-y-2.5">
                    {/* Primary CTA — Checkout */}
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="group flex items-center justify-center gap-2.5 w-full py-3.5 bg-crimson-thread text-warm-ivory rounded-full font-body font-medium text-sm hover:bg-crimson-thread/90 transition-all duration-300 shadow-lg shadow-crimson-thread/20 hover:shadow-xl hover:shadow-crimson-thread/25"
                    >
                      <Lock className="w-3.5 h-3.5 opacity-70" />
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {/* Secondary — View full cart */}
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="flex items-center justify-center w-full py-3 border border-raw-umber/15 text-raw-umber rounded-full font-body font-medium text-sm hover:border-deep-ochre/40 hover:bg-deep-ochre/5 transition-all duration-300"
                    >
                      View Full Cart
                    </Link>

                    {/* Tertiary — Continue shopping */}
                    <button
                      onClick={closeCart}
                      className="w-full py-2 text-raw-umber/40 font-body text-sm hover:text-deep-ochre transition-colors text-center"
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Trust line */}
                  <p className="mt-4 text-center text-[11px] font-mono text-raw-umber/30 tracking-wide uppercase">
                    Secure checkout &nbsp;·&nbsp; Free shipping above ₹599
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
