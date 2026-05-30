/**
 * Source of truth for the Login request shape: Kotlin `LoginRequest.kt`
 *   email: NotBlank + Email, password: NotBlank, inviteToken?
 * Zod mirrors these constraints; `type LoginRequest = z.infer<...>` is the
 * only place the TypeScript shape lives.
 */
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
  inviteToken: z.string().optional(),
});

export type LoginRequest = z.infer<typeof loginSchema>;
