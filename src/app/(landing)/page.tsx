"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShoppingBag, Heart, Check, Phone, Mail, MapPin, Instagram, ArrowDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useHaptics } from "@/hooks/useHaptics";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================
   DATA
   ========================================== */

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

const COLLECTIONS = [
  {
    name: "AD Stone Bangles",
    slug: "ad-stone-bangles",
    descriptor: "Precision-set stones, modern brilliance",
    image: "/assets/AD%20Stone%20bangles/AD%20stone%20brick%20ruby%20stone/1.webp",
  },
  {
    name: "Antique Golden Bangles",
    slug: "antique-golden-bangles",
    descriptor: "Old gold warmth, timeless weight",
    image: "/assets/antique%20golden%20Bangles/antique%20%20lakshmi%20flower/1.webp",
  },
  {
    name: "Bridal Sets",
    slug: "sample-bridal-sets",
    descriptor: "Complete adornment for sacred moments",
    image: "/assets/sample%20bridal%20sets/red%20bridal%20set/1.webp",
  },
  {
    name: "Glass Bangles",
    slug: "glass-bangles",
    descriptor: "Celebration in every chime",
    image: "/assets/Glass%20Bangles/diamond%20design%20glass%20bangles/Diamon%20design%20%20magenta/1.webp",
  },
  {
    name: "Thread Bangles",
    slug: "thread-bangles",
    descriptor: "Traditional craft, vivid colour",
    image: "/assets/thread%20bangles/thread%20diamond%20design/green%20stone%20thread%20bangles/1.webp",
  },
];

const TRUST_ITEMS = [
  "1000+ Bangles Crafted",
  "100% Handmade",
  "500+ Happy Customers",
  "Free Delivery Above ₹599",
  "Based in Thrissur, Kerala",
  "Premium Materials Only",
];

