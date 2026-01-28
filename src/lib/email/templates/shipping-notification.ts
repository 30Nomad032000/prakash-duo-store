import type { Order } from '@/lib/types';

interface TrackingInfo {
  carrier: string;
  trackingId: string;
  estimatedDelivery?: string;
}

export function shippingNotificationTemplate(
  order: Order,
  tracking: TrackingInfo
): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${process.env.NEXT_PUBLIC_BASE_URL}${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
              <div>
                <p style="margin: 0; font-weight: 500; font-size: 14px;">${item.name}</p>
                <p style="margin: 4px 0 0; color: #666; font-size: 12px;">Size: ${item.size} | Qty: ${item.quantity}</p>
              </div>
            </div>
          </td>
        </tr>
      `
    )
    .join('');

  const estimatedDeliveryHtml = tracking.estimatedDelivery
    ? `
      <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
        <span style="color: #6B7280;">Estimated Delivery</span>
        <span style="font-weight: 500;">${new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })}</span>
      </div>
    `
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Prakash Duo</h1>
              <p style="margin: 8px 0 0; color: #ffffff; opacity: 0.9;">Shipping Update</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 64px; height: 64px; background-color: #EEF2FF; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 32px;">📦</span>
                </div>
                <h2 style="margin: 0; color: #111827; font-size: 20px;">Your order is on its way!</h2>
                <p style="margin: 8px 0 0; color: #6B7280;">We've handed your package to ${tracking.carrier}.</p>
              </div>

              <!-- Tracking Info -->
              <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6B7280;">Order ID</span>
                  <span style="font-weight: 600; font-family: monospace;">${order.orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6B7280;">Carrier</span>
                  <span style="font-weight: 500;">${tracking.carrier}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6B7280;">Tracking Number</span>
                  <span style="font-weight: 600; font-family: monospace; color: #4F46E5;">${tracking.trackingId}</span>
                </div>
                ${estimatedDeliveryHtml}
              </div>

              <!-- Track Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${tracking.trackingId}" target="_blank" style="display: inline-block; background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500;">
                  Track on ${tracking.carrier} Website
                </a>
              </div>

              <!-- Items Summary -->
              <h3 style="margin: 0 0 16px; color: #111827; font-size: 16px;">Items in this shipment</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Shipping Address -->
              <div style="margin-top: 24px;">
                <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">Delivering to</h3>
                <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px;">
                  <p style="margin: 0; font-weight: 500;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                  <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">
                    ${order.shippingAddress.address}${order.shippingAddress.apartment ? ', ' + order.shippingAddress.apartment : ''}<br>
                    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              <!-- Help Section -->
              <div style="margin-top: 32px; padding: 20px; background-color: #FEF3C7; border-radius: 8px;">
                <h4 style="margin: 0 0 8px; color: #92400E; font-size: 14px;">💡 Delivery Tips</h4>
                <ul style="margin: 0; padding-left: 20px; color: #92400E; font-size: 14px;">
                  <li>Keep your phone nearby for delivery updates</li>
                  <li>Ensure someone is available to receive the package</li>
                  <li>Check the package for any damage before accepting</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                Questions about your delivery? <a href="mailto:support@prakashduo.com" style="color: #4F46E5;">Contact us</a>
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

export const shippingNotificationSubject = (orderId: string) =>
  `Your Order ${orderId} Has Shipped! | Prakash Duo`;
