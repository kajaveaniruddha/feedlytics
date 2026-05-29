export interface VerificationEmailData {
  email: string;
  username: string;
  verifyCode: string;
  expiryDate: string | number | Date;
}

export interface PaymentEmailData {
  email: string;
}

export interface InvitationEmailData {
  email: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  inviteToken: string;
  expiresAtEpochMs: number;
}
