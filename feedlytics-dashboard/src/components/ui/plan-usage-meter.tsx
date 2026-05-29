import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const meterFillVariants = cva("h-full rounded-full transition-[width] duration-300 ease-out", {
  variants: {
    tone: {
      brand: "bg-gradient-to-r from-[#868CFF] to-brand-500",
      green: "bg-gradient-to-r from-[#43E89E] to-[#01B574]",
      orange: "bg-gradient-to-r from-[#FFD580] to-[#FFB547]",
    },
  },
  defaultVariants: {
    tone: "brand",
  },
});

export type PlanUsageMeterProps = {
  label: string;
  used: number;
  limit: number;
  formatValue?: (value: number) => string;
  className?: string;
} & VariantProps<typeof meterFillVariants>;

function toPercent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  const raw = (used / limit) * 100;
  return Math.max(0, Math.min(100, raw));
}

export function PlanUsageMeter({
  label,
  used,
  limit,
  tone,
  className,
  formatValue = (value) => value.toLocaleString(),
}: PlanUsageMeterProps) {
  const percent = toPercent(used, limit);
  const usedText = formatValue(used);
  const limitText = formatValue(limit);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end justify-between gap-3">
        <p className="text-xs font-semibold text-navy-900 dark:text-white">{label}</p>
        <p className="text-xs font-medium text-secondary-gray-600 dark:text-white/70">
          {usedText} / {limitText}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-gray-400 dark:bg-white/15">
        <div
          className={meterFillVariants({ tone })}
          style={{ width: `${percent}%` }}
          role="meter"
          aria-label={`${label} usage`}
          aria-valuemin={0}
          aria-valuenow={used}
          aria-valuemax={limit}
        />
      </div>
    </div>
  );
}
