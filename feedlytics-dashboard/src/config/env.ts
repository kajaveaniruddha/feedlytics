/**
 * Runtime environment config.
 *
 * Every entry is validated via Zod so a missing/mis-typed var fails fast at
 * import time rather than producing a confusing 404 in a fetch 30 seconds later.
 */
import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .min(1)
    .default("http://localhost:8081"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_ENABLE_MSW: z
    .enum(["true", "false"])
    .optional()
    .default("false"),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_ENABLE_MSW: process.env.NEXT_PUBLIC_ENABLE_MSW,
});

if (!parsed.success) {
  console.error("Invalid environment config:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration — see console for details.");
}

export const env = {
  apiBaseUrl: parsed.data.NEXT_PUBLIC_API_BASE_URL,
  googleClientId: parsed.data.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  enableMsw: parsed.data.NEXT_PUBLIC_ENABLE_MSW === "true",
} as const;
