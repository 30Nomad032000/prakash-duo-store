'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductDetails from '@/components/ProductDetails';
import ProductImageGallery from '@/components/ProductImageGallery';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Package, Star, Gift, Shield, Truck, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageSeo from '@/components/seo/PageSeo';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const trustRef = useRef<HTMLElement>(null);
  const similarRef = useRef<HTMLElement>(null);
  const shippingRef = useRef<HTMLElement>(null);

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

  // GSAP animations for trust badges
  useEffect(() => {
    if (!trustRef.current || loading || !product) return;
    const ctx = gsap.context(() => {
      gsap.from('.trust-badge', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trustRef.current,
          start: 'top 85%',
        },
      });
    }, trustRef);
    return () => ctx.revert();
  }, [loading, product]);

  // GSAP animations for similar products
  useEffect(() => {
    if (!similarRef.current || similarProducts.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.similar-header > *', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: similarRef.current,
          start: 'top 80%',
        },
      });
      gsap.from('.similar-card', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.similar-grid',
          start: 'top 85%',
        },
      });
    }, similarRef);
    return () => ctx.revert();
  }, [similarProducts]);

  // GSAP animations for shipping banner
  useEffect(() => {
    if (!shippingRef.current || loading || !product) return;
    const ctx = gsap.context(() => {
      gsap.from('.shipping-content', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: shippingRef.current,
          start: 'top 90%',
        },
      });
    }, shippingRef);
    return () => ctx.revert();
  }, [loading, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center"
        >
          <Sparkles className="w-12 h-12 text-deep-ochre mx-auto mb-4" />
          <p className="text-raw-umber/60 font-display text-xl">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blush-dust/30 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-raw-umber/30" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-raw-umber mb-4">
              Product Not Found
            </h1>
            <p className="font-body text-raw-umber/60 mb-8 max-w-md mx-auto">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-semibold hover:bg-crimson-thread/90 transition-colors"
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
    <div className="bg-warm-ivory noise-overlay pt-20">
      <PageSeo
        title={`${product.name} — Handcrafted ${product.category}`}
        description={`Buy ${product.name} online. Handcrafted ${product.category.toLowerCase()} by Prakash Duo, Thrissur, Kerala. ₹${product.price.toLocaleString()}. Free shipping above ₹599.`}
        canonical={`https://banglesbyprakashduo.store/product/${product.id}`}
        ogImage={product.images[0]?.startsWith('http') ? product.images[0] : `https://banglesbyprakashduo.store${product.images[0]}`}
      />
      <ProductJsonLd
        name={product.name}
        description={`Handcrafted ${product.category.toLowerCase()} by Prakash Duo. Each piece is handmade in Thrissur, Kerala with premium materials and traditional craftsmanship.`}
        price={product.price}
        images={product.images}
        category={product.category}
        availability={
          product.inventory.some(inv => {
            const qty = parseInt(inv.quantity) || 0;
            return qty > 0;
          }) ? 'InStock' : 'OutOfStock'
        }
        url={`https://banglesbyprakashduo.store/product/${product.id}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
          { name: product.category, url: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
          { name: product.name, url: `/product/${product.id}` },
        ]}
      />
      {/* Breadcrumb */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-4 bg-warm-ivory border-b border-raw-umber/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-body">
            <Link href="/" className="text-raw-umber/50 hover:text-deep-ochre transition-colors">Home</Link>
            <span className="text-raw-umber/30">/</span>
            <Link href="/categories" className="text-raw-umber/50 hover:text-deep-ochre transition-colors">Categories</Link>
            <span className="text-raw-umber/30">/</span>
            <span className="text-raw-umber font-medium">{product.name}</span>
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
      <section ref={trustRef} className="py-12 bg-blush-dust/30 border-y border-raw-umber/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Package, title: "Secure Packaging", desc: "Carefully packed for safe delivery" },
              { icon: Star, title: "Handcrafted Quality", desc: "Traditional artisan techniques" },
              { icon: Gift, title: "Gift Ready", desc: "Beautiful packaging included" },
              { icon: Shield, title: "Authentic Products", desc: "100% genuine handmade items" },
            ].map((item, i) => (
              <div key={i} className="trust-badge text-center group">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-deep-ochre/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-deep-ochre" />
                </div>
                <h3 className="font-display text-raw-umber text-sm md:text-base mb-1">{item.title}</h3>
                <p className="font-body text-raw-umber/50 text-xs md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section ref={similarRef} className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="similar-header text-center mb-12">
              <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">
                You May Also Like
              </p>
              <h2 className="font-display text-raw-umber text-3xl md:text-4xl font-bold">
                Similar <span className="font-drama italic font-normal">Products</span>
              </h2>
              <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-deep-ochre to-transparent mx-auto" />
            </div>

            <div className="similar-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((prod) => (
                <div key={prod.id} className="similar-card">
                  <ProductCard
                    id={prod.id}
                    name={prod.name}
                    price={prod.price}
                    images={prod.images}
                    category={prod.category}
                    inventory={prod.inventory}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/categories"
                className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-10 py-5 rounded-full font-body font-semibold hover:bg-crimson-thread/90 transition-colors duration-300"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shipping Banner */}
      <section ref={shippingRef} className="py-12 bg-raw-umber">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shipping-content flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-deep-ochre/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-deep-ochre" />
              </div>
              <div>
                <h3 className="font-display text-xl text-warm-ivory">Free Shipping</h3>
                <p className="font-body text-warm-ivory/60 text-sm">On orders above ₹599</p>
              </div>
            </div>
            <Link
              href="/shipping"
              className="text-deep-ochre hover:text-crimson-thread font-body font-medium transition-colors flex items-center gap-2"
            >
              Learn more about shipping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
