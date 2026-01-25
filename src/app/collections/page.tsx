'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Sparkles, ArrowRight, Star, Crown, Gift } from "lucide-react";

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

const featuredCollections = [
  {
    title: "Best Sellers",
    subtitle: "Customer Favorites",
    description: "Discover the bangles that have won the hearts of our customers across India",
    image: "/assets/AD Stone bangles/AD stone brick ruby stone/1.webp",
    icon: Star,
    href: "/best-sellers",
    accent: "from-gold/20 to-rose-gold/20",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh from Artisans",
    description: "Latest additions crafted with modern elegance and traditional techniques",
    image: "/assets/antique golden Bangles/antique  flower rode/1.webp",
    icon: Sparkles,
    href: "/categories",
    accent: "from-rose-gold/20 to-burgundy/20",
  },
  {
    title: "Traditional",
    subtitle: "Timeless Classics",
    description: "Heritage designs cherished across generations of Indian families",
    image: "/assets/bracelet bangle/drop shaped bangle/1.webp",
    icon: Crown,
    href: "/categories",
    accent: "from-burgundy/20 to-charcoal/20",
  },
];

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products?limit=12');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
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
          <Crown className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-charcoal/60 font-display text-xl">Curating collections...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-ivory noise-overlay">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-champagne via-ivory to-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 backdrop-blur-sm rounded-full border border-gold/20 mb-6">
              <Gift className="w-4 h-4 text-gold" />
              <span className="text-charcoal text-sm font-medium tracking-widest uppercase">
                Curated Collections
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6">
              Special <span className="gradient-text">Collections</span>
            </h1>

            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Explore our handpicked collections featuring the finest bangles for every occasion and celebration
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {featuredCollections.map((collection, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <Link href={collection.href} className="group block h-full">
                  <div className="relative h-full bg-white rounded-lg overflow-hidden border border-gold/10 hover:border-gold/30 hover:shadow-xl transition-all duration-500">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

                      {/* Icon Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${collection.accent} backdrop-blur-sm flex items-center justify-center`}>
                          <collection.icon className="w-5 h-5 text-gold" />
                        </div>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-gold text-sm font-medium tracking-wider uppercase mb-1">
                          {collection.subtitle}
                        </p>
                        <h3 className="font-display text-2xl text-white">
                          {collection.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-charcoal/70 text-sm mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                      <div className="flex items-center gap-2 text-gold font-medium text-sm group-hover:gap-3 transition-all">
                        <span>Shop Collection</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Hover accent line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-rose-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Handpicked Selection
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-2">
              Featured Products
            </h2>
            <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.05}>
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

          <AnimatedSection delay={0.3} className="text-center mt-12">
            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 bg-charcoal text-white px-10 py-5 font-semibold hover:bg-burgundy transition-colors duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Our Collections */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-champagne to-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">
              Why Our Collections Stand Out
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                title: "Handpicked Selection",
                desc: "Every collection is carefully curated by our team to ensure you get only the finest bangles.",
              },
              {
                num: "02",
                title: "Artisan Crafted",
                desc: "Each piece is handcrafted by skilled artisans using traditional techniques passed down through generations.",
              },
              {
                num: "03",
                title: "Quality Assured",
                desc: "Every bangle goes through strict quality checks to ensure you receive nothing but the best.",
              },
              {
                num: "04",
                title: "Exclusive Designs",
                desc: "Many pieces in our collections are limited edition or exclusive designs you won't find elsewhere.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex gap-6 p-6 bg-white rounded-lg border border-gold/10 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0">
                    <span className="font-display text-4xl text-gold/30">{item.num}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-charcoal mb-2">{item.title}</h3>
                    <p className="text-charcoal/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
