export interface VerificationEmailData {
  email: string;
  username: string;
  verifyCode: string;
  expiryDate: string | number | Date;
}

export interface PaymentEmailData {
  email: string;
}
