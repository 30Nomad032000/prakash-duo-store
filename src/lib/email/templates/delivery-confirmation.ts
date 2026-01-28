import type { Order } from '@/lib/types';

export function deliveryConfirmationTemplate(order: Order): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Been Delivered!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669, #10B981); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Prakash Duo</h1>
              <p style="margin: 8px 0 0; color: #ffffff; opacity: 0.9;">Delivery Confirmation</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="width: 80px; height: 80px; background-color: #D1FAE5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">🎉</span>
                </div>
                <h2 style="margin: 0; color: #111827; font-size: 24px;">Your order has been delivered!</h2>
                <p style="margin: 12px 0 0; color: #6B7280; font-size: 16px;">
                  We hope you love your new bangles!
                </p>
              </div>

              <!-- Order Details -->
              <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <span style="color: #6B7280;">Order ID</span>
                  <span style="font-weight: 600; font-family: monospace;">${order.orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #6B7280;">Delivered On</span>
                  <span style="font-weight: 500;">${new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}</span>
                </div>
              </div>

              <!-- Thank You Message -->
              <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-radius: 12px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px; color: #92400E; font-size: 18px;">Thank You for Shopping with Us!</h3>
                <p style="margin: 0; color: #92400E; font-size: 14px;">
                  Your support means the world to us. We handcraft each piece with love and care.
                </p>
              </div>

              <!-- Feedback Request -->
              <div style="border: 2px solid #E5E7EB; border-radius: 12px; padding: 24px; text-align: center;">
                <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px;">How was your experience?</h3>
                <p style="margin: 0 0 16px; color: #6B7280; font-size: 14px;">
                  We'd love to hear your feedback! Share your thoughts and help other customers.
                </p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/product/${order.items[0]?.productId}#reviews" style="display: inline-block; background-color: #D97706; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px;">
                  Write a Review
                </a>
              </div>

              <!-- Social Media -->
              <div style="margin-top: 32px; text-align: center;">
                <p style="margin: 0 0 12px; color: #6B7280; font-size: 14px;">
                  Share your styling on social media and tag us!
                </p>
                <p style="margin: 0; color: #D97706; font-weight: 500;">
                  @prakashduo
                </p>
              </div>

              <!-- Shop Again -->
              <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid #eee;">
                <p style="margin: 0 0 16px; color: #6B7280;">
                  Ready for more beautiful bangles?
                </p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/categories" style="display: inline-block; border: 2px solid #D97706; color: #D97706; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px;">
                  Shop New Arrivals
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                Need help? <a href="mailto:support@prakashduo.com" style="color: #059669;">Contact our support team</a>
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

export const deliveryConfirmationSubject = (orderId: string) =>
  `Order ${orderId} Delivered! We'd Love Your Feedback | Prakash Duo`;
