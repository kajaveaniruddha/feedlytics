import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "stars"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  content: z.string().optional(),
  stars: z
    .preprocess((val) => {
      if (typeof val === "string" && val.length > 0) return val.split(",").map(Number);
      if (Array.isArray(val)) return val.map(Number);
      return undefined;
    }, z.array(z.number().min(1).max(5)).optional()),
  sentiment: z
    .preprocess((val) => {
      if (typeof val === "string" && val.length > 0) return val.split(",");
      return val;
    }, z.array(z.enum(["positive", "negative", "neutral"])).optional()),
  category: z
    .preprocess((val) => {
      if (typeof val === "string" && val.length > 0) return val.split(",");
      return val;
    }, z.array(z.enum(["bug", "request", "praise", "complaint", "suggestion", "question", "other"])).optional()),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
