import { z } from "zod";

export const checkoutSessionSchema = z.object({
  plan: z.enum(["pro", "business"]),
  interval: z.enum(["monthly", "yearly"]),
});
