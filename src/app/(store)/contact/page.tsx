"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Clock, Send, Instagram } from "lucide-react";
import PageSeo from '@/components/seo/PageSeo';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const heroRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      lines: ["support@banglesbyprakashduo.store"],
      href: "mailto:support@banglesbyprakashduo.store",
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text entrance
      gsap.from(".contact-hero-text > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      // Contact info cards
      gsap.from(".contact-info-card", {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 80%",
        },
      });

      // Social links
      gsap.from(".social-block", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 60%",
        },
      });

      // Contact form
      gsap.from(".contact-form-block", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-warm-ivory noise-overlay">
      <PageSeo
        title="Contact Us — Prakash Duo Bangles"
        description="Get in touch with Prakash Duo for handcrafted bangles. Call +91 79092 02091 or email us. Based in Thrissur, Kerala."
        canonical="https://banglesbyprakashduo.store/contact"
      />
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-16 md:pb-20 bg-raw-umber overflow-hidden">
        {/* Grain texture */}
        <div className="absolute inset-0 hero-grain pointer-events-none" />
        {/* Decorative blurs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="contact-hero-text relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-6">
            Get in Touch
          </p>

          <h1 className="font-display text-warm-ivory text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Contact <span className="font-drama italic font-normal">Us.</span>
          </h1>

          <p className="font-body text-warm-ivory/70 text-lg max-w-2xl mx-auto">
            Have a question or need assistance? We&apos;re here to help you find the perfect piece.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info Column */}
            <div ref={infoRef}>
              <div className="mb-10">
                <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-3">
                  Reach Out
                </p>
                <h2 className="font-display text-raw-umber text-3xl md:text-4xl font-bold mb-4">
                  Let&apos;s Start a <span className="font-drama italic font-normal">Conversation.</span>
                </h2>
                <p className="font-body text-raw-umber/70 leading-relaxed">
                  Whether you have a question about our bangles, need help with an order,
                  or just want to share your feedback, we&apos;d love to hear from you.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {contactInfo.map((item, i) => {
                  const CardContent = (
                    <>
                      <div className="w-12 h-12 rounded-full bg-deep-ochre/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5 text-deep-ochre" />
                      </div>
                      <h3 className="font-display text-lg text-raw-umber mb-2">
                        {item.title}
                      </h3>
                      {item.lines.map((line, j) => (
                        <p
                          key={j}
                          className="font-body text-raw-umber/60 text-sm group-hover:text-deep-ochre transition-colors"
                        >
                          {line}
                        </p>
                      ))}
                    </>
                  );

                  return item.href ? (
                    <a
                      key={i}
                      href={item.href}
                      className="contact-info-card group block p-6 rounded-3xl bg-warm-ivory border border-raw-umber/10 hover:shadow-luxury transition-all duration-300"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div
                      key={i}
                      className="contact-info-card group p-6 rounded-3xl bg-warm-ivory border border-raw-umber/10 hover:shadow-luxury transition-all duration-300"
                    >
                      {CardContent}
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="social-block mt-10">
                <h3 className="font-display text-xl text-raw-umber mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-12 h-12 rounded-full bg-raw-umber text-warm-ivory flex items-center justify-center hover:bg-deep-ochre transition-colors duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div ref={formRef}>
              <div className="contact-form-block rounded-3xl bg-warm-ivory border border-raw-umber/10 p-8 md:p-10 shadow-luxury relative overflow-hidden">
                <h2 className="font-display text-2xl text-raw-umber mb-6">
                  Send a Message
                </h2>

                {submitted ? (
                  <div className="rounded-2xl bg-blush-dust/30 border border-deep-ochre/20 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-deep-ochre/10 flex items-center justify-center">
                      <Mail className="w-7 h-7 text-deep-ochre" />
                    </div>
                    <h3 className="font-display text-xl text-raw-umber mb-2">
                      Message Sent!
                    </h3>
                    <p className="font-body text-raw-umber/70">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block font-body text-sm font-medium text-raw-umber mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-blush-dust/30 border border-raw-umber/10 rounded-2xl font-body focus:outline-none focus:border-deep-ochre transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block font-body text-sm font-medium text-raw-umber mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-blush-dust/30 border border-raw-umber/10 rounded-2xl font-body focus:outline-none focus:border-deep-ochre transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block font-body text-sm font-medium text-raw-umber mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-blush-dust/30 border border-raw-umber/10 rounded-2xl font-body focus:outline-none focus:border-deep-ochre transition-all"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block font-body text-sm font-medium text-raw-umber mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-blush-dust/30 border border-raw-umber/10 rounded-2xl font-body focus:outline-none focus:border-deep-ochre transition-all resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="group w-full relative overflow-hidden bg-crimson-thread text-warm-ivory py-4 font-body font-semibold rounded-full flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02] press-effect"
                    >
                      <Send className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Send Message</span>
                      <span className="absolute inset-0 bg-deep-ochre translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
