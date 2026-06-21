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

notificationWorker.on("active", (job: Job<WorkflowNotificationPayload>) => {
  let webhookHost = "unknown";
  try {
    webhookHost = new URL(job.data.webhookUrl).host;
  } catch {
    /* ignore */
  }
  logger.info(
    { component: "notification.worker", queue: "notificationQueue", bullJobId: job.id, webhookHost },
    "Notification job started",
  );
});

notificationWorker.on("completed", (job: Job) => {
  logger.info({ jobId: job.id }, "Notification job completed");
});

notificationWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, "Notification job failed");
});
