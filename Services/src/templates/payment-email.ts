interface PaymentTemplateData {
  email: string;
}

export function paymentEmailTemplate(data: PaymentTemplateData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <a href="https://feedlytics.in" target="_blank" style="display: block; text-align: center; margin-bottom: 20px;">
            <img src="https://feedlytics.in/opengraph-image.png" alt="Feedback-Collect" style="max-width: 100%; height: auto; border-radius: 6px;" />
          </a>
          <h2 style="color: #2c3e50;">Welcome to Premium ${data.email}!</h2>
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">Your account has been successfully upgraded to the <strong>Premium Plan</strong>.</p>
          <p style="font-size: 16px; color: #333;">You now have access to:</p>
          <ul style="font-size: 16px; color: #333; padding-left: 20px;">
            <li>100 feedbacks</li>
            <li>10 workflows each for Google Chat, Slack, and Microsoft Teams</li>
            <li>Smarter AI-powered feedback analysis</li>
          </ul>
          <p style="font-size: 16px; color: #333;">We're excited to see what you build with Feedback-Collect!</p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">Best regards,<br/>The <a href="https://feedlytics.in" target="_blank" style="color: #0077cc; text-decoration: none;">Feedback-Collect Team</a></p>
        </div>
      </body>
    </html>
  `;
}
