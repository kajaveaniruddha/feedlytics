const nodemailer = require("nodemailer");

interface ApiResponse {
  success: boolean;
  message: string;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_MAIL_FROM,
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
      from: process.env.GOOGLE_MAIL_FROM,
      to: email,
      subject: "Feedback-Collect | Verification Code",
      html: `<html>
      <body>
        <p>Hello ${username},</p>
        <p>Your verification code is: <strong>${verifyCode}</strong>.</p>
        <p>This code is valid until: <strong>${expiryDate.toLocaleString()}</strong>.</p>
        <p>Thank you,<br/>Feedback-Collect Team</p>
      </body>
    </html>`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending email.", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
