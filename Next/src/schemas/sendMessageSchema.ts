// zod -> typescript schema validation before inserting to db
import { z } from "zod";

export const SendMessageSchema = z.object({
  username: z.string().trim(),
  name: z
    .string()
    .max(50, { message: "sender name can not exceed 50 characters" })
    .trim(),
  email: z
    .string()
    .max(50, { message: "email can not exceed 50 characters" })
    .trim(),
  stars: z.number(),
  content: z
    .string()
    .min(10, { message: "message must be at least 10 characters" })
    .max(400, { message: "message can not exceed 400 characters" })
    .trim(),
});
