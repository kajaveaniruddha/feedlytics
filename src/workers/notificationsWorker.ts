import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "@/lib/queue";
import { sendVerificationEmail } from "@/jobs/sendVerificationEmail";

export const notificationsQueueName = "notificationsQueue";
export const notificationsQueue = new Queue(notificationsQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

export const queueWorker = new Worker(
  notificationsQueueName,
  async (job: Job) => {
    try {
      const data = job.data;
      console.log("job data is ", data);
      await sendVerificationEmail(
        data.email,
        data.username,
        data.verifyCode,
        new Date(data.expiryDate)
      );
      await job.updateProgress(100);
    } catch (error) {
      console.error("Error processing job:", error);
      throw error;
    }
  },
  {
    connection: redisConnection,
  }
);

// Optional: Listen to worker events
queueWorker.on("completed", (job: Job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

queueWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
