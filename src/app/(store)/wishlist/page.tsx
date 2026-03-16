"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageSeo from '@/components/seo/PageSeo';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem, openCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text-el", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (items.length === 0 || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".wishlist-card", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });
    }, gridRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <div className="min-h-screen bg-warm-ivory noise-overlay">
      <PageSeo
        title="Your Wishlist — Saved Bangles"
        description="View your saved favorite bangles from Prakash Duo."
        canonical="https://banglesbyprakashduo.store/wishlist"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-raw-umber pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-crimson-thread/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="hero-text-el font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
            Your Favorites
          </p>
          <h1 className="hero-text-el font-display text-4xl md:text-5xl lg:text-6xl text-warm-ivory font-bold mb-4">
            Your <span className="font-drama italic font-normal">Wishlist</span>
          </h1>
          <p className="hero-text-el font-body text-warm-ivory/60 text-lg max-w-md mx-auto">
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} item${items.length > 1 ? "s" : ""} saved for later`}
          </p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blush-dust/30 flex items-center justify-center">
                <Heart className="w-12 h-12 text-deep-ochre/40" />
              </div>
              <h2 className="font-display text-2xl text-raw-umber mb-4">
                No favorites yet
              </h2>
              <p className="font-body text-raw-umber/60 mb-8 max-w-md mx-auto">
                Start adding items to your wishlist by clicking the heart icon on products you love.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-semibold hover:bg-crimson-thread/90 transition-colors"
              >
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-8 border-b border-raw-umber/10">
                <p className="font-body text-raw-umber/60">
                  {items.length} item{items.length > 1 ? "s" : ""} in your wishlist
                </p>
                <button
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 bg-crimson-thread text-warm-ivory px-6 py-3 font-body font-medium rounded-full hover:bg-crimson-thread/90 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add All to Cart
                </button>
              </div>

              {/* Wishlist Grid */}
              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="wishlist-card group rounded-3xl overflow-hidden bg-warm-ivory border border-raw-umber/10 hover:shadow-xl transition-shadow"
                    >
                      {/* Image */}
                      <Link href={`/product/${item.productId}`} className="block relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-raw-umber/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-raw-umber/70 backdrop-blur-sm text-warm-ivory rounded-full">
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
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-raw-umber/60 hover:bg-crimson-thread hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </Link>

                      {/* Content */}
                      <div className="p-4">
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-display text-lg text-raw-umber hover:text-deep-ochre transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xl font-body font-bold text-deep-ochre mt-2">
                          ₹{item.price.toLocaleString()}
                        </p>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(item)}
                          className={`w-full mt-4 py-3 rounded-full font-body font-medium flex items-center justify-center gap-2 transition-all ${
                            addedToCart === item.productId
                              ? "bg-emerald-500 text-white"
                              : "bg-raw-umber text-warm-ivory hover:bg-deep-ochre"
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
        <section className="py-12 border-t border-raw-umber/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-raw-umber font-body font-medium hover:text-deep-ochre transition-colors"
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
