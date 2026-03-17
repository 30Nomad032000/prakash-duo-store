'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Lock, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ShippingForm from './ShippingForm';
import CartSummary, { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/schemas';
import { useHaptics } from '@/hooks/useHaptics';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
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
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const { trigger: haptic } = useHaptics();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setPaymentError('Failed to load payment gateway. Please refresh.');
      document.body.appendChild(script);
    } else if (typeof window !== 'undefined' && window.Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

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
      haptic("error");
      return;
    }

    if (state.items.length === 0) {
      setPaymentError('Your cart is empty');
      return;
    }

    if (!scriptLoaded || typeof window === 'undefined' || !window.Razorpay) {
      setPaymentError('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on server (server validates prices)
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

      const { orderId, razorpayOrderId, keyId, amount, currency, prefill, releaseToken } = orderData.data;

      // Open Razorpay checkout modal
      const razorpayOptions: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: 'Prakash Duo',
        description: `Order ${orderId}`,
        order_id: razorpayOrderId,
        prefill,
        theme: {
          color: '#722F37', // burgundy to match brand
        },
        handler: async (response: RazorpayResponse) => {
          // Payment successful on client — verify on server
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success && verifyData.data?.verified) {
              haptic("success");
              clearCart();
              router.push(`/order-confirmation?order_id=${orderId}`);
            } else {
              setPaymentError(verifyData.error || 'Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          } catch {
            // Even if verification call fails, redirect — webhook will handle it
            clearCart();
            router.push(`/order-confirmation?order_id=${orderId}`);
          }
        },
        modal: {
          ondismiss: () => {
            // Release reserved stock for this abandoned order
            fetch(`/api/orders/${orderId}/release`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ releaseToken }),
            }).catch(() => {});
            setIsProcessing(false);
            setPaymentError('Payment was cancelled. Please try again.');
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);

      razorpay.on('payment.failed', (response: { error: { description: string } }) => {
        haptic("error");
        setIsProcessing(false);
        setPaymentError(response.error.description || 'Payment failed. Please try again.');
      });

      razorpay.open();
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
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
              disabled={isProcessing || state.items.length === 0 || !scriptLoaded}
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
