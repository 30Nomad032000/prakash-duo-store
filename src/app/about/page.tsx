"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Heart, Shield, Users, Star, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
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

  return (
    <div className="bg-ivory noise-overlay">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-charcoal overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/10 rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20 mb-8">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium tracking-widest uppercase">
                  Our Story
                </span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            >
              Celebrating Tradition,
              <br />
              <span className="gradient-text">Crafting Elegance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/70 max-w-2xl mx-auto mt-8 leading-relaxed"
            >
              For generations, bangles have been more than jewelry — they are
              symbols of tradition, celebration, and timeless beauty in Indian
              culture.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection>
                <div className="relative">
                  <div className="aspect-[4/5] bg-gradient-to-br from-champagne to-ivory overflow-hidden">
                    {/* Placeholder for image - decorative frame */}
                    <div className="absolute inset-0 border border-gold/20" />
                    <div className="absolute -inset-4 border border-gold/10" />
                    <div className="absolute inset-8 border border-gold/30" />

                    {/* Decorative content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 text-gold/40 mx-auto mb-4" />
                        <p className="font-display text-3xl text-charcoal/30">
                          Artisan Craft
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating element */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute -bottom-8 -right-8 bg-charcoal text-white p-6 max-w-xs"
                  >
                    <p className="font-display text-4xl text-gold mb-2">25+</p>
                    <p className="text-white/70 text-sm">
                      Years of crafting timeless pieces
                    </p>
                  </motion.div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <span className="text-gold text-sm font-medium tracking-widest uppercase">
                  About Prakash Duo
                </span>
                <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-4 mb-8">
                  A Legacy of Beauty
                </h2>

                <div className="space-y-6 text-charcoal/70 leading-relaxed">
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

                <div className="mt-10 pt-10 border-t border-gold/20">
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="font-display text-3xl text-gold">500+</p>
                      <p className="text-sm text-charcoal/60">Unique Designs</p>
                    </div>
                    <div className="w-px h-12 bg-gold/20" />
                    <div>
                      <p className="font-display text-3xl text-gold">1000+</p>
                      <p className="text-sm text-charcoal/60">Happy Customers</p>
                    </div>
                    <div className="w-px h-12 bg-gold/20" />
                    <div>
                      <p className="font-display text-3xl text-gold">100%</p>
                      <p className="text-sm text-charcoal/60">Handmade</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                What We Believe
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mt-4">
                Our Values
              </h2>
              <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <AnimatedSection key={index} delay={index * 0.15}>
                  <div className="group relative bg-ivory p-8 h-full hover:shadow-xl transition-all duration-500 overflow-hidden">
                    {/* Number watermark */}
                    <span className="absolute -top-4 -right-2 font-display text-9xl text-gold/5 group-hover:text-gold/10 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative">
                      <h3 className="font-display text-2xl text-charcoal mb-4">
                        {value.title}
                      </h3>
                      <p className="text-charcoal/60 leading-relaxed">
                        {value.description}
                      </p>
                    </div>

                    {/* Hover accent */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-rose-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-24 md:py-32 bg-gradient-to-br from-champagne to-ivory">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Our Promise
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-4">
                Our Commitment
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white p-8 md:p-12 relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-gold/30" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-gold/30" />

                <p className="text-center text-charcoal/70 mb-10 text-lg">
                  At Bangles by Prakash Duo, we are committed to:
                </p>

                <ul className="space-y-4 max-w-xl mx-auto">
                  {commitments.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-center gap-4 text-charcoal/80"
                    >
                      <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-gold" />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Why Prakash Duo
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-4">
                Why Choose Us
              </h2>
              <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {trustBadges.map((badge, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="group bg-ivory p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <badge.icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-display text-lg text-charcoal mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-sm text-charcoal/60">{badge.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <p className="text-white/60 mb-4">Thank you for being part of our journey.</p>
              <p className="font-display text-3xl text-white mb-8">
                With love and gratitude,
                <br />
                <span className="text-gold italic">Team Prakash Duo</span>
              </p>

              <Link
                href="/categories"
                className="group inline-flex items-center gap-3 bg-gold text-charcoal px-10 py-5 font-semibold hover:bg-rose-gold transition-colors duration-300"
              >
                Explore Our Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </div>
        </section>
    </div>
  );
}
