'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/categories?withImages=true');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-charcoal/60 font-display text-xl">Loading collections...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-ivory noise-overlay">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Our Collections
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Shop by <span className="gradient-text">Category</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore our curated collection of handcrafted bangles, from traditional designs to contemporary masterpieces
            </p>
          </motion.div>

          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <ol className="flex items-center justify-center space-x-2 text-white/50 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li className="text-gold">All Categories</li>
            </ol>
          </motion.nav>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 bg-white border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-charcoal/60">
              <span className="font-display text-2xl text-charcoal">{categories.length}</span> Categories Available
            </p>
            <div className="hidden md:flex items-center gap-4 text-sm text-charcoal/50">
              <span>Handcrafted with love</span>
              <span className="w-px h-4 bg-gold/30" />
              <span>Free shipping above ₹999</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => (
              <AnimatedSection key={category.id} delay={index * 0.1}>
                <Link href={`/category/${category.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />

                    <Image
                      src={category.images[0] || ''}
                      alt={category.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                        <span className="inline-block px-3 py-1 bg-gold/20 backdrop-blur-sm text-gold text-xs font-medium tracking-wider uppercase rounded-full mb-3">
                          {category.productCount} Designs
                        </span>
                        <h2 className="font-display text-2xl md:text-3xl text-white mb-2">
                          {category.name}
                        </h2>
                        <div className="flex items-center gap-2 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">Explore Collection</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-20 bg-white border-t border-gold/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "✨", title: "Handcrafted", desc: "Each piece made with care and precision" },
              { icon: "🚚", title: "Fast Delivery", desc: "Shipped within 24 hours, delivered in 5-7 days" },
              { icon: "💎", title: "Premium Quality", desc: "Strict quality checks before shipping" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-xl text-charcoal mb-2">{item.title}</h3>
                  <p className="text-charcoal/60 text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
