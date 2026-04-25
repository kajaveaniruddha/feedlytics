import { Worker, Job } from "bullmq";
import { feedbackQueue } from "../queues/queue.registry";
import { feedbackService } from "../services/feedback.service";
import { logger } from "../lib/logger";

export const feedbackWorker = new Worker(
  "feedbackQueue",
  async (job: Job) => {
    await feedbackService.processFeedback(job.data);
  },
  { connection: feedbackQueue.opts.connection }
);

feedbackWorker.on("completed", (job: Job) => {
  logger.info({ jobId: job.id }, "Feedback job completed");
});

feedbackWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, "Feedback job failed");
});
