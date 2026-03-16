'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { RotateCcw, XCircle, Package, AlertTriangle, Sparkles, ArrowRight, Mail } from 'lucide-react';
import PageSeo from '@/components/seo/PageSeo';

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

export default function RefundPolicyPage() {
  const highlights = [
    {
      icon: RotateCcw,
      title: "Return Policy",
      desc: "Returns accepted only for fully damaged products"
    },
    {
      icon: XCircle,
      title: "Cancellation Rights",
      desc: "We reserve the right to cancel non-compliant orders"
    },
    {
      icon: Package,
      title: "Full Refund",
      desc: "Complete refund for cancelled or lost orders"
    },
    {
      icon: AlertTriangle,
      title: "Shipping Charges",
      desc: "₹99 shipping fee for partial cancellations"
    },
  ];

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Refund & Return Policy"
        description="Easy returns within 7 days. Learn about our refund policy for handcrafted bangles."
        canonical="https://banglesbyprakashduo.store/refund"
      />
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 bg-raw-umber overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-deep-ochre/20 mb-6">
              <RotateCcw className="w-4 h-4 text-deep-ochre" />
              <span className="text-deep-ochre text-sm font-medium tracking-widest uppercase">
                Customer Support
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Refund <span className="gradient-text">Policy</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Our policies on returns, exchanges, and cancellations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {highlights.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group bg-warm-ivory rounded-3xl p-6 border border-deep-ochre/10 hover:border-deep-ochre/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-ochre/10 to-deep-ochre/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-deep-ochre" />
                  </div>
                  <h3 className="font-display text-lg text-raw-umber mb-2">{item.title}</h3>
                  <p className="text-raw-umber/60 text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Return & Exchange Policy
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <div className="p-5 bg-gradient-to-br from-blush-dust to-warm-ivory rounded-lg border border-deep-ochre/10">
                    <p className="text-raw-umber font-medium mb-3">Important Notice:</p>
                    <p>
                      Return/Exchange is only possible if the product reaches you <strong className="text-crimson-thread">fully damaged</strong>.
                    </p>
                  </div>
                  <p>
                    Any other reasons for the return or exchange of the product will not be taken in by the company. We ensure that all our products are carefully inspected and packaged before shipping to minimize any transit damage.
                  </p>
                  <p>
                    If you receive a damaged product, please contact us within 24 hours of delivery with photos of the damaged item and packaging.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Cancellation Policy
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>
                    banglesbyprakashduo.com reserves the right to cancel an order without cause if the request is not complied with. The company will ensure timely notice of order cancellation or applicable refund.
                  </p>
                  <div className="p-5 bg-gradient-to-br from-blush-dust to-warm-ivory rounded-lg border border-deep-ochre/10">
                    <h4 className="font-semibold text-raw-umber mb-3">Partial Cancellation:</h4>
                    <p>
                      If the customer partially cancels when the total cart value is less than the free shipping amount, banglesbyprakashduo.com reserves the right to charge a <strong className="text-deep-ochre">₹99 shipping fee</strong>.
                    </p>
                  </div>
                  <p>
                    If an order is cancelled or lost in transit, the entire order amount including shipping costs will be refunded.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Refund Process
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>
                    Once your return/refund request is approved, the refund will be processed within 5-7 business days. The amount will be credited to your original payment method.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Credit/Debit Card payments: Refund within 5-7 business days</li>
                    <li>UPI payments: Refund within 3-5 business days</li>
                    <li>Net Banking: Refund within 5-7 business days</li>
                  </ul>
                  <p className="text-sm text-raw-umber/50 mt-4 p-4 bg-blush-dust rounded-lg">
                    Note: The actual credit to your account may take additional time depending on your bank&apos;s processing time.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Cash on Delivery (COD)
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <div className="p-5 bg-crimson-thread/10 rounded-lg border border-crimson-thread/20">
                    <p className="text-crimson-thread font-medium">
                      Cash on Delivery service is not available.
                    </p>
                  </div>
                  <p>
                    We accept payments via Credit/Debit cards, UPI, Net Banking, and other online payment methods through our secure payment gateway.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Contact CTA */}
          <AnimatedSection delay={0.3} className="mt-16">
            <div className="relative bg-raw-umber p-8 md:p-12 rounded-3xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-deep-ochre/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-deep-ochre/10 rounded-full blur-3xl" />

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-deep-ochre/20 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-deep-ochre" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-4">
                  Any Questions or Comments?
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Please send any questions or comments to our support team. We&apos;re here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:prakashduo19@gmail.com"
                    className="group inline-flex items-center justify-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-semibold hover:bg-crimson-thread/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    prakashduo19@gmail.com
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:border-deep-ochre hover:text-deep-ochre px-8 py-4 rounded-full font-semibold transition-all"
                  >
                    Contact Support
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
