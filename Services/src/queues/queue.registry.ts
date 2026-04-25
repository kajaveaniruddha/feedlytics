import { Queue } from "bullmq";
import { redisConnection, defaultJobOptions } from "../config/queue.config";

export const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
  defaultJobOptions,
});

export const feedbackQueue = new Queue("feedbackQueue", {
  connection: redisConnection,
  defaultJobOptions,
});

export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
  defaultJobOptions,
});
