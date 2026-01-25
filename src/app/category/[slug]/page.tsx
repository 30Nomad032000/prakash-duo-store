'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Sparkles, ArrowRight, ArrowLeft, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

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
  images?: string[];
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/categories?slug=${params.slug}`);
        const data = await res.json();

        if (data.error) {
          setError(true);
        } else {
          setCategory(data.category);
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return -1; // Assume newest are first in original array
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-charcoal/60 font-display text-xl">Loading collection...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-charcoal/5 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-charcoal/30" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
              Category Not Found
            </h1>
            <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
              The category you&apos;re looking for doesn&apos;t exist or has no products yet.
            </p>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 font-semibold hover:bg-burgundy transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Browse All Categories
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory noise-overlay">
      {/* Hero Section with Category Image */}
      <section className="relative py-16 md:py-24 bg-charcoal overflow-hidden">
        {/* Background Image */}
        {products[0]?.images[0] && (
          <div className="absolute inset-0">
            <Image
              src={products[0].images[0]}
              alt={category.name}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/90 to-charcoal" />
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <ol className="flex items-center space-x-2 text-white/50 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/categories" className="hover:text-gold transition-colors">Categories</Link>
              </li>
              <li>/</li>
              <li className="text-gold">{category.name}</li>
            </ol>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Collection
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-4">
              {category.name}
            </h1>

            <p className="text-lg text-white/70 max-w-xl">
              Discover our exquisite collection of {category.name.toLowerCase()}.
              Each piece is handcrafted with love and precision by skilled artisans.
            </p>

            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <div className="font-display text-3xl text-gold">{products.length}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Designs</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl text-gold">100%</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Handmade</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-md border-b border-gold/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-charcoal/60">
              Showing <span className="font-semibold text-charcoal">{sortedProducts.length}</span> products
            </p>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2 border border-gold/20 rounded-lg text-charcoal hover:border-gold transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>

                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gold/20 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-charcoal hover:bg-ivory transition-colors"
                      >
                        {option.label}
                        {sortBy === option.value && <Check className="w-4 h-4 text-gold" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 0.03}>
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
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
              <p className="text-charcoal/60 text-lg font-display">
                No products found in this category yet.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-gold font-medium mt-4 hover:gap-3 transition-all"
              >
                Browse other categories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-white border-t border-gold/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                About This Collection
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mt-2 mb-6">
                {category.name}
              </h2>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Our {category.name.toLowerCase()} collection features exquisite pieces
                handcrafted by skilled artisans. Each bangle tells a story of tradition,
                elegance, and meticulous craftsmanship that has been passed down through generations.
              </p>
              <p className="text-charcoal/70 leading-relaxed">
                Whether you&apos;re looking for everyday elegance or a statement piece for
                special occasions, our collection offers something unique for every taste.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-gradient-to-br from-champagne to-ivory p-8 rounded-lg border border-gold/20">
                <h3 className="font-display text-xl text-charcoal mb-6">Why Choose Us</h3>
                <div className="space-y-4">
                  {[
                    "100% authentic handcrafted bangles",
                    "Premium quality at affordable prices",
                    "Secure packaging and fast delivery",
                    "Easy returns and exchanges",
                    "Dedicated customer support",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-charcoal/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              Explore More Collections
            </h2>
            <p className="text-white/60 mb-8">
              Discover other beautiful categories in our store
            </p>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 bg-gold text-charcoal px-8 py-4 font-semibold hover:bg-rose-gold transition-colors"
            >
              View All Categories
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
