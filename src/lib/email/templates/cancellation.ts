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
};

const fontDisplay = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
const fontBody = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const fontMono = "'Courier Prime', 'Courier New', monospace";

export function cancellationTemplate(order: Order, reason: string): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${C.border};">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align: middle; font-family: ${fontBody};">
                  <p style="margin: 0; font-weight: 500; color: ${C.rawUmber}; font-size: 14px;">${item.name}</p>
                  <p style="margin: 4px 0 0; color: ${C.textMuted}; font-size: 12px; font-family: ${fontMono};">Size: ${item.size} · Qty: ${item.quantity}</p>
                </td>
                <td style="vertical-align: middle; text-align: right; font-family: ${fontBody};">
                  <p style="margin: 0; color: ${C.textMuted}; font-size: 14px; text-decoration: line-through;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
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
  <title>Order Cancelled</title>
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
              <p style="margin: 0 0 16px; color: ${C.crimsonThread}; font-family: ${fontMono}; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;">Order Cancelled</p>
              <h1 style="margin: 0; color: ${C.warmIvory}; font-family: ${fontDisplay}; font-size: 26px; font-weight: 600;">Your order has been cancelled</h1>
              <p style="margin: 12px 0 0; color: ${C.blushDust}; font-family: ${fontBody}; font-size: 14px; opacity: 0.7;">We're sorry about this. Here are the details.</p>
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
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${C.blushDust}; border-radius: 4px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px; border-bottom: 1px solid ${C.border};">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono}; letter-spacing: 0.05em; text-transform: uppercase;">Order</td>
                        <td style="text-align: right; font-weight: 600; font-family: ${fontMono}; color: ${C.rawUmber}; font-size: 14px;">${order.orderId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color: ${C.textMuted}; font-size: 13px; font-family: ${fontMono}; letter-spacing: 0.05em; text-transform: uppercase;">Status</td>
                        <td style="text-align: right; font-weight: 600; color: ${C.crimsonThread}; font-size: 14px;">Cancelled</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Reason -->
              <div style="border-left: 3px solid ${C.crimsonThread}; padding: 16px 20px; background-color: #FEF2F2; border-radius: 0 4px 4px 0; margin-bottom: 28px;">
                <p style="margin: 0 0 6px; font-family: ${fontMono}; font-size: 11px; color: ${C.crimsonThread}; letter-spacing: 0.08em; text-transform: uppercase;">Reason for Cancellation</p>
                <p style="margin: 0; color: ${C.rawUmber}; font-size: 14px; line-height: 1.6;">${reason}</p>
              </div>

              <!-- Items -->
              <p style="margin: 0 0 16px; font-family: ${fontDisplay}; font-size: 18px; color: ${C.rawUmber}; font-weight: 600;">Cancelled Items</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>

              <!-- Refund note -->
              ${order.paymentStatus === 'paid' ? `
              <div style="margin-top: 28px; padding: 20px; background-color: #F0FDF4; border-radius: 4px; border: 1px solid #BBF7D0;">
                <p style="margin: 0 0 6px; font-family: ${fontMono}; font-size: 11px; color: #2D6A4F; letter-spacing: 0.08em; text-transform: uppercase;">Refund Information</p>
                <p style="margin: 0; color: #2D6A4F; font-size: 14px; line-height: 1.6;">
                  A refund of <strong>₹${order.total.toLocaleString('en-IN')}</strong> will be initiated to your original payment method. Please allow 5-7 business days for it to reflect.
                </p>
              </div>
              ` : ''}

              <!-- Divider -->
              <div style="height: 1px; background-color: ${C.border}; margin: 28px 0;"></div>

              <!-- CTA -->
              <div style="text-align: center;">
                <p style="margin: 0 0 16px; color: ${C.textMuted}; font-size: 14px;">We'd love for you to shop with us again.</p>
                <a href="${SITE_URL}/categories" style="display: inline-block; background-color: ${C.crimsonThread}; color: ${C.warmIvory}; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-family: ${fontBody}; font-weight: 500; font-size: 14px;">
                  Browse Collections →
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

export const cancellationSubject = (orderId: string) =>
  `Order ${orderId} Cancelled — Bangles by Prakash Duo`;
