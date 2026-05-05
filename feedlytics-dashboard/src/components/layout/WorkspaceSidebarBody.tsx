"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppWordMark } from "@/components/layout/AppWordMark";
import { WorkspaceLogoutNavItem } from "@/components/layout/WorkspaceLogoutNavItem";
import { workspaceSidebarNavEntries } from "@/components/layout/workspace-sidebar.constants";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/constants/app.constants";
import { routes } from "@/config/routes";
import { workspacePublicIdFromPathname } from "@/features/workspace/lib/workspace-path";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";
import { cn } from "@/lib/utils/cn";

export type WorkspaceSidebarBodyProps = {
  /** Close mobile drawer after navigation */
  onNavigate?: () => void;
  className?: string;
};

export function WorkspaceSidebarBody({ onNavigate, className }: WorkspaceSidebarBodyProps) {
  const pathname = usePathname() ?? "";
  const workspacePublicId = workspacePublicIdFromPathname(pathname);
  if (!workspacePublicId) {
    return null;
  }
  const ctx = { workspacePublicId };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-0 px-4 pb-6 pt-7 lg:min-h-screen lg:w-[250px] lg:shrink-0 lg:px-4",
        className,
      )}
    >
      <div className="mb-6 flex flex-col gap-3 px-2.5">
        <AppWordMark initials={workspaceInitials(APP_NAME)}>{APP_NAME}</AppWordMark>
        <Link
          href={routes.workspaces}
          prefetch={false}
          className="flex items-center gap-1.5 text-sm font-medium text-secondary-gray-600 transition-colors hover:text-brand-500 dark:hover:text-brand-100"
          onClick={() => onNavigate?.()}
        >
          <ChevronLeftIcon className="size-4 shrink-0 stroke-[2]" aria-hidden />
          All workspaces
        </Link>
      </div>
      <Separator className="mb-6 bg-secondary-gray-200 dark:bg-white/10" />
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto" aria-label="Workspace">
        {workspaceSidebarNavEntries.map((entry) => {
          const href = entry.resolveHref(ctx);
          const active = entry.resolveActive(pathname, ctx);
          const Icon = entry.icon;
          const content = (
            <>
              <Icon
                className={cn(
                  "size-[18px] shrink-0 stroke-[2]",
                  active ? "text-brand-500" : "text-current",
                )}
                aria-hidden
              />
              <span>{entry.label}</span>
            </>
          );
          const itemClass = cn(
            "relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
            active
              ? "bg-surface font-bold text-navy-700 shadow-[0_2px_8px_rgba(67,24,255,0.08)] before:absolute before:top-1/2 before:left-0 before:h-7 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-brand-500 dark:text-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
              : "text-secondary-gray-600 hover:text-navy-700 dark:hover:text-white",
          );

          if (href) {
            return (
              <Link
                key={entry.id}
                href={href}
                className={itemClass}
                prefetch={false}
                onClick={() => onNavigate?.()}
              >
                {content}
              </Link>
            );
          }

          return (
            <span
              key={entry.id}
              className={cn(itemClass, "cursor-not-allowed opacity-50")}
              aria-disabled="true"
            >
              {content}
            </span>
          );
        })}
      </nav>
      <WorkspaceLogoutNavItem onLogout={onNavigate} />
    </div>
  );
}
