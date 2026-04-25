interface VerificationTemplateData {
  username: string;
  verifyCode: string;
  expiryDate: Date;
}

export function verificationEmailTemplate(data: VerificationTemplateData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <a href="https://feedlytics.in" target="_blank" style="display: block; text-align: center; margin-bottom: 20px;">
            <img src="https://feedlytics.in/opengraph-image.png" alt="Feedback-Collect" style="max-width: 100%; height: auto; border-radius: 6px;" />
          </a>
          <h2 style="color: #2c3e50;">Hello ${data.username},</h2>
          <p style="font-size: 16px; color: #333;">Thank you for signing up with <strong>Feedback-Collect</strong>.</p>
          <p style="font-size: 16px; color: #333;">Please use the following verification code to verify your email address:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #eaf6ff; border: 1px solid #b3e0ff; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #0077cc; border-radius: 6px;">
            ${data.verifyCode}
          </div>
          <p style="font-size: 14px; color: #555;">This code is valid until: <strong>${data.expiryDate.toLocaleString()}</strong></p>
          <p style="font-size: 14px; color: #999; margin-top: 40px;">If you didn't request this, please ignore this email.</p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,<br/>The <a href="https://feedlytics.in" target="_blank" style="color: #0077cc; text-decoration: none;">Feedback-Collect Team</a></p>
        </div>
      </body>
    </html>
  `;
}
