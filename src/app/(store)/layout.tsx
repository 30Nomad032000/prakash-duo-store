'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
