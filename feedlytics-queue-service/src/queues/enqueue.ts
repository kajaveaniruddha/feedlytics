import {
  emailQueue,
  feedbackQueue,
  notificationQueue,
  invitationEmailQueue,
} from "./queue.registry";
import { shortLivedJobOptions } from "../config/queue.config";
import type { FeedbackJobData } from "../types/feedback.types";
import type {
  VerificationEmailData,
  PaymentEmailData,
  InvitationEmailData,
} from "../types/email.types";
import type { WorkflowNotificationPayload } from "../types/workflow.types";
import { logger } from "../lib/logger";

export async function enqueueFeedback(data: FeedbackJobData) {
  const job = await feedbackQueue.add("processFeedback", data, shortLivedJobOptions);
  logger.info(
    {
      queue: "feedbackQueue",
      bullJobId: job.id,
      feedbackId: data.feedbackId,
      categoryCount: data.workspaceCategoryNames.length,
    },
    "Enqueued feedback analysis job",
  );
  return job;
}

export async function enqueueNotification(data: WorkflowNotificationPayload) {
  const job = await notificationQueue.add("sendNotification", data, shortLivedJobOptions);
  let webhookHost = "unknown";
  try {
    webhookHost = new URL(data.webhookUrl).host;
  } catch {
    /* ignore */
  }
  logger.info({ queue: "notificationQueue", bullJobId: job.id, webhookHost }, "Enqueued workflow notification job");
  return job;
}

export async function enqueueVerificationEmail(data: VerificationEmailData) {
  const job = await emailQueue.add("sendVerificationEmail", data, shortLivedJobOptions);
  logger.info({ queue: "emailQueue", bullJobId: job.id, kind: "verification_email" }, "Enqueued verification email job");
  return job;
}

export async function enqueuePaymentEmail(data: PaymentEmailData) {
  const job = await emailQueue.add("sendPaymentEmail", data, shortLivedJobOptions);
  logger.info({ queue: "emailQueue", bullJobId: job.id, kind: "payment_email" }, "Enqueued payment email job");
  return job;
}

export async function enqueueInvitationEmail(data: InvitationEmailData) {
  const job = await invitationEmailQueue.add("sendInvitationEmail", data, shortLivedJobOptions);
  logger.info(
    { queue: "invitationEmailQueue", bullJobId: job.id, kind: "invitation_email" },
    "Enqueued invitation email job",
  );
  return job;
}
