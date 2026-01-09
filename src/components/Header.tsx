"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/categories') return pathname.startsWith('/categories') || pathname.startsWith('/category') || pathname.startsWith('/product');
    if (path === '/collections') return pathname.startsWith('/collections') || pathname.startsWith('/collection');
    return pathname.startsWith(path);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto'
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05
      }
    })
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/assets/logo/Black & White Typography Brightwell Company Logo.png"
                alt="Bangles by Prakash Duo"
                width={180}
                height={40}
                className="h-12 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          <motion.nav 
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className="hidden md:block"
          >
            <div className="ml-10 flex items-baseline space-x-8">
              {['/', '/categories', '/collections', '/about', '/contact'].map((path, i) => {
                const label = path.replace('/', '').charAt(0).toUpperCase() + path.slice(2) || 'Home';
                return (
                  <motion.div key={path} variants={navVariants} custom={i}>
                    <Link
                      href={path}
                      className={`px-3 py-2 text-sm font-medium relative group ${
                        isActive(path) 
                          ? 'text-amber-600' 
                          : 'text-gray-700 hover:text-amber-600'
                      }`}
                    >
                      {label}
                      <motion.span 
                        className={`absolute bottom-0 left-0 h-0.5 bg-amber-600 ${
                          isActive(path) ? 'w-full' : 'w-0'
                        }`}
                        initial={false}
                        animate={{ width: isActive(path) ? '100%' : '0%' }}
                        whileHover={{ width: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      ></motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.nav>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-amber-600 hover:bg-amber-700">
                  2
                </Badge>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-amber-600 transition-colors p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden bg-white border-t border-stone-200 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-4 space-y-2">
              {['/', '/categories', '/collections', '/about', '/contact'].map((path, i) => {
                const label = path.replace('/', '').charAt(0).toUpperCase() + path.slice(2) || 'Home';
                return (
                  <motion.div key={path} custom={i} variants={itemVariants}>
                    <Link
                      href={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium ${
                        isActive(path) 
                          ? 'text-amber-600 bg-amber-50' 
                          : 'text-gray-700 hover:text-amber-600 hover:bg-stone-50'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
