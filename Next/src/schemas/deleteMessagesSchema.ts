import { z } from "zod";

export const deleteMessagesSchema = z.object({
  messageIds: z.array(z.string()).min(1, "At least one message ID is required"),
});
