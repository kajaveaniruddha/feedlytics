import { z } from "zod";

export const AddFeedbackSchema = z.object({
  data: z.object({
    userId: z.number().int().positive(),
    stars: z.number().int().min(0).max(5),
    content: z.string().min(1).max(5000),
    email: z.string().email().optional().nullable(),
    name: z.string().max(50).optional().nullable(),
    createdAt: z.union([z.string(), z.coerce.date()]).optional(),
  }),
});
