"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Send, Instagram } from "lucide-react";

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      lines: ["Prakashduo19@gmail.com"],
      href: "mailto:Prakashduo19@gmail.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: ["+91 79092 02091"],
      href: "tel:+917909202091",
    },
    {
      icon: MapPin,
      title: "Location",
      lines: ["Thrissur, Kerala, India"],
      href: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      lines: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"],
      href: null,
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#" },
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
              <Mail className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Get in Touch
              </span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Have a question or need assistance? We&apos;re here to help you find the perfect piece
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <AnimatedSection>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8">
                  Let&apos;s Start a Conversation
                </h2>
                <p className="text-charcoal/70 mb-10 leading-relaxed">
                  Whether you have a question about our bangles, need help with an order,
                  or just want to share your feedback, we&apos;d love to hear from you.
                </p>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group block p-6 bg-white rounded-lg border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <item.icon className="w-5 h-5 text-gold" />
                        </div>
                        <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-charcoal/60 text-sm group-hover:text-gold transition-colors">{line}</p>
                        ))}
                      </a>
                    ) : (
                      <div className="group p-6 bg-white rounded-lg border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/10 to-rose-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <item.icon className="w-5 h-5 text-gold" />
                        </div>
                        <h3 className="font-display text-lg text-charcoal mb-2">{item.title}</h3>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-charcoal/60 text-sm">{line}</p>
                        ))}
                      </div>
                    )}
                  </AnimatedSection>
                ))}
              </div>

              {/* Social Links */}
              <AnimatedSection delay={0.4} className="mt-10">
                <h3 className="font-display text-xl text-charcoal mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center hover:bg-gold transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-8 md:p-10 rounded-lg border border-gold/10 shadow-lg relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold/20" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold/20" />

                <h2 className="font-display text-2xl text-charcoal mb-6">Send a Message</h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-gold/10 to-rose-gold/10 border border-gold/30 rounded-lg p-8 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                      <Mail className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="font-display text-xl text-charcoal mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-charcoal/70">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-ivory border border-gold/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-ivory border border-gold/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-ivory border border-gold/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-ivory border border-gold/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-charcoal text-white py-4 font-semibold rounded-lg hover:bg-burgundy transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </motion.button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </div>
  );
}
