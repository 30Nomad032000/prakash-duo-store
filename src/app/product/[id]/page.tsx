'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductDetails from '@/components/ProductDetails';
import ProductImageGallery from '@/components/ProductImageGallery';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ArrowLeft, Package, Star, Gift, Shield, Truck, ArrowRight } from 'lucide-react';

interface InventoryItem {
  size: string;
  quantity: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  inventory: InventoryItem[];
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

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, allProductsRes] = await Promise.all([
          fetch(`/api/products?id=${params.id}`).then(r => r.json()),
          fetch('/api/products').then(r => r.json())
        ]);

        if (productRes.error) {
          setProduct(null);
        } else {
          setProduct(productRes);

          // Show similar products from the same category first
          const sameCategory = allProductsRes.filter(
            (p: Product) => p.id !== params.id && p.category === productRes.category
          );
          const otherProducts = allProductsRes.filter(
            (p: Product) => p.id !== params.id && p.category !== productRes.category
          );
          setSimilarProducts([...sameCategory, ...otherProducts].slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-charcoal/60 font-display text-xl">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
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
              Product Not Found
            </h1>
            <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 bg-charcoal text-white px-8 py-4 font-semibold hover:bg-burgundy transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Browse All Products
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory noise-overlay">
      {/* Breadcrumb */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-4 bg-white border-b border-gold/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-charcoal/50 hover:text-gold transition-colors">Home</Link>
            <span className="text-charcoal/30">/</span>
            <Link href="/categories" className="text-charcoal/50 hover:text-gold transition-colors">Categories</Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-charcoal font-medium">{product.name}</span>
          </nav>
        </div>
      </motion.section>

      {/* Product Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
          >
            <ProductImageGallery images={product.images} name={product.name} />

            <ProductDetails
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              subcategory={product.subcategory}
              sizes={product.sizes}
              inventory={product.inventory}
              image={product.images[0]}
            />
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Package, title: "Secure Packaging", desc: "Carefully packed for safe delivery" },
              { icon: Star, title: "Handcrafted Quality", desc: "Traditional artisan techniques" },
              { icon: Gift, title: "Gift Ready", desc: "Beautiful packaging included" },
              { icon: Shield, title: "Authentic Products", desc: "100% genuine handmade items" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display text-charcoal text-sm md:text-base mb-1">{item.title}</h3>
                  <p className="text-charcoal/50 text-xs md:text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                You May Also Like
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mt-2">
                Similar Products
              </h2>
              <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((prod, index) => (
                <AnimatedSection key={prod.id} delay={index * 0.1}>
                  <ProductCard
                    id={prod.id}
                    name={prod.name}
                    price={prod.price}
                    images={prod.images}
                    category={prod.category}
                  />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.3} className="text-center mt-12">
              <Link
                href="/categories"
                className="group inline-flex items-center gap-3 bg-charcoal text-white px-10 py-5 font-semibold hover:bg-burgundy transition-colors duration-300"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Shipping Banner */}
      <section className="py-12 bg-charcoal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-white">Free Shipping</h3>
                  <p className="text-white/60 text-sm">On orders above ₹999</p>
                </div>
              </div>
              <Link
                href="/shipping"
                className="text-gold hover:text-rose-gold font-medium transition-colors flex items-center gap-2"
              >
                Learn more about shipping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
