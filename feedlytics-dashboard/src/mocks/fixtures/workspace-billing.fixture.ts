import type { BillingInfoResponseDto } from "@/features/workspace/types/billing.types";

export const billingFreeFixture: BillingInfoResponseDto = {
  success: true,
  plan: "FREE",
  billingInterval: null,
  hasSubscription: false,
  stripeSubscriptionId: null,
  canManageBilling: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
};

export const billingProMonthlyFixture: BillingInfoResponseDto = {
  success: true,
  plan: "PRO",
  billingInterval: "monthly",
  hasSubscription: true,
  stripeSubscriptionId: "sub_mock_pro_monthly",
  canManageBilling: true,
  subscriptionStatus: "ACTIVE",
  currentPeriodEnd: "2026-07-01T00:00:00Z",
};

export const billingBusinessYearlyFixture: BillingInfoResponseDto = {
  success: true,
  plan: "BUSINESS",
  billingInterval: "yearly",
  hasSubscription: true,
  stripeSubscriptionId: "sub_mock_business_yearly",
  canManageBilling: true,
  subscriptionStatus: "ACTIVE",
  currentPeriodEnd: "2027-05-27T00:00:00Z",
};
