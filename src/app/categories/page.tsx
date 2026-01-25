'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Sparkles, ArrowRight, Phone, MessageCircle } from "lucide-react";

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
                        <h2 className="font-display text-2xl md:text-3xl text-white mb-2 capitalize">
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

      {/* Personal Shopping Assistance Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-charcoal via-charcoal to-burgundy overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-burgundy/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            {/* Decorative top element */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
              <div className="w-2 h-2 rotate-45 bg-gold/50" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/30 mb-6">
              <MessageCircle className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Personal Shopping
              </span>
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Need Help <span className="text-gold">Choosing?</span>
            </h2>

            <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
              Our expert team is here to help you find the perfect bangles for any occasion.
              Get personalized recommendations and styling advice.
            </p>

            {/* Contact options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="tel:+917909202091"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 bg-gold text-charcoal font-semibold hover:bg-white transition-colors duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>Call Us: +91 79092 02091</span>
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </motion.a>

              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-medium hover:border-gold hover:text-gold transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message on Instagram</span>
              </motion.a>
            </div>

            {/* Bottom decorative element */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/30" />
              <Sparkles className="w-4 h-4 text-gold/40" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/30" />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
