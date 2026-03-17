'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageSeo from '@/components/seo/PageSeo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I place an order?',
    answer: 'Simply browse our collection, select your favorite bangles, choose the quantity, and click "Add to Cart". You can continue shopping or proceed to checkout. Complete the checkout process by providing shipping details and payment information. You will receive a confirmation email with your order details.',
    category: 'Ordering'
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and popular digital wallets. All transactions are secure and encrypted for your protection.',
    category: 'Payment'
  },
  {
    id: '3',
    question: 'How long will delivery take?',
    answer: 'Orders within India are typically delivered within 5-7 business days. International orders may take 10-14 business days depending on the destination. You can track your order using the tracking number provided in your confirmation email.',
    category: 'Shipping'
  },
  {
    id: '4',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free shipping on all orders above ₹599 within India. For orders below ₹599, a shipping fee of ₹99 will be applied.',
    category: 'Shipping'
  },
  {
    id: '5',
    question: 'What if the bangle size doesn\'t fit?',
    answer: 'We offer easy returns and exchanges within 7 days of delivery. You can return or exchange the bangles if they don\'t fit, provided they are in their original condition with all tags intact. Contact our support team at support@banglesbyprakashduo.store to initiate a return.',
    category: 'Returns'
  },
  {
    id: '6',
    question: 'Can I cancel my order after placing it?',
    answer: 'Yes, you can cancel your order within 24 hours of placing it, provided it hasn\'t been shipped yet. To cancel, contact our customer support team with your order ID. Once shipped, cancellation is not possible, but you can return the order after delivery.',
    category: 'Ordering'
  },
  {
    id: '7',
    question: 'Are the bangles handmade?',
    answer: 'Yes, all our bangles are handcrafted by skilled artisans using traditional techniques. Each piece is unique and made with love and care. The slight variations in design add to their charm and authenticity.',
    category: 'Product'
  },
  {
    id: '8',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. Please note that free shipping is not available for international orders. Shipping rates and delivery times vary by destination — you will see the cost and estimated delivery time during checkout.',
    category: 'Shipping'
  },
  {
    id: '9',
    question: 'How should I care for my bangles?',
    answer: 'To keep your bangles looking beautiful, avoid exposing them to harsh chemicals, perfumes, or water. Store them in a cool, dry place, preferably in the original packaging or a soft cloth pouch. Gently wipe with a soft cloth after use to remove any oils or dirt.',
    category: 'Product'
  },
  {
    id: '10',
    question: 'Can I gift wrap my order?',
    answer: 'Yes! We offer beautiful gift packaging options during checkout. Each order comes with elegant packaging, and you can add premium gift wrapping for a small additional charge. Add a personal message to make it extra special!',
    category: 'Gift'
  },
  {
    id: '11',
    question: 'What materials are used in your bangles?',
    answer: 'We use high-quality materials including premium metals (gold, silver), precious and semi-precious stones, pearls, kundan, meenakari work, and traditional craft materials. All materials are sourced responsibly and crafted to the highest standards.',
    category: 'Product'
  },
  {
    id: '12',
    question: 'How can I contact customer support?',
    answer: 'Our customer support team is available Monday to Saturday, 9 AM to 6 PM IST. You can reach us via email at support@banglesbyprakashduo.store, WhatsApp at +91 XXXXX XXXXX, or call us at the same number. We typically respond within 24 hours.',
    category: 'Support'
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text-el', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.filter-section', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 85%',
        },
      });

      gsap.from('.faq-item', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 85%',
        },
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ctaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.cta-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
        },
      });
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="FAQs — Shipping, Returns & Bangle Care"
        description="Find answers about ordering, shipping, returns, and caring for your handcrafted bangles from Prakash Duo."
        canonical="https://banglesbyprakashduo.store/faq"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-16 md:pb-20 bg-raw-umber overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-crimson-thread/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="hero-text-el font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-4">
            Help Center
          </p>

          <h1 className="hero-text-el font-display text-5xl md:text-6xl lg:text-7xl text-warm-ivory font-bold mb-6">
            Frequently Asked <span className="font-drama italic font-normal">Questions</span>
          </h1>

          <p className="hero-text-el font-body text-lg text-warm-ivory/60 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, and policies
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section ref={contentRef} className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="filter-section mb-12">
            <h2 className="font-display text-2xl text-raw-umber mb-6">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2.5 rounded-full font-body font-medium transition-all duration-300 ${
                  selectedCategory === 'All'
                    ? 'bg-raw-umber text-warm-ivory shadow-lg'
                    : 'bg-warm-ivory text-raw-umber border border-raw-umber/10 hover:border-deep-ochre'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-body font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-raw-umber text-warm-ivory shadow-lg'
                      : 'bg-warm-ivory text-raw-umber border border-raw-umber/10 hover:border-deep-ochre'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="faq-list space-y-4">
            <AnimatePresence mode="wait">
              {filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="faq-item rounded-3xl bg-warm-ivory border border-raw-umber/10 overflow-hidden hover:border-deep-ochre/30 hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full flex items-start gap-4 p-6 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-deep-ochre" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg text-raw-umber pr-4">
                            {faq.question}
                          </h3>
                          <span className="inline-block mt-2 text-xs bg-blush-dust text-raw-umber/70 px-3 py-1 rounded-full font-mono">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-2"
                    >
                      <ChevronDown className="w-5 h-5 text-deep-ochre" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-raw-umber/10"
                      >
                        <div className="p-6 pl-[4.5rem]">
                          <p className="font-body text-raw-umber/70 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Contact CTA */}
          <div ref={ctaRef} className="mt-16">
            <div className="cta-card relative rounded-3xl bg-warm-ivory border border-raw-umber/10 p-8 md:p-12 overflow-hidden">
              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-deep-ochre" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-raw-umber mb-4">
                  Still have questions?
                </h3>
                <p className="font-body text-raw-umber/60 mb-8 max-w-md mx-auto">
                  Can&apos;t find what you&apos;re looking for? Our customer support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-semibold hover:bg-crimson-thread/90 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Support
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center justify-center gap-2 border-2 border-raw-umber/20 text-raw-umber hover:border-deep-ochre hover:bg-deep-ochre/5 px-8 py-4 rounded-full font-body font-semibold transition-all"
                  >
                    Track Your Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
