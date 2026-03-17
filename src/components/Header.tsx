"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useHaptics } from "@/hooks/useHaptics";

// Pages that have a dark hero section extending behind the navbar
const DARK_HERO_PAGES = [
  "/categories",
  "/best-sellers",
  "/about",
  "/contact",
  "/faq",
  "/wishlist",
  "/shipping",
  "/refund",
  "/privacy",
  "/terms",
  "/track-order",
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { trigger: haptic } = useHaptics();

  const hasDarkHero =
    DARK_HERO_PAGES.includes(pathname) ||
    pathname.startsWith("/category/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // When not scrolled on a dark hero page, use light text on transparent bg
  const isTransparent = hasDarkHero && !scrolled;

  const navLinks = [
    { label: "Collections", href: "/categories" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/categories")
      return pathname.startsWith("/categories") || pathname.startsWith("/category") || pathname.startsWith("/product");
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav
        className={`
          w-full max-w-5xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-700
          ${isTransparent
            ? "bg-raw-umber/40 backdrop-blur-lg border border-warm-ivory/10 shadow-[0_2px_20px_rgba(61,43,31,0.15)]"
            : "bg-warm-ivory/80 backdrop-blur-xl border border-raw-umber/10 shadow-luxury"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className={`font-display text-2xl font-bold tracking-tight transition-colors duration-500 ${
            isTransparent ? "text-warm-ivory" : "text-raw-umber"
          }`}>
            Prakash<span className="text-deep-ochre">Duo</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-body font-medium tracking-wide rounded-full transition-all duration-300 ${
                isActive(link.href)
                  ? isTransparent
                    ? "bg-white/15 text-warm-ivory"
                    : "bg-deep-ochre/15 text-raw-umber"
                  : isTransparent
                    ? "text-warm-ivory/80 hover:text-warm-ivory hover:bg-white/10"
                    : "text-raw-umber/60 hover:text-raw-umber hover:bg-deep-ochre/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className={`relative p-2 rounded-full transition-colors ${
              isTransparent ? "text-warm-ivory/70 hover:text-warm-ivory" : "text-raw-umber/60 hover:text-raw-umber"
            }`}
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-current text-crimson-thread" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-crimson-thread text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => { haptic("nudge"); openCart(); }}
            className={`relative p-2 rounded-full transition-colors ${
              isTransparent ? "text-warm-ivory/70 hover:text-warm-ivory" : "text-raw-umber/60 hover:text-raw-umber"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-deep-ochre text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* CTA Desktop */}
          <Link
            href="/categories"
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-crimson-thread text-warm-ivory text-sm font-body font-medium rounded-full hover:bg-crimson-thread/90 transition-all duration-300 press-effect"
          >
            Browse Collections
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => { haptic("nudge"); setMobileOpen(!mobileOpen); }}
            className={`lg:hidden p-2 rounded-full transition-colors ${
              isTransparent ? "text-warm-ivory" : "text-raw-umber"
            }`}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[7px]" : ""
              } ${isTransparent ? "bg-warm-ivory" : "bg-raw-umber"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              } ${isTransparent ? "bg-warm-ivory" : "bg-raw-umber"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
              } ${isTransparent ? "bg-warm-ivory" : "bg-raw-umber"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 mx-4 bg-warm-ivory/95 backdrop-blur-xl rounded-3xl border border-raw-umber/10 shadow-luxury-lg p-6 z-40"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 font-body font-medium rounded-2xl transition-colors ${
                    isActive(link.href)
                      ? "text-raw-umber bg-deep-ochre/15"
                      : "text-raw-umber hover:bg-deep-ochre/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 font-body font-medium rounded-2xl text-raw-umber hover:bg-deep-ochre/10 transition-colors"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-current text-crimson-thread" : ""}`} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-crimson-thread text-warm-ivory text-xs font-bold rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 bg-crimson-thread text-warm-ivory font-body font-medium rounded-2xl text-center mt-4"
              >
                Browse Collections
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
