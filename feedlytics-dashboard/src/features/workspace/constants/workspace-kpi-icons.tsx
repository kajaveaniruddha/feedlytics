/**
 * Default Lucide icons for workspace KPI cards. Swap icons here only.
 */
import { BarChart3Icon, MessageSquareIcon, StarIcon, TagIcon } from "lucide-react";

import { KpiIconDisc } from "@/components/layout/KpiIconDisc";

export const workspaceKpiIconSlots = {
  totalFeedbacks: (
    <KpiIconDisc>
      <MessageSquareIcon strokeWidth={2} />
    </KpiIconDisc>
  ),
  averageRating: (
    <KpiIconDisc>
      <StarIcon strokeWidth={2} />
    </KpiIconDisc>
  ),
  topCategory: (
    <KpiIconDisc>
      <TagIcon strokeWidth={2} />
    </KpiIconDisc>
  ),
  positiveSentiment: (
    <KpiIconDisc variant="onGradient">
      <BarChart3Icon strokeWidth={2} />
    </KpiIconDisc>
  ),
} as const;
