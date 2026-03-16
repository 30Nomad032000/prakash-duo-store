"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Heart, Shield, Users, Star, Sparkles, ArrowRight } from "lucide-react";
import PageSeo from '@/components/seo/PageSeo';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const commitRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const trustBadges = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handcrafted with finest materials",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% safe transactions",
    },
    {
      icon: Users,
      title: "1000+ Happy Customers",
      description: "Trusted by many",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Each piece unique",
    },
    {
      icon: Star,
      title: "4.9 Rating",
      description: "Customer satisfaction",
    },
    {
      icon: Sparkles,
      title: "Authentic",
      description: "100% genuine products",
    },
  ];

  const values = [
    {
      title: "Quality Craftsmanship",
      description:
        "Every bangle is carefully handcrafted by skilled artisans using traditional techniques passed down through generations.",
    },
    {
      title: "Fair Trade",
      description:
        "We believe in fair compensation and sustainable practices that support artisan communities.",
    },
    {
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We are committed to providing exceptional service and beautiful products.",
    },
  ];

  const commitments = [
    "Preserving traditional craftsmanship techniques",
    "Supporting artisan communities across India",
    "Using high-quality, sustainable materials",
    "Providing exceptional customer service",
    "Creating designs that celebrate Indian heritage",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".about-hero-text > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      // Story section
      gsap.from(".story-image-block", {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".story-content > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 75%",
        },
      });

      // Values cards
      gsap.from(".value-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 80%",
        },
      });

      // Commitment items
      gsap.from(".commit-item", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: commitRef.current,
          start: "top 80%",
        },
      });

      // Trust badges
      gsap.from(".trust-badge", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: trustRef.current,
          start: "top 80%",
        },
      });

      // CTA
      gsap.from(".cta-content > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Our Story — Handcrafted Bangles from Thrissur, Kerala"
        description="Born in Thrissur, worn across India. Learn about Prakash Duo's journey in preserving traditional bangle craftsmanship."
        canonical="https://banglesbyprakashduo.store/about"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 md:pt-40 pb-20 md:pb-28 bg-raw-umber overflow-hidden">
        {/* Grain texture */}
        <div className="absolute inset-0 hero-grain pointer-events-none" />
        {/* Decorative blurs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="about-hero-text relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-6">
            Our Story
          </p>

          <h1 className="font-display text-warm-ivory text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Celebrating <span className="font-drama italic font-normal">Tradition,</span>
            <br />
            Crafting Elegance
          </h1>

          <p className="font-body text-warm-ivory/70 text-lg max-w-2xl mx-auto mt-8 leading-relaxed">
            For generations, bangles have been more than jewelry — they are
            symbols of tradition, celebration, and timeless beauty in Indian
            culture.
          </p>
        </div>
      </section>

      {/* Story Section — Two-column like landing Brand Story */}
      <section ref={storyRef} className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
          {/* Left — Dark with image overlay and centered quote */}
          <div className="relative bg-raw-umber overflow-hidden">
            <div className="story-image-block absolute inset-0">
              <Image
                src="/assets/cover page images website/Bangles.png"
                alt="Artisan crafted bangles by Prakash Duo"
                fill
                className="object-cover object-top opacity-60"
                priority
              />
            </div>
            {/* Warm vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(61,43,31,0.3) 0%, rgba(61,43,31,0.7) 100%)",
              }}
            />
            {/* Centered quote */}
            <div className="relative z-10 h-full flex items-center justify-center p-12 lg:p-16">
              <p className="font-drama italic text-warm-ivory/90 text-2xl md:text-3xl lg:text-4xl text-center leading-snug max-w-md">
                &ldquo;Every bangle carries the memory of the hands that made it.&rdquo;
              </p>
            </div>
          </div>

          {/* Right — warm-ivory with content */}
          <div className="bg-warm-ivory flex items-center p-10 lg:p-16 xl:p-20">
            <div className="story-content max-w-lg">
              <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
                About Prakash Duo
              </p>

              <h2 className="font-display text-raw-umber text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                A Legacy of <span className="font-drama italic font-normal">Beauty.</span>
              </h2>

              <div className="space-y-5 font-body text-raw-umber/70 leading-relaxed mb-8">
                <p>
                  Bangles by Prakash Duo was born from a passion for preserving
                  the rich heritage of traditional bangle craftsmanship. Each
                  piece in our collection is a testament to the dedication,
                  skill, and artistry of India&apos;s finest artisans.
                </p>
                <p>
                  We work closely with skilled craftspeople across India to
                  bring you a curated collection that bridges traditional artistry
                  with contemporary design sensibilities.
                </p>
                <p>
                  Our mission is simple: to celebrate India&apos;s cultural heritage
                  while making exquisite bangles accessible to those who
                  appreciate true craftsmanship.
                </p>
              </div>

              {/* Micro-facts with diamond bullets */}
              <div className="space-y-3 mb-8">
                {[
                  "500+ Unique Designs",
                  "1000+ Happy Customers",
                  "100% Handmade with Love",
                ].map((fact) => (
                  <p
                    key={fact}
                    className="font-mono text-raw-umber/60 text-sm flex items-center gap-3"
                  >
                    <span className="text-deep-ochre text-lg">&#10022;</span>
                    {fact}
                  </p>
                ))}
              </div>

              <Link
                href="/categories"
                className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-7 py-3.5 rounded-full font-body font-medium text-sm overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
              >
                <span className="relative z-10">Explore Our Collection</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 md:py-32 bg-blush-dust/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">
              What We Believe
            </p>
            <h2 className="font-display text-raw-umber text-4xl md:text-6xl font-bold">
              Our <span className="font-drama italic font-normal">Values.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card group relative rounded-3xl bg-warm-ivory p-8 h-full hover:shadow-luxury transition-all duration-500 overflow-hidden"
              >
                {/* Number watermark */}
                <span className="absolute -top-4 -right-2 font-display text-9xl text-deep-ochre/10 group-hover:text-deep-ochre/15 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <h3 className="font-display text-2xl text-raw-umber mb-4">
                    {value.title}
                  </h3>
                  <p className="font-body text-raw-umber/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-deep-ochre to-rose-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section ref={commitRef} className="py-24 md:py-32 bg-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">
              Our Promise
            </p>
            <h2 className="font-display text-raw-umber text-4xl md:text-5xl font-bold">
              Our <span className="font-drama italic font-normal">Commitment.</span>
            </h2>
          </div>

          <div className="rounded-3xl bg-blush-dust/30 p-8 md:p-12 relative overflow-hidden">
            <p className="text-center font-body text-raw-umber/70 mb-10 text-lg">
              At Bangles by Prakash Duo, we are committed to:
            </p>

            <ul className="space-y-4 max-w-xl mx-auto">
              {commitments.map((item, i) => (
                <li
                  key={i}
                  className="commit-item flex items-center gap-4 font-body text-raw-umber/80"
                >
                  <span className="text-deep-ochre text-lg flex-shrink-0">&#10022;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section ref={trustRef} className="py-24 md:py-32 bg-warm-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">
              Why Prakash Duo
            </p>
            <h2 className="font-display text-raw-umber text-4xl md:text-6xl font-bold">
              Why <span className="font-drama italic font-normal">Choose</span> Us.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="trust-badge group rounded-3xl bg-blush-dust/30 p-6 text-center hover:shadow-luxury transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-deep-ochre/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <badge.icon className="w-6 h-6 text-deep-ochre" />
                </div>
                <h3 className="font-display text-lg text-raw-umber mb-1">
                  {badge.title}
                </h3>
                <p className="font-body text-sm text-raw-umber/60">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 md:py-32 bg-raw-umber relative overflow-hidden">
        <div className="absolute inset-0 hero-grain pointer-events-none" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="cta-content relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body text-warm-ivory/60 mb-4">
            Thank you for being part of our journey.
          </p>
          <p className="font-display text-3xl text-warm-ivory mb-8">
            With love and gratitude,
            <br />
            <span className="font-drama italic font-normal text-deep-ochre">
              Team Prakash Duo
            </span>
          </p>

          <Link
            href="/categories"
            className="group inline-flex items-center gap-3 bg-crimson-thread text-warm-ivory px-10 py-5 rounded-full font-body font-semibold overflow-hidden relative transition-transform duration-300 hover:scale-[1.02] press-effect"
          >
            <span className="relative z-10">Explore Our Collection</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </section>
    </div>
  );
}
