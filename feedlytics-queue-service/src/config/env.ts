import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  GRPC_PORT: z.coerce.number().default(9090),
  REDIS_URL: z.string(),
  GROQ_API_KEY: z.string().min(1),
  GOOGLE_MAIL_FROM: z.string().email(),
  GOOGLE_APP_PASSWORD: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.string().default("info"),
  AI_CALLBACK_BATCH_MS: z.coerce.number().optional(),
  AI_CALLBACK_MAX_BATCH: z.coerce.number().optional(),
});

export const env = envSchema.parse(process.env);
