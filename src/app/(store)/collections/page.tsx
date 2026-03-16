'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Crown } from 'lucide-react';
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

const featuredCollections = [
  {
    title: 'Best Sellers',
    subtitle: 'Customer Favorites',
    description: 'Discover the bangles that have won the hearts of our customers across India',
    image: '/assets/AD Stone bangles/AD stone brick ruby stone/1.webp',
    href: '/best-sellers',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh from Artisans',
    description: 'Latest additions crafted with modern elegance and traditional techniques',
    image: '/assets/antique golden Bangles/antique  flower rode/1.webp',
    href: '/categories',
  },
  {
    title: 'Traditional',
    subtitle: 'Timeless Classics',
    description: 'Heritage designs cherished across generations of Indian families',
    image: '/assets/bracelet bangle/drop shaped bangle/1.webp',
    href: '/categories',
  },
];

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const collectionsRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Featured collections animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.collection-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: collectionsRef.current,
          start: 'top 80%',
        },
      });
    }, collectionsRef);

    return () => ctx.revert();
  }, []);

  // Products grid animations
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
          trigger: productsRef.current,
          start: 'top 80%',
        },
      });
    }, productsRef);

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
      gsap.from('.why-item', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
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
          <Crown className="w-12 h-12 text-deep-ochre mx-auto mb-4" />
          <p className="text-raw-umber/60 font-display text-xl">Curating collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Bangle Collections — Curated Handcrafted Sets"
        description="Explore curated bangle collections for every occasion. Bridal, traditional, and contemporary designs handcrafted in Kerala."
        canonical="https://banglesbyprakashduo.store/collections"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-16 md:pb-20 bg-blush-dust/30 overflow-hidden">
        {/* Subtle decorative blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-deep-ochre/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-crimson-thread/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-16 text-center">
          <p className="hero-label font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
            Curated Collections
          </p>

          <h1 className="hero-title font-display text-raw-umber text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="font-drama italic font-normal">Crafted for</span> Every Occasion.
          </h1>

          <p className="hero-subtitle font-body text-raw-umber/70 text-base md:text-lg max-w-2xl mx-auto">
            Explore our handpicked collections featuring the finest bangles for every occasion and celebration
          </p>
        </div>
      </section>

      {/* Featured Collections */}
      <section ref={collectionsRef} className="py-16 md:py-24 bg-warm-ivory">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="mb-12 md:mb-16">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Explore</p>
            <h2 className="font-display text-raw-umber text-4xl md:text-5xl font-bold">
              Featured <span className="font-drama italic font-normal">Collections</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {featuredCollections.map((collection, index) => (
              <div key={index} className="collection-card">
                <Link href={collection.href} className="group block relative overflow-hidden rounded-3xl h-[320px] md:h-[380px]">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-raw-umber/80 via-raw-umber/20 to-transparent" />

                  {/* Content at bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.15em] mb-2">
                      {collection.subtitle}
                    </p>
                    <h3 className="font-display font-bold text-warm-ivory text-2xl md:text-3xl leading-tight mb-2">
                      {collection.title}
                    </h3>
                    <p className="font-body text-blush-dust/80 text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center gap-2 font-body text-deep-ochre text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Shop Collection <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="py-16 md:py-24 bg-warm-ivory">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Handpicked Selection</p>
              <h2 className="font-display text-raw-umber text-4xl md:text-5xl font-bold">
                Featured <span className="font-drama italic font-normal">Products</span>
              </h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-raw-umber/20 text-raw-umber font-body text-sm font-medium rounded-full hover:border-deep-ochre hover:bg-deep-ochre/5 transition-all duration-300 self-start md:self-auto"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
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
              <span className="relative z-10">View All Products</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Our Collections Stand Out */}
      <section ref={whyRef} className="py-16 md:py-24 bg-blush-dust/30">
        <div className="max-w-5xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <p className="why-heading font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">The Difference</p>
            <h2 className="why-heading font-display text-raw-umber text-3xl md:text-4xl font-bold">
              Why Our Collections <span className="font-drama italic font-normal">Stand Out</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                num: '01',
                title: 'Handpicked Selection',
                desc: 'Every collection is carefully curated by our team to ensure you get only the finest bangles.',
              },
              {
                num: '02',
                title: 'Artisan Crafted',
                desc: 'Each piece is handcrafted by skilled artisans using traditional techniques passed down through generations.',
              },
              {
                num: '03',
                title: 'Quality Assured',
                desc: 'Every bangle goes through strict quality checks to ensure you receive nothing but the best.',
              },
              {
                num: '04',
                title: 'Exclusive Designs',
                desc: 'Many pieces in our collections are limited edition or exclusive designs you won\'t find elsewhere.',
              },
            ].map((item, i) => (
              <div key={i} className="why-item flex gap-6 p-6 md:p-8 bg-warm-ivory rounded-3xl">
                <div className="flex-shrink-0">
                  <span className="font-display text-4xl md:text-5xl text-deep-ochre/30 font-bold">{item.num}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-raw-umber mb-2">{item.title}</h3>
                  <p className="font-body text-raw-umber/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Micro-facts */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {['Premium Materials Only', '100% Handmade', 'Free Delivery Available'].map((fact) => (
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
