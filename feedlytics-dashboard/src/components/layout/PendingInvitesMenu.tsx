"use client";

import * as React from "react";
import { BellIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MutedText } from "@/components/ui/muted-text";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils/cn";
import { usePendingInviteMutations } from "@/features/workspace/hooks/usePendingInviteMutations";
import { usePendingInvites } from "@/features/workspace/hooks/usePendingInvites";
import { formatDate } from "@/lib/utils/format";
import { ApiError } from "@/services/api/errors/ApiError";

export type PendingInvitesMenuProps = {
  /** Matches header capsule icon styling */
  actionIconClass?: string;
};

export function PendingInvitesMenu({ actionIconClass }: PendingInvitesMenuProps) {
  const { data: invites = [], isPending } = usePendingInvites();
  const { acceptPending, rejectPending } = usePendingInviteMutations();
  const count = invites.length;

  const badgeLabel = count > 9 ? "9+" : count > 0 ? String(count) : null;

  const onAccept = (inviteId: string) => {
    acceptPending.mutate(inviteId, {
      onSuccess: (res) => {
        toast.success(res.message, { description: `You joined ${res.workspaceName}.` });
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Could not accept invite");
      },
    });
  };

  const onReject = (inviteId: string) => {
    rejectPending.mutate(inviteId, {
      onSuccess: () => {
        toast.success("Invitation declined");
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Could not decline invite");
      },
    });
  };

  const busyId =
    acceptPending.isPending && acceptPending.variables
      ? acceptPending.variables
      : rejectPending.isPending && rejectPending.variables
        ? rejectPending.variables
        : null;

  return (
    <DropdownMenu modal={false}>
      <div className="relative inline-flex shrink-0">
        <DropdownMenuTrigger
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "rounded-full",
            actionIconClass,
          )}
          aria-label="Workspace invitations"
        >
          <BellIcon className="size-4" strokeWidth={2} aria-hidden />
        </DropdownMenuTrigger>
        {badgeLabel != null ? (
          <span
            className="pointer-events-none absolute -top-0.5 -right-0.5 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white shadow-sm ring-2 ring-popover"
            aria-hidden
          >
            {badgeLabel}
          </span>
        ) : null}
      </div>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="flex max-h-[min(16rem,calc(100vh-5rem))] w-[min(100vw-1.5rem,17.5rem)] min-w-0 flex-col overflow-hidden p-0"
      >
        <div className="border-b border-border px-2.5 py-2">
          <DropdownMenuLabel className="px-0 py-0 text-xs font-bold text-foreground">
            Invitations
          </DropdownMenuLabel>
          <MutedText tone="subtle" className="text-[11px] leading-snug">
            Pending invites to your email.
          </MutedText>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 py-0.5">
          {isPending ? (
            <div className="px-2 py-5 text-center">
              <MutedText tone="subtle" className="text-xs">
                Loading…
              </MutedText>
            </div>
          ) : count === 0 ? (
            <div className="px-2 py-5 text-center">
              <MutedText tone="subtle" className="text-xs">
                No pending invitations.
              </MutedText>
            </div>
          ) : (
            <Stack gap="none">
              {invites.map((inv, index) => (
                <React.Fragment key={inv.inviteId}>
                  {index > 0 ? <Separator className="my-0.5" /> : null}
                  <div className="flex flex-col gap-1.5 rounded-md px-1.5 py-1.5">
                    <div>
                      <p className="text-xs font-bold leading-snug text-foreground">{inv.workspaceName}</p>
                      <MutedText tone="subtle" className="text-[11px] leading-snug">
                        {inv.role} · {formatDate(inv.expiresAt)}
                      </MutedText>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        variant="brand"
                        size="sm"
                        className="h-8 flex-1 px-2 text-xs"
                        disabled={busyId === inv.inviteId}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAccept(inv.inviteId);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 flex-1 px-2 text-xs"
                        disabled={busyId === inv.inviteId}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onReject(inv.inviteId);
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </Stack>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
