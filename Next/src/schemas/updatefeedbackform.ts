import { z } from "zod";

export const updateFeedbackForm = z.object({
  introduction: z
    .string()
    .max(200, { message: "Introduction can have a maximum of 200 characters." }),

  questions: z
    .array(
      z.string().max(100, {
        message: "Each question can have a maximum of 100 characters.",
      })
    )
    .length(2, { message: "You must provide exactly 2 questions." }),
});
