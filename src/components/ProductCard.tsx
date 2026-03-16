"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useHaptics } from "@/hooks/useHaptics";

interface InventoryItem {
  size: string;
  quantity: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  inventory?: InventoryItem[];
}

function isProductOutOfStock(inventory?: InventoryItem[]): boolean {
  if (!inventory || inventory.length === 0) return false;
  return inventory.every((item) => {
    const qty = parseInt(item.quantity) || (item.quantity.includes('set') ? 1 : 0);
    return qty <= 0;
  });
}

export default function ProductCard({
  id,
  name,
  price,
  images,
  category,
  inventory,
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { trigger: haptic } = useHaptics();
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isFav = isInWishlist(id);
  const outOfStock = isProductOutOfStock(inventory);

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    haptic("success");
    addItem({
      productId: id,
      name,
      price,
      image: images[0],
      size: "One Size",
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  }, [addItem, openCart, id, name, price, images, haptic, outOfStock]);

  const handleToggleFav = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic("nudge");
    toggleItem({
      productId: id,
      name,
      price,
      image: images[0],
      category,
    });
  }, [toggleItem, id, name, price, images, category, haptic]);

  return (
    <Link href={`/product/${id}`} className="group block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-blush-dust">
          <Image
            src={images[0]}
            alt={name}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${hovered ? "scale-[1.04]" : "scale-100"} ${outOfStock ? "opacity-60 grayscale-[30%]" : ""}`}
          />

          {/* Out of Stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="px-4 py-2 bg-raw-umber/85 backdrop-blur-sm text-warm-ivory text-xs font-mono uppercase tracking-widest rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-raw-umber/70 backdrop-blur-sm text-warm-ivory text-[10px] font-mono uppercase tracking-wider rounded-full">
            {category}
          </span>

          {/* Wishlist button */}
          <button
            onClick={handleToggleFav}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
              isFav ? "bg-crimson-thread text-white" : "bg-white/80 text-raw-umber hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>

          {/* Desktop add to cart — slides up on hover (hidden when out of stock) */}
          {!outOfStock && (
            <motion.div
              initial={false}
              animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-3 left-3 right-3 hidden md:block"
            >
              <button
                onClick={handleQuickAdd}
                className={`w-full py-3 rounded-2xl font-body text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                  addedToCart
                    ? "bg-emerald-500 text-white"
                    : "bg-warm-ivory/90 text-raw-umber hover:bg-deep-ochre hover:text-warm-ivory"
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Added</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><ShoppingBag className="w-4 h-4" /> Add to Cart</span>
                )}
              </button>
            </motion.div>
          )}

          {/* Mobile add to cart (hidden when out of stock) */}
          {!outOfStock && (
            <button
              onClick={handleQuickAdd}
              className={`md:hidden absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-sm shadow-lg z-10 ${
                addedToCart ? "bg-emerald-500 text-white" : "bg-white/90 text-raw-umber"
              }`}
            >
              {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 px-1">
          <h3 className="font-display text-raw-umber text-lg leading-tight line-clamp-2 group-hover:text-deep-ochre transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body font-bold text-deep-ochre text-lg">
              ₹{price.toLocaleString()}
            </p>
            {outOfStock && (
              <span className="text-xs font-mono text-crimson-thread/80 uppercase">Sold Out</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
