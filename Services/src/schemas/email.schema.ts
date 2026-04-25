import { z } from "zod";

export const VerificationEmailSchema = z.object({
  data: z.object({
    email: z.string().email(),
    username: z.string().min(1),
    verifyCode: z.string().min(1),
    expiryDate: z.union([z.string(), z.number()]),
  }),
});

export const PaymentEmailSchema = z.object({
  data: z.object({
    email: z.string().email(),
  }),
});
