import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const renameCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});

export type RenameCategoryFormValues = z.infer<typeof renameCategorySchema>;
