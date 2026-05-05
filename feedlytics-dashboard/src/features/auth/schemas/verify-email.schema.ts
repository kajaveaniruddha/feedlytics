/**
 * Shape of `POST /auth/verify-email` and `POST /auth/regenerate-email-verification-code`.
 * The Kotlin `VerifyEmailRequest.kt` doesn't annotate strict validation, but the
 * frontend enforces a 6-character numeric code to match the UX convention.
 */
import { z } from "zod";

export const verifyEmailSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Enter a valid email"),
  code: z
    .string({ error: "Verification code is required" })
    .regex(/^\d{6}$/u, "Enter the 6-digit code we emailed you"),
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;

export const regenerateEmailCodeSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Enter a valid email"),
});

export type RegenerateEmailCodeRequest = z.infer<typeof regenerateEmailCodeSchema>;
