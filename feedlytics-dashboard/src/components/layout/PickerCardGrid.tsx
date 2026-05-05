/**
 * Auto-fill card grid for workspace / resource pickers.
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type PickerCardGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function PickerCardGrid({ children, className }: PickerCardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
