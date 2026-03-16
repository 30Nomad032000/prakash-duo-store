'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Shield, Lock, Eye, Database, Sparkles, ArrowRight } from 'lucide-react';
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

export default function PrivacyPage() {
  const highlights = [
    {
      icon: Shield,
      title: "Your Privacy Matters",
      desc: "We are committed to protecting your personal data"
    },
    {
      icon: Lock,
      title: "Secure Transactions",
      desc: "Your payment information is encrypted and secure"
    },
    {
      icon: Eye,
      title: "Transparent Practices",
      desc: "We are clear about how we use your data"
    },
    {
      icon: Database,
      title: "Data Protection",
      desc: "We follow strict data protection standards"
    },
  ];

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Privacy Policy"
        description="Your privacy matters. Learn how Prakash Duo handles your personal data."
        canonical="https://banglesbyprakashduo.store/privacy"
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
              <Shield className="w-4 h-4 text-deep-ochre" />
              <span className="text-deep-ochre text-sm font-medium tracking-widest uppercase">
                Your Data, Protected
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information
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

          {/* Last Updated */}
          <AnimatedSection>
            <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10 mb-8">
              <p className="text-raw-umber/70 mb-4">
                <span className="font-semibold text-raw-umber">Last Updated:</span> January 18, 2026
              </p>
              <p className="text-raw-umber/70 leading-relaxed">
                At Bangles by Prakash Duo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases. By using our services, you agree to this policy.
              </p>
            </div>
          </AnimatedSection>

          {/* Policy Sections */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Information We Collect
                </h2>
                <div className="space-y-6 text-raw-umber/70">
                  <p>We collect the following types of information to provide you with a better shopping experience:</p>

                  <div>
                    <h4 className="font-semibold text-raw-umber mb-3">Personal Information</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Name, email address, phone number</li>
                      <li>Shipping and billing addresses</li>
                      <li>Payment information (processed securely)</li>
                      <li>Account credentials (if you create an account)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-raw-umber mb-3">Technical Information</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>IP address and browser type</li>
                      <li>Device information and operating system</li>
                      <li>Referring website and pages visited</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-raw-umber mb-3">Usage Information</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li>Products viewed and added to cart</li>
                      <li>Purchase history</li>
                      <li>Customer reviews and ratings</li>
                      <li>Customer service communications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-deep-ochre" />
                  </div>
                  How We Use Your Information
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Send order confirmations and shipping notifications</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Improve our products, services, and user experience</li>
                    <li>Send promotional offers (with your consent)</li>
                    <li>Prevent fraudulent activities and ensure security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Data Security
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>We implement robust security measures to protect your information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>SSL encryption for all data transmissions</li>
                    <li>Secure payment gateways (Razorpay, Stripe)</li>
                    <li>Restricted access to personal data</li>
                    <li>Regular security audits and updates</li>
                    <li>Compliance with industry best practices</li>
                  </ul>
                  <p className="text-sm text-raw-umber/50 mt-4 p-4 bg-blush-dust rounded-lg">
                    However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Information Sharing
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-raw-umber">Service Providers:</strong> Third parties who assist in operating our website, processing payments, and shipping orders</li>
                    <li><strong className="text-raw-umber">Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
                    <li><strong className="text-raw-umber">Business Transfers:</strong> If our business is sold or merged, your data may be transferred</li>
                  </ul>
                  <p className="text-sm text-raw-umber/50 mt-4">
                    All third-party service providers are contractually obligated to protect your information and use it only for the purposes specified.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Cookies and Tracking Technologies
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences and login details</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Improve website performance and functionality</li>
                  </ul>
                  <p className="text-sm text-raw-umber/50 mt-4">
                    You can manage your cookie preferences through your browser settings. However, disabling cookies may affect your experience on our website.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.35}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Your Rights
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-raw-umber">Access:</strong> Request a copy of your personal data</li>
                    <li><strong className="text-raw-umber">Correction:</strong> Update inaccurate or incomplete information</li>
                    <li><strong className="text-raw-umber">Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong className="text-raw-umber">Objection:</strong> Object to processing of your data</li>
                    <li><strong className="text-raw-umber">Withdrawal:</strong> Withdraw consent at any time</li>
                  </ul>
                  <p className="text-sm text-raw-umber/50 mt-4">
                    To exercise these rights, please contact us at privacy@prakashduo.com
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="bg-warm-ivory rounded-3xl p-8 border border-deep-ochre/10">
                <h2 className="font-display text-2xl text-raw-umber mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-deep-ochre" />
                  </div>
                  Changes to This Policy
                </h2>
                <div className="space-y-4 text-raw-umber/70">
                  <p>
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                  </p>
                  <p>
                    For material changes, we will notify you via email or prominent notice on our website before the changes take effect.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Contact CTA */}
          <AnimatedSection delay={0.45} className="mt-16">
            <div className="relative bg-raw-umber p-8 md:p-12 rounded-3xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-deep-ochre/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-deep-ochre/10 rounded-full blur-3xl" />

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-deep-ochre/20 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-deep-ochre" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-4">
                  Questions About Your Privacy?
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  If you have any questions or concerns about this Privacy Policy, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:privacy@prakashduo.com"
                    className="group inline-flex items-center justify-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-semibold hover:bg-crimson-thread/90 transition-colors"
                  >
                    Privacy Email
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
