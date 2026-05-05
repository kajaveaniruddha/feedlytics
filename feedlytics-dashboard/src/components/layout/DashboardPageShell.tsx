/**
 * Constrained dashboard / picker page width + vertical rhythm.
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type DashboardPageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardPageShell({ children, className }: DashboardPageShellProps) {
  return (
    <div className={cn("mx-auto flex w-full flex-col gap-10 px-6 py-9 container", className)}>{children}</div>
  );
}
