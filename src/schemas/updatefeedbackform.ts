import { z } from "zod";

export const updateFeedbackForm = z.object({
  introduction: z
    .string()
    .min(3, { message: "Introduction should have a minimum of 3 characters." })
    .max(100, { message: "Introduction can have a maximum of 100 characters." }),

  questions: z
    .array(
      z.string().max(100, {
        message: "Each question can have a maximum of 100 characters.",
      })
    )
    .length(2, { message: "You must provide exactly 2 questions." }),
});
