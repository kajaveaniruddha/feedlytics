export const PLAN_TIERS = ["free", "pro", "business"] as const;
export type PlanTier = (typeof PLAN_TIERS)[number];

export const PLAN_LIMITS: Record<PlanTier, {
  maxFeedbacksPerMonth: number;
  maxWorkflows: number;
  maxTeamMembers: number;
  maxProjects: number;
  dataRetentionDays: number;
  features: {
    csvExport: boolean;
    feedbackReply: boolean;
    removeBranding: boolean;
    apiAccess: boolean;
    genericWebhook: boolean;
  };
}> = {
  free: {
    maxFeedbacksPerMonth: 200,
    maxWorkflows: 3,
    maxTeamMembers: 1,
    maxProjects: 1,
    dataRetentionDays: 90,
    features: {
      csvExport: false,
      feedbackReply: false,
      removeBranding: false,
      apiAccess: false,
      genericWebhook: false,
    },
  },
  pro: {
    maxFeedbacksPerMonth: 2000,
    maxWorkflows: 15,
    maxTeamMembers: 5,
    maxProjects: 3,
    dataRetentionDays: 365,
    features: {
      csvExport: true,
      feedbackReply: true,
      removeBranding: false,
      apiAccess: false,
      genericWebhook: true,
    },
  },
  business: {
    maxFeedbacksPerMonth: 20000,
    maxWorkflows: Infinity,
    maxTeamMembers: 25,
    maxProjects: Infinity,
    dataRetentionDays: Infinity,
    features: {
      csvExport: true,
      feedbackReply: true,
      removeBranding: true,
      apiAccess: true,
      genericWebhook: true,
    },
  },
};

export function getPlanForPrice(priceId: string): { tier: PlanTier; interval: "monthly" | "yearly" } | undefined {
  const map: Record<string, { tier: PlanTier; interval: "monthly" | "yearly" }> = {
    [process.env.STRIPE_PRICE_PRO_MONTHLY ?? ""]: { tier: "pro", interval: "monthly" },
    [process.env.STRIPE_PRICE_PRO_YEARLY ?? ""]: { tier: "pro", interval: "yearly" },
    [process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? ""]: { tier: "business", interval: "monthly" },
    [process.env.STRIPE_PRICE_BUSINESS_YEARLY ?? ""]: { tier: "business", interval: "yearly" },
  };
  return map[priceId];
}
