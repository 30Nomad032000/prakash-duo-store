import nodemailer from 'nodemailer';

// Create reusable transporter for Zoho SMTP
export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export const emailConfig = {
  from: {
    name: process.env.SMTP_FROM_NAME || 'Prakash Duo',
    email: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
  },
};

// Verify transporter configuration
export async function verifyTransporter(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
}
