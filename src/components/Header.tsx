"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path === "/categories")
      return (
        pathname.startsWith("/categories") ||
        pathname.startsWith("/category") ||
        pathname.startsWith("/product")
      );
    if (path === "/collections")
      return (
        pathname.startsWith("/collections") ||
        pathname.startsWith("/collection")
      );
    if (path === "/wishlist") return pathname === "/wishlist";
    return pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/categories", label: "Shop" },
    { path: "/collections", label: "Collections" },
    { path: "/best-sellers", label: "Best Sellers" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-gold/5"
          : "bg-transparent"
      }`}
    >
      {/* Decorative top line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center group">
              <Image
                src="/assets/logo/Logo.png"
                alt="Prakash Duo - Bangles"
                width={56}
                height={56}
                className="h-12 lg:h-14 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive(item.path)
                      ? "text-charcoal"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "80%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 text-charcoal/70 hover:text-charcoal transition-colors group"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute inset-0 rounded-full bg-gold/0 group-hover:bg-gold/10 transition-colors" />
            </motion.button>

            <Link href="/wishlist">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 transition-colors group rounded-full ${
                  isActive("/wishlist")
                    ? "text-rose-500 bg-rose-50"
                    : "text-charcoal/70 hover:text-rose-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${wishlistCount > 0 ? "fill-current" : ""}`}
                  strokeWidth={1.5}
                />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
                <span className="absolute inset-0 rounded-full bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors" />
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative ml-2 p-3 bg-charcoal text-white rounded-full group overflow-hidden"
            >
              <ShoppingBag className="w-5 h-5 relative z-10" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-gold to-rose-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Wishlist */}
            <Link href="/wishlist">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 transition-colors rounded-full ${
                  wishlistCount > 0 ? "text-rose-500" : "text-charcoal/70"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${wishlistCount > 0 ? "fill-current" : ""}`}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Mobile Cart */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative p-2 text-charcoal"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? "text-charcoal bg-gradient-to-r from-gold/20 to-rose-gold/10"
                          : "text-charcoal/70 hover:text-charcoal hover:bg-gold/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Wishlist link in mobile menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive("/wishlist")
                        ? "text-rose-500 bg-rose-50"
                        : "text-charcoal/70 hover:text-rose-500 hover:bg-rose-50/50"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${wishlistCount > 0 ? "fill-current" : ""}`}
                    />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-6 border-t border-gold/10 flex items-center justify-center gap-4"
              >
                <button className="p-3 text-charcoal/70 hover:text-charcoal rounded-full hover:bg-gold/10 transition-all">
                  <Search className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
