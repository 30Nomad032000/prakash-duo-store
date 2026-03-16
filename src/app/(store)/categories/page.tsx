'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import PageSeo from '@/components/seo/PageSeo';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  id: string;
  name: string;
  slug: string;
  path: string;
  images: string[];
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

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

  // GSAP animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Hero text entrance
      gsap.from(".hero-label, .hero-title, .hero-subtitle, .hero-breadcrumb", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });

      // Grid cards
      gsap.from(".category-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
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
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 border-2 border-deep-ochre/30 border-t-deep-ochre rounded-full animate-spin mx-auto mb-4" />
          <p className="text-raw-umber/60 font-display text-xl">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-ivory">
      <PageSeo
        title="Shop Bangles by Category — Handcrafted Indian Bangles"
        description="Browse our curated collection of handcrafted bangles. AD Stone, Antique Golden, Bridal Sets, Glass, Thread Bangles — all handmade in Thrissur, Kerala."
        canonical="https://banglesbyprakashduo.store/categories"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-raw-umber overflow-hidden">
        {/* Grain texture */}
        <div className="absolute inset-0 hero-grain pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="hero-label font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
              Our Collections
            </p>

            <h1 className="hero-title font-display text-warm-ivory text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Shop by <span className="font-drama italic font-normal">Category</span>
            </h1>

            <p className="hero-subtitle font-body text-warm-ivory/60 text-lg max-w-2xl mx-auto">
              Explore our curated collection of handcrafted bangles, from traditional designs to contemporary masterpieces
            </p>
          </div>

          {/* Breadcrumb */}
          <nav className="hero-breadcrumb mt-8 text-center">
            <ol className="flex items-center justify-center space-x-2 text-warm-ivory/50 text-sm font-body">
              <li>
                <Link href="/" className="hover:text-deep-ochre transition-colors">Home</Link>
              </li>
              <li className="text-deep-ochre">&#10022;</li>
              <li className="text-deep-ochre">All Categories</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Categories Grid — Asymmetric Masonry */}
      <section ref={gridRef} className="py-20 md:py-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">Browse</p>
          <h2 className="font-display text-raw-umber text-4xl md:text-6xl font-bold">
            <span className="font-drama italic font-normal">Crafted for</span> Every Occasion.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {categories.map((category, index) => {
            // Asymmetric layout: first card is large hero spanning 2 rows
            const isHero = index === 0;
            const isTopRight = index === 1 || index === 2;
            const isBottomRow = index >= 3;

            let gridClasses = "";
            if (isHero) gridClasses = "md:col-span-7 md:row-span-2";
            else if (isTopRight) gridClasses = "md:col-span-5";
            else if (isBottomRow) gridClasses = "md:col-span-4";
            else gridClasses = "md:col-span-4";

            return (
              <div key={category.id} className={`${gridClasses} category-card`}>
                <Link
                  href={`/category/${category.slug}`}
                  className={`group block relative overflow-hidden rounded-3xl ${
                    isHero ? "h-[400px] md:h-full min-h-[500px]" : "h-[260px] md:h-[280px]"
                  }`}
                >
                  <Image
                    src={category.images[0] || ''}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-raw-umber/80 via-raw-umber/20 to-transparent" />

                  {/* Content at bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <span className="inline-block px-3 py-1 bg-deep-ochre/20 backdrop-blur-sm text-deep-ochre text-[10px] font-mono uppercase tracking-wider rounded-full mb-3">
                      {category.productCount} Designs
                    </span>
                    <h3 className={`font-display font-bold text-warm-ivory leading-tight capitalize ${
                      isHero ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
                    }`}>
                      {category.name}
                    </h3>
                    <p className="font-body text-blush-dust/80 text-sm mt-1 mb-4">
                      Handcrafted with tradition
                    </p>
                    <span className="inline-flex items-center gap-2 font-body text-deep-ochre text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Personal Shopping / CTA Section */}
      <section ref={ctaRef} className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Left — Dark with decorative image */}
          <div className="relative bg-raw-umber overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="/assets/antique%20golden%20Bangles/antique%20kada%20lakshmi%20bangle/1.webp"
                alt="Artisan bangle craftsmanship"
                fill
                className="object-cover opacity-50"
              />
            </div>
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, rgba(61,43,31,0.3) 0%, rgba(61,43,31,0.7) 100%)"
            }} />
            <div className="relative z-10 h-full flex items-center justify-center p-12 lg:p-16">
              <p className="font-drama italic text-warm-ivory/90 text-2xl md:text-3xl lg:text-4xl text-center leading-snug max-w-md">
                &ldquo;Every bangle carries the memory of the hands that made it.&rdquo;
              </p>
            </div>
          </div>

          {/* Right — Warm ivory with content */}
          <div className="bg-warm-ivory flex items-center p-10 lg:p-16 xl:p-20">
            <div className="cta-content max-w-lg">
              <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">Personal Shopping</p>

              <h2 className="font-display text-raw-umber text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Need Help <span className="font-drama italic font-normal">Choosing?</span>
              </h2>

              <p className="font-body text-raw-umber/70 leading-relaxed mb-8">
                Our expert team is here to help you find the perfect bangles for any occasion.
                Get personalized recommendations and styling advice.
              </p>

              {/* Trust facts */}
              <div className="space-y-3 mb-8">
                {[
                  "Expert Styling Advice",
                  "Personalized Recommendations",
                  "Dedicated Customer Support",
                ].map((fact) => (
                  <p key={fact} className="font-mono text-raw-umber/60 text-sm flex items-center gap-3">
                    <span className="text-deep-ochre text-lg">&#10022;</span>
                    {fact}
                  </p>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <a
                  href="tel:+917909202091"
                  className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-7 py-3.5 rounded-full font-body font-medium text-sm overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
                >
                  <Phone className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Call Us: +91 79092 02091</span>
                  <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </a>

                <a
                  href="https://www.instagram.com/bangles_byprakashduo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-7 py-3.5 border-2 border-raw-umber/20 text-raw-umber font-body text-sm font-medium rounded-full hover:border-deep-ochre hover:bg-deep-ochre/5 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message on Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
