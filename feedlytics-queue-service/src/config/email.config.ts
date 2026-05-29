import nodemailer from "nodemailer";

const smtpUser = process.env.GOOGLE_MAIL_FROM?.trim();
const smtpPass = process.env.GOOGLE_APP_PASSWORD?.replace(/\s+/g, "");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});
