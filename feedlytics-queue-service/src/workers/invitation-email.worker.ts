import { Job, Worker } from "bullmq";
import { invitationEmailQueue } from "../queues/queue.registry";
import { emailService } from "../services/email.service";
import { logger } from "../lib/logger";

export const invitationEmailWorker = new Worker(
  "invitationEmailQueue",
  async (job: Job) => {
    if (job.name === "sendInvitationEmail") {
      await emailService.sendInvitationEmail(job.data);
      return;
    }
    logger.warn({ jobName: job.name }, "Unknown invitation email job type");
  },
  { connection: invitationEmailQueue.opts.connection, concurrency: 5 },
);

invitationEmailWorker.on("completed", (job: Job) => {
  logger.info({ jobId: job.id, jobName: job.name }, "Invitation email job completed");
});

invitationEmailWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, jobName: job?.name, error: err.message },
    "Invitation email job failed",
  );
});
