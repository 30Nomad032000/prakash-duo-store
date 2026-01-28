'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, Heart, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
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

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=20&sort=bestsellers');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <Star className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-charcoal/60 font-display text-xl">Loading favorites...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-ivory noise-overlay">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-charcoal via-charcoal to-burgundy overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold/10 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20 mb-6">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Customer Favorites
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Best <span className="gradient-text">Sellers</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover our most loved bangles, handpicked favorites cherished by customers across India
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-10"
          >
            {[
              { value: "500+", label: "Happy Customers" },
              { value: "4.9★", label: "Average Rating" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-display text-gold">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.05}>
                <Link href={`/product/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-champagne">
                    {/* Best Seller Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold text-charcoal text-xs font-semibold rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        Best Seller
                      </span>
                    </div>

                    {/* Decorative corners on hover */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/0 group-hover:border-gold transition-all duration-500 z-10" />

                    <Image
                      src={product.images[0] || '/placeholder-product.webp'}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Quick actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal hover:bg-gold hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal hover:bg-rose-gold hover:text-white transition-all"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 space-y-2">
                    <div className="h-[1px] w-1/4 bg-gradient-to-r from-gold to-transparent group-hover:w-full transition-all duration-500" />
                    <h3 className="font-display text-lg text-charcoal line-clamp-2 group-hover:text-burgundy transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xl font-semibold text-charcoal">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA */}
          <AnimatedSection delay={0.3} className="text-center mt-16">
            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 bg-charcoal text-white px-10 py-5 font-semibold hover:bg-burgundy transition-colors duration-300"
            >
              Browse All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Best Sellers Section */}
      <section className="py-16 md:py-20 bg-white border-t border-gold/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">
              Why Customers Love These
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Exceptional Quality", desc: "Each piece passes through rigorous quality checks" },
              { title: "Unique Designs", desc: "Handcrafted by skilled artisans with traditional techniques" },
              { title: "Customer Approved", desc: "Highly rated and reviewed by hundreds of customers" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 bg-ivory rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-gold" />
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
