import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type DistributionSegment = {
  id: string;
  label: string;
  value: number;
  colorClass: string;
};

export type SegmentedDistributionBarProps = {
  segments: DistributionSegment[];
  className?: string;
  "aria-label"?: string;
};

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function SegmentedDistributionBar({
  segments,
  className,
  "aria-label": ariaLabel,
}: SegmentedDistributionBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const visibleSegments = segments.filter((segment) => segment.value > 0);

  if (total <= 0 || visibleSegments.length === 0) {
    return (
      <div
        className={cn(
          "h-3 w-full rounded-full bg-secondary-gray-400 dark:bg-white/15",
          className,
        )}
        role="img"
        aria-label={ariaLabel ?? "No distribution data"}
      />
    );
  }

  const summary =
    ariaLabel ??
    visibleSegments
      .map((segment) => {
        const percent = clampPercent(Math.round((segment.value / total) * 100));
        return `${segment.label} ${percent}%`;
      })
      .join(", ");

  return (
    <div
      className={cn("flex h-3 w-full overflow-hidden rounded-full", className)}
      role="img"
      aria-label={summary}
    >
      {visibleSegments.map((segment) => {
        const width = clampPercent((segment.value / total) * 100);
        return (
          <div
            key={segment.id}
            className={cn("h-full min-w-0 transition-[width] duration-300 ease-out", segment.colorClass)}
            style={{ width: `${width}%` }}
            title={`${segment.label}: ${segment.value}`}
          />
        );
      })}
    </div>
  );
}
