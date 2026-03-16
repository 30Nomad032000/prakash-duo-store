import type { Order } from '@/lib/types';

export function newOrderNotificationTemplate(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item, i) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #374151; font-size: 14px;">${i + 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #374151; font-size: 14px;">${item.name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: center; color: #374151; font-size: 14px;">${item.size}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: center; color: #374151; font-size: 14px;">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: right; color: #374151; font-size: 14px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `
    )
    .join('');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669, #10B981); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">New Order Received!</h1>
              <p style="margin: 8px 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">₹${order.total.toLocaleString('en-IN')}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- Order Summary -->
              <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="color: #6B7280; font-size: 14px;">Order ID</span><br>
                      <span style="font-weight: 600; font-family: monospace; font-size: 16px;">${order.orderId}</span>
                    </td>
                    <td style="text-align: right;">
                      <span style="color: #6B7280; font-size: 14px;">Date</span><br>
                      <span style="font-weight: 500;">${new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Customer Info -->
              <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">Customer Details</h3>
              <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-weight: 500; color: #111827;">${order.customer.firstName} ${order.customer.lastName}</p>
                <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${order.customer.email}</p>
                <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${order.customer.phone}</p>
              </div>

              <!-- Shipping Address -->
              <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">Ship To</h3>
              <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-weight: 500; color: #111827;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${order.shippingAddress.address}</p>
                ${order.shippingAddress.apartment ? `<p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${order.shippingAddress.apartment}</p>` : ''}
                <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
                <p style="margin: 8px 0 0; color: #6B7280; font-size: 14px;">Phone: ${order.shippingAddress.phone}</p>
              </div>

              <!-- Items Table -->
              <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">Items Ordered</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
                <thead>
                  <tr style="background-color: #F9FAFB;">
                    <th style="padding: 10px 12px; text-align: left; font-weight: 500; color: #6B7280; font-size: 13px;">#</th>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 500; color: #6B7280; font-size: 13px;">Product</th>
                    <th style="padding: 10px 12px; text-align: center; font-weight: 500; color: #6B7280; font-size: 13px;">Size</th>
                    <th style="padding: 10px 12px; text-align: center; font-weight: 500; color: #6B7280; font-size: 13px;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; font-weight: 500; color: #6B7280; font-size: 13px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; font-size: 14px;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Shipping</td>
                  <td style="padding: 6px 0; text-align: right; font-size: 14px;">${order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</td>
                </tr>
                <tr style="border-top: 2px solid #111827;">
                  <td style="padding: 12px 0; font-weight: 700; font-size: 18px; color: #111827;">Total</td>
                  <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 18px; color: #059669;">₹${order.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <!-- Payment Status -->
              <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
                <span style="color: #059669; font-weight: 600;">Payment: ${order.paymentStatus === 'paid' ? 'Paid via Razorpay ✓' : order.paymentStatus.toUpperCase()}</span>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="${baseUrl}/admin/orders/${order.orderId}" style="display: inline-block; background-color: #C8882A; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500;">
                  View Order in Admin
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                This is an automated notification from Prakash Duo order system.
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

export const newOrderNotificationSubject = (orderId: string) =>
  `💰 New Order ${orderId} — ₹ Received | Prakash Duo`;
