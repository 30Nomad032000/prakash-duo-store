import type { Order } from '@/lib/types';

const SITE_URL = 'https://www.banglesbyprakashduo.store';

const C = {
  warmIvory: '#F5EFE0',
  deepOchre: '#C8882A',
  rawUmber: '#3D2B1F',
  blushDust: '#EDD9C0',
  crimsonThread: '#A0281A',
  textMuted: '#7A6A5E',
  border: '#E2D9CC',
  successGreen: '#2D6A4F',
  successBg: '#E8F5E9',
};

const fontDisplay = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
const fontBody = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const fontMono = "'Courier Prime', 'Courier New', monospace";

export function newOrderNotificationTemplate(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item, i) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${C.border}; color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono};">${i + 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${C.border}; color: ${C.rawUmber}; font-size: 14px;">${item.name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${C.border}; text-align: center; color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono};">${item.size}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${C.border}; text-align: center; color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono};">${item.quantity}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${C.border}; text-align: right; color: ${C.rawUmber}; font-size: 14px; font-weight: 500;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .email-body { padding: 28px 20px !important; }
      .header-pad { padding: 32px 20px !important; }
      .footer-pad { padding: 24px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${C.blushDust}; font-family: ${fontBody}; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${C.blushDust}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: ${C.warmIvory}; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 3px rgba(61,43,31,0.08);">

          <!-- Header -->
          <tr>
            <td class="header-pad" style="background-color: ${C.rawUmber}; padding: 40px 40px 36px; text-align: center;">
              <p style="margin: 0 0 16px; color: ${C.deepOchre}; font-family: ${fontMono}; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;">New Order</p>
              <h1 style="margin: 0; color: ${C.warmIvory}; font-family: ${fontDisplay}; font-size: 32px; font-weight: 700;">₹${order.total.toLocaleString('en-IN')}</h1>
              <p style="margin: 10px 0 0; color: ${C.blushDust}; font-family: ${fontMono}; font-size: 13px; opacity: 0.7; letter-spacing: 0.03em;">${order.orderId}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body" style="padding: 32px 40px 40px;">

              <!-- Payment badge -->
              <div style="text-align: center; margin-bottom: 28px;">
                <span style="display: inline-block; background-color: ${C.successBg}; color: ${C.successGreen}; font-family: ${fontMono}; font-size: 12px; font-weight: 600; padding: 8px 20px; border-radius: 50px; letter-spacing: 0.03em;">
                  ${order.paymentStatus === 'paid' ? '✓ Paid via Razorpay' : order.paymentStatus.toUpperCase()}
                </span>
              </div>

              <!-- Order meta -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${C.blushDust}; border-radius: 4px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align: top;">
                          <p style="margin: 0; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.1em; text-transform: uppercase;">Customer</p>
                          <p style="margin: 6px 0 0; font-weight: 500; color: ${C.rawUmber}; font-size: 15px;">${order.customer.firstName} ${order.customer.lastName}</p>
                          <p style="margin: 4px 0 0; color: ${C.textMuted}; font-size: 13px;">${order.customer.email}</p>
                          <p style="margin: 2px 0 0; color: ${C.textMuted}; font-size: 13px;">${order.customer.phone}</p>
                        </td>
                        <td style="vertical-align: top; text-align: right;">
                          <p style="margin: 0; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.1em; text-transform: uppercase;">Date</p>
                          <p style="margin: 6px 0 0; color: ${C.rawUmber}; font-size: 14px;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          <p style="margin: 2px 0 0; color: ${C.textMuted}; font-size: 13px;">${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Ship to -->
              <p style="margin: 0 0 10px; font-family: ${fontDisplay}; font-size: 18px; color: ${C.rawUmber}; font-weight: 600;">Ship To</p>
              <div style="background-color: ${C.blushDust}; border-radius: 4px; padding: 18px 20px; margin-bottom: 28px;">
                <p style="margin: 0; font-weight: 500; color: ${C.rawUmber}; font-size: 15px;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                <p style="margin: 6px 0 0; color: ${C.textMuted}; font-size: 14px; line-height: 1.5;">
                  ${order.shippingAddress.address}${order.shippingAddress.apartment ? ', ' + order.shippingAddress.apartment : ''}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}
                </p>
                <p style="margin: 8px 0 0; color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono};">Ph: ${order.shippingAddress.phone}</p>
              </div>

              <!-- Items -->
              <p style="margin: 0 0 12px; font-family: ${fontDisplay}; font-size: 18px; color: ${C.rawUmber}; font-weight: 600;">Items</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid ${C.border}; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
                <thead>
                  <tr style="background-color: ${C.blushDust};">
                    <th style="padding: 10px 12px; text-align: left; font-weight: 500; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.08em; text-transform: uppercase;">#</th>
                    <th style="padding: 10px 12px; text-align: left; font-weight: 500; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.08em; text-transform: uppercase;">Product</th>
                    <th style="padding: 10px 12px; text-align: center; font-weight: 500; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.08em; text-transform: uppercase;">Size</th>
                    <th style="padding: 10px 12px; text-align: center; font-weight: 500; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.08em; text-transform: uppercase;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; font-weight: 500; color: ${C.textMuted}; font-size: 11px; font-family: ${fontMono}; letter-spacing: 0.08em; text-transform: uppercase;">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 6px 0; color: ${C.textMuted}; font-size: 14px;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; font-size: 14px; color: ${C.rawUmber};">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: ${C.textMuted}; font-size: 14px;">Shipping</td>
                  <td style="padding: 6px 0; text-align: right; font-size: 14px; color: ${C.rawUmber};">${order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0;"><div style="height: 2px; background-color: ${C.rawUmber}; margin: 8px 0;"></div></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: ${fontDisplay}; font-size: 22px; font-weight: 700; color: ${C.rawUmber};">Total</td>
                  <td style="padding: 8px 0; text-align: right; font-family: ${fontDisplay}; font-size: 22px; font-weight: 700; color: ${C.successGreen};">₹${order.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <!-- Admin CTA -->
              <div style="text-align: center;">
                <a href="${SITE_URL}/admin/orders/${order.orderId}" style="display: inline-block; background-color: ${C.deepOchre}; color: ${C.rawUmber}; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-family: ${fontBody}; font-weight: 600; font-size: 14px;">
                  View in Admin →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="background-color: ${C.rawUmber}; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: ${C.blushDust}; font-family: ${fontMono}; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.4;">
                Automated notification · Bangles by Prakash Duo
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
  `New Order ${orderId} | Bangles by Prakash Duo`;
