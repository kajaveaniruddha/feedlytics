import type { WorkflowNotificationMessage } from "../types/workflow.types";
import { logger } from "../lib/logger";

function formatMessage(msg: WorkflowNotificationMessage): string {
  return [
    "*New Feedback Received via Feedlytics*",
    "",
    `*Stars:* ${msg.stars}`,
    `*Date:* ${new Date(msg.createdAt).toLocaleString()}`,
    `*Category:* ${msg.category.join(", ")}`,
    `*Sentiment:* ${msg.sentiment}`,
    "",
    `*Feedback:* ${msg.content}`,
    "",
    "Powered by *Feedlytics* — actionable insights from real feedback.",
  ].join("\n");
}

export const notificationService = {
  async send(webhookUrl: string, message: WorkflowNotificationMessage) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: formatMessage(message) }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }
  },

  async dispatchAll(
    workflows: { webhookUrl: string; isActive: boolean }[],
    message: WorkflowNotificationMessage
  ) {
    const active = workflows.filter((w) => w.isActive);
    if (active.length === 0) return;

    const results = await Promise.allSettled(
      active.map((w) => this.send(w.webhookUrl, message))
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      logger.warn({ failedCount: failed.length, total: active.length }, "Some workflow notifications failed");
    }
  },
};
