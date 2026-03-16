'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ArrowLeft, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import PageSeo from '@/components/seo/PageSeo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

if (typeof window !== "undefined") {
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

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
  images?: string[];
}

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

  // GSAP animations
  useEffect(() => {
    if (loading || error || !category) return;

    const ctx = gsap.context(() => {
      // Hero text entrance
      gsap.from(".hero-breadcrumb, .hero-label, .hero-title, .hero-subtitle, .hero-stats", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });

      // Product cards
      gsap.from(".product-card-item", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });

      // About section
      gsap.from(".about-content > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
        },
      });

      // CTA section
      gsap.from(".cta-content > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [loading, error, category]);

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
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 border-2 border-deep-ochre/30 border-t-deep-ochre rounded-full animate-spin mx-auto mb-4" />
          <p className="text-raw-umber/60 font-display text-xl">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-raw-umber/5 flex items-center justify-center">
            <span className="text-deep-ochre text-3xl">&#10022;</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-raw-umber mb-4">
            Category Not Found
          </h1>
          <p className="font-body text-raw-umber/60 mb-8 max-w-md mx-auto">
            The category you&apos;re looking for doesn&apos;t exist or has no products yet.
          </p>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium text-sm overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
          >
            <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
            <span className="relative z-10">Browse All Categories</span>
            <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-ivory" ref={heroRef}>
      <PageSeo
        title={`${category.name} — Buy Handcrafted ${category.name} Online`}
        description={`Shop ${products.length} handcrafted ${category.name.toLowerCase()} from Prakash Duo, Thrissur, Kerala. 100% handmade, free shipping above ₹999.`}
        canonical={`https://banglesbyprakashduo.store/category/${params.slug}`}
        ogImage={products[0]?.images[0]?.startsWith('http') ? products[0].images[0] : `https://banglesbyprakashduo.store${products[0]?.images[0] || ''}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
          { name: category.name, url: `/category/${params.slug}` },
        ]}
      />
      {/* Hero Section with Category Image */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-raw-umber overflow-hidden">
        {/* Background Image */}
        {products[0]?.images[0] && (
          <div className="absolute inset-0">
            <Image
              src={products[0].images[0]}
              alt={category.name}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-raw-umber/70 via-raw-umber/85 to-raw-umber" />
          </div>
        )}

        {/* Grain texture */}
        <div className="absolute inset-0 hero-grain pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-16">
          {/* Breadcrumb */}
          <nav className="hero-breadcrumb mb-8">
            <ol className="flex items-center space-x-2 text-warm-ivory/50 text-sm font-body">
              <li>
                <Link href="/" className="hover:text-deep-ochre transition-colors">Home</Link>
              </li>
              <li className="text-deep-ochre">&#10022;</li>
              <li>
                <Link href="/categories" className="hover:text-deep-ochre transition-colors">Categories</Link>
              </li>
              <li className="text-deep-ochre">&#10022;</li>
              <li className="text-deep-ochre">{category.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="hero-label font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
              Collection
            </p>

            <h1 className="hero-title font-display text-warm-ivory text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              {category.name}
            </h1>

            <p className="hero-subtitle font-body text-warm-ivory/60 text-lg max-w-xl">
              Discover our exquisite collection of {category.name.toLowerCase()}.
              Each piece is handcrafted with love and precision by skilled artisans.
            </p>

            {/* Stats with diamond bullets */}
            <div className="hero-stats flex items-center gap-8 mt-8">
              <p className="font-mono text-warm-ivory/60 text-sm flex items-center gap-3">
                <span className="text-deep-ochre text-lg">&#10022;</span>
                <span className="font-display text-2xl text-deep-ochre mr-1">{products.length}</span> Designs
              </p>
              <p className="font-mono text-warm-ivory/60 text-sm flex items-center gap-3">
                <span className="text-deep-ochre text-lg">&#10022;</span>
                <span className="font-display text-2xl text-deep-ochre mr-1">100%</span> Handmade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[80px] z-40 bg-warm-ivory/95 backdrop-blur-xl border-b border-deep-ochre/10 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex items-center justify-between">
            <p className="font-body text-raw-umber/60 text-sm">
              Showing <span className="font-semibold text-raw-umber">{sortedProducts.length}</span> products
            </p>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-raw-umber/20 rounded-full text-raw-umber font-body text-sm hover:border-deep-ochre hover:bg-deep-ochre/5 transition-all duration-300"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-warm-ivory border border-deep-ochre/15 rounded-2xl shadow-luxury-lg overflow-hidden z-50">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-5 py-3 text-sm font-body text-raw-umber hover:bg-blush-dust/30 transition-colors"
                      >
                        {option.label}
                        {sortBy === option.value && <Check className="w-4 h-4 text-deep-ochre" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={gridRef} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
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
          ) : (
            <div className="text-center py-20">
              <span className="text-deep-ochre text-4xl block mb-4">&#10022;</span>
              <p className="text-raw-umber/60 text-lg font-display">
                No products found in this category yet.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-deep-ochre font-body font-medium mt-4 hover:gap-3 transition-all"
              >
                Browse other categories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-16 md:py-24 bg-blush-dust/30">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="about-content">
              <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">
                About This Collection
              </p>
              <h2 className="font-display text-raw-umber text-3xl md:text-4xl font-bold mb-6">
                <span className="font-drama italic font-normal">The Art of</span> {category.name}
              </h2>
              <p className="font-body text-raw-umber/70 leading-relaxed mb-6">
                Our {category.name.toLowerCase()} collection features exquisite pieces
                handcrafted by skilled artisans. Each bangle tells a story of tradition,
                elegance, and meticulous craftsmanship that has been passed down through generations.
              </p>
              <p className="font-body text-raw-umber/70 leading-relaxed">
                Whether you&apos;re looking for everyday elegance or a statement piece for
                special occasions, our collection offers something unique for every taste.
              </p>
            </div>

            <div>
              <div className="bg-warm-ivory p-8 rounded-3xl border border-deep-ochre/10">
                <h3 className="font-display text-xl text-raw-umber mb-6">Why Choose Us</h3>
                <div className="space-y-4">
                  {[
                    "100% authentic handcrafted bangles",
                    "Premium quality at affordable prices",
                    "Secure packaging and fast delivery",
                    "Easy returns and exchanges",
                    "Dedicated customer support",
                  ].map((item, i) => (
                    <p key={i} className="font-mono text-raw-umber/60 text-sm flex items-center gap-3">
                      <span className="text-deep-ochre text-lg">&#10022;</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 md:py-28 bg-raw-umber relative overflow-hidden">
        {/* Grain texture */}
        <div className="absolute inset-0 hero-grain pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-16 text-center">
          <div className="cta-content">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
              Keep Exploring
            </p>
            <h2 className="font-display text-warm-ivory text-3xl md:text-5xl font-bold mb-4">
              Discover More <span className="font-drama italic font-normal">Collections</span>
            </h2>
            <p className="font-body text-warm-ivory/60 mb-10 max-w-lg mx-auto">
              Explore other beautiful categories in our store and find the perfect bangles for every occasion.
            </p>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium text-sm overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
            >
              <span className="relative z-10">View All Categories</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
