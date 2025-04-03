import { Worker, Job } from "bullmq";
import { db } from "../db/db";
import { feedbacksTable } from "../db/models/feedback";
import { userSlackChannelsTable } from "../db/models/user-slack-channels";
import { feedbackQueue, slackNotificationQueue } from "../queue";
import { analyzeReview } from "../jobs/llm-functions";
import { sql, arrayOverlaps, and } from "drizzle-orm";

export const feedbackWorker = new Worker(
  "feedbackQueue",
  async (job: Job) => {
    console.log("Testing feedback worker");
    console.log("Received job data:", job.data);
    const { userId, stars, content, createdAt } = job.data;

    try {
      // Analyze sentiment and feedback classification
      let sentimentData = await analyzeReview(content);
      if (!sentimentData) {
        sentimentData = {
          overall_sentiment: "neutral",
          feedback_classification: ["other"],
          review: content,
        };
      }
      const {
        overall_sentiment: sentiment,
        feedback_classification: category,
      } = sentimentData;

      // Insert feedback message with analysis results
      await db.insert(feedbacksTable).values({
        userId,
        stars,
        content,
        sentiment,
        category,
        createdAt: new Date(createdAt || Date.now()),
      });
      console.log(`Feedback job ${job.id} inserted successfully.`);

      const channels = await db
        .select()
        .from(userSlackChannelsTable)
        .where(
          and(
            arrayOverlaps(userSlackChannelsTable.notifyCategories, category),
            userSlackChannelsTable.isActive
          )
        );

      // For each channel, add a job to send Slack notification
      for (const channel of channels) {
        await slackNotificationQueue.add("sendSlackNotification", {
          webhookUrl: channel.webhookUrl,
          message: {
            userId,
            stars,
            content,
            sentiment,
            category,
            createdAt: new Date(createdAt || Date.now()),
          },
        });
      }
    } catch (error) {
      console.error(`Error processing feedback job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: feedbackQueue.opts.connection,
  }
);

feedbackWorker.on("completed", (job: Job) => {
  console.log(`Feedback job ${job.id} completed.`);
});

feedbackWorker.on("failed", (job, err) => {
  console.error(`Feedback job ${job?.id} failed with error: ${err.message}`);
});
