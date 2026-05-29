import { transporter } from "../config/email.config";
import { verificationEmailTemplate } from "../templates/verification-email";
import { paymentEmailTemplate } from "../templates/payment-email";
import { invitationEmailTemplate } from "../templates/invitation-email";
import { env } from "../config/env";
import type {
  VerificationEmailData,
  PaymentEmailData,
  InvitationEmailData,
} from "../types/email.types";
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

  async sendInvitationEmail(data: InvitationEmailData) {
    const acceptUrl = `${env.DASHBOARD_BASE_URL.replace(/\/$/, "")}/login?inviteToken=${encodeURIComponent(data.inviteToken)}`;
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL_FROM,
      to: data.email,
      subject: `FEEDLYTICS | Invitation to ${data.workspaceName}`,
      html: invitationEmailTemplate({
        workspaceName: data.workspaceName,
        inviterName: data.inviterName,
        role: data.role,
        acceptUrl,
        expiresAt: new Date(data.expiresAtEpochMs),
      }),
    });
    logger.info({ email: data.email, workspaceName: data.workspaceName }, "Invitation email sent");
  },
};
