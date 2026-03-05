'use client';

import CartDrawer from "@/components/cart/CartDrawer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
