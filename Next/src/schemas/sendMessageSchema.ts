// zod -> typescript schema validation before inserting to db
import { string, z } from "zod";

export const SendMessageSchema = z.object({
  username: z.string(),
  stars:z.number(),
  content: z
    .string()
    .min(10, { message: "message must be at least 10 characters" })
    .max(400, { message: "message can not exceed 400 characters" }).trim(),
});
