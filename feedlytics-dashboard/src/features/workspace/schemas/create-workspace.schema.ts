import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;
