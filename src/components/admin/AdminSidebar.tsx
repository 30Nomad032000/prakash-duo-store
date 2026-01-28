'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  FolderTree,
  Mail,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Emails', href: '/admin/emails', icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 bg-gray-950">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Prakash Duo</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
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

          {/* Store link */}
          <div className="px-3 py-4 border-t border-gray-800">
            <Link
              href="/"
              target="_blank"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              View Store
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle is handled in AdminHeader */}
    </>
  );
}
