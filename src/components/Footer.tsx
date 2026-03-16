"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-raw-umber relative overflow-hidden border-t border-deep-ochre/20">
      {/* Decorative blurs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-deep-ochre/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-crimson-thread/5 rounded-full blur-3xl" />

      {/* Newsletter bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-mono text-deep-ochre text-xs uppercase tracking-[0.2em] mb-2">Stay in the Loop</p>
            <p className="font-body text-warm-ivory/50 text-sm">Subscribe for exclusive offers and new arrivals.</p>
          </div>
          {subscribed ? (
            <p className="font-body text-deep-ochre font-medium">Welcome to the circle!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-72 px-5 py-3 bg-white/5 border border-white/10 text-warm-ivory placeholder-warm-ivory/30 rounded-full font-body text-sm focus:outline-none focus:border-deep-ochre transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-deep-ochre text-raw-umber font-body font-semibold text-sm rounded-full hover:bg-deep-ochre/90 transition-colors press-effect"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/">
              <h3 className="font-display text-3xl text-warm-ivory font-bold">
                Prakash<span className="text-deep-ochre">Duo</span>
              </h3>
            </Link>
            <p className="font-body text-warm-ivory/50 leading-relaxed max-w-sm text-sm">
              Celebrating India&apos;s rich tradition of bangle craftsmanship.
              Each piece is a testament to artisanal excellence and timeless elegance.
            </p>
            <div className="space-y-3 pt-2">
              <a href="tel:+917909202091" className="flex items-center gap-3 font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                <Phone className="w-4 h-4 text-deep-ochre" />
                +91 79092 02091
              </a>
              <a href="mailto:Prakashduo19@gmail.com" className="flex items-center gap-3 font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                <Mail className="w-4 h-4 text-deep-ochre" />
                Prakashduo19@gmail.com
              </a>
              <div className="flex items-center gap-3 font-body text-warm-ivory/50 text-sm">
                <MapPin className="w-4 h-4 text-deep-ochre" />
                Thrissur, Kerala, India
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/bangles_byprakashduo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-warm-ivory/20 flex items-center justify-center text-warm-ivory/50 hover:text-deep-ochre hover:border-deep-ochre transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            <h4 className="font-display text-lg text-deep-ochre mb-6">Shop</h4>
            <ul className="space-y-3">
              {[
                ["New Arrivals", "/categories"],
                ["Best Sellers", "/best-sellers"],
                ["Collections", "/collections"],
                ["All Bangles", "/categories"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-3">
            <h4 className="font-display text-lg text-deep-ochre mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                ["Shipping Policy", "/shipping"],
                ["Refund Policy", "/refund"],
                ["Terms & Conditions", "/terms"],
                ["FAQs", "/faq"],
                ["Track Order", "/track-order"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h4 className="font-display text-lg text-deep-ochre mb-6">Connect</h4>
            <div className="space-y-3">
              <a href="tel:+917909202091" className="block font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                +91 79092 02091
              </a>
              <a href="mailto:Prakashduo19@gmail.com" className="block font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm">
                Prakashduo19@gmail.com
              </a>
              <a
                href="https://www.instagram.com/bangles_byprakashduo"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-warm-ivory/50 hover:text-deep-ochre transition-colors text-sm"
              >
                @bangles_byprakashduo
              </a>
            </div>

            {/* Status indicator */}
            <div className="mt-8 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="font-mono text-warm-ivory/40 text-xs">Crafting with love</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-warm-ivory/30 text-sm text-center md:text-left">
            &copy; 2026 Bangles by Prakash Duo. All rights reserved. Legal: <span className="text-deep-ochre/60">SHILPA PRAKASH</span>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/refund" className="font-body text-warm-ivory/30 hover:text-deep-ochre transition-colors text-sm">Refund Policy</Link>
            <Link href="/terms" className="font-body text-warm-ivory/30 hover:text-deep-ochre transition-colors text-sm">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
