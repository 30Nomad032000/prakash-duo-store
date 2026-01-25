import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prakash Duo - Elegant Bangles for Every Occasion",
  description: "Discover our exquisite collection of handcrafted bangles. From traditional designs to modern elegance, find the perfect piece for you. Handmade in Thrissur, Kerala.",
  keywords: ["bangles", "indian jewelry", "bridal bangles", "traditional bangles", "handcrafted jewelry", "kerala bangles", "thrissur", "prakash duo"],
  authors: [{ name: "Prakash Duo" }],
  creator: "Prakash Duo",
  icons: {
    icon: "/assets/logo/Logo.png",
    apple: "/assets/logo/Logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://prakashduo.com",
    siteName: "Prakash Duo",
    title: "Prakash Duo - Elegant Handcrafted Bangles",
    description: "Discover our exquisite collection of handcrafted bangles. Traditional designs with modern elegance, handmade in Kerala, India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prakash Duo - Elegant Handcrafted Bangles",
    description: "Discover our exquisite collection of handcrafted bangles. Traditional designs with modern elegance.",
    creator: "@prakashduo",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
