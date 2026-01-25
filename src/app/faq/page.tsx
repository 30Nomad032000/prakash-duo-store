'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, MessageCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

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
    answer: 'Yes! We offer free shipping on all orders above ₹999 within India. For orders below this amount, a nominal shipping fee of ₹49 will be applied.',
    category: 'Shipping'
  },
  {
    id: '5',
    question: 'What if the bangle size doesn\'t fit?',
    answer: 'We offer easy returns and exchanges within 7 days of delivery. You can return or exchange the bangles if they don\'t fit, provided they are in their original condition with all tags intact. Contact our support team at support@prakashduo.com to initiate a return.',
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
    answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. During checkout, you will see the shipping cost and estimated delivery time for your country.',
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
    answer: 'Our customer support team is available Monday to Saturday, 9 AM to 6 PM IST. You can reach us via email at support@prakashduo.com, WhatsApp at +91 XXXXX XXXXX, or call us at the same number. We typically respond within 24 hours.',
    category: 'Support'
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

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

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-ivory noise-overlay">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gold/20 mb-6">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Help Center
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, and policies
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <AnimatedSection className="mb-12">
            <h2 className="font-display text-2xl text-charcoal mb-6">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'All'
                    ? 'bg-charcoal text-white shadow-lg'
                    : 'bg-white text-charcoal border border-gold/20 hover:border-gold hover:text-gold'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-charcoal text-white shadow-lg'
                      : 'bg-white text-charcoal border border-gold/20 hover:border-gold hover:text-gold'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* FAQ List */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg border border-gold/10 overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full flex items-start gap-4 p-6 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-gold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg text-charcoal pr-4">
                            {faq.question}
                          </h3>
                          <span className="inline-block mt-2 text-xs bg-champagne text-charcoal/70 px-3 py-1 rounded-full">
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
                      <ChevronDown className="w-5 h-5 text-gold" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gold/10"
                      >
                        <div className="p-6 pl-[4.5rem]">
                          <p className="text-charcoal/70 leading-relaxed">
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
          <AnimatedSection delay={0.3} className="mt-16">
            <div className="relative bg-white p-8 md:p-12 rounded-lg border border-gold/20 overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold/20" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold/20" />

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-4">
                  Still have questions?
                </h3>
                <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
                  Can&apos;t find what you&apos;re looking for? Our customer support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-4 font-semibold hover:bg-burgundy transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Support
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center justify-center gap-2 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-4 font-semibold transition-all"
                  >
                    Track Your Order
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
