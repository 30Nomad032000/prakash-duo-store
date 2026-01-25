"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, Award, Truck, Shield, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
  images: string[];
  productCount: number;
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track window scroll - only apply parallax on desktop
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const heroProducts = products.slice(0, 4);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories?withImages=true").then((r) => r.json()),
          fetch("/api/products?limit=8").then((r) => r.json()),
        ]);
        setCategories(categoriesRes);
        setProducts(productsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Auto-advance hero images
  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentHeroImage(index);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="space-y-4 text-center"
        >
          <div className="w-24 h-24 mx-auto border-2 border-gold rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-gold animate-pulse" />
          </div>
          <p className="text-charcoal/60 font-display text-xl">
            Curating elegance...
          </p>
        </motion.div>
      </div>
    );
  }

  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="bg-ivory noise-overlay">
        {/* Hero Section - Editorial Style */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Announcement Bar */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 bg-charcoal text-white py-3 px-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-rose-gold/10" />
            <p className="text-center text-sm font-medium tracking-wide">
              <span className="gold-shimmer">Free Shipping</span> on orders
              above ₹999 · Handcrafted with love in India
            </p>
          </motion.div>

          {/* Hero Content */}
          <div className="relative min-h-[calc(100vh-52px)] lg:h-[90vh] bg-gradient-to-br from-charcoal via-charcoal to-burgundy overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/10 rounded-full hidden lg:block" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/5 rounded-full hidden lg:block" />
            </div>

            <motion.div
              style={isMobile ? {} : { y: heroY, opacity: heroOpacity }}
              className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center py-8 lg:py-0"
            >
              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col lg:hidden w-full gap-8">
                {/* Mobile Hero Image Carousel */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative w-full"
                >
                  <div className="relative aspect-[4/5] w-full max-w-sm mx-auto">
                    {/* Decorative frame */}
                    <div className="absolute -inset-2 border border-gold/30" />

                    {/* Image carousel with crossfade */}
                    <div className="relative w-full h-full overflow-hidden">
                      <AnimatePresence mode="wait">
                        {heroProducts[currentHeroImage] && (
                          <motion.div
                            key={currentHeroImage}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={heroProducts[currentHeroImage].images[0]}
                              alt={heroProducts[currentHeroImage].name}
                              fill
                              className="object-cover"
                              priority
                            />
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Carousel indicators */}
                    {heroProducts.length > 1 && (
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {heroProducts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              index === currentHeroImage
                                ? 'w-8 bg-gold'
                                : 'w-1.5 bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Mobile Content */}
                <div className="space-y-6 text-center pt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20">
                      <Sparkles className="w-3 h-3 text-gold" />
                      <span className="text-gold text-xs font-medium tracking-widest uppercase">
                        Artisan Collection 2025
                      </span>
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="font-display text-4xl sm:text-5xl text-white leading-[0.95] tracking-tight"
                  >
                    Timeless
                    <br />
                    <span className="gradient-text">Elegance</span>
                    <br />
                    <span className="text-white/60 text-3xl sm:text-4xl">
                      Redefined
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base text-white/70 max-w-xs mx-auto leading-relaxed"
                  >
                    Handcrafted bangles celebrating tradition with modern sophistication.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                  >
                    <Link
                      href="/categories"
                      className="group relative inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-6 py-3.5 font-semibold overflow-hidden transition-all duration-300"
                    >
                      <span className="relative z-10">Explore Collection</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-gradient-to-r from-rose-gold to-gold translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-300"
                    >
                      Our Story
                    </Link>
                  </motion.div>

                  {/* Mobile Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="flex items-center justify-center gap-6 pt-6"
                  >
                    {[
                      { value: "1000+", label: "Customers" },
                      { value: "500+", label: "Designs" },
                      { value: "100%", label: "Handmade" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-display text-gold">
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Desktop Layout - Side by Side */}
              <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center w-full">
                {/* Left Content */}
                <div className="space-y-8 z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span className="text-gold text-sm font-medium tracking-widest uppercase">
                        Artisan Collection 2025
                      </span>
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.95] tracking-tight"
                  >
                    Timeless
                    <br />
                    <span className="gradient-text">Elegance</span>
                    <br />
                    <span className="text-white/60 text-4xl md:text-5xl lg:text-6xl">
                      Redefined
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-lg text-white/70 max-w-md leading-relaxed"
                  >
                    Discover handcrafted bangles that celebrate tradition while
                    embracing modern sophistication. Each piece, a testament to
                    India&apos;s rich artisanal heritage.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap gap-4 pt-4"
                  >
                    <Link
                      href="/categories"
                      className="group relative inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/20"
                    >
                      <span className="relative z-10">Explore Collection</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-gradient-to-r from-rose-gold to-gold translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-300"
                    >
                      Our Story
                    </Link>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex items-center gap-8 pt-8"
                  >
                    {[
                      { value: "1000+", label: "Happy Customers" },
                      { value: "500+", label: "Unique Designs" },
                      { value: "100%", label: "Handmade" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl md:text-3xl font-display text-gold">
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right - Featured Image Carousel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="relative"
                >
                  <div className="relative aspect-[3/4] max-w-lg ml-auto">
                    {/* Decorative frame */}
                    <div className="absolute -inset-4 border border-gold/30" />
                    <div className="absolute -inset-8 border border-gold/10" />

                    {/* Image carousel with crossfade */}
                    <div className="relative w-full h-full overflow-hidden">
                      <AnimatePresence mode="wait">
                        {heroProducts[currentHeroImage] && (
                          <motion.div
                            key={currentHeroImage}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={heroProducts[currentHeroImage].images[0]}
                              alt={heroProducts[currentHeroImage].name}
                              fill
                              className="object-cover"
                              priority
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Floating badge with product info */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentHeroImage}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute -right-6 top-1/4 bg-white px-4 py-3 shadow-xl"
                      >
                        <p className="text-xs text-charcoal/60 uppercase tracking-wider">
                          Featured
                        </p>
                        <p className="font-display text-lg text-charcoal">
                          {heroProducts[currentHeroImage]?.name?.split(' ').slice(0, 2).join(' ') || 'New Arrival'}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel indicators */}
                    {heroProducts.length > 1 && (
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                        {heroProducts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-500 ${
                              index === currentHeroImage
                                ? 'w-10 bg-gold'
                                : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Scroll indicator - hidden on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2"
              >
                <motion.div className="w-1 h-2 bg-gold rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section - Asymmetric Grid */}
        <section className="py-24 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-16">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <span className="text-gold text-sm font-medium tracking-widest uppercase">
                    Curated Selection
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mt-2">
                    Shop by Category
                  </h2>
                </div>
                <Link
                  href="/categories"
                  className="group inline-flex items-center gap-2 text-charcoal font-medium hover:text-gold transition-colors"
                >
                  View All Categories
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="mt-6 h-[1px] bg-gradient-to-r from-gold/50 via-rose-gold/30 to-transparent" />
            </AnimatedSection>

            {/* Asymmetric Category Grid */}
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {featuredCategories.map((category, index) => {
                // Create asymmetric layout
                const gridClasses = [
                  "col-span-12 md:col-span-8 aspect-[2/1] md:aspect-[16/9]",
                  "col-span-6 md:col-span-4 aspect-square",
                  "col-span-6 md:col-span-4 aspect-square",
                  "col-span-12 md:col-span-4 aspect-[2/1] md:aspect-square",
                  "col-span-6 md:col-span-4 aspect-square",
                  "col-span-6 md:col-span-4 aspect-square",
                ];

                return (
                  <AnimatedSection
                    key={category.id}
                    delay={index * 0.1}
                    className={gridClasses[index] || "col-span-6 md:col-span-4"}
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      className="group relative block w-full h-full overflow-hidden bg-charcoal"
                    >
                      <Image
                        src={category.images[0] || ""}
                        alt={category.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />

                      {/* Category info */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="font-display text-2xl md:text-3xl text-white mb-1">
                            {category.name}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {category.productCount} pieces
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-sm font-medium">
                              Explore Collection
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-gold/0 group-hover:border-gold transition-colors duration-500" />
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-ivory to-transparent" />
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <AnimatedSection className="text-center mb-16">
              <span className="text-rose-gold text-sm font-medium tracking-widest uppercase">
                Most Loved
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mt-2">
                Best Sellers
              </h2>
              <p className="text-charcoal/60 mt-4 max-w-lg mx-auto">
                Discover our most cherished pieces, handpicked favorites from
                our discerning clientele
              </p>
              <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.slice(0, 8).map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 0.08}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    images={product.images}
                    category={product.category}
                  />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.4} className="text-center mt-16">
              <Link
                href="/best-sellers"
                className="group inline-flex items-center gap-3 bg-charcoal text-white px-10 py-5 font-medium hover:bg-burgundy transition-colors duration-300"
              >
                View All Best Sellers
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Promo Banner - Full Width Editorial */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy via-burgundy to-charcoal" />
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-block px-6 py-2 border border-gold/50 text-gold text-sm tracking-widest uppercase mb-6"
              >
                Limited Time Offer
              </motion.span>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-4">
                Exclusive Sale
              </h2>
              <p className="text-3xl md:text-4xl text-gold font-display mb-8">
                Up to 40% Off Selected Pieces
              </p>
              <Link
                href="/categories?sale=true"
                className="group inline-flex items-center gap-3 bg-gold text-charcoal px-10 py-5 font-semibold hover:bg-white transition-colors duration-300"
              >
                Shop the Sale
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonials - Editorial Cards */}
        <section className="py-24 md:py-32 bg-champagne relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Testimonials
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mt-2">
                What Our Clients Say
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma",
                  location: "Mumbai",
                  text: "The craftsmanship is extraordinary. Each bangle feels like a piece of art. The attention to detail is remarkable.",
                  rating: 5,
                },
                {
                  name: "Anjali Patel",
                  location: "Delhi",
                  text: "Beautiful packaging and even more beautiful bangles. They arrived perfectly and look stunning. Highly recommend!",
                  rating: 5,
                },
                {
                  name: "Meera Krishnan",
                  location: "Bangalore",
                  text: "My go-to for traditional bangles. The quality is consistently excellent and the designs are unique and elegant.",
                  rating: 5,
                },
              ].map((review, index) => (
                <AnimatedSection key={index} delay={index * 0.15}>
                  <div className="group bg-white p-8 h-full relative overflow-hidden hover:shadow-xl transition-all duration-500">
                    {/* Decorative quote */}
                    <div className="absolute -top-4 -left-2 text-8xl font-display text-gold/10">
                      &ldquo;
                    </div>

                    <div className="relative">
                      {/* Stars */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-gold text-gold"
                          />
                        ))}
                      </div>

                      <p className="text-charcoal/80 leading-relaxed mb-6 text-lg">
                        {review.text}
                      </p>

                      <div className="pt-6 border-t border-gold/20">
                        <p className="font-display text-xl text-charcoal">
                          {review.name}
                        </p>
                        <p className="text-sm text-charcoal/50">
                          {review.location}
                        </p>
                      </div>
                    </div>

                    {/* Hover accent */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-rose-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-20 bg-white border-y border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "Handcrafted",
                  desc: "Artisan made with love",
                },
                {
                  icon: Award,
                  title: "Premium Quality",
                  desc: "Finest materials only",
                },
                {
                  icon: Truck,
                  title: "Free Shipping",
                  desc: "On orders above ₹999",
                },
                {
                  icon: Shield,
                  title: "Secure Checkout",
                  desc: "100% safe payments",
                },
              ].map((item, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 0.1}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-display text-lg text-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 mt-1">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter - Elegant */}
        <section className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Stay Connected
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-white mt-4 mb-6">
                Join Our Circle of Elegance
              </h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto">
                Be the first to discover new collections, exclusive offers, and
                styling inspirations delivered to your inbox.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gold text-charcoal font-semibold hover:bg-rose-gold transition-colors"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-white/40 text-sm mt-6">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </AnimatedSection>
          </div>
        </section>
    </div>
  );
}
