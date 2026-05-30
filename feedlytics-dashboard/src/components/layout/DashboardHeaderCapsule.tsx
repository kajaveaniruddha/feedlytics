"use client";

import * as React from "react";
import { InfoIcon } from "lucide-react";

import { ToolbarThemeToggle } from "@/components/layout/ToolbarThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { PendingInvitesMenu } from "@/components/layout/PendingInvitesMenu";
import { cn } from "@/lib/utils/cn";

export type DashboardHeaderCapsuleProps = {
  /** When true, renders the `search` slot inside an inset pill on the left. */
  showSearch?: boolean;
  /** Search row (e.g. `SearchFieldShell` + `Input`); only used when `showSearch`. */
  search?: React.ReactNode;
  userInitials: string;
  className?: string;
};

export function DashboardHeaderCapsule({
  showSearch = false,
  search,
  userInitials,
  className,
}: DashboardHeaderCapsuleProps) {
  const actionIconClass =
    "text-secondary-gray-600 hover:text-navy-700 hover:bg-secondary-gray-100 dark:hover:bg-white/10 dark:hover:text-white";

  return (
    <div
      data-slot="dashboard-header-capsule"
      className={cn(
        "flex min-w-0 max-w-full items-center gap-2 rounded-full border border-secondary-gray-100 bg-surface px-2 py-1.5 shadow-card dark:border-white/10 dark:bg-navy-800 dark:shadow-none md:gap-3 md:px-2.5 md:py-2",
        className,
      )}
    >
      {showSearch && search != null ? (
        <div
          className={cn(
            "flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1.5",
            "bg-[#F3F4F9] dark:bg-navy-700/90",
            "md:max-w-[min(100%,280px)] md:flex-initial",
          )}
        >
          {search}
        </div>
      ) : null}

      <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
        <PendingInvitesMenu actionIconClass={actionIconClass} />
        <ToolbarThemeToggle />
        <IconButton
          type="button"
          variant="ghost"
          size="icon-sm"
          label="Help (coming soon)"
          className={actionIconClass}
        >
          <InfoIcon className="size-[18px]" strokeWidth={2} />
        </IconButton>
        <Avatar size="md" className="ml-0.5">
          <AvatarFallback tone="brand">{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
