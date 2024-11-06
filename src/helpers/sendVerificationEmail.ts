const nodemailer = require("nodemailer");
import { ApiResponse } from "@/types/ApiResponse";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aakajave@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
  expiryDate: Date
): Promise<ApiResponse> {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_APP_PASSWORD,
      to: email,
      subject: "Echo-Collect | Verification Code",
      text: `Welcome ${username}! ${verifyCode} is your otp valid till ${expiryDate}.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending email.", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
