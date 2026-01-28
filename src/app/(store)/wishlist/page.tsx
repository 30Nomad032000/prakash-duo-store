"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem, openCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "One Size",
      quantity: 1,
    });
    setAddedToCart(item.productId);
    setTimeout(() => setAddedToCart(null), 2000);
    openCart();
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        size: "One Size",
        quantity: 1,
      });
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-charcoal via-charcoal to-burgundy py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-rose-500/20 mb-6">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span className="text-rose-400 text-sm font-medium tracking-widest uppercase">
                Your Favorites
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Wishlist
            </h1>
            <p className="text-white/60 text-lg max-w-md mx-auto">
              {items.length === 0
                ? "Your wishlist is empty"
                : `${items.length} item${items.length > 1 ? "s" : ""} saved for later`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-50 flex items-center justify-center">
                <Heart className="w-12 h-12 text-rose-300" />
              </div>
              <h2 className="font-display text-2xl text-charcoal mb-4">
                No favorites yet
              </h2>
              <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
                Start adding items to your wishlist by clicking the heart icon on products you love.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-gold text-charcoal px-8 py-4 font-semibold hover:bg-rose-gold transition-colors"
              >
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Actions Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-8 border-b border-gold/20"
              >
                <p className="text-charcoal/60">
                  {items.length} item{items.length > 1 ? "s" : ""} in your wishlist
                </p>
                <button
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 bg-charcoal text-white px-6 py-3 font-medium hover:bg-burgundy transition-colors rounded-full"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add All to Cart
                </button>
              </motion.div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                    >
                      {/* Image */}
                      <Link href={`/product/${item.productId}`} className="block relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 text-[10px] font-medium uppercase tracking-widest bg-white/90 backdrop-blur-sm text-charcoal/80 rounded-full">
                            {item.category}
                          </span>
                        </div>

                        {/* Remove button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            removeItem(item.productId);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal/60 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </Link>

                      {/* Content */}
                      <div className="p-4">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-display text-lg text-charcoal hover:text-burgundy transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xl font-semibold text-gold mt-2">
                          ₹{item.price.toLocaleString()}
                        </p>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item)}
                          className={`w-full mt-4 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                            addedToCart === item.productId
                              ? "bg-emerald-500 text-white"
                              : "bg-charcoal text-white hover:bg-gold hover:text-charcoal"
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          {addedToCart === item.productId ? "Added!" : "Add to Cart"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Continue Shopping */}
      {items.length > 0 && (
        <section className="py-12 border-t border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-charcoal font-medium hover:text-gold transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
