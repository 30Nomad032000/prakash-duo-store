"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

// Heart burst particle component
function HeartParticle({ index, onComplete }: { index: number; onComplete?: () => void }) {
  const angle = (index * 45) + Math.random() * 20 - 10; // 8 directions with slight randomness
  const distance = 60 + Math.random() * 40;
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * distance;
  const y = Math.sin(radians) * distance;
  const scale = 0.5 + Math.random() * 0.5;
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
        duration: 0.8,
        ease: "easeOut",
      }}
      onAnimationComplete={onComplete}
      className="absolute pointer-events-none"
    >
      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
    </motion.div>
  );
}

export default function ProductCard({
  id,
  name,
  price,
  images,
  category,
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);

  const isFavorited = isInWishlist(id);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: id,
      name,
      price,
      image: images[0],
      size: 'One Size',
      quantity: 1,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  };

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasAdded = toggleItem({
      productId: id,
      name,
      price,
      image: images[0],
      category,
    });

    if (wasAdded) {
      // Trigger heart burst animation
      setShowHeartBurst(true);
      setParticles([0, 1, 2, 3, 4, 5, 6, 7]);
      setTimeout(() => {
        setShowHeartBurst(false);
        setParticles([]);
      }, 1000);
    }
  }, [toggleItem, id, name, price, images, category]);

  return (
    <Link href={`/product/${id}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-ivory to-champagne">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 z-10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 z-10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 z-10" />

          {/* Main Image */}
          <motion.div
            animate={{
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full"
          >
            <Image
              src={images[currentImageIndex] || images[0]}
              alt={name}
              fill
              className="object-cover transition-opacity duration-500"
            />
          </motion.div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Desktop Quick actions - shown on hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-charcoal hover:bg-gold hover:text-white transition-all duration-300 shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className={`p-3 backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg ${
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/90 text-charcoal hover:bg-gold hover:text-white'
              }`}
            >
              {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleFavorite}
              className={`relative p-3 backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg ${
                isFavorited
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-charcoal hover:bg-rose-gold hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />

              {/* Heart burst particles */}
              <AnimatePresence>
                {showHeartBurst && particles.map((i) => (
                  <HeartParticle key={i} index={i} />
                ))}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Mobile Quick Actions - Bottom right to avoid category badge overlap */}
          <div className="md:hidden absolute bottom-3 right-3 flex flex-row gap-2 z-20">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className={`relative p-2.5 backdrop-blur-sm rounded-full shadow-lg transition-all ${
                isFavorited
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-charcoal'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />

              {/* Heart burst particles for mobile */}
              <AnimatePresence>
                {showHeartBurst && particles.map((i) => (
                  <HeartParticle key={i} index={i} />
                ))}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              className={`p-2.5 backdrop-blur-sm rounded-full shadow-lg transition-all ${
                addedToCart
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/90 text-charcoal'
              }`}
            >
              {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </motion.button>
          </div>

          {/* Category tag */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-[10px] font-medium uppercase tracking-widest bg-white/80 backdrop-blur-sm text-charcoal/80 rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isHovered ? "100%" : "30%" }}
            transition={{ duration: 0.4 }}
            className="h-[1px] bg-gradient-to-r from-gold via-rose-gold to-transparent"
          />

          <h3 className="font-display text-lg text-charcoal leading-tight tracking-tight group-hover:text-burgundy transition-colors duration-300">
            {name}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-charcoal">
              ₹{price.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
