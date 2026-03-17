'use client';

import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface CartSummaryProps {
  showShipping?: boolean;
  className?: string;
}

// Shipping threshold for free shipping
const FREE_SHIPPING_THRESHOLD = 599;
const SHIPPING_COST = 99;

export default function CartSummary({ showShipping = true, className = '' }: CartSummaryProps) {
  const { subtotal, itemCount } = useCart();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Free shipping progress */}
      {showShipping && subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gold/5 rounded-xl p-4 border border-gold/20"
        >
          <p className="text-sm text-charcoal/80">
            Add <span className="font-semibold text-gold">₹{amountToFreeShipping.toLocaleString()}</span> more
            for <span className="font-semibold">FREE shipping!</span>
          </p>
          <div className="mt-2 h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-gold to-rose-gold rounded-full"
            />
          </div>
        </motion.div>
      )}

      {showShipping && subtotal >= FREE_SHIPPING_THRESHOLD && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 rounded-xl p-4 border border-emerald-200"
        >
          <p className="text-sm text-emerald-700 flex items-center gap-2">
            <span className="text-lg">🎉</span>
            You&apos;ve unlocked <span className="font-semibold">FREE shipping!</span>
          </p>
        </motion.div>
      )}

      {/* Summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-charcoal/70">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>

        {showShipping && (
          <div className="flex justify-between text-sm text-charcoal/70">
            <span>Shipping</span>
            {shipping === 0 ? (
              <span className="text-emerald-600 font-medium">FREE</span>
            ) : (
              <span>₹{shipping.toLocaleString()}</span>
            )}
          </div>
        )}

        <div className="border-t border-stone-200 pt-3 flex justify-between">
          <span className="text-base font-semibold text-charcoal">Total</span>
          <span className="text-xl font-bold text-gold">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Export constants for use in checkout
export { FREE_SHIPPING_THRESHOLD, SHIPPING_COST };
