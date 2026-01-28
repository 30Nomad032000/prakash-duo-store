// Email service exports
export { createTransporter, emailConfig, verifyTransporter } from './nodemailer';
export {
  sendOrderConfirmation,
  sendShippingNotification,
  sendDeliveryConfirmation,
  resendEmail,
} from './send';
