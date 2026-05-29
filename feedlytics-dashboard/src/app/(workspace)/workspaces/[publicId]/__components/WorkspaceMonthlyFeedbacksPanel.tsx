"use client";

import { BarChart3Icon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { MutedText } from "@/components/ui/muted-text";
import { SparklineAreaChart } from "@/components/ui/sparkline-area-chart";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

import type { RollingFeedbackTrend } from "@/features/workspace/types/overview.types";

export type WorkspaceMonthlyFeedbacksPanelProps = {
  trend: RollingFeedbackTrend;
};

function formatChangeBadge(changePercent: number): string {
  const rounded = Math.round(changePercent * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

export function WorkspaceMonthlyFeedbacksPanel({ trend }: WorkspaceMonthlyFeedbacksPanelProps) {
  const values = trend.dailyCounts.map((point) => point.count);
  const isPositiveChange = trend.changePercent >= 0;

  return (
    <Card>
      <CardContent className="flex w-full flex-1 flex-col items-center pt-6">
        <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-secondary-gray-100 dark:bg-white/10">
          <BarChart3Icon className="size-4 text-brand-500" strokeWidth={2} aria-hidden />
        </div>
        <p className="text-[13px] font-medium text-secondary-gray-600 dark:text-white/70">This month feedbacks</p>
        <MutedText tone="subtle" className="mt-0.5 text-xs">
          Last 30 days
        </MutedText>
        <p className="mt-1 text-[34px] leading-none font-bold text-navy-900 dark:text-white">
          +{formatNumber(trend.count)}
        </p>
        <span
          className={cn(
            "mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
            isPositiveChange
              ? "bg-[#E6FAF5] text-[#01B574] dark:bg-[#01B574]/15"
              : "bg-[#FEEFEE] text-[#EE5D50] dark:bg-[#EE5D50]/15",
          )}
        >
          {formatChangeBadge(trend.changePercent)}
        </span>
        <div className="mt-auto h-[100px] w-[calc(100%+2.5rem)] -mx-5 pt-2.5">
          <SparklineAreaChart values={values} />
        </div>
      </CardContent>
    </Card>
  );
}
