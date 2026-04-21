import { z } from "zod";

export const deleteMessagesSchema = z.object({
  messageIds: z.array(z.coerce.string()).min(1, "At least one message ID is required."),
});
