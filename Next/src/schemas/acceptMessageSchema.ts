// zod -> typescript schema validation before inserting to db
import { z } from "zod";

export const AcceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});
