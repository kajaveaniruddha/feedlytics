import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_MAIL_FROM,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
