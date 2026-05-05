import { Worker, Job } from "bullmq";
import { emailQueue } from "../queues/queue.registry";
import { emailService } from "../services/email.service";
import { logger } from "../lib/logger";

export const emailWorker = new Worker(
  "emailQueue",
  async (job: Job) => {
    switch (job.name) {
      case "sendVerificationEmail":
        await emailService.sendVerificationEmail(job.data);
        break;
      case "sendPaymentEmail":
        await emailService.sendPaymentEmail(job.data);
        break;
      default:
        logger.warn({ jobName: job.name }, "Unknown email job type");
    }
  },
  { connection: emailQueue.opts.connection, concurrency: 5 },
);

emailWorker.on("completed", (job: Job) => {
  logger.info({ jobId: job.id, jobName: job.name }, "Email job completed");
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, jobName: job?.name, error: err.message },
    "Email job failed",
  );
});
