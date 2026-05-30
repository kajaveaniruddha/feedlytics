"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MutedText } from "@/components/ui/muted-text";
import { PlanUsageMeter } from "@/components/ui/plan-usage-meter";
import { Stack } from "@/components/ui/stack";
import { routes } from "@/config/routes";
import { useWorkspacePlanUsage } from "@/features/workspace/hooks/useWorkspacePlanUsage";
import { cn } from "@/lib/utils/cn";

import type {
  WorkspacePlanUsageBySourceTypeDto,
  WorkspacePlanUsageSourceType,
} from "@/features/workspace/types/plan-usage.types";

export type WorkspacePlanUsagePanelProps = {
  workspacePublicId: string;
};

const sourceTypeLabelMap: Pick<Record<WorkspacePlanUsageSourceType, string>, "API_KEY"> = {
  API_KEY: "API",
};

function sourceMetric(
  rows: WorkspacePlanUsageBySourceTypeDto[],
  sourceType: WorkspacePlanUsageSourceType,
  fallbackLimit: number,
): { used: number; limit: number } {
  const found = rows.find((row) => row.sourceType === sourceType);
  if (!found) {
    return { used: 0, limit: fallbackLimit };
  }
  return { used: found.used, limit: found.limit };
}

function daysUntilReset(periodEndIso: string): number {
  const resetAt = Date.parse(periodEndIso);
  if (Number.isNaN(resetAt)) return 0;
  const ms = resetAt - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

function formatPlanName(plan: string): string {
  const normalized = plan.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function PlanUsageMeterSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      <div className="flex items-end justify-between gap-3">
        <div className="h-3 w-20 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" />
        <div className="h-3 w-16 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" />
      </div>
      <div className="h-2 w-full animate-pulse rounded-full bg-secondary-gray-200 dark:bg-white/10" />
    </div>
  );
}

function PlanUsagePanelSkeleton() {
  return (
    <Card aria-busy aria-label="Loading plan usage">
      <CardHeader>
        <CardTitle>Plan Usage</CardTitle>
        <div className="mt-1 h-4 w-48 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" aria-hidden />
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          <PlanUsageMeterSkeleton />
          <PlanUsageMeterSkeleton />
          <PlanUsageMeterSkeleton />
        </Stack>
        <div
          className="mt-4 h-9 w-full animate-pulse rounded-full bg-secondary-gray-200 dark:bg-white/10"
          aria-hidden
        />
      </CardContent>
    </Card>
  );
}

export function WorkspacePlanUsagePanel({ workspacePublicId }: WorkspacePlanUsagePanelProps) {
  const { data, isPending, isError, error, refetch } = useWorkspacePlanUsage(workspacePublicId);

  if (isPending) {
    return <PlanUsagePanelSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <MutedText>{error?.message ?? "Could not load plan usage."}</MutedText>
          <Button type="button" size="sm" onClick={() => void refetch()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const feedbacks = data.monthlyFeedback;
  const members = data.members;
  const api = sourceMetric(data.feedbacksBySourceType, "API_KEY", 0);
  const resetDays = daysUntilReset(data.periodEnd);
  const planName = formatPlanName(data.plan);

  return (
    <Card>
      <CardHeader >
        <CardTitle>Plan Usage</CardTitle>
        <MutedText tone="subtle">
          {planName} Plan · Resets in {resetDays} day{resetDays === 1 ? "" : "s"}
        </MutedText>
      </CardHeader>
      <CardContent>
        <Stack gap="sm">
          <PlanUsageMeter label="Feedbacks" used={feedbacks.used} limit={feedbacks.limit} tone="brand" />
          <PlanUsageMeter label={sourceTypeLabelMap.API_KEY} used={api.used} limit={api.limit} tone="green" />
          <PlanUsageMeter label="Team Members" used={members.used} limit={members.limit} tone="orange" />
        </Stack>
          <Link
            href={routes.workspaceBilling(workspacePublicId)}
            className={cn(buttonVariants({ variant: "brand", size: "sm" }), "mt-4 w-full rounded-full")}
          >
            Upgrade Plan
          </Link>
      </CardContent>
    </Card>
  );
}
