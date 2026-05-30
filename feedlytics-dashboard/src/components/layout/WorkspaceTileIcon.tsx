/**
 * Rounded square initials tile for workspace cards (Horizon picker).
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type WorkspaceTileIconTone = "brand" | "muted" | "gradient";

export type WorkspaceTileIconProps = {
  initials: string;
  tone: WorkspaceTileIconTone;
  /** `sm` — top bar mark (34px). `md` — workspace cards (52px). */
  size?: "sm" | "md";
  className?: string;
};

const toneClass: Record<WorkspaceTileIconTone, string> = {
  brand: "bg-brand-500 text-white",
  muted: "bg-secondary-gray-500 text-white dark:bg-secondary-gray-700",
  gradient: "bg-gradient-to-br from-[#868CFF] to-brand-600 text-white",
};

const sizeClass: Record<NonNullable<WorkspaceTileIconProps["size"]>, string> = {
  sm: "size-[34px] rounded-[10px] text-[15px]",
  md: "size-[52px] rounded-[14px] text-lg",
};

export function WorkspaceTileIcon({
  initials,
  tone,
  size = "md",
  className,
}: WorkspaceTileIconProps) {
  return (
    <div
      data-slot="workspace-tile-icon"
      className={cn(
        "flex shrink-0 items-center justify-center font-bold tracking-tight",
        sizeClass[size],
        toneClass[tone],
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
