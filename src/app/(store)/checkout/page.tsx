'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Bell, Sparkles, Instagram } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-ivory noise-overlay">
      {/* Header */}
      <section className="py-4 bg-white border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-charcoal/50 hover:text-gold transition-colors">Home</Link>
            <span className="text-charcoal/30">/</span>
            <Link href="/cart" className="text-charcoal/50 hover:text-gold transition-colors">Cart</Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-charcoal font-medium">Checkout</span>
          </nav>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Back link */}
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-charcoal/60 hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>

            {/* Main Card */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gold/10 relative overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-gold/30" />
              <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-gold/30" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-gold/30" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-gold/30" />

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />

              <div className="relative">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold/20 to-rose-gold/20 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <ShoppingBag className="w-12 h-12 text-gold" />
                  </motion.div>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy/10 rounded-full mb-6"
                >
                  <Sparkles className="w-4 h-4 text-burgundy" />
                  <span className="text-burgundy text-sm font-medium">Coming Soon</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="font-display text-3xl md:text-4xl text-charcoal mb-4"
                >
                  Online Ordering
                  <br />
                  <span className="gradient-text">Opens Soon!</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-charcoal/60 max-w-md mx-auto mb-8 leading-relaxed"
                >
                  We&apos;re putting the finishing touches on our online store.
                  Soon you&apos;ll be able to order our beautiful handcrafted bangles
                  from the comfort of your home.
                </motion.p>

                {/* Divider */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/30" />
                  <div className="w-2 h-2 rotate-45 bg-gold/30" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/30" />
                </div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-ivory rounded-xl p-6 mb-8"
                >
                  <p className="text-charcoal font-medium mb-3">
                    Want to place an order now?
                  </p>
                  <p className="text-charcoal/60 text-sm mb-4">
                    Contact us directly and we&apos;ll help you with your purchase!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="tel:+917909202091"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full hover:bg-burgundy transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      Call: +91 79092 02091
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-charcoal/20 text-charcoal rounded-full hover:border-gold hover:text-gold transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      DM on Instagram
                    </a>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 text-gold hover:text-burgundy transition-colors font-medium"
                  >
                    Continue Browsing Our Collection
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
