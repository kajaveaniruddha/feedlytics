"use client";

import { MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import type { MemberDataDto } from "@/features/workspace/types/team.types";
import type { WorkspaceRole } from "@/features/workspace/types/workspace.types";

export type MemberRowActionsProps = {
  member: MemberDataDto;
  viewerPublicId: string;
  viewerRole?: WorkspaceRole;
  onPromoteAdmin: () => void;
  onDemoteMember: () => void;
  onRemove: () => void;
  onLeave: () => void;
  onTransfer: () => void;
  leavePending: boolean;
  rolePending: boolean;
  removePending: boolean;
};

export function MemberRowActions({
  member,
  viewerPublicId,
  viewerRole,
  onPromoteAdmin,
  onDemoteMember,
  onRemove,
  onLeave,
  onTransfer,
  leavePending,
  rolePending,
  removePending,
}: MemberRowActionsProps) {
  const isSelf = member.userPublicId === viewerPublicId;
  const isOwner = viewerRole === "OWNER";
  const isAdmin = viewerRole === "ADMIN";

  const canPromoteToAdmin = isOwner && member.role === "MEMBER";
  const canDemote = isOwner && member.role === "ADMIN";
  const canRemoveAsOwner = isOwner && member.role !== "OWNER";
  const canRemoveAsAdmin = isAdmin && member.role === "MEMBER";
  const canTransferThisRow = isOwner && member.role === "ADMIN" && !isSelf;
  const canLeave = isSelf && member.role !== "OWNER";

  const hasRowActions =
    canPromoteToAdmin ||
    canDemote ||
    canRemoveAsOwner ||
    canRemoveAsAdmin ||
    canTransferThisRow ||
    canLeave;

  if (!hasRowActions) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <IconButton type="button" variant="ghost" size="icon-sm" label={`Actions for ${member.name}`}>
            <MoreHorizontalIcon className="size-4" />
          </IconButton>
        }
      />
      <DropdownMenuContent align="end">
        {canPromoteToAdmin ? (
          <DropdownMenuItem disabled={rolePending} onClick={onPromoteAdmin}>
            Promote to admin
          </DropdownMenuItem>
        ) : null}
        {canDemote ? (
          <DropdownMenuItem disabled={rolePending} onClick={onDemoteMember}>
            Demote to member
          </DropdownMenuItem>
        ) : null}
        {canTransferThisRow ? (
          <DropdownMenuItem onClick={onTransfer}>Transfer ownership to…</DropdownMenuItem>
        ) : null}
        {(canRemoveAsOwner || canRemoveAsAdmin) && !isSelf ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled={removePending} onClick={onRemove}>
              Remove from workspace
            </DropdownMenuItem>
          </>
        ) : null}
        {canLeave ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled={leavePending} onClick={onLeave}>
              Leave workspace
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
