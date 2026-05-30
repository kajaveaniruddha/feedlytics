/**
 * Icon + label row (member counts, feedback counts, KPI chips).
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type MetricInlineProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function MetricInline({ icon, children, className }: MetricInlineProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-secondary-gray-600 dark:text-secondary-gray-600", className)}>
      <span className="flex shrink-0 text-secondary-gray-500 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:stroke-current">
        {icon}
      </span>
      {children}
    </span>
  );
}
