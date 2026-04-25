import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  GROQ_API_KEY: z.string().min(1),
  GOOGLE_MAIL_FROM: z.string().email(),
  GOOGLE_APP_PASSWORD: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse(process.env);
