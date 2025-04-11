import { Worker, Job } from "bullmq";
import { WorkFlowNotificationQueue } from "../queue";

function formatWorkflowMessage({
  stars,
  content,
  sentiment,
  category,
  createdAt,
}: any) {
  return `
🔔 *New Feedback Received via Feedlytics*

⭐ *Stars:* ${stars}
📅 *Date:* ${new Date(createdAt).toLocaleString()}
🏷️ *Category:* ${category.join(", ")}
🟢 *Sentiment:* ${sentiment}

💬 *Feedback:* ${content}

🔗 Powered by *Feedlytics* — actionable insights from real feedback.
`;
}

export const slackNotificationWorker = new Worker(
  "WorkFlowNotificationQueue",
  async (job: Job<{ webhookUrl: string; message: any }>) => {
    const { webhookUrl, message } = job.data;
    try {
      // Send POST request to the Workflow webhook URL with feedback message
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: formatWorkflowMessage(message),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.statusText}`);
      }
      console.log(`Workflow notification sent successfully for job ${job.id}`);
    } catch (error) {
      console.error(
        `Error sending Workflow notification for job ${job.id}:`,
        error
      );
      throw error;
    }
  },
  {
    connection: WorkFlowNotificationQueue.opts.connection,
  }
);

slackNotificationWorker.on("completed", (job: Job) => {
  console.log(`Workflow notification job ${job.id} completed.`);
});

slackNotificationWorker.on("failed", (job, err) => {
  console.error(
    `Workflow notification job ${job?.id} failed with error: ${err.message}`
  );
});
