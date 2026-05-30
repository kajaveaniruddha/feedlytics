/**
 * Compact app mark: rounded initials tile + uppercase wordmark.
 */
import * as React from "react";

import { WorkspaceTileIcon } from "@/components/layout/WorkspaceTileIcon";
import { cn } from "@/lib/utils/cn";

export type AppWordMarkProps = {
  initials: string;
  children: React.ReactNode;
  className?: string;
};

export function AppWordMark({ initials, children, className }: AppWordMarkProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <WorkspaceTileIcon initials={initials} tone="brand" size="sm" />
      <span className="font-heading text-[15px] font-bold leading-none tracking-wide text-navy-700 uppercase dark:text-white">
        {children}
      </span>
    </div>
  );
}
