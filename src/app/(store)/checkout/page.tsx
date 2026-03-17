'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import PageSeo from '@/components/seo/PageSeo';

export default function CheckoutPage() {
  const { state } = useCart();

  return (
    <div className="min-h-screen bg-warm-ivory noise-overlay pt-20">
      <PageSeo
        title="Checkout"
        description="Complete your order — secure checkout powered by Razorpay."
        canonical="https://banglesbyprakashduo.store/checkout"
      />
      {/* Breadcrumb */}
      <section className="py-4 bg-warm-ivory border-b border-raw-umber/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-body">
            <Link href="/" className="text-raw-umber/50 hover:text-deep-ochre transition-colors">Home</Link>
            <span className="text-raw-umber/30">/</span>
            <Link href="/cart" className="text-raw-umber/50 hover:text-deep-ochre transition-colors">Cart</Link>
            <span className="text-raw-umber/30">/</span>
            <span className="text-raw-umber font-medium">Checkout</span>
          </nav>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {state.items.length === 0 ? (
            /* Empty cart — redirect back */
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blush-dust flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-raw-umber/30" />
              </div>
              <h1 className="font-display text-2xl text-raw-umber mb-4">Your cart is empty</h1>
              <p className="text-raw-umber/60 font-body mb-8">Add some items before checking out.</p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-crimson-thread text-warm-ivory px-8 py-4 rounded-full font-body font-medium hover:bg-crimson-thread/90 transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 text-raw-umber/60 hover:text-deep-ochre transition-colors text-sm font-body mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Cart
                </Link>
                <h1 className="font-display text-3xl md:text-4xl text-raw-umber">Checkout</h1>
                <p className="text-raw-umber/50 font-body mt-2">Complete your order details below</p>
              </div>

              {/* Checkout Form with Razorpay */}
              <CheckoutForm />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
