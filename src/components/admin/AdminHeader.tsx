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
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page title */}
            <h1 className="text-lg font-semibold text-gray-900 lg:ml-0 ml-4">
              {getPageTitle()}
            </h1>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
            className="fixed inset-0 bg-gray-900/80"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 overflow-y-auto">
            <div className="flex items-center justify-between h-16 px-6 bg-gray-950">
              <span className="text-xl font-bold text-white">Prakash Duo</span>
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-amber-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
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
