import type { WorkspacePlanUsageResponseDto } from "@/features/workspace/types/plan-usage.types";

export const workspacePlanUsageFixture: WorkspacePlanUsageResponseDto = {
  success: true,
  plan: "PRO",
  periodStart: "2026-05-01T00:00:00Z",
  periodEnd: "2026-06-01T00:00:00Z",
  monthlyFeedback: {
    used: 847,
    limit: 2000,
  },
  feedbacksBySourceType: [
    {
      sourceType: "API_KEY",
      used: 1240,
      limit: 5000,
      limitKind: "API_MONTHLY",
    },
    {
      sourceType: "WIDGET",
      used: 300,
      limit: 2000,
      limitKind: "SHARED_MONTHLY_FEEDBACK",
    },
    {
      sourceType: "CAMPAIGN",
      used: 40,
      limit: 2000,
      limitKind: "SHARED_MONTHLY_FEEDBACK",
    },
  ],
  members: {
    used: 5,
    limit: 10,
  },
};

export const workspacePlanUsageArchivedFixture: WorkspacePlanUsageResponseDto = {
  ...workspacePlanUsageFixture,
  plan: "ARCHIVED",
  monthlyFeedback: { used: 0, limit: 0 },
  feedbacksBySourceType: [
    { sourceType: "API_KEY", used: 0, limit: 0, limitKind: "API_MONTHLY" },
    { sourceType: "WIDGET", used: 0, limit: 0, limitKind: "SHARED_MONTHLY_FEEDBACK" },
    { sourceType: "CAMPAIGN", used: 0, limit: 0, limitKind: "SHARED_MONTHLY_FEEDBACK" },
  ],
  members: { used: 1, limit: 2 },
};
