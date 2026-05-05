"use client";

import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { useLogout } from "@/features/auth/hooks/useLogout";
import { cn } from "@/lib/utils/cn";

export type WorkspaceLogoutNavItemProps = {
  className?: string;
  onLogout?: () => void;
};

export function WorkspaceLogoutNavItem({ className, onLogout }: WorkspaceLogoutNavItemProps) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className={cn("mt-auto border-t border-secondary-gray-200 pt-4 dark:border-white/10", className)}>
      <button
        type="button"
        disabled={isPending}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-secondary-gray-600 transition-colors",
          "hover:text-red-500 disabled:pointer-events-none disabled:opacity-50 dark:text-secondary-gray-600",
        )}
        onClick={() => {
          onLogout?.();
          logout(undefined, {
            onError: (err) => {
              toast.error(err.message ?? "Logout failed");
            },
          });
        }}
      >
        <LogOutIcon className="size-[18px] shrink-0 stroke-[2]" aria-hidden />
        <span>Log Out</span>
      </button>
    </div>
  );
}
