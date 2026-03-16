'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  FolderTree,
  Mail,
  ChevronDown,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Emails', href: '/admin/emails', icon: Mail },
];

export default function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.replace('/admin', '').replace(/^\//, '');
    if (!path) return 'Dashboard';

    const parts = path.split('/');
    const mainSection = parts[0];

    const titles: Record<string, string> = {
      orders: 'Orders',
      products: 'Products',
      inventory: 'Inventory',
      categories: 'Categories',
      emails: 'Email Logs',
    };

    return titles[mainSection] || 'Dashboard';
  };

  return (
    <>
      <header className="bg-warm-ivory border-b border-gold/10 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-charcoal/60 hover:bg-charcoal/5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page title */}
            <h1 className="text-lg font-semibold text-charcoal font-display lg:ml-0 ml-4">
              {getPageTitle()}
            </h1>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-charcoal/5 transition"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 bg-deep-ochre/15 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-deep-ochre" />
                </div>
                <ChevronDown className="w-4 h-4 text-charcoal/50" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-raw-umber/10 z-50 overflow-hidden">
                    <div className="p-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-raw-umber/80"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-raw-umber overflow-y-auto noise-overlay">
            {/* Brand header */}
            <div className="flex items-center justify-between px-6 pt-8 pb-6">
              <div>
                <span className="font-display text-2xl font-bold text-warm-ivory tracking-tight">
                  Prakash<span className="text-deep-ochre">Duo</span>
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px w-6 bg-deep-ochre/40" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-ivory/40">
                    Admin
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-xl text-warm-ivory/50 hover:text-warm-ivory hover:bg-warm-ivory/5 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mx-6 h-px bg-gradient-to-r from-deep-ochre/30 via-warm-ivory/10 to-transparent" />

            <nav className="px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative flex items-center px-3 py-2.5 text-sm font-body font-medium rounded-xl transition-all duration-300 ${
                      active
                        ? 'bg-warm-ivory/10 text-deep-ochre'
                        : 'text-warm-ivory/50 hover:bg-warm-ivory/5 hover:text-warm-ivory/80'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-deep-ochre rounded-r-full" />
                    )}
                    <item.icon className={`w-[18px] h-[18px] mr-3 transition-colors duration-300 ${
                      active ? 'text-deep-ochre' : 'text-warm-ivory/40 group-hover:text-warm-ivory/60'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
