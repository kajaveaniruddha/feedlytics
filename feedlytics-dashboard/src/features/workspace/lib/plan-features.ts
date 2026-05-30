import type { BillingInterval } from "@/features/workspace/types/billing.types";

export type PlanFeatureEntry = {
  plan: string;
  label: string;
  description: string;
  prices: Record<BillingInterval, number>;
  features: string[];
};

export const PLAN_FEATURES: PlanFeatureEntry[] = [
  {
    plan: "FREE",
    label: "Free",
    description: "Get started with the basics for small projects.",
    prices: { monthly: 0, yearly: 0 },
    features: [
      "100 feedbacks / month",
      "1 campaign",
      "2 team members",
      "1 widget",
      "3 feedback categories",
      "90-day data retention",
    ],
  },
  {
    plan: "PRO",
    label: "Pro",
    description: "For growing teams that need more insights and power.",
    prices: { monthly: 19, yearly: 190 },
    features: [
      "5,000 feedbacks / month",
      "10 campaigns",
      "10 team members",
      "5 widgets",
      "6 feedback categories",
      "1-year data retention",
      "CSV export",
      "Feedback reply",
      "Generic webhooks",
    ],
  },
  {
    plan: "BUSINESS",
    label: "Business",
    description: "For large teams with advanced needs and full control.",
    prices: { monthly: 79, yearly: 790 },
    features: [
      "20,000 feedbacks / month",
      "50 campaigns",
      "50 team members",
      "10 widgets",
      "10 feedback categories",
      "Unlimited data retention",
      "CSV export",
      "Feedback reply",
      "Remove branding",
      "Full API access",
      "Generic webhooks",
    ],
  },
];