/* ==========================================
   NAVBAR — "The Woven Band"
   ========================================== */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { trigger: haptic } = useHaptics();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Collections", href: "/categories" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav
        className={`
          w-full max-w-5xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-700
          ${scrolled
            ? "bg-warm-ivory/80 backdrop-blur-xl border border-raw-umber/10 shadow-luxury"
            : "bg-transparent border border-transparent"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span
            className={`font-display text-2xl font-bold tracking-tight transition-colors duration-500 ${
              scrolled ? "text-raw-umber" : "text-warm-ivory"
            }`}
          >
            Prakash<span className="text-deep-ochre">Duo</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-body font-medium tracking-wide rounded-full transition-all duration-300 hover:bg-deep-ochre/10 ${
                scrolled ? "text-raw-umber/70 hover:text-raw-umber" : "text-warm-ivory/80 hover:text-warm-ivory"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className={`relative p-2 rounded-full transition-colors ${
              scrolled ? "text-raw-umber/60 hover:text-raw-umber" : "text-warm-ivory/70 hover:text-warm-ivory"
            }`}
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-current text-crimson-thread" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-crimson-thread text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => { haptic("nudge"); openCart(); }}
            className={`relative p-2 rounded-full transition-colors ${
              scrolled ? "text-raw-umber/60 hover:text-raw-umber" : "text-warm-ivory/70 hover:text-warm-ivory"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-deep-ochre text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* CTA Desktop */}
          <Link
            href="/categories"
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-crimson-thread text-warm-ivory text-sm font-body font-medium rounded-full hover:bg-crimson-thread/90 transition-all duration-300 press-effect"
          >
            Browse Collections
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => { haptic("nudge"); setMobileOpen(!mobileOpen); }}
            className={`lg:hidden p-2 rounded-full transition-colors ${
              scrolled ? "text-raw-umber" : "text-warm-ivory"
            }`}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[7px]" : ""
              } ${scrolled ? "bg-raw-umber" : "bg-warm-ivory"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              } ${scrolled ? "bg-raw-umber" : "bg-warm-ivory"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
              } ${scrolled ? "bg-raw-umber" : "bg-warm-ivory"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 mx-4 bg-warm-ivory/95 backdrop-blur-xl rounded-3xl border border-raw-umber/10 shadow-luxury-lg p-6 z-40"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-raw-umber font-body font-medium rounded-2xl hover:bg-deep-ochre/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/categories"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 bg-crimson-thread text-warm-ivory font-body font-medium rounded-2xl text-center mt-4"
              >
                Browse Collections
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ==========================================
   HERO — "The Opening Drape"
   ========================================== */

function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered text entrance
      gsap.from(".hero-text-line", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3,
      });

      // CTA entrance
      gsap.from(".hero-cta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.0,
      });

      // Ken Burns on both images
      gsap.fromTo(
        ".hero-img-left",
        { scale: 1.1 },
        { scale: 1.0, duration: 2.8, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-img-right",
        { scale: 1.15 },
        { scale: 1.0, duration: 3.0, ease: "power2.out", delay: 0.2 }
      );

      // Scroll indicator
      gsap.from(".scroll-indicator", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 1.5,
        ease: "power2.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100dvh] overflow-hidden">
      {/* ===== MOBILE HERO IMAGE — Bangles.png full bleed ===== */}
      <div className="lg:hidden absolute inset-0">
        <div className="hero-img-right absolute inset-0">
          <Image
            src="/assets/cover page images website/Bangles.png"
            alt="Handcrafted bangles with flowers"
            fill
            className="object-cover object-[center_25%]"
            priority
            quality={90}
          />
        </div>
      </div>

      {/* ===== LEFT IMAGE — flower wall (desktop only) ===== */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 left-0"
        style={{
          width: "45%",
          maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
        }}
      >
        <div className="hero-img-left absolute inset-0">
          <Image
            src="/assets/cover page images website/Untitled design.png"
            alt="Handcrafted bangles against white jasmine flowers"
            fill
            className="object-cover object-left"
            priority
            quality={90}
          />
        </div>
      </div>

      {/* ===== RIGHT IMAGE — portrait bangles (desktop only) ===== */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 right-0"
        style={{
          width: "50%",
          maskImage: "linear-gradient(to left, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%)",
        }}
      >
        <div className="hero-img-right absolute inset-0">
          <Image
            src="/assets/cover page images website/Bangles.png"
            alt="Close-up of handcrafted bangles with flowers"
            fill
            className="object-cover object-[center_30%]"
            quality={90}
          />
        </div>
      </div>

      {/* ===== BLEND ZONE — frosted strip with SVG ornaments ===== */}
      <div
        className="blend-zone hidden lg:block absolute top-0 bottom-0 z-[5]"
        style={{ left: "40%", width: "22%" }}
      >
        {/* Frosted glass effect */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(12px) saturate(120%)",
            WebkitBackdropFilter: "blur(12px) saturate(120%)",
            maskImage: "linear-gradient(to right, transparent, black 30%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30%, black 70%, transparent)",
          }}
        />
        {/* Warm tint in blend zone */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(180deg, rgba(200,136,42,0.1) 0%, rgba(245,239,224,0.15) 50%, rgba(200,136,42,0.1) 100%)",
            maskImage: "linear-gradient(to right, transparent, black 30%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30%, black 70%, transparent)",
          }}
        />

      </div>

      {/* SVG ornaments removed */}

      {/* ===== OVERLAYS — global darkening for text ===== */}
      <div className="absolute inset-0 z-[6] bg-gradient-to-t from-raw-umber/80 via-raw-umber/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[6] bg-gradient-to-r from-raw-umber/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[6] pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(61,43,31,0.45) 100%)"
      }} />
      <div className="absolute inset-0 z-[6] hero-grain pointer-events-none" />

      {/* ===== CONTENT — bottom-left ===== */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Label */}
        <p className="hero-text-line font-mono text-deep-ochre text-xs md:text-sm uppercase tracking-[0.2em] mb-4 md:mb-6">
          New Collection &middot; 2026
        </p>

        {/* Hero text */}
        <h1 className="mb-4 md:mb-6">
          <span className="hero-text-line block font-drama italic text-warm-ivory text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.1]">
            Where every wrist
          </span>
          <span className="hero-text-line block font-display font-bold text-deep-ochre text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.95] -mt-1 md:-mt-2">
            tells a story.
          </span>
        </h1>

        {/* Subline */}
        <p className="hero-text-line font-body text-warm-ivory/70 text-sm md:text-base max-w-lg leading-relaxed mb-8">
          Handcrafted bangles from the heart of Thrissur — born from tradition, worn for a lifetime.
        </p>

        {/* CTA */}
        <div className="hero-cta">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium text-sm md:text-base overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
          >
            <span className="relative z-10">Browse Collections</span>
            <ArrowDown className="w-4 h-4 relative z-10 group-hover:translate-y-0.5 transition-transform" />
            <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator — bottom right, above marquee */}
      <div className="scroll-indicator absolute bottom-14 right-8 md:right-16 flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-deep-ochre text-[10px] uppercase tracking-[0.3em] rotate-90 origin-center translate-x-3 mb-4">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-deep-ochre/30 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-full bg-deep-ochre scroll-indicator-line" />
        </div>
      </div>

      {/* Trust strip marquee — pinned to bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-raw-umber/80 backdrop-blur-sm py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 md:mx-12 font-mono text-warm-ivory/60 text-xs md:text-sm uppercase tracking-[0.15em] flex items-center gap-3">
              <span className="text-deep-ochre">&#10022;</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   TRUST STRIP — Marquee Bar
   ========================================== */

/* TrustStrip is now integrated into the Hero section bottom */

/* ==========================================
   COLLECTIONS — "The Craft Table"
   ========================================== */

function Collections() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".collection-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="mb-12 md:mb-16">
        <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Our Collections</p>
        <h2 className="font-display text-raw-umber text-4xl md:text-6xl font-bold">
          <span className="font-drama italic font-normal">Crafted for</span> Every Occasion.
        </h2>
      </div>

      {/* Asymmetric masonry grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Large hero card — spans 2 rows left */}
        <div className="md:col-span-7 md:row-span-2 collection-card collection-hero-card">
          <CollectionCard
            collection={COLLECTIONS[0]}
            large
          />
        </div>

        {/* Two stacked right */}
        <div className="md:col-span-5 collection-card">
          <CollectionCard collection={COLLECTIONS[1]} />
        </div>
        <div className="md:col-span-5 collection-card">
          <CollectionCard collection={COLLECTIONS[2]} />
        </div>

        {/* Bottom row — 3 equal */}
        <div className="md:col-span-4 collection-card">
          <CollectionCard collection={COLLECTIONS[3]} />
        </div>
        <div className="md:col-span-4 collection-card">
          <CollectionCard collection={COLLECTIONS[4]} />
        </div>
        <div className="md:col-span-4 collection-card">
          <CollectionCard
            collection={{
              name: "View All",
              slug: "",
              descriptor: "Discover our complete range",
              image: "/assets/antique%20golden%20Bangles/antique%20multicolor%20full%20stone/1.webp",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ collection, large = false }: { collection: typeof COLLECTIONS[0]; large?: boolean }) {
  return (
    <Link
      href={collection.slug ? `/category/${collection.slug}` : "/categories"}
      className={`group block relative overflow-hidden rounded-3xl ${large ? "h-[400px] md:h-full min-h-[500px]" : "h-[260px] md:h-[280px]"}`}
    >
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-raw-umber/80 via-raw-umber/20 to-transparent" />

      {/* Content at bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className={`font-display font-bold text-warm-ivory leading-tight ${large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
          {collection.name}
        </h3>
        <p className="font-body text-blush-dust/80 text-sm mt-1 mb-4">
          {collection.descriptor}
        </p>
        <span className="inline-flex items-center gap-2 font-body text-deep-ochre text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          Explore <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

/* ==========================================
   BEST SELLERS — "The Display Case"
   ========================================== */

function BestSellers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@/data/products.json").then((mod) => {
      // Pick a variety across categories for best sellers display
      const all = mod.default.products as Product[];
      const picked: Product[] = [];
      const seen = new Set<string>();
      for (const p of all) {
        if (picked.length >= 8) break;
        if (!seen.has(p.category)) {
          picked.push(p);
          seen.add(p.category);
        }
      }
      // Fill remaining slots
      for (const p of all) {
        if (picked.length >= 8) break;
        if (!picked.includes(p)) picked.push(p);
      }
      setProducts(picked);
    });
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".bestseller-card", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [products]);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-blush-dust/30">
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Most Loved</p>
            <h2 className="font-display text-raw-umber text-4xl md:text-6xl font-bold">
              Our <span className="font-drama italic font-normal">Best Sellers.</span>
            </h2>
          </div>
          <Link
            href="/best-sellers"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-raw-umber/20 text-raw-umber font-body text-sm font-medium rounded-full hover:border-deep-ochre hover:bg-deep-ochre/5 transition-all duration-300 self-start md:self-auto"
          >
            View All Best Sellers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: horizontal scroll, Desktop: 4-col grid */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="bestseller-card min-w-[260px] md:min-w-0 snap-start"
            >
              <BestSellerCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSellerCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, openCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { trigger: haptic } = useHaptics();
  const isFav = isInWishlist(product.id);

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic("success");
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: "One Size",
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  }, [addItem, openCart, product, haptic]);

  const handleToggleFav = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic("nudge");
    toggleItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
  }, [toggleItem, product]);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-blush-dust luxury-card">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${hovered ? "scale-[1.04]" : "scale-100"}`}
          />

          {/* Bestseller badge */}
          {index < 2 && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-crimson-thread text-warm-ivory text-[10px] font-mono uppercase tracking-wider rounded-full">
              Bestseller
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleToggleFav}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
              isFav ? "bg-crimson-thread text-white" : "bg-white/80 text-raw-umber hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>

          {/* Add to Cart — slides up on hover */}
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

          {/* Mobile add to cart */}
          <button
            onClick={handleQuickAdd}
            className={`md:hidden absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-sm shadow-lg z-10 ${
              addedToCart ? "bg-emerald-500 text-white" : "bg-white/90 text-raw-umber"
            }`}
          >
            {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 px-1">
          <h3 className="font-display text-raw-umber text-lg leading-tight line-clamp-2 group-hover:text-deep-ochre transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-body font-bold text-deep-ochre text-lg mt-1">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ==========================================
   BRAND STORY — "The Maker's Mark"
   ========================================== */

function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".story-text > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".story-image", {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
        {/* Left — Dark with image */}
        <div className="relative bg-raw-umber overflow-hidden">
          <div className="story-image absolute inset-0">
            <Image
              src="/assets/antique%20golden%20Bangles/antique%20kada%20lakshmi%20bangle/1.webp"
              alt="Artisan bangle craftsmanship"
              fill
              className="object-cover opacity-60"
            />
          </div>
          {/* Warm vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, rgba(61,43,31,0.3) 0%, rgba(61,43,31,0.7) 100%)"
          }} />
          {/* Decorative quote overlay */}
          <div className="relative z-10 h-full flex items-center justify-center p-12 lg:p-16">
            <p className="font-drama italic text-warm-ivory/90 text-2xl md:text-3xl lg:text-4xl text-center leading-snug max-w-md">
              &ldquo;Every bangle carries the memory of the hands that made it.&rdquo;
            </p>
          </div>
        </div>

        {/* Right — Ivory with text */}
        <div className="bg-warm-ivory flex items-center p-10 pb-16 lg:p-16 xl:p-20">
          <div className="story-text max-w-lg">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">Our Story</p>

            <h2 className="font-display text-raw-umber text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Born in <span className="font-drama italic font-normal">Thrissur,</span><br />
              worn across India.
            </h2>

            <p className="font-body text-raw-umber/70 leading-relaxed mb-8">
              Bangles by Prakash Duo was born in Thrissur, Kerala — a city that breathes jewellery.
              What started as a family passion has grown into a craft house trusted by brides, mothers,
              and jewellery lovers across India. Each piece is handmade, each stone hand-set,
              each finish inspected with care.
            </p>

            {/* Micro facts */}
            <div className="space-y-3 mb-8">
              {[
                "Based in Thrissur, Kerala",
                "Est. with love by Prakash Sisters",
                "100% Artisan-Crafted",
              ].map((fact) => (
                <p key={fact} className="font-mono text-raw-umber/60 text-sm flex items-center gap-3">
                  <span className="text-deep-ochre text-lg">&#10022;</span>
                  {fact}
                </p>
              ))}
            </div>

            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-7 py-3.5 rounded-full font-body font-medium text-sm overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
            >
              <span className="relative z-10">Meet the Collection</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   FOOTER — "The Closing Thread"
   ========================================== */

function CinematicFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-raw-umber relative overflow-hidden border-t border-deep-ochre/20">
      {/* Decorative blurs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-crimson-thread/5 rounded-full blur-3xl" />

      {/* Newsletter bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-2">Stay in the Loop</p>
            <p className="font-body text-warm-ivory/50 text-sm">Subscribe for exclusive offers and new arrivals.</p>
          </div>
          {subscribed ? (
            <p className="font-body text-deep-ochre font-medium">Welcome to the circle!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-72 px-5 py-3 bg-white/5 border border-white/10 text-warm-ivory placeholder-warm-ivory/30 rounded-full font-body text-sm focus:outline-none focus:border-deep-ochre transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-deep-ochre text-raw-umber font-body font-semibold text-sm rounded-full hover:bg-deep-ochre/90 transition-colors press-effect"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/">
              <h3 className="font-display text-3xl text-warm-ivory font-bold">
                Prakash<span className="text-deep-ochre">Duo</span>
              </h3>
            </Link>
            <p className="font-body text-warm-ivory/50 leading-relaxed max-w-sm text-sm">
              Celebrating India&apos;s rich tradition of bangle craftsmanship.
              Each piece is a testament to artisanal excellence and timeless elegance.
            </p>
            <div className="space-y-3 pt-2">
              <a href="tel:+917909202091" className="flex items-center gap-3 font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                <Phone className="w-4 h-4 text-deep-ochre" />
                +91 79092 02091
              </a>
              <a href="mailto:support@banglesbyprakashduo.store" className="flex items-center gap-3 font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                <Mail className="w-4 h-4 text-deep-ochre" />
                support@banglesbyprakashduo.store
              </a>
              <div className="flex items-center gap-3 font-body text-warm-ivory/50 text-sm">
                <MapPin className="w-4 h-4 text-deep-ochre" />
                Thrissur, Kerala, India
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/bangles_byprakashduo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-warm-ivory/20 flex items-center justify-center text-warm-ivory/50 hover:text-deep-ochre hover:border-deep-ochre transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            <h4 className="font-display text-lg text-deep-ochre mb-6">Shop</h4>
            <ul className="space-y-3">
              {[
                ["New Arrivals", "/categories"],
                ["Best Sellers", "/best-sellers"],
                ["Collections", "/collections"],
                ["All Bangles", "/categories"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-3">
            <h4 className="font-display text-lg text-deep-ochre mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                ["Shipping Policy", "/shipping"],
                ["Refund Policy", "/refund"],
                ["Terms & Conditions", "/terms"],
                ["FAQs", "/faq"],
                ["Track Order", "/track-order"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h4 className="font-display text-lg text-deep-ochre mb-6">Connect</h4>
            <div className="space-y-3">
              <a href="tel:+917909202091" className="block font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                +91 79092 02091
              </a>
              <a href="mailto:support@banglesbyprakashduo.store" className="block font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                support@banglesbyprakashduo.store
              </a>
              <a
                href="https://www.instagram.com/bangles_byprakashduo"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm"
              >
                @bangles_byprakashduo
              </a>
            </div>

            {/* Status indicator */}
            <div className="mt-8 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="font-mono text-warm-ivory/40 text-xs">Crafting with love</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-warm-ivory/30 text-sm text-center md:text-left">
            &copy; 2026 Bangles by Prakash Duo. All rights reserved. Legal: <span className="text-deep-ochre/60">SHILPA PRAKASH</span>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/refund" className="font-body text-warm-ivory/30 hover:text-deep-ochre transition-colors text-sm">Refund Policy</Link>
            <Link href="/terms" className="font-body text-warm-ivory/30 hover:text-deep-ochre transition-colors text-sm">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================
   MAIN PAGE
   ========================================== */

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <BestSellers />
        <BrandStory />
      </main>
      <CinematicFooter />
    </>
  );
}
