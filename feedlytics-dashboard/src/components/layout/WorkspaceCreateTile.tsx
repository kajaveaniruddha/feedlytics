/**
 * Dashed “create workspace” tile from the Horizon workspace picker UX.
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type WorkspaceCreateTileProps = {
  title: string;
  subtitle: string;
  disabled?: boolean;
  disabledHint?: string;
  onActivate?: () => void;
  className?: string;
};

export function WorkspaceCreateTile({
  title,
  subtitle,
  disabled,
  disabledHint,
  onActivate,
  className,
}: WorkspaceCreateTileProps) {
  return (
    <div
      data-slot="workspace-create-tile"
      className={cn(
        "group flex min-h-[215px] w-full flex-col items-center justify-center gap-0 rounded-2xl border-2 border-dashed border-secondary-gray-100 bg-transparent px-5 text-center transition-all dark:border-white-alpha-100",
        !disabled &&
          "cursor-pointer hover:border-brand-400 hover:bg-surface hover:shadow-card dark:hover:shadow-none",
        disabled && "cursor-not-allowed opacity-80",
        className,
      )}
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? undefined : 0}
      aria-disabled={disabled || undefined}
      aria-label={disabled && disabledHint ? `${title}. ${disabledHint}` : title}
      onClick={() => {
        if (!disabled && onActivate) onActivate();
      }}
      onKeyDown={(e) => {
        if (disabled || !onActivate) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      <div
        className={cn(
          "mb-3.5 flex size-[52px] items-center justify-center rounded-full bg-secondary-gray-300 transition-colors dark:bg-navy-700",
          !disabled && "group-hover:bg-brand-500",
        )}
      >
        <span
          className={cn(
            "text-2xl font-light leading-none text-brand-500 transition-colors",
            !disabled && "group-hover:text-white group-hover:rotate-90 transition-all",
          )}
          aria-hidden
        >
          +
        </span>
      </div>
      <h3 className="font-heading text-base font-bold text-navy-700 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-[220px] text-xs text-secondary-gray-600 dark:text-secondary-gray-600">
        {disabled && disabledHint ? disabledHint : subtitle}
      </p>
    </div>
  );
}
