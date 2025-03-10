import { Worker, Job } from "bullmq";
import { db } from "../db/db";
import { feedbacksTable } from "../db/models/feedback";
import { feedbackQueue } from "../queue";
import { analyzeReview } from "../jobs/llm-functions";

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
