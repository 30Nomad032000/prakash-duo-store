'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Package, Truck, Globe, Clock, Sparkles, ArrowRight, MapPin } from 'lucide-react';

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

export default function ShippingPage() {
  const highlights = [
    {
      icon: Package,
      title: "Free Shipping",
      desc: "On orders above ₹999 within India"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "5-7 business days for domestic orders"
    },
    {
      icon: Globe,
      title: "International",
      desc: "We ship to most countries worldwide"
    },
    {
      icon: Clock,
      title: "Order Tracking",
      desc: "Real-time tracking for all orders"
    },
  ];

  const internationalRates = [
    { region: "USA & Canada", time: "10-14 business days", price: "₹1,999" },
    { region: "UK & Europe", time: "10-14 business days", price: "₹1,799" },
    { region: "Australia & New Zealand", time: "12-16 business days", price: "₹2,199" },
    { region: "Other Countries", time: "14-21 business days", price: "₹2,499" },
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
              <Truck className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Delivery Information
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Shipping <span className="gradient-text">Policy</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Everything you need to know about our shipping process
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

          {/* Policy Sections */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-gold" />
                  </div>
                  Domestic Shipping (Within India)
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    We offer free standard shipping on all orders above ₹999 within India. For orders below ₹999, a nominal shipping fee of ₹49 will be applied.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 bg-gradient-to-br from-champagne to-ivory rounded-lg border border-gold/10">
                      <h4 className="font-display text-charcoal mb-3">Standard Shipping</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold" />
                          5-7 business days
                        </li>
                        <li className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gold" />
                          Free on orders above ₹999
                        </li>
                        <li className="text-charcoal/50 pl-6">₹49 for orders below ₹999</li>
                      </ul>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-champagne to-ivory rounded-lg border border-gold/10">
                      <h4 className="font-display text-charcoal mb-3">Express Shipping</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold" />
                          2-3 business days
                        </li>
                        <li className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gold" />
                          ₹99 additional charge
                        </li>
                        <li className="text-charcoal/50 pl-6">Available for metro cities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gold" />
                  </div>
                  International Shipping
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    We ship to most countries worldwide. International shipping rates are calculated at checkout based on the destination and package weight.
                  </p>
                  <div className="overflow-x-auto mt-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gold/20">
                          <th className="text-left py-4 px-4 font-display text-charcoal">Region</th>
                          <th className="text-left py-4 px-4 font-display text-charcoal">Delivery Time</th>
                          <th className="text-left py-4 px-4 font-display text-charcoal">Starting Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {internationalRates.map((rate, i) => (
                          <tr key={i} className="border-b border-gold/10 hover:bg-champagne/30 transition-colors">
                            <td className="py-4 px-4 text-charcoal">{rate.region}</td>
                            <td className="py-4 px-4 text-charcoal/70">{rate.time}</td>
                            <td className="py-4 px-4 font-semibold text-gold">{rate.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-charcoal/50 mt-4 p-4 bg-champagne rounded-lg">
                    * Customs duties and taxes may apply for international orders and are the responsibility of the recipient.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gold" />
                  </div>
                  Order Processing Time
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    Orders are typically processed within 1-2 business days. During peak seasons (festivals, weddings, holidays), processing time may extend to 3-4 business days. You will receive a shipping confirmation email with tracking information once your order has been dispatched.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  Tracking Your Order
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    Once your order is shipped, you will receive an email with your tracking number. You can track your order on our website using the &ldquo;Track Order&rdquo; page or by visiting the courier partner&apos;s website with your tracking number.
                  </p>
                  <p>
                    For any issues with tracking or delayed delivery, please contact our customer support team at support@prakashduo.com or call us at +91 XXXXX XXXXX.
                  </p>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center gap-2 text-gold font-medium mt-2 hover:text-burgundy transition-colors"
                  >
                    Track Your Order
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gold" />
                  </div>
                  Packaging
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    All orders are carefully packaged to ensure they reach you in perfect condition. We use high-quality packaging materials to protect your bangles during transit. Each order includes:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {[
                      "Protective bubble wrap or foam padding",
                      "Sturdy cardboard box",
                      "Elegant gift packaging (optional)",
                      "Invoice and order details",
                      "Return instructions (if applicable)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.35}>
              <div className="bg-white rounded-lg p-8 border border-gold/10">
                <h2 className="font-display text-2xl text-charcoal mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  Delivery Address
                </h2>
                <div className="space-y-4 text-charcoal/70">
                  <p>
                    Please ensure you provide a complete and accurate delivery address. We are not responsible for orders delivered to incorrect addresses provided by the customer. For any address changes after order placement, please contact us within 24 hours.
                  </p>
                  <p>
                    If you&apos;re not available at the delivery address, the courier will attempt delivery 2-3 times. After failed delivery attempts, the package will be returned to our warehouse, and return shipping charges will apply.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Contact CTA */}
          <AnimatedSection delay={0.4} className="mt-16">
            <div className="relative bg-charcoal p-8 md:p-12 rounded-lg overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-gold/10 rounded-full blur-3xl" />

              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                  <Truck className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-4">
                  Questions About Shipping?
                </h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Our customer support team is here to help with any shipping-related queries.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 bg-gold text-charcoal px-8 py-4 font-semibold hover:bg-rose-gold transition-colors"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:border-gold hover:text-gold px-8 py-4 font-semibold transition-all"
                  >
                    Track Order
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
