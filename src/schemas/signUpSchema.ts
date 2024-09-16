import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be at least 2 characters")
  .max(20, "username can not exceed 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  name: z
    .string()
    .min(3, { message: "name should have minimum 3 characters" })
    .max(30, { message: "name can have maximum 30 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
