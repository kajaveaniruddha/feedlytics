import { Worker, Job } from "bullmq";
import { notificationQueue } from "../queues/queue.registry";
import { notificationService } from "../services/notification.service";
import type { WorkflowNotificationPayload } from "../types/workflow.types";
import { logger } from "../lib/logger";

export const notificationWorker = new Worker(
  "notificationQueue",
  async (job: Job<WorkflowNotificationPayload>) => {
    const { webhookUrl, message } = job.data;
    await notificationService.send(webhookUrl, message);
  },
  { connection: notificationQueue.opts.connection, concurrency: 5 }
);

notificationWorker.on("completed", (job: Job) => {
  logger.info({ jobId: job.id }, "Notification job completed");
});

notificationWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, "Notification job failed");
});
