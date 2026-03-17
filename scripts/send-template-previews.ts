/**
 * Send all email template previews to a specified address.
 *
 * Usage:
 *   npx tsx scripts/send-template-previews.ts [recipient_email]
 *
 * Requires RESEND_API_KEY and EMAIL_FROM_ADDRESS in .env
 */

import 'dotenv/config';
import { Resend } from 'resend';

const RECIPIENT = process.argv[2] || 'ebin.john76@gmail.com';

const resend = new Resend(process.env.RESEND_API_KEY);
const from = `${process.env.EMAIL_FROM_NAME || 'Bangles by Prakash Duo'} <${process.env.EMAIL_FROM_ADDRESS || 'orders@banglesbyprakashduo.store'}>`;

// Mock order data for previews
const mockOrder = {
  id: '1',
  orderId: 'PD-A1B2C3-D4E5F6',
  customer: {
    email: RECIPIENT,
    phone: '+91 98765 43210',
    firstName: 'Priya',
    lastName: 'Sharma',
  },
  shippingAddress: {
    firstName: 'Priya',
    lastName: 'Sharma',
    address: '12, Rose Garden Society',
    apartment: 'Flat 3B, Tower A',
    city: 'Thrissur',
    state: 'Kerala',
    pincode: '680001',
    phone: '+91 98765 43210',
  },
  items: [
    {
      productId: 'antique-golden-bangles',
      name: 'Antique Kada Lakshmi Bangle',
      price: 1299,
      image: '/assets/antique%20golden%20Bangles/antique%20kada%20lakshmi%20bangle/1.webp',
      size: '2.6',
      quantity: 2,
    },
    {
      productId: 'stone-bangles',
      name: 'Ruby Stone Designer Bangle',
      price: 899,
      image: '/assets/antique%20golden%20Bangles/antique%20kada%20lakshmi%20bangle/1.webp',
      size: '2.4',
      quantity: 1,
    },
  ],
  subtotal: 3497,
  shipping: 0,
  tax: 0,
  total: 3497,
  status: 'confirmed' as const,
  paymentStatus: 'paid' as const,
  paymentSessionId: 'order_mock123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Import templates
import { orderConfirmationTemplate, orderConfirmationSubject } from '../src/lib/email/templates/order-confirmation';
import { shippingNotificationTemplate, shippingNotificationSubject } from '../src/lib/email/templates/shipping-notification';
import { deliveryConfirmationTemplate, deliveryConfirmationSubject } from '../src/lib/email/templates/delivery-confirmation';
import { newOrderNotificationTemplate, newOrderNotificationSubject } from '../src/lib/email/templates/new-order-notification';

const templates = [
  {
    name: 'Order Confirmation',
    subject: `[PREVIEW] ${orderConfirmationSubject(mockOrder.orderId)}`,
    html: orderConfirmationTemplate(mockOrder),
  },
  {
    name: 'Shipping Notification',
    subject: `[PREVIEW] ${shippingNotificationSubject(mockOrder.orderId)}`,
    html: shippingNotificationTemplate(mockOrder, {
      carrier: 'DTDC',
      trackingId: 'D12345678',
      estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
    }),
  },
  {
    name: 'Delivery Confirmation',
    subject: `[PREVIEW] ${deliveryConfirmationSubject(mockOrder.orderId)}`,
    html: deliveryConfirmationTemplate(mockOrder),
  },
  {
    name: 'New Order (Owner Notification)',
    subject: `[PREVIEW] ${newOrderNotificationSubject(mockOrder.orderId)}`,
    html: newOrderNotificationTemplate(mockOrder),
  },
];

async function main() {
  console.log(`Sending ${templates.length} template previews to ${RECIPIENT}...\n`);

  for (const tpl of templates) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: RECIPIENT,
        subject: tpl.subject,
        html: tpl.html,
      });

      if (error) {
        console.error(`  ✗ ${tpl.name}: ${error.message}`);
      } else {
        console.log(`  ✓ ${tpl.name} — sent (id: ${data?.id})`);
      }
    } catch (err) {
      console.error(`  ✗ ${tpl.name}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log('\nDone!');
}

main();
