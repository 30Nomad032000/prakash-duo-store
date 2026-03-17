'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft } from 'lucide-react';
import type { Order } from '@/lib/types';

const STORE = {
  name: 'Prakash Duo',
  legal: 'SHILPA PRAKASH',
  address: 'Thrissur, Kerala, India',
  phone: '+91 79092 02091',
  email: 'orders@banglesbyprakashduo.store',
  instagram: '@bangles_byprakashduo',
};

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrder(data.order);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-raw-umber" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-raw-umber/60 mb-4">Order not found</p>
          <Link href={`/admin/orders/${id}`} className="text-deep-ochre hover:underline">
            Back to Order
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Full-screen overlay so admin sidebar/header don't show */}
      <div className="fixed inset-0 z-[100] bg-white overflow-auto print:static print:z-auto">
        {/* Toolbar — hidden when printing */}
        <div className="no-print sticky top-0 bg-warm-ivory border-b border-raw-umber/10 px-6 py-3 flex items-center justify-between z-10">
          <Link
            href={`/admin/orders/${id}`}
            className="inline-flex items-center gap-2 text-raw-umber/70 hover:text-raw-umber text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Order
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 bg-deep-ochre text-white rounded-lg hover:bg-deep-ochre/90 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>

        {/* Invoice Content */}
        <div className="invoice-content max-w-[210mm] mx-auto px-8 py-6 print:px-0 print:py-0 print:max-w-none">

          {/* ============ SHIPPING LABEL ============ */}
          <section className="border-2 border-dashed border-raw-umber/30 rounded-lg p-6 mb-2 print:border-black/40 print:rounded-none">
            <div className="grid grid-cols-2 gap-8">
              {/* FROM */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-raw-umber/40 font-bold mb-1">From</p>
                <p className="font-bold text-sm">{STORE.name}</p>
                <p className="text-xs text-raw-umber/70">{STORE.address}</p>
                <p className="text-xs text-raw-umber/70">{STORE.phone}</p>
              </div>

              {/* TO */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-raw-umber/40 font-bold mb-1">Ship To</p>
                <p className="font-bold text-sm">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-xs text-raw-umber/70">{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && (
                  <p className="text-xs text-raw-umber/70">{order.shippingAddress.apartment}</p>
                )}
                <p className="text-xs text-raw-umber/70">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-2xl font-bold mt-1 tracking-wide">{order.shippingAddress.pincode}</p>
                <p className="text-xs text-raw-umber/70">Ph: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order ref line */}
            <div className="mt-4 pt-3 border-t border-raw-umber/15 flex justify-between items-center">
              <p className="text-xs font-mono font-bold">{order.orderId}</p>
              <p className="text-xs text-raw-umber/50">{orderDate}</p>
              <p className="text-xs font-semibold">
                {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s) &middot; ₹{order.total.toLocaleString('en-IN')}
              </p>
            </div>
          </section>

          {/* Cut line */}
          <div className="flex items-center gap-2 my-4 print:my-2">
            <div className="flex-1 border-t border-dashed border-raw-umber/20" />
            <span className="text-[9px] text-raw-umber/30 uppercase tracking-widest no-print">✂ cut here</span>
            <div className="flex-1 border-t border-dashed border-raw-umber/20" />
          </div>

          {/* ============ INVOICE ============ */}
          <section className="print:mt-2">
            {/* Invoice header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-raw-umber tracking-tight">INVOICE</h1>
                <p className="text-xs text-raw-umber/50 mt-1">{STORE.name} &middot; {STORE.legal}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm">{order.orderId}</p>
                <p className="text-xs text-raw-umber/50 mt-1">{orderDate}</p>
                <p className="text-xs mt-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'PAID' : order.paymentStatus.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-raw-umber/40 font-bold mb-2">Bill To</p>
                <p className="text-sm font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                <p className="text-xs text-raw-umber/60">{order.customer.email}</p>
                <p className="text-xs text-raw-umber/60">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-raw-umber/40 font-bold mb-2">Ship To</p>
                <p className="text-sm font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-xs text-raw-umber/60">{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && (
                  <p className="text-xs text-raw-umber/60">{order.shippingAddress.apartment}</p>
                )}
                <p className="text-xs text-raw-umber/60">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-raw-umber/60">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-y-2 border-raw-umber/20">
                  <th className="py-2 text-left text-[10px] uppercase tracking-wider text-raw-umber/50 font-semibold w-8">#</th>
                  <th className="py-2 text-left text-[10px] uppercase tracking-wider text-raw-umber/50 font-semibold">Item</th>
                  <th className="py-2 text-center text-[10px] uppercase tracking-wider text-raw-umber/50 font-semibold w-16">Size</th>
                  <th className="py-2 text-center text-[10px] uppercase tracking-wider text-raw-umber/50 font-semibold w-12">Qty</th>
                  <th className="py-2 text-right text-[10px] uppercase tracking-wider text-raw-umber/50 font-semibold w-20">Price</th>
                  <th className="py-2 text-right text-[10px] uppercase tracking-wider text-raw-umber/50 font-semibold w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-raw-umber/10">
                    <td className="py-2.5 text-raw-umber/50">{index + 1}</td>
                    <td className="py-2.5 font-medium text-raw-umber">{item.name}</td>
                    <td className="py-2.5 text-center text-raw-umber/60">{item.size}</td>
                    <td className="py-2.5 text-center text-raw-umber/60">{item.quantity}</td>
                    <td className="py-2.5 text-right text-raw-umber/60">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right font-medium text-raw-umber">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-1.5 text-sm">
                  <span className="text-raw-umber/50">Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm">
                  <span className="text-raw-umber/50">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between py-1.5 text-sm">
                    <span className="text-raw-umber/50">Tax</span>
                    <span>₹{order.tax.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-base font-bold border-t-2 border-raw-umber/30 mt-1">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-raw-umber/10 pt-4 flex justify-between items-end">
              <div className="text-xs text-raw-umber/40">
                <p>{STORE.name} &middot; {STORE.address}</p>
                <p>{STORE.phone} &middot; {STORE.email}</p>
              </div>
              <p className="text-xs text-raw-umber/40 italic">Thank you for shopping with Prakash Duo!</p>
            </div>
          </section>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          /* Hide everything outside the invoice */
          body > *:not(.fixed) {
            visibility: hidden;
          }

          /* But the fixed overlay becomes the page content */
          .fixed {
            position: static !important;
            overflow: visible !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-content {
            max-width: none !important;
            padding: 0 !important;
          }

          /* Ensure crisp printing */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </>
  );
}
