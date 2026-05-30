import type { WorkspacePlan } from "@/features/workspace/types/workspace.types";

export type WorkspacePlanUsageSourceType = "API_KEY" | "WIDGET" | "CAMPAIGN";

export type WorkspacePlanUsageLimitKind = "API_MONTHLY" | "SHARED_MONTHLY_FEEDBACK";

export type WorkspacePlanUsageMetric = {
  used: number;
  limit: number;
};

export type WorkspacePlanUsageBySourceTypeDto = {
  sourceType: WorkspacePlanUsageSourceType;
  used: number;
  limit: number;
  limitKind: WorkspacePlanUsageLimitKind;
};

export type WorkspacePlanUsageResponseDto = {
  success: boolean;
  plan: WorkspacePlan;
  periodStart: string;
  periodEnd: string;
  monthlyFeedback: WorkspacePlanUsageMetric;
  feedbacksBySourceType: WorkspacePlanUsageBySourceTypeDto[];
  members: WorkspacePlanUsageMetric;
};
