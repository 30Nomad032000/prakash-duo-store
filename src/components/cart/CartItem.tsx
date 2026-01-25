'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.size, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.productId, item.size, item.quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size);
  };

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="flex gap-3 py-4 border-b border-stone-200 last:border-0"
      >
        {/* Image */}
        <Link href={`/product/${item.productId}`} className="shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/product/${item.productId}`}>
            <h3 className="text-sm font-medium text-charcoal truncate hover:text-gold transition-colors">
              {item.name}
            </h3>
          </Link>
          <p className="text-xs text-charcoal/60 mt-0.5">Size: {item.size}</p>
          <p className="text-sm font-semibold text-gold mt-1">
            ₹{item.price.toLocaleString()}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 hover:border-gold hover:bg-gold/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-stone-200 hover:border-gold hover:bg-gold/5 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={handleRemove}
              className="p-1.5 text-charcoal/40 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full cart page view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 md:gap-6 py-6 border-b border-stone-200"
    >
      {/* Image */}
      <Link href={`/product/${item.productId}`} className="shrink-0">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-stone-100 group">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/product/${item.productId}`}>
              <h3 className="text-base md:text-lg font-medium text-charcoal hover:text-gold transition-colors">
                {item.name}
              </h3>
            </Link>
            <p className="text-sm text-charcoal/60 mt-1">Size: {item.size}</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 hover:border-gold hover:bg-gold/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-base font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 hover:border-gold hover:bg-gold/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg md:text-xl font-bold text-gold">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-charcoal/50">
                ₹{item.price.toLocaleString()} each
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
