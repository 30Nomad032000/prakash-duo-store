import type { Order } from '@/lib/types';

const SITE_URL = 'https://www.banglesbyprakashduo.store';

// Brand palette
const C = {
  warmIvory: '#F5EFE0',
  deepOchre: '#C8882A',
  rawUmber: '#3D2B1F',
  blushDust: '#EDD9C0',
  crimsonThread: '#A0281A',
  textMuted: '#7A6A5E',
  border: '#E2D9CC',
};

const fontDisplay = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
const fontBody = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const fontMono = "'Courier Prime', 'Courier New', monospace";

export function orderConfirmationTemplate(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid ${C.border};">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="72" style="vertical-align: top; padding-right: 16px;">
                  <img src="${SITE_URL}${item.image}" alt="${item.name}" width="72" height="72" style="display: block; object-fit: cover; border-radius: 4px; border: 1px solid ${C.border};">
                </td>
                <td style="vertical-align: top; font-family: ${fontBody};">
                  <p style="margin: 0; font-weight: 500; color: ${C.rawUmber}; font-size: 15px;">${item.name}</p>
                  <p style="margin: 6px 0 0; color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono}; letter-spacing: 0.03em;">Size: ${item.size} &nbsp;·&nbsp; Qty: ${item.quantity}</p>
                </td>
                <td style="vertical-align: top; text-align: right; white-space: nowrap; font-family: ${fontBody};">
                  <p style="margin: 0; font-weight: 600; color: ${C.rawUmber}; font-size: 15px;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  ${item.quantity > 1 ? `<p style="margin: 4px 0 0; color: ${C.textMuted}; font-size: 12px;">₹${item.price.toLocaleString('en-IN')} each</p>` : ''}
                </td>
              </tr>
            </table>
          </td>
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
  <title>Order Confirmation</title>
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
              <p style="margin: 0 0 16px; color: ${C.deepOchre}; font-family: ${fontMono}; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;">Order Confirmed</p>
              <h1 style="margin: 0; color: ${C.warmIvory}; font-family: ${fontDisplay}; font-size: 28px; font-weight: 600; letter-spacing: -0.01em;">Bangles by Prakash Duo</h1>
              <p style="margin: 12px 0 0; color: ${C.blushDust}; font-family: ${fontBody}; font-size: 14px; opacity: 0.7;">Thank you for your order. We're preparing it with care.</p>
            </td>
          </tr>

          <!-- Ornamental divider -->
          <tr>
            <td style="padding: 0; text-align: center; background-color: ${C.warmIvory};">
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 28px;">
                <tr>
                  <td style="width: 40px; height: 1px; background-color: ${C.border};"></td>
                  <td style="padding: 0 12px; color: ${C.deepOchre}; font-size: 14px; line-height: 1;">✦</td>
                  <td style="width: 40px; height: 1px; background-color: ${C.border};"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body" style="padding: 24px 40px 40px;">

              <!-- Order meta -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${C.blushDust}; border-radius: 4px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 18px 20px; border-bottom: 1px solid ${C.border};">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono}; letter-spacing: 0.05em; text-transform: uppercase;">Order ID</td>
                        <td style="text-align: right; font-weight: 600; font-family: ${fontMono}; color: ${C.rawUmber}; font-size: 14px; letter-spacing: 0.02em;">${order.orderId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono}; letter-spacing: 0.05em; text-transform: uppercase;">Date</td>
                        <td style="text-align: right; color: ${C.rawUmber}; font-size: 14px; font-family: ${fontBody};">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <p style="margin: 0 0 16px; font-family: ${fontDisplay}; font-size: 18px; color: ${C.rawUmber}; font-weight: 600;">Items</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: ${C.textMuted}; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: ${C.rawUmber}; font-size: 14px;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${C.textMuted}; font-size: 14px;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; color: ${order.shipping === 0 ? '#5A8C5A' : C.rawUmber}; font-size: 14px; font-weight: ${order.shipping === 0 ? '500' : '400'};">${order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0;"><div style="height: 1px; background-color: ${C.rawUmber}; margin: 8px 0;"></div></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: ${fontDisplay}; font-size: 20px; font-weight: 700; color: ${C.rawUmber};">Total</td>
                  <td style="padding: 8px 0; text-align: right; font-family: ${fontDisplay}; font-size: 20px; font-weight: 700; color: ${C.rawUmber};">₹${order.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height: 1px; background-color: ${C.border}; margin: 32px 0;"></div>

              <!-- Shipping address -->
              <p style="margin: 0 0 12px; font-family: ${fontDisplay}; font-size: 18px; color: ${C.rawUmber}; font-weight: 600;">Shipping To</p>
              <div style="background-color: ${C.blushDust}; border-radius: 4px; padding: 18px 20px;">
                <p style="margin: 0; font-weight: 500; color: ${C.rawUmber}; font-size: 15px;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
                <p style="margin: 6px 0 0; color: ${C.textMuted}; font-size: 14px; line-height: 1.5;">${order.shippingAddress.address}${order.shippingAddress.apartment ? ', ' + order.shippingAddress.apartment : ''}<br>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
                <p style="margin: 8px 0 0; color: ${C.textMuted}; font-size: 14px;">${order.shippingAddress.phone}</p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin-top: 36px;">
                <a href="${SITE_URL}/track-order?orderId=${order.orderId}" style="display: inline-block; background-color: ${C.crimsonThread}; color: ${C.warmIvory}; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-family: ${fontBody}; font-weight: 500; font-size: 14px; letter-spacing: 0.02em;">
                  Track Your Order →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="background-color: ${C.rawUmber}; padding: 28px 40px; text-align: center;">
              <p style="margin: 0; color: ${C.blushDust}; font-family: ${fontBody}; font-size: 13px; opacity: 0.6;">
                Questions? Write to <a href="mailto:support@banglesbyprakashduo.store" style="color: ${C.deepOchre}; text-decoration: none;">support@banglesbyprakashduo.store</a>
              </p>
              <p style="margin: 12px 0 0; color: ${C.blushDust}; font-family: ${fontMono}; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.4;">
                © ${new Date().getFullYear()} Prakash Duo · Thrissur, Kerala
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
  `Order Confirmed — ${orderId} | Bangles by Prakash Duo`;
