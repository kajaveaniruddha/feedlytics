"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import type { MemberDataDto } from "@/features/workspace/types/team.types";

export type TransferOwnershipDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminOptions: MemberDataDto[];
  transferTargetId: string | null;
  onTransferTargetChange: (userPublicId: string) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function TransferOwnershipDialog({
  open,
  onOpenChange,
  adminOptions,
  transferTargetId,
  onTransferTargetChange,
  onConfirm,
  isPending,
}: TransferOwnershipDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ownership</DialogTitle>
          <DialogDescription>
            The new owner must already be an admin. You will become an admin after confirming.
          </DialogDescription>
        </DialogHeader>
        <Stack gap="sm">
          {adminOptions.map((m) => (
            <label
              key={m.userPublicId}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-secondary-gray-100 p-3 dark:border-white/10"
            >
              <input
                type="radio"
                name="transferTarget"
                className="size-4 accent-brand-500"
                checked={transferTargetId === m.userPublicId}
                onChange={() => onTransferTargetChange(m.userPublicId)}
              />
              <span className="text-sm font-medium">{m.name}</span>
              <MutedText tone="subtle" className="text-xs">
                {m.email}
              </MutedText>
            </label>
          ))}
        </Stack>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand" disabled={!transferTargetId || isPending} onClick={onConfirm}>
            {isPending ? "Transferring…" : "Confirm transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
