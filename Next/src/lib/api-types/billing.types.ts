import type { BaseApiResponse } from "./common.types";

export interface GetBillingResponse extends BaseApiResponse {
  userTier: string | null;
  messageCount: number | null;
  maxMessages: number | null;
  maxWorkflows: number | null;
  billingPeriodStart: Date | null;
  billingPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  workflowCount: number;
  periodFeedbackCount: number;
}

export interface CreateCheckoutSessionResponse extends BaseApiResponse {
  url: string;
}
