import { emailQueue, feedbackQueue, notificationQueue } from "./queue.registry";
import { shortLivedJobOptions } from "../config/queue.config";
import type { FeedbackJobData } from "../types/feedback.types";
import type { VerificationEmailData, PaymentEmailData } from "../types/email.types";
import type { WorkflowNotificationPayload } from "../types/workflow.types";

export async function enqueueFeedback(data: FeedbackJobData) {
  return feedbackQueue.add("processFeedback", data, shortLivedJobOptions);
}

export async function enqueueNotification(data: WorkflowNotificationPayload) {
  return notificationQueue.add("sendNotification", data, shortLivedJobOptions);
}

export async function enqueueVerificationEmail(data: VerificationEmailData) {
  return emailQueue.add("sendVerificationEmail", data, shortLivedJobOptions);
}

export async function enqueuePaymentEmail(data: PaymentEmailData) {
  return emailQueue.add("sendPaymentEmail", data, shortLivedJobOptions);
}
