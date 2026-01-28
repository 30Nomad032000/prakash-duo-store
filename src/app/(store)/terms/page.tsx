'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FileText, Scale, Shield, AlertTriangle, Sparkles, ArrowRight, Mail } from 'lucide-react';

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

export default function TermsAndConditionsPage() {
  const highlights = [
    {
      icon: Scale,
      title: "Legal Agreement",
      desc: "Binding terms between you and us"
    },
    {
      icon: FileText,
      title: "Clear Terms",
      desc: "Transparent policies for your protection"
    },
    {
      icon: Shield,
      title: "Your Rights",
      desc: "Understanding your entitlements"
    },
    {
      icon: AlertTriangle,
      title: "Responsibilities",
      desc: "What we expect from users"
    },
  ];

  const termsPoints = [
    "To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account.",
    "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials offered on this website or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
    "Your use of our Services and the website is solely at your own risk and discretion. You are required to independently assess and ensure that the Services meet your requirements.",
    "The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights, title, or interest in its contents.",
    "You acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.",
    "You agree to pay us the charges associated with availing the Services.",
    "You agree not to use the website and/or Services for any purpose that is unlawful, illegal or forbidden by these Terms, or Indian or local laws that might apply to you.",
    "You agree and acknowledge that website and the Services may contain links to other third party websites. On accessing these links, you will be governed by the terms of use, privacy policy and such other policies of such third party websites.",
    "You understand that upon initiating a transaction for availing the Services you are entering into a legally binding and enforceable contract with us for the Services.",
  ];

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
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Legal Information
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Please read these terms carefully before using our services
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
                <div className="group bg-white rounded-lg p-6 border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
                  <p className="text-charcoal/60 text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Last Updated & Introduction */}
          <AnimatedSection>
            <div className="bg-white rounded-lg p-8 border border-gold/10 mb-8">
              <p className="text-charcoal/70 mb-4">
                <span className="font-semibold text-charcoal">Last updated on:</span> 27-01-2026 19:16:34
              </p>
              <div className="space-y-4 text-charcoal/70 leading-relaxed">
                <p>
                  These Terms and Conditions, along with privacy policy or other terms (&ldquo;Terms&rdquo;) constitute a binding agreement by and between <strong className="text-charcoal">Bangles by Prakash Duo</strong>, (&ldquo;Website Owner&rdquo; or &ldquo;we&rdquo; or &ldquo;us&rdquo; or &ldquo;our&rdquo;) and you (&ldquo;you&rdquo; or &ldquo;your&rdquo;) and relate to your use of our website, goods (as applicable) or services (as applicable) (collectively, &ldquo;Services&rdquo;).
                </p>
                <p>
                  By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Policy Sections */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gold" />
                  </div>
                  Terms of Use
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p className="font-medium text-charcoal">
                    The use of this website or availing of our Services is subject to the following terms of use:
                  </p>
                  <ul className="space-y-4">
                    {termsPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-xs font-semibold text-gold mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold" />
                  </div>
                  Refund Policy
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the Service. The timelines for such return and refund will be according to the specific Service you have availed or within the time period provided in our policies (as applicable).
                  </p>
                  <div className="p-5 bg-gradient-to-br from-champagne to-ivory rounded-lg border border-gold/10">
                    <p className="text-charcoal font-medium">
                      Important: In case you do not raise a refund claim within the stipulated time, this would make you ineligible for a refund.
                    </p>
                  </div>
                  <Link
                    href="/refund"
                    className="inline-flex items-center gap-2 text-gold font-medium mt-2 hover:text-burgundy transition-colors"
                  >
                    View Full Refund Policy
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-gold" />
                  </div>
                  Force Majeure
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-gold" />
                  </div>
                  Governing Law & Jurisdiction
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed in accordance with the laws of India.
                  </p>
                  <div className="p-5 bg-gradient-to-br from-champagne to-ivory rounded-lg border border-gold/10">
                    <p>
                      All disputes arising out of or in connection with these Terms shall be subject to the <strong className="text-charcoal">exclusive jurisdiction of the courts in Thrissur, Kerala</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  Contact Us
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-gold font-medium mt-2 hover:text-burgundy transition-colors"
                  >
                    Go to Contact Page
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Contact CTA */}
          <AnimatedSection delay={0.35} className="mt-16">
            <div className="relative bg-charcoal p-8 md:p-12 rounded-lg overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-gold/10 rounded-full blur-3xl" />

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  If you have any questions or concerns about these Terms and Conditions, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:prakashduo19@gmail.com"
                    className="group inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-8 py-4 font-semibold hover:bg-rose-gold transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    prakashduo19@gmail.com
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:border-gold hover:text-gold px-8 py-4 font-semibold transition-all"
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
