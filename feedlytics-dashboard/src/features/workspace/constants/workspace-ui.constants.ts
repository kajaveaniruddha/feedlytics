import type { WorkspacePlan } from "@/features/workspace/types/workspace.types";

const PLAN_LABEL: Record<WorkspacePlan, string> = {
  FREE: "Free",
  PRO: "Pro",
  BUSINESS: "Business",
  ARCHIVED: "Archived",
};

export function formatWorkspacePlanLabel(plan: WorkspacePlan): string {
  return PLAN_LABEL[plan];
}
