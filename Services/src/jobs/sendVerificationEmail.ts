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
      subject: "🔐 Feedback-Collect | Verify Your Email",
      html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <a href="https://feedlytics.in" target="_blank" style="display: block; text-align: center; margin-bottom: 20px;">
            <img src="https://feedlytics.in/opengraph-image.png" alt="Feedback-Collect" style="max-width: 100%; height: auto; border-radius: 6px;" />
          </a>
          <h2 style="color: #2c3e50;">Hello ${username},</h2>
          <p style="font-size: 16px; color: #333;">Thank you for signing up with <strong>Feedback-Collect</strong>.</p>
          <p style="font-size: 16px; color: #333;">Please use the following verification code to verify your email address:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #eaf6ff; border: 1px solid #b3e0ff; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #0077cc; border-radius: 6px;">
            ${verifyCode}
          </div>
          <p style="font-size: 14px; color: #555;">This code is valid until: <strong>${expiryDate.toLocaleString()}</strong></p>
          <p style="font-size: 14px; color: #999; margin-top: 40px;">If you didn’t request this, please ignore this email.</p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,<br/>The <a href="https://feedlytics.in" target="_blank" style="color: #0077cc; text-decoration: none;">Feedback-Collect Team</a></p>
        </div>
      </body>
    </html>
  `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending email.", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
