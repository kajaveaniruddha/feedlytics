/**
 * Circular KPI icon container (muted disc or translucent on brand gradient).
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type KpiIconDiscProps = {
  children: React.ReactNode;
  variant?: "default" | "onGradient";
  className?: string;
};

export function KpiIconDisc({ children, variant = "default", className }: KpiIconDiscProps) {
  return (
    <div
      data-slot="kpi-icon-disc"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full",
        variant === "default" &&
          "bg-secondary-gray-100 text-brand-500 dark:bg-navy-700 dark:text-brand-100",
        variant === "onGradient" && "bg-white/15 text-white",
        className,
      )}
      aria-hidden
    >
      <span className="flex items-center justify-center [&_svg]:size-[22px] [&_svg]:shrink-0">{children}</span>
    </div>
  );
}
