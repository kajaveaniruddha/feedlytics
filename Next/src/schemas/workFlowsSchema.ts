import { z } from "zod";

export const workflowsSchema = z.object({
  provider: z.enum(["googlechat", "slack"]),
  groupName: z.string().min(3).max(50),
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

export type WorkflowsSchema = z.infer<typeof workflowsSchema>;
