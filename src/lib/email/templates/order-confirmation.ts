import type { Order } from '@/lib/types';

export function orderConfirmationTemplate(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${process.env.NEXT_PUBLIC_BASE_URL}${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
              <div>
                <p style="margin: 0; font-weight: 500;">${item.name}</p>
                <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Size: ${item.size}</p>
              </div>
            </div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D97706, #F59E0B); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Prakash Duo</h1>
              <p style="margin: 8px 0 0; color: #ffffff; opacity: 0.9;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background-color: #D1FAE5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 32px;">✓</span>
                </div>
                <h2 style="margin: 0; color: #111827; font-size: 20px;">Thank you for your order!</h2>
                <p style="margin: 8px 0 0; color: #6B7280;">Your order has been received and is being processed.</p>
              </div>

              <!-- Order Details -->
              <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6B7280;">Order ID</span>
                  <span style="font-weight: 600; font-family: monospace;">${order.orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6B7280;">Order Date</span>
                  <span>${new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}</span>
                </div>
              </div>

              <!-- Items Table -->
              <h3 style="margin: 0 0 16px; color: #111827; font-size: 16px;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #F9FAFB;">
                    <th style="padding: 12px; text-align: left; font-weight: 500; color: #6B7280; font-size: 14px;">Product</th>
                    <th style="padding: 12px; text-align: center; font-weight: 500; color: #6B7280; font-size: 14px;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-weight: 500; color: #6B7280; font-size: 14px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #6B7280;">Subtotal</span>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    ₹${order.subtotal.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #6B7280;">Shipping</span>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    ${order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}
                  </td>
                </tr>
                <tr style="border-top: 2px solid #111827;">
                  <td style="padding: 12px 0;">
                    <span style="font-weight: 600; font-size: 18px;">Total</span>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="font-weight: 600; font-size: 18px;">₹${order.total.toLocaleString('en-IN')}</span>
                  </td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <div style="margin-top: 32px;">
                <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">Shipping Address</h3>
                <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px;">
                  <p style="margin: 0; font-weight: 500;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                  <p style="margin: 4px 0 0; color: #6B7280;">${order.shippingAddress.address}</p>
                  ${order.shippingAddress.apartment ? `<p style="margin: 4px 0 0; color: #6B7280;">${order.shippingAddress.apartment}</p>` : ''}
                  <p style="margin: 4px 0 0; color: #6B7280;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
                  <p style="margin: 8px 0 0; color: #6B7280;">${order.shippingAddress.phone}</p>
                </div>
              </div>

              <!-- Track Order Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order?orderId=${order.orderId}" style="display: inline-block; background-color: #D97706; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500;">
                  Track Your Order
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@prakashduo.com" style="color: #D97706;">support@prakashduo.com</a>
              </p>
              <p style="margin: 12px 0 0; color: #9CA3AF; font-size: 12px;">
                © ${new Date().getFullYear()} Prakash Duo. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export const orderConfirmationSubject = (orderId: string) =>
  `Order Confirmed - ${orderId} | Prakash Duo`;
