/**
 * Source of truth for the Register request shape: Kotlin `RegisterRequest.kt`
 *   email: NotBlank + Email
 *   password: NotBlank + min 8 chars
 *   name: NotBlank
 *   inviteToken?
 */
import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Please tell us your name"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email("Enter a valid email"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  inviteToken: z.string().optional(),
});

export type SignupRequest = z.infer<typeof signupSchema>;
