import type { WorkspacePlan } from "@/features/workspace/types/workspace.types";

export type BillingInterval = "monthly" | "yearly";
export type PaidPlan = "PRO" | "BUSINESS";

export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELLED" | "TRIALING" | "INCOMPLETE";

export type BillingInfoResponseDto = {
  success: boolean;
  plan: WorkspacePlan;
  billingInterval: BillingInterval | null;
  hasSubscription: boolean;
  stripeSubscriptionId: string | null;
  canManageBilling: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  currentPeriodEnd: string | null;
};

export type CheckoutSessionRequestDto = {
  plan: PaidPlan;
  interval: BillingInterval;
};

export type CheckoutSessionResponseDto = {
  success: boolean;
  url: string;
};

export type PortalSessionResponseDto = {
  success: boolean;
  url: string;
};
