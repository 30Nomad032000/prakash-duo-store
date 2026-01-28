import { createTransporter, emailConfig } from './nodemailer';
import {
  orderConfirmationTemplate,
  orderConfirmationSubject,
} from './templates/order-confirmation';
import {
  shippingNotificationTemplate,
  shippingNotificationSubject,
} from './templates/shipping-notification';
import {
  deliveryConfirmationTemplate,
  deliveryConfirmationSubject,
} from './templates/delivery-confirmation';
import { createClient } from '@supabase/supabase-js';
import type { Order } from '@/lib/types';
import type { EmailType, EmailStatus } from '@/lib/supabase/types';

function getUntypedClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

async function logEmail(
  orderId: string,
  emailType: EmailType,
  recipientEmail: string,
  subject: string,
  status: EmailStatus,
  errorMessage?: string
) {
  try {
    const supabase = getUntypedClient();

    // First get the order UUID from the order_id
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('order_id', orderId)
      .single();

    if (order) {
      await supabase.from('email_logs').insert({
        order_id: order.id,
        email_type: emailType,
        recipient_email: recipientEmail,
        subject,
        status,
        error_message: errorMessage,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
      });
    }
  } catch (error) {
    console.error('Failed to log email:', error);
  }
}

export async function sendOrderConfirmation(
  order: Order
): Promise<SendEmailResult> {
  const subject = orderConfirmationSubject(order.orderId);
  const html = orderConfirmationTemplate(order);
  const recipientEmail = order.customer.email;

  try {
    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: recipientEmail,
      subject,
      html,
    });

    await logEmail(
      order.orderId,
      'order_confirmation',
      recipientEmail,
      subject,
      'sent'
    );

    return { success: true, messageId: result.messageId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send order confirmation email:', error);

    await logEmail(
      order.orderId,
      'order_confirmation',
      recipientEmail,
      subject,
      'failed',
      errorMessage
    );

    return { success: false, error: errorMessage };
  }
}

export async function sendShippingNotification(
  order: Order,
  trackingInfo: {
    carrier: string;
    trackingId: string;
    estimatedDelivery?: string;
  }
): Promise<SendEmailResult> {
  const subject = shippingNotificationSubject(order.orderId);
  const html = shippingNotificationTemplate(order, trackingInfo);
  const recipientEmail = order.customer.email;

  try {
    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: recipientEmail,
      subject,
      html,
    });

    await logEmail(
      order.orderId,
      'shipping_notification',
      recipientEmail,
      subject,
      'sent'
    );

    return { success: true, messageId: result.messageId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send shipping notification email:', error);

    await logEmail(
      order.orderId,
      'shipping_notification',
      recipientEmail,
      subject,
      'failed',
      errorMessage
    );

    return { success: false, error: errorMessage };
  }
}

export async function sendDeliveryConfirmation(
  order: Order
): Promise<SendEmailResult> {
  const subject = deliveryConfirmationSubject(order.orderId);
  const html = deliveryConfirmationTemplate(order);
  const recipientEmail = order.customer.email;

  try {
    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
      to: recipientEmail,
      subject,
      html,
    });

    await logEmail(
      order.orderId,
      'delivery_confirmation',
      recipientEmail,
      subject,
      'sent'
    );

    return { success: true, messageId: result.messageId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send delivery confirmation email:', error);

    await logEmail(
      order.orderId,
      'delivery_confirmation',
      recipientEmail,
      subject,
      'failed',
      errorMessage
    );

    return { success: false, error: errorMessage };
  }
}

// Resend a failed email
export async function resendEmail(emailLogId: string): Promise<SendEmailResult> {
  try {
    const supabase = getUntypedClient();

    // Get the email log
    const { data: emailLog, error: logError } = await supabase
      .from('email_logs')
      .select('*, orders(*)')
      .eq('id', emailLogId)
      .single();

    if (logError || !emailLog) {
      return { success: false, error: 'Email log not found' };
    }

    // Get the full order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', emailLog.order_id)
      .single();

    if (orderError || !order) {
      return { success: false, error: 'Order not found' };
    }

    // Convert to Order type
    const orderData: Order = {
      id: order.id,
      orderId: order.order_id,
      customer: {
        email: order.customer_email,
        phone: order.customer_phone,
        firstName: order.customer_first_name,
        lastName: order.customer_last_name,
      },
      shippingAddress: {
        firstName: order.shipping_first_name,
        lastName: order.shipping_last_name,
        address: order.shipping_address,
        apartment: order.shipping_apartment || undefined,
        city: order.shipping_city,
        state: order.shipping_state,
        pincode: order.shipping_pincode,
        phone: order.shipping_phone,
      },
      items: order.order_items.map((item: {
        product_id: string;
        product_name: string;
        price: number;
        image: string;
        size: string;
        quantity: number;
      }) => ({
        productId: item.product_id,
        name: item.product_name,
        price: item.price,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentSessionId: order.payment_session_id || undefined,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    // Resend based on email type
    switch (emailLog.email_type) {
      case 'order_confirmation':
        return sendOrderConfirmation(orderData);

      case 'shipping_notification':
        // Get tracking info
        const { data: tracking } = await supabase
          .from('shipping_tracking')
          .select('*')
          .eq('order_id', order.id)
          .single();

        if (!tracking?.tracking_id) {
          return { success: false, error: 'No tracking information found' };
        }

        return sendShippingNotification(orderData, {
          carrier: tracking.carrier,
          trackingId: tracking.tracking_id,
          estimatedDelivery: tracking.estimated_delivery || undefined,
        });

      case 'delivery_confirmation':
        return sendDeliveryConfirmation(orderData);

      default:
        return { success: false, error: 'Unknown email type' };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
