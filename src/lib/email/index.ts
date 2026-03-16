// Email service exports
export { getResend, emailConfig } from './nodemailer';
export {
  sendOrderConfirmation,
  sendShippingNotification,
  sendDeliveryConfirmation,
  sendNewOrderNotification,
  resendEmail,
} from './send';
