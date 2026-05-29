interface InvitationTemplateData {
  workspaceName: string;
  inviterName: string;
  role: string;
  acceptUrl: string;
  expiresAt: Date;
}

export function invitationEmailTemplate(data: InvitationTemplateData): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <a href="https://feedlytics.in" target="_blank" style="display: block; text-align: center; margin-bottom: 20px;">
            <img src="https://feedlytics.in/opengraph-image.png" alt="Feedlytics" style="max-width: 100%; height: auto; border-radius: 6px;" />
          </a>
          <h2 style="color: #2c3e50; margin: 0 0 12px;">You have been invited to a workspace</h2>
          <p style="font-size: 16px; color: #333;">${data.inviterName} invited you to join <strong>${data.workspaceName}</strong> as <strong>${data.role}</strong>.</p>
          <p style="font-size: 16px; color: #333;">Sign in (or create an account with the same email) and accept the invitation from the bell icon in your dashboard.</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${data.acceptUrl}" target="_blank" style="display: inline-block; background: #4318ff; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 700;">
              Open Feedlytics
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">This invite expires at: <strong>${data.expiresAt.toLocaleString()}</strong></p>
          <p style="font-size: 14px; color: #999; margin-top: 30px;">If you were not expecting this invitation, you can ignore this email.</p>
        </div>
      </body>
    </html>
  `;
}
