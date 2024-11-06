const nodemailer = require("nodemailer")
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// Set up transporter using nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aakajave@gmail.com", // Your email ID
    pass: process.env.GOOGLE_APP_PASSWORD, // App-specific password for security
  },
});

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
  expiryDate:Date
): Promise<ApiResponse> {
  try {
    // Define email options
    const mailOptions = {
      from: "aakajave@gmail.com",
      to: email, 
      subject: "Echo-Collect | Verification Code",
      // react: VerificationEmail({ username, otp: verifyCode }),
      text: `Welcome ${username}! ${verifyCode} is your otp valid till ${expiryDate}.`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending email.", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
