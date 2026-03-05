import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, DM_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-drama",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bangles by Prakash Duo | Handcrafted Bangles from Thrissur, Kerala",
  description: "Celebrating India's rich tradition of bangle craftsmanship. Each piece is a testament to artisanal excellence and timeless elegance. Handmade in Thrissur, Kerala.",
  keywords: ["bangles", "indian jewelry", "bridal bangles", "traditional bangles", "handcrafted jewelry", "kerala bangles", "thrissur", "prakash duo", "AD stone bangles", "antique golden bangles"],
  authors: [{ name: "Prakash Duo" }],
  creator: "Prakash Duo",
  icons: {
    icon: "/assets/logo/Logo.png",
    apple: "/assets/logo/Logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://banglesbyprakashduo.store",
    siteName: "Bangles by Prakash Duo",
    title: "Bangles by Prakash Duo | Handcrafted Artisan Bangles",
    description: "Handcrafted bangles from the heart of Thrissur — born from tradition, worn for a lifetime.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bangles by Prakash Duo | Handcrafted Artisan Bangles",
    description: "Handcrafted bangles from the heart of Thrissur — born from tradition, worn for a lifetime.",
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
        className={`${cormorant.variable} ${playfair.variable} ${dmSans.variable} ${courierPrime.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Global noise/grain overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
          <svg className="w-full h-full opacity-[0.035]">
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
        </div>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
