"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabeledHorizontalBar } from "@/components/ui/labeled-horizontal-bar";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import { routes } from "@/config/routes";
import {
  buildCategoryChartRows,
  categoryBarMax,
} from "@/features/workspace/lib/overview-distribution";
import type { CategoryAnalyticsBreakdown } from "@/features/workspace/types/overview.types";
import { cn } from "@/lib/utils/cn";

export type WorkspaceCategoryBreakdownPanelProps = {
  categories: CategoryAnalyticsBreakdown;
  workspacePublicId: string;
};

export function WorkspaceCategoryBreakdownPanel({
  categories,
  workspacePublicId,
}: WorkspaceCategoryBreakdownPanelProps) {
  if (categories.state === "NOT_CONFIGURED") {
    return (
      <Card>
        <CardHeader >
          <CardTitle>Feedback by category</CardTitle>
          <MutedText tone="subtle">Category tagging for feedback analysis</MutedText>
        </CardHeader>
        <CardContent>
          <MutedText>{categories.message ?? "Categories are not configured for this workspace."}</MutedText>
          <Link
            href={routes.workspaceSettings(workspacePublicId)}
            className={cn(buttonVariants({ variant: "brand", size: "sm" }), "w-fit rounded-full")}
          >
            Set up categories
          </Link>
        </CardContent>
      </Card>
    );
  }

  const chartRows = buildCategoryChartRows(categories.items ?? [], categories.otherCount ?? 0);
  const hasItems = chartRows.length > 0;
  const barMax = categoryBarMax(chartRows);

  return (
    <Card>
      <CardHeader >
        <CardTitle>Feedback by category</CardTitle>
        <MutedText tone="subtle">Distribution across configured categories</MutedText>
      </CardHeader>
      <CardContent>
        {!hasItems ? (
          <MutedText>No categorized feedback yet.</MutedText>
        ) : (
          <Stack gap="md">
            {chartRows.map((row) => (
              <LabeledHorizontalBar
                key={row.key}
                label={row.label}
                value={row.value}
                max={barMax}
                tone={row.isUncategorizedBucket ? "neutral" : "brand"}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
