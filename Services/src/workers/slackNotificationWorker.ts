import { Worker, Job } from "bullmq";
import { slackNotificationQueue } from "../queue";

function formatSlackMessage({
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
  "slackNotificationQueue",
  async (job: Job<{ webhookUrl: string; message: any }>) => {
    const { webhookUrl, message } = job.data;
    try {
      // Send POST request to the Slack webhook URL with feedback message
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: formatSlackMessage(message),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.statusText}`);
      }
      console.log(`Slack notification sent successfully for job ${job.id}`);
    } catch (error) {
      console.error(
        `Error sending Slack notification for job ${job.id}:`,
        error
      );
      throw error;
    }
  },
  { connection: slackNotificationQueue.opts.connection }
);

slackNotificationWorker.on("completed", (job: Job) => {
  console.log(`Slack notification job ${job.id} completed.`);
});

slackNotificationWorker.on("failed", (job, err) => {
  console.error(
    `Slack notification job ${job?.id} failed with error: ${err.message}`
  );
});
