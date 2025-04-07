import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().nonempty(), //email
  password: z.string().nonempty(),
});
