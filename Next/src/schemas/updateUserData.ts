import * as z from "zod";

export const updateUserData = z.object({
  name: z.string().min(1, "Name is required").max(50),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  avatar_url: z.string().url("Must be a valid URL"),
  introduction: z.string().optional(),
  questions: z.array(z.string()).length(2, "Must provide exactly 2 questions"),
  bg_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid background color format"),
  text_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid text color format"),
  collect_info: z.object({
    name: z.boolean(),
    email: z.boolean(),
  }),
});
