/**
 * Pill search container (Horizon workspace picker). Wraps `Input variant="searchInset"`.
 */
import * as React from "react";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type SearchFieldShellProps = {
  /** When `search`, renders a standard magnifier icon with stroke styling. */
  preset?: "custom" | "search";
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** `toolbar` — min width for dense header toolbars (e.g. workspace picker). */
  minWidth?: "default" | "toolbar";
  className?: string;
};

export function SearchFieldShell({
  preset = "custom",
  icon,
  children,
  minWidth = "default",
  className,
}: SearchFieldShellProps) {
  const resolvedIcon =
    preset === "search" ? (
      <SearchIcon aria-hidden className="stroke-current" strokeWidth={2} />
    ) : (
      icon ?? <SearchIcon aria-hidden className="stroke-current" strokeWidth={2} />
    );

  return (
    <div
      data-slot="search-field-shell"
      className={cn(
        "flex h-6 min-w-0 flex-1 items-center gap-2 rounded-full bg-surface shadow-card md:max-w-[240px] md:flex-initial dark:shadow-none",
        minWidth === "toolbar" && "min-w-[10rem]",
        className,
      )}
    >
      <span className="flex shrink-0 text-secondary-gray-600 [&_svg]:size-[15px] [&_svg]:shrink-0">
        {resolvedIcon}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
