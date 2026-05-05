/**
 * Single KPI highlight (dashboard overview tiles).
 */
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import {
  brandAccentGradientFill,
  brandAccentOnGradientMutedText,
} from "@/lib/ui/brand-accent-gradient";
import { cn } from "@/lib/utils/cn";

export type KpiStatCardProps = {
  label: string;
  value: string;
  hint?: React.ReactNode;
  variant?: "default" | "highlight";
  /** Right-side icon disc or custom decoration (e.g. from `workspaceKpiIconSlots`). */
  icon?: React.ReactNode;
};

export function KpiStatCard({
  label,
  value,
  hint,
  variant = "default",
  icon,
}: KpiStatCardProps) {
  const isHighlight = variant === "highlight";

  return (
    <Card
      className={cn(
        isHighlight &&
          cn(brandAccentGradientFill, "border-0 shadow-card dark:border-0 dark:shadow-none"),
      )}
    >
      <CardContent className="flex flex-row items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          {isHighlight ? (
            <p className={cn("text-xs font-medium", brandAccentOnGradientMutedText)}>{label}</p>
          ) : (
            <MutedText tone="subtle" className="text-xs font-medium">
              {label}
            </MutedText>
          )}
          <Heading
            variant="kpi"
            as="p"
            className={cn(isHighlight && "text-white dark:text-white")}
          >
            {value}
          </Heading>
          {hint != null && hint !== false ? (
            isHighlight ? (
              <p className={cn("text-xs", brandAccentOnGradientMutedText)}>{hint}</p>
            ) : (
              <MutedText tone="subtle" className="text-xs">
                {hint}
              </MutedText>
            )
          ) : null}
        </div>
        {icon != null ? (
          <div className="flex shrink-0 items-center justify-center">{icon}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
