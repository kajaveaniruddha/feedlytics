import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
