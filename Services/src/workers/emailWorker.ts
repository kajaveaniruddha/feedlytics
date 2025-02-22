import { Job, Worker } from "bullmq";
import { emailQueue } from "../queue";
import { sendVerificationEmail } from "../jobs/sendVerificationEmail";

export const queueWorker = new Worker(
  "emailQueue", // Match the name used in the queue definition
  async (job: Job) => {
    try {
      // if (job.name === "sendVerificationEmail") {
      //   Process the email sending job
      // }
      console.log("Running email worker")
      const data = job.data;
      console.log("Processing job with data:", data);

      // Call the sendVerificationEmail function
      await sendVerificationEmail(
        data.email,
        data.username,
        data.verifyCode,
        new Date(data.expiryDate)
      );

      // Update the job progress when 100% done
      // await job.updateProgress(100);
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: emailQueue.opts.connection, // Use the same Redis connection
  }
);

// Optional: Listen to worker events
queueWorker.on("completed", (job: Job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

queueWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
