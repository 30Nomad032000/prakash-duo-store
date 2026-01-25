'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Check, Heart, Share2 } from 'lucide-react';

interface InventoryItem {
  size: string;
  quantity: string;
}

interface ProductDetailsProps {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  sizes?: string[];
  inventory?: InventoryItem[];
  image: string;
}

// Heart burst particle component
function HeartParticle({ index }: { index: number }) {
  const angle = (index * 45) + Math.random() * 20 - 10;
  const distance = 80 + Math.random() * 60;
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * distance;
  const y = Math.sin(radians) * distance;
  const scale = 0.6 + Math.random() * 0.6;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
      animate={{
        x,
        y,
        scale: [0, scale, scale, 0],
        opacity: [1, 1, 1, 0],
        rotate: rotation,
      }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
      }}
      className="absolute pointer-events-none"
    >
      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
    </motion.div>
  );
}

export default function ProductDetails({
  id,
  name,
  price,
  category,
  subcategory,
  sizes = [],
  inventory = [],
  image,
}: ProductDetailsProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [addedToCart, setAddedToCart] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const isFavorited = isInWishlist(id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const getStockForSize = (size: string): string => {
    const item = inventory.find(inv => inv.size === size);
    return item ? item.quantity : '0';
  };

  const isInStock = (size: string): boolean => {
    const stock = getStockForSize(size);
    const qty = parseInt(stock) || (stock.includes('set') ? 1 : 0);
    return qty > 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) {
      return;
    }

    addItem({
      productId: id,
      name,
      price,
      image,
      size: selectedSize || 'One Size',
      quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  };

  const handleBuyNow = () => {
    if (!selectedSize && sizes.length > 0) {
      return;
    }

    addItem({
      productId: id,
      name,
      price,
      image,
      size: selectedSize || 'One Size',
      quantity,
    });

    router.push('/checkout');
  };

  const handleToggleFavorite = useCallback(() => {
    const wasAdded = toggleItem({
      productId: id,
      name,
      price,
      image,
      category,
    });

    if (wasAdded) {
      setShowHeartBurst(true);
      setParticles([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      setTimeout(() => {
        setShowHeartBurst(false);
        setParticles([]);
      }, 1200);
    }
  }, [toggleItem, id, name, price, image, category]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out this beautiful ${name} from Prakash Duo!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const canAddToCart = sizes.length === 0 || (selectedSize && isInStock(selectedSize));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 lg:sticky lg:top-8"
    >
      {/* Category badges and action buttons */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gold/10 text-gold hover:bg-gold/20 border border-gold/20">
            {category}
          </Badge>
          {subcategory && subcategory !== category && (
            <Badge variant="outline" className="text-charcoal/60 border-charcoal/20">
              {subcategory}
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2.5 rounded-full border border-charcoal/20 text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleFavorite}
            className={`relative p-2.5 rounded-full border transition-all ${
              isFavorited
                ? 'bg-rose-500 border-rose-500 text-white'
                : 'border-charcoal/20 text-charcoal/60 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-500'
            }`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />

            {/* Heart burst particles */}
            <AnimatePresence>
              {showHeartBurst && particles.map((i) => (
                <HeartParticle key={i} index={i} />
              ))}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight"
      >
        {name}
      </motion.h1>

      <motion.div variants={itemVariants} className="flex items-baseline gap-3">
        <span className="text-2xl md:text-3xl font-bold text-gold">
          ₹{price.toLocaleString()}
        </span>
      </motion.div>

      <motion.p variants={itemVariants} className="text-gray-600 leading-relaxed">
        Handcrafted with love and precision by skilled artisans. Each piece is unique
        and tells a story of tradition and elegance.
      </motion.p>

      {/* Size Selection */}
      {sizes.length > 0 && (
        <motion.div variants={itemVariants} className="border-t border-stone-200 pt-4">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const inStock = isInStock(size);
              const stock = getStockForSize(size);
              return (
                <button
                  key={size}
                  onClick={() => inStock && setSelectedSize(size)}
                  disabled={!inStock}
                  className={`
                    relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                    ${selectedSize === size
                      ? 'border-gold bg-gold/10 text-gold'
                      : inStock
                        ? 'border-stone-200 hover:border-gold/50 text-gray-700'
                        : 'border-stone-100 bg-stone-50 text-gray-400 cursor-not-allowed line-through'
                    }
                  `}
                >
                  {size}
                  {inStock && (
                    <span className="block text-[10px] text-gray-400 font-normal">
                      {stock} available
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="border-t border-b border-stone-200 py-4">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-10 h-10 hover:bg-gold/10 hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </Button>
          <span className="w-14 h-10 flex items-center justify-center border border-stone-300 rounded bg-white text-lg font-medium">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            className="w-10 h-10 hover:bg-gold/10 hover:border-gold"
          >
            +
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <motion.div whileHover={canAddToCart ? { scale: 1.02 } : {}} whileTap={canAddToCart ? { scale: 0.98 } : {}}>
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full bg-gold hover:bg-rose-gold text-white py-4 font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold"
          >
            {addedToCart ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Added to Cart
              </span>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </motion.div>
        <motion.div whileHover={canAddToCart ? { scale: 1.02 } : {}} whileTap={canAddToCart ? { scale: 0.98 } : {}}>
          <Button
            onClick={handleBuyNow}
            disabled={!canAddToCart}
            className="w-full bg-burgundy hover:bg-burgundy/90 text-white py-4 font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-burgundy"
          >
            Buy Now
          </Button>
        </motion.div>

        {/* Mobile Favorite Button - Large and accessible */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleToggleFavorite}
          className={`md:hidden relative w-full py-4 font-medium rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-white border-2 border-rose-300 text-rose-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          {isFavorited ? 'Added to Wishlist' : 'Add to Wishlist'}

          {/* Heart burst particles for mobile button */}
          <AnimatePresence>
            {showHeartBurst && particles.map((i) => (
              <HeartParticle key={i} index={i} />
            ))}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="pt-6 space-y-4 border-t border-stone-200"
      >
        {[
          { title: 'Free Shipping', subtitle: 'On orders above ₹999' },
          { title: 'Secure Payment', subtitle: '100% secure transactions' },
          { title: 'Easy Returns', subtitle: '7 days return policy' }
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-start gap-3"
          >
            <span className="text-gold text-lg">✓</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
