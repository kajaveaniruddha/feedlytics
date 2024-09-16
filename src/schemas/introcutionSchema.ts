// zod -> typescript schema validation before inserting to db
import { z } from "zod";

export const introductionSchema = z.object({
  introduction: z.string().min(5,{message:"minimum 5 characters of introduction is required."}).max(100,{message:"maximum 100 characters of introduction is allowed."}),
});
