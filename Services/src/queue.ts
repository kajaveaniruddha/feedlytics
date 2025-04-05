import { Queue } from "bullmq";
import "dotenv/config";

export const redisConnection = {
  url: process.env.REDIS_URL,
  // url: process.env.CLOUD_REDIS_URL,
};

export const defaultQueueOptions = {
  attempts: 3, // Retry the job 3 times before failing
  backoff: {
    type: "exponential",
    delay: 1000, // Initial delay of 1 second for retries
  },
};

export const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

export const feedbackQueue = new Queue("feedbackQueue", {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

export const slackNotificationQueue = new Queue("slackNotificationQueue", {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});
