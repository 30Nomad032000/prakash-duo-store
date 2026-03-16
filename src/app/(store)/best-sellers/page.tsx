'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import PageSeo from '@/components/seo/PageSeo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  inventory?: { size: string; quantity: string }[];
}

export default function BestSellersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-label', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      });
      gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
      });
      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6,
      });
      gsap.from('.hero-stat', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.8,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Product grid animations
  useEffect(() => {
    if (products.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.product-card-item', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [products]);

  // Why section animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-heading', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: whyRef.current,
          start: 'top 80%',
        },
      });
      gsap.from('.why-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: whyRef.current,
          start: 'top 75%',
        },
      });
    }, whyRef);

    return () => ctx.revert();
  }, []);

  // CTA animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-button', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 90%',
        },
      });
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Star className="w-12 h-12 text-deep-ochre mx-auto mb-4" />
          <p className="text-raw-umber/60 font-display text-xl">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Best Selling Bangles — Most Loved Handcrafted Designs"
        description="Discover our most loved handcrafted bangles. Customer favorites from Prakash Duo, handmade in Thrissur, Kerala with premium materials."
        canonical="https://banglesbyprakashduo.store/best-sellers"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-16 md:pb-20 bg-raw-umber overflow-hidden">
        {/* Subtle decorative blurs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-deep-ochre/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-crimson-thread/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-16 text-center">
          <p className="hero-label font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
            Customer Favorites
          </p>

          <h1 className="hero-title font-display text-warm-ivory text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Our <span className="font-drama italic font-normal">Best Sellers.</span>
          </h1>

          <p className="hero-subtitle font-body text-warm-ivory/70 text-base md:text-lg max-w-2xl mx-auto">
            Discover our most loved bangles, handpicked favorites cherished by customers across India
          </p>

          {/* Stats with diamond separators */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-10 flex-wrap">
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '4.9\u2605', label: 'Average Rating' },
              { value: '100%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className="hero-stat flex items-center gap-6 md:gap-10">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-display text-deep-ochre">{stat.value}</div>
                  <div className="text-xs font-mono text-warm-ivory/50 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
                {i < 2 && (
                  <span className="text-deep-ochre text-lg hidden sm:block">&#10022;</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={gridRef} className="py-16 md:py-24 bg-warm-ivory">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Handpicked Selection</p>
              <h2 className="font-display text-raw-umber text-4xl md:text-5xl font-bold">
                <span className="font-drama italic font-normal">Trending</span> Right Now
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="product-card-item">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  category={product.category}
                  inventory={product.inventory}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="text-center mt-16">
            <Link
              href="/categories"
              className="cta-button group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium text-sm md:text-base overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
            >
              <span className="relative z-10">Browse All Categories</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Customers Love These */}
      <section ref={whyRef} className="py-16 md:py-24 bg-blush-dust/30">
        <div className="max-w-5xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <p className="why-heading font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Trust & Quality</p>
            <h2 className="why-heading font-display text-raw-umber text-3xl md:text-4xl font-bold">
              Why Customers <span className="font-drama italic font-normal">Love These</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Exceptional Quality',
                desc: 'Each piece passes through rigorous quality checks to ensure only the finest reach you.',
              },
              {
                title: 'Unique Designs',
                desc: 'Handcrafted by skilled artisans with traditional techniques passed down through generations.',
              },
              {
                title: 'Customer Approved',
                desc: 'Highly rated and reviewed by hundreds of customers across India.',
              },
            ].map((item, i) => (
              <div key={i} className="why-card text-center p-8 bg-warm-ivory rounded-3xl">
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-deep-ochre" />
                </div>
                <h3 className="font-display text-xl text-raw-umber mb-3">{item.title}</h3>
                <p className="font-body text-raw-umber/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Micro-facts */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {['1000+ Bangles Crafted', '100% Handmade', 'Based in Thrissur, Kerala'].map((fact) => (
              <p key={fact} className="font-mono text-raw-umber/60 text-sm flex items-center gap-3">
                <span className="text-deep-ochre text-lg">&#10022;</span>
                {fact}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
