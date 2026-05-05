"use client";

import { KpiStatCard } from "@/components/layout/KpiStatCard";
import { KpiStatCardGrid } from "@/components/layout/KpiStatCardGrid";
import { workspaceDashboardKpiCopy } from "@/features/workspace/constants/workspace-dashboard.constants";
import { workspaceKpiIconSlots } from "@/features/workspace/constants/workspace-kpi-icons";
import { formatTopCategoryDisplay } from "@/features/workspace/lib/format-workspace-overview";
import { formatNumber, formatPercentFromHundred, formatRating } from "@/lib/utils/format";

import type { WorkspaceOverviewAnalytics } from "@/features/workspace/types/overview.types";

export type WorkspaceKpiSectionProps = {
  analytics: WorkspaceOverviewAnalytics;
};

export function WorkspaceKpiSection({ analytics }: WorkspaceKpiSectionProps) {
  return (
    <KpiStatCardGrid>
      <KpiStatCard
        icon={workspaceKpiIconSlots.totalFeedbacks}
        label={workspaceDashboardKpiCopy.totalFeedbacks}
        value={formatNumber(analytics.totalFeedbacks)}
      />
      <KpiStatCard
        icon={workspaceKpiIconSlots.averageRating}
        label={workspaceDashboardKpiCopy.averageRating}
        value={formatRating(analytics.averageRating)}
      />
      <KpiStatCard
        icon={workspaceKpiIconSlots.topCategory}
        label={workspaceDashboardKpiCopy.topCategory}
        value={formatTopCategoryDisplay(analytics.topCategory)}
      />
      <KpiStatCard
        variant="highlight"
        icon={workspaceKpiIconSlots.positiveSentiment}
        label={workspaceDashboardKpiCopy.positiveSentiment}
        value={formatPercentFromHundred(analytics.positiveSentimentPercentage)}
      />
    </KpiStatCardGrid>
  );
}
