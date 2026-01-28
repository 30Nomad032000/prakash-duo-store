"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles, Award, Truck, Shield, Star, ChevronLeft, ChevronRight, Phone, Instagram } from "lucide-react";

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

// Cover images for the hero section
const heroSlides = [
  {
    image: "/assets/cover page images website/Bangles.png",
    title: "Adorned in",
    highlight: "Tradition",
    subtitle: "Handcrafted bangles for the modern bride",
    cta: "Shop Bridal Collection",
    link: "/categories",
  },
  {
    image: "/assets/cover page images website/Untitled design.png",
    title: "Where Heritage",
    highlight: "Blooms",
    subtitle: "Each piece tells a story of artisan excellence",
    cta: "Explore Our Craft",
    link: "/about",
  },
];

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track window scroll - subtle parallax only
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], ["0%", "10%"]);

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

  // Auto-advance hero slides
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [isPaused, currentSlide]); // Add currentSlide to reset timer on manual navigation

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
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

  const featuredCategories = categories; // Show all categories

  return (
    <div className="bg-ivory noise-overlay">
        {/* Hero Section - Split Layout with Portrait Images */}
        <section className="relative min-h-screen overflow-hidden bg-charcoal">
          {/* Announcement Bar */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-30 bg-gradient-to-r from-burgundy via-charcoal to-burgundy text-white py-3 px-4 overflow-hidden"
          >
            {/* Animated shimmer effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
            />
            <p className="text-center text-sm font-medium tracking-wide relative">
              <span className="gold-shimmer">Free Shipping</span> on orders
              above ₹999 · Handcrafted with love in India
            </p>
          </motion.div>

          {/* Main Hero Content - Split Layout */}
          <div className="relative min-h-[calc(100vh-52px)] flex flex-col lg:flex-row">
            {/* Left Side - Content */}
            <div className="relative z-20 w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12 lg:py-0 order-2 lg:order-1">
              {/* Background with maroon gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-burgundy/80">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-40" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
                {/* Decorative glows with burgundy */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy/30 rounded-full blur-3xl" />
                <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gold/15 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-rose-gold/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-burgundy/20 rounded-full blur-3xl" />
              </div>

              <div className="relative max-w-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 lg:space-y-8"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <span className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/30">
                        <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold text-xs sm:text-sm font-medium tracking-[0.15em] uppercase">
                          Artisan Collection 2025
                        </span>
                      </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight"
                    >
                      {heroSlides[currentSlide].title}
                      <br />
                      <span className="relative inline-block mt-1 sm:mt-2">
                        <span className="gradient-text">{heroSlides[currentSlide].highlight}</span>
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold via-rose-gold to-gold origin-left"
                        />
                      </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="text-base sm:text-lg lg:text-xl text-white/70 max-w-md leading-relaxed"
                    >
                      {heroSlides[currentSlide].subtitle}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
                    >
                      <Link
                        href={heroSlides[currentSlide].link}
                        className="group relative inline-flex items-center justify-center gap-3 bg-gold text-charcoal px-6 sm:px-8 py-3.5 sm:py-4 font-semibold overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/30"
                      >
                        <span className="relative z-10">{heroSlides[currentSlide].cta}</span>
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                        <span className="absolute inset-0 bg-gradient-to-r from-white to-rose-gold translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                      </Link>
                      <Link
                        href="/categories"
                        className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/30 text-white font-medium hover:bg-white/10 hover:border-gold/50 transition-all duration-300"
                      >
                        View All
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="flex items-center gap-6 sm:gap-8 pt-4 sm:pt-6"
                    >
                      {[
                        { value: "1000+", label: "Happy Brides" },
                        { value: "500+", label: "Designs" },
                        { value: "100%", label: "Handcrafted" },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                          className="text-center"
                        >
                          <div className="text-xl sm:text-2xl lg:text-3xl font-display text-gold">
                            {stat.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider mt-0.5 sm:mt-1">
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls - Desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="hidden lg:flex items-center gap-6 pt-12"
                >
                  {/* Slide counter */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-display text-gold">
                      0{currentSlide + 1}
                    </span>
                    <span className="text-white/30 text-xl">/</span>
                    <span className="text-lg text-white/50">
                      0{heroSlides.length}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="flex flex-1 max-w-[120px] items-center gap-2"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="flex-1 h-1 rounded-full overflow-hidden bg-white/20"
                      >
                        {index === currentSlide ? (
                          <motion.div
                            key={`progress-${currentSlide}-${index}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 5,
                              ease: "linear"
                            }}
                            className="h-full bg-gradient-to-r from-gold to-rose-gold origin-left"
                          />
                        ) : (
                          <div className="h-full bg-transparent" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Arrow navigation */}
                  <div
                    className="flex items-center gap-2"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <button
                      onClick={prevSlide}
                      className="group w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-gold/50 transition-all duration-300"
                    >
                      <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-gold transition-colors" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="group w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-gold/50 transition-all duration-300"
                    >
                      <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-gold transition-colors" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Image Showcase */}
            <div className="relative w-full lg:w-1/2 h-[50vh] sm:h-[60vh] lg:h-auto order-1 lg:order-2">
              {/* Decorative frame with burgundy accent corners */}
              <div className="absolute inset-4 sm:inset-6 lg:inset-8 border border-gold/25 z-10 pointer-events-none" />
              <div className="absolute inset-8 sm:inset-10 lg:inset-12 border border-burgundy/20 z-10 pointer-events-none hidden sm:block" />
              {/* Corner accents */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 w-8 h-8 border-l-2 border-t-2 border-gold/50 z-10 pointer-events-none" />
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 w-8 h-8 border-r-2 border-t-2 border-gold/50 z-10 pointer-events-none" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 w-8 h-8 border-l-2 border-b-2 border-burgundy/50 z-10 pointer-events-none" />
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-8 h-8 border-r-2 border-b-2 border-burgundy/50 z-10 pointer-events-none" />

              {/* Image carousel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <motion.div
                    style={isMobile ? {} : { y: heroY }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
                      fill
                      className="object-cover object-top"
                      priority
                      quality={90}
                    />
                  </motion.div>

                  {/* Subtle gradient overlays for depth and color cohesion */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-burgundy/20 lg:from-charcoal/30 lg:to-transparent" />
                  <div className="absolute inset-0 lg:bg-gradient-to-l lg:from-burgundy/30 lg:via-transparent lg:to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Mobile Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex lg:hidden items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="group w-10 h-10 rounded-full bg-charcoal/60 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="h-1.5 rounded-full overflow-hidden bg-white/30"
                      style={{ width: index === currentSlide ? '2rem' : '0.375rem' }}
                    >
                      {index === currentSlide && (
                        <motion.div
                          key={`mobile-progress-${currentSlide}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 5, ease: "linear" }}
                          className="h-full w-full bg-gold origin-left"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="group w-10 h-10 rounded-full bg-charcoal/60 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Floating product badge */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-8 left-4 sm:left-8 lg:bottom-auto lg:top-1/3 lg:-left-6 z-20 hidden sm:block"
              >
                <div className="bg-white px-4 py-3 shadow-xl">
                  <p className="text-xs text-charcoal/60 uppercase tracking-wider">
                    Prakash Duo
                  </p>
                  <p className="font-display text-lg text-charcoal">
                    Bridal Collection
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Coming Soon Banner - Positioned at bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <div className="relative py-4 bg-charcoal/95 backdrop-blur-sm border-t border-gold/20">
              {/* Animated shimmer */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
              />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
                  {/* Left - Message */}
                  <div className="flex items-center gap-3 text-center md:text-left">
                    <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-burgundy/30 border border-gold/30">
                      <Sparkles className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        Online Ordering Opens Soon!
                      </p>
                      <p className="text-white/50 text-xs">
                        Contact us directly to place your order
                      </p>
                    </div>
                  </div>

                  {/* Right - Contact Options */}
                  <div className="flex items-center gap-3">
                    <a
                      href="tel:+917909202091"
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold text-charcoal text-sm font-semibold rounded-full hover:bg-white transition-colors duration-300"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>+91 79092 02091</span>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:border-gold hover:text-gold transition-colors duration-300"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - With Fade Effect */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                <div className="hidden md:flex items-center gap-2 text-charcoal/60">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm">{categories.length} Collections Available</span>
                </div>
              </div>
              <div className="mt-6 h-[1px] bg-gradient-to-r from-gold/50 via-rose-gold/30 to-transparent" />
            </AnimatedSection>

            {/* Category Grid with Fade - Show only 5 */}
            <div className="relative">
              <div className="grid grid-cols-12 gap-4 md:gap-6">
                {featuredCategories.slice(0, 5).map((category, index) => {
                  // Create asymmetric layout for 5 categories
                  const gridClasses = [
                    "col-span-12 md:col-span-8 aspect-[2/1] md:aspect-[16/9]",  // Featured large
                    "col-span-6 md:col-span-4 aspect-square",                    // Square
                    "col-span-6 md:col-span-4 aspect-square",                    // Square
                    "col-span-6 md:col-span-4 aspect-square",                    // Square
                    "col-span-6 md:col-span-4 aspect-square",                    // Square
                  ];

                  return (
                    <AnimatedSection
                      key={category.id}
                      delay={index * 0.1}
                      className={gridClasses[index] || "col-span-6 md:col-span-4 aspect-square"}
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
                            <h3 className="font-display text-2xl md:text-3xl text-white mb-1 capitalize">
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

              {/* Fade overlay from middle */}
              <div
                className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(255,251,245,0.3) 20%, rgba(255,251,245,0.7) 50%, rgba(255,251,245,0.95) 80%, rgb(255,251,245) 100%)'
                }}
              />

              {/* Show All Button - Centered over fade */}
              <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8 pointer-events-none">
                <AnimatedSection delay={0.5} className="pointer-events-auto">
                  <Link
                    href="/categories"
                    className="group relative inline-flex items-center gap-4 overflow-hidden"
                  >
                    {/* Button background with gradient border */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-gold via-burgundy to-gold rounded-sm opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Button inner */}
                    <div className="relative flex items-center gap-4 bg-charcoal px-10 py-5">
                      {/* Shimmer effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      />

                      {/* Icon */}
                      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 border border-gold/30 group-hover:bg-gold/20 transition-colors duration-300">
                        <Sparkles className="w-5 h-5 text-gold" />
                      </div>

                      {/* Text */}
                      <div className="relative text-left">
                        <span className="block text-white font-semibold text-lg">
                          View All Collections
                        </span>
                        <span className="block text-gold/70 text-sm">
                          Explore {categories.length} categories
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="relative ml-4">
                        <ArrowRight className="w-6 h-6 text-gold group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              </div>
            </div>

            {/* Decorative bottom element */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
                <div className="w-2 h-2 rotate-45 bg-gold/30" />
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
              </div>
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

        {/* Why Choose Us - Elegant Feature Strip */}
        <section className="relative py-20 bg-gradient-to-r from-charcoal via-burgundy to-charcoal overflow-hidden">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          {/* Animated border lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-white">
                The <span className="text-gold">Prakash Duo</span> Promise
              </h2>
            </AnimatedSection>

            {/* Features in horizontal strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-gold/20">
              {[
                {
                  icon: Sparkles,
                  title: "Handcrafted",
                  desc: "Every piece made with love by skilled artisans",
                  accent: "100%",
                },
                {
                  icon: Award,
                  title: "Premium Quality",
                  desc: "Only the finest materials for lasting beauty",
                  accent: "A+",
                },
                {
                  icon: Truck,
                  title: "Free Delivery",
                  desc: "Complimentary shipping on orders above ₹999",
                  accent: "₹0",
                },
                {
                  icon: Shield,
                  title: "Secure Shopping",
                  desc: "Your payments are 100% safe & encrypted",
                  accent: "SSL",
                },
              ].map((item, index) => (
                <AnimatedSection
                  key={index}
                  delay={index * 0.1}
                  className="group relative px-4 lg:px-8 py-4 text-center"
                >
                  {/* Floating accent number */}
                  <div className="absolute top-0 right-4 lg:right-8 font-display text-4xl lg:text-5xl text-gold/10 group-hover:text-gold/20 transition-colors duration-500">
                    {item.accent}
                  </div>

                  {/* Icon with glow effect */}
                  <div className="relative inline-flex items-center justify-center w-14 h-14 mb-4">
                    <div className="absolute inset-0 bg-gold/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg text-white mb-2 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-[200px] mx-auto">
                    {item.desc}
                  </p>
                </AnimatedSection>
              ))}
            </div>

            {/* Bottom decorative element */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/40" />
                <Sparkles className="w-4 h-4 text-gold/40" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/40" />
              </div>
            </div>
          </div>
        </section>

    </div>
  );
}
