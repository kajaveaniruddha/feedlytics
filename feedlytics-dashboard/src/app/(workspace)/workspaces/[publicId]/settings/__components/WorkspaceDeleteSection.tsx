"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { useDeleteWorkspace } from "@/features/workspace/hooks/useDeleteWorkspace";
import { useWorkspaceDetail } from "@/features/workspace/hooks/useWorkspaceDetail";
import { ApiError } from "@/services/api/errors/ApiError";

export type WorkspaceDeleteSectionProps = {
  workspacePublicId: string;
};

export function WorkspaceDeleteSection({ workspacePublicId }: WorkspaceDeleteSectionProps) {
  const detail = useWorkspaceDetail(workspacePublicId);
  const deleteWorkspace = useDeleteWorkspace();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const workspace = detail.data;
  const isOwner = workspace?.role === "OWNER";
  const busy = deleteWorkspace.isPending;

  async function onConfirmDelete() {
    try {
      await deleteWorkspace.mutateAsync(workspacePublicId);
      toast.success("Workspace deleted");
      setConfirmOpen(false);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not delete workspace";
      toast.error(msg);
    }
  }

  return (
    <section aria-labelledby="workspace-delete-heading" className="flex flex-col gap-4">
      <div>
        <Heading variant="tertiary" as="h2" className="mb-2">
          <span id="workspace-delete-heading">Delete workspace</span>
        </Heading>
        <p className="max-w-3xl text-sm leading-relaxed text-navy-700 dark:text-white/85">
          Permanently delete this workspace and its data. This cannot be undone. Only the workspace owner can delete it.
        </p>
      </div>

      {!detail.isPending && workspace && !isOwner ? (
        <MutedText tone="subtle" className="text-sm">
          You must be the workspace owner to delete this workspace.
        </MutedText>
      ) : null}

      <div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={!isOwner || detail.isPending || busy}
          onClick={() => setConfirmOpen(true)}
        >
          Delete workspace
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this workspace?</DialogTitle>
            <DialogDescription className="text-left text-navy-700 dark:text-white/80">
              <span className="block">
                This will permanently remove <strong className="font-semibold text-navy-900 dark:text-white">{workspace?.name}</strong>{" "}
                and its associated data. Members will lose access immediately. This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={busy} onClick={() => void onConfirmDelete()}>
              {busy ? "Deleting…" : "Delete workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
