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
  ExternalLink,
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
        <div className="flex flex-col flex-grow bg-raw-umber overflow-y-auto noise-overlay">
          {/* Brand header */}
          <div className="px-6 pt-8 pb-6">
            <Link href="/admin" className="block">
              <span className="font-display text-2xl font-bold text-warm-ivory tracking-tight">
                Prakash<span className="text-deep-ochre">Duo</span>
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-px w-6 bg-deep-ochre/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm-ivory/40">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-gradient-to-r from-deep-ochre/30 via-warm-ivory/10 to-transparent" />

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-3 py-2.5 text-sm font-body font-medium rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-warm-ivory/10 text-deep-ochre'
                      : 'text-warm-ivory/50 hover:bg-warm-ivory/5 hover:text-warm-ivory/80'
                  }`}
                >
                  {/* Active indicator — gold left bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-deep-ochre rounded-r-full" />
                  )}

                  <item.icon className={`w-[18px] h-[18px] mr-3 transition-colors duration-300 ${
                    active ? 'text-deep-ochre' : 'text-warm-ivory/40 group-hover:text-warm-ivory/60'
                  }`} />

                  <span className="relative">
                    {item.name}
                    {/* Subtle underline on active */}
                    {active && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-deep-ochre/30" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 pb-6">
            {/* Divider */}
            <div className="mx-2 mb-4 h-px bg-gradient-to-r from-deep-ochre/20 via-warm-ivory/8 to-transparent" />

            <Link
              href="/"
              target="_blank"
              className="group flex items-center px-3 py-2.5 text-sm font-body font-medium text-warm-ivory/40 hover:text-warm-ivory/70 rounded-xl hover:bg-warm-ivory/5 transition-all duration-300"
            >
              <ExternalLink className="w-[18px] h-[18px] mr-3 text-warm-ivory/30 group-hover:text-deep-ochre/60 transition-colors" />
              View Store
            </Link>

            {/* Tiny brand footer */}
            <div className="mt-6 px-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-warm-ivory/25">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle is handled in AdminHeader */}
    </>
  );
}
