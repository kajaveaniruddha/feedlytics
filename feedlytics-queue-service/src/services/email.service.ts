import { transporter } from "../config/email.config";
import { verificationEmailTemplate } from "../templates/verification-email";
import { paymentEmailTemplate } from "../templates/payment-email";
import type { VerificationEmailData, PaymentEmailData } from "../types/email.types";
import { logger } from "../lib/logger";

export const emailService = {
  async sendVerificationEmail(data: VerificationEmailData) {
    const { email, username, verifyCode, expiryDate } = data;
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL_FROM,
      to: email,
      subject: "FEEDLYTICS | Verify Your Email",
      html: verificationEmailTemplate({
        username,
        verifyCode,
        expiryDate: new Date(expiryDate),
      }),
    });
    logger.info({ email }, "Verification email sent");
  },

  async sendPaymentEmail(data: PaymentEmailData) {
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL_FROM,
      to: data.email,
      subject: "FEEDLYTICS | Premium Plan Activated",
      html: paymentEmailTemplate({ email: data.email }),
    });
    logger.info({ email: data.email }, "Payment confirmation email sent");
  },
};
