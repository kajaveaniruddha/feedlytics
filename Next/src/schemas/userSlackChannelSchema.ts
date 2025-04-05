import { z } from "zod";

export const userSlackChannelSchema = z.object({
  channelName: z.string().min(3).max(50), // updated: minimum of 3 characters now required
  webhookUrl: z.string().url(),
  notifyCategories: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.split(",").map((s) => s.trim()).filter(Boolean);
      }
      return val;
    },
    z.array(z.string()).min(1, "Please select at least one category")
  ),
  isActive: z.boolean().optional().default(true)
});

export type UserSlackChannel = z.infer<typeof userSlackChannelSchema>;
