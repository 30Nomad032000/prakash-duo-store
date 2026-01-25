'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ShippingForm from './ShippingForm';
import CartSummary, { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/schemas';

declare global {
  interface Window {
    Cashfree?: {
      PGComponent?: {
        new (options: { paymentSessionId: string; environment: string }): {
          init: () => void;
          destroy: () => void;
        };
      };
      checkout: (options: {
        paymentSessionId: string;
        returnUrl?: string;
        redirectTarget?: '_self' | '_blank' | '_modal';
      }) => Promise<{ error?: { message: string } }>;
    };
  }
}

const initialFormData: CheckoutFormData = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  pincode: '',
};

export default function CheckoutForm() {
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const result = checkoutFormSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!validateForm()) {
      return;
    }

    if (state.items.length === 0) {
      setPaymentError('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on server
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            email: formData.email,
            phone: formData.phone,
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            apartment: formData.apartment || undefined,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
          items: state.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const { paymentSessionId, orderId } = orderData.data;

      // Load Cashfree SDK and initiate payment
      if (typeof window !== 'undefined' && window.Cashfree) {
        const cashfree = window.Cashfree;
        const checkoutOptions = {
          paymentSessionId,
          returnUrl: `${window.location.origin}/order-confirmation?order_id=${orderId}`,
          redirectTarget: '_self' as const,
        };

        const result = await cashfree.checkout(checkoutOptions);

        if (result?.error) {
          throw new Error(result.error.message);
        }
      } else {
        // Fallback: redirect to order confirmation for testing without Cashfree
        clearCart();
        router.push(`/order-confirmation?order_id=${orderId}&test=true`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Form */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <ShippingForm
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-medium text-charcoal mb-6">Order Summary</h3>
        <CartSummary showShipping={true} />

        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{paymentError}</p>
          </motion.div>
        )}

        <div className="mt-6 pt-6 border-t border-stone-200 space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isProcessing || state.items.length === 0}
              className="w-full bg-burgundy hover:bg-burgundy/90 text-white py-4 rounded-full font-medium disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Pay ₹{total.toLocaleString()}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </motion.div>

          <p className="text-xs text-center text-charcoal/50">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </form>
  );
}
