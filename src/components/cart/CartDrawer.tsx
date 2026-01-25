'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { Button } from '@/components/ui/button';

export default function CartDrawer() {
  const { state, closeCart, itemCount } = useCart();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-serif font-semibold text-charcoal">
                  Shopping Bag
                </h2>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-gold/10 text-gold rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5 text-charcoal/60" />
              </button>
            </div>

            {/* Content */}
            {state.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-stone-400" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-2">
                  Your bag is empty
                </h3>
                <p className="text-sm text-charcoal/60 mb-6">
                  Discover our exquisite collection of handcrafted bangles
                </p>
                <Button
                  onClick={closeCart}
                  asChild
                  className="bg-gold hover:bg-rose-gold text-white rounded-full px-8"
                >
                  <Link href="/categories">Start Shopping</Link>
                </Button>
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
                <div className="border-t border-stone-200 px-6 py-4 bg-white">
                  <CartSummary showShipping={true} />

                  <div className="mt-4 space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={closeCart}
                        asChild
                        className="w-full bg-gold hover:bg-rose-gold text-white py-3 rounded-full font-medium"
                      >
                        <Link href="/checkout" className="flex items-center justify-center gap-2">
                          Checkout
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>

                    <Button
                      onClick={closeCart}
                      asChild
                      variant="outline"
                      className="w-full py-3 rounded-full border-charcoal/20 hover:border-gold hover:bg-gold/5"
                    >
                      <Link href="/cart">View Full Cart</Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
