/**
 * Two-row toolbar: stacks on small screens, splits on `md+`.
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type DashboardToolbarProps = {
  leading?: React.ReactNode;
  trailing: React.ReactNode;
  className?: string;
};

export function DashboardToolbar({ leading, trailing, className }: DashboardToolbarProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-center",
        leading != null ? "md:justify-between" : "md:justify-end",
        className,
      )}
    >
      {leading != null ? <div className="flex items-center gap-2">{leading}</div> : null}
      <div className="flex flex-wrap items-center gap-2.5 md:justify-end">{trailing}</div>
    </header>
  );
}
