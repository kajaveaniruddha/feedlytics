/**
 * Responsive row of KPI cards (typically four on wide dashboards).
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type KpiStatCardGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function KpiStatCardGrid({ children, className }: KpiStatCardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
