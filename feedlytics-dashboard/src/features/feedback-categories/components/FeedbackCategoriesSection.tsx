"use client";

import * as React from "react";
import { toast } from "sonner";

import { ChipCollectionEditor } from "@/components/integration/integration-doc-kit";
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
import { useFeedbackCategories } from "@/features/feedback-categories/hooks/useFeedbackCategories";
import { ApiError } from "@/services/api/errors/ApiError";

export type FeedbackCategoriesSectionProps = {
  workspacePublicId: string;
};

export function FeedbackCategoriesSection({ workspacePublicId }: FeedbackCategoriesSectionProps) {
  const { data, isPending, isError, error, refetch, create } = useFeedbackCategories(workspacePublicId);
  const [draft, setDraft] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingName, setPendingName] = React.useState("");

  if (isPending) {
    return (
      <section aria-label="Feedback categories" className="flex flex-col gap-2">
        <Heading variant="tertiary" as="h2">
          Feedback categories
        </Heading>
        <p className="text-sm text-navy-700 dark:text-white/80">Loading categories…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Feedback categories" className="flex flex-col gap-2">
        <Heading variant="tertiary" as="h2">
          Feedback categories
        </Heading>
        <p className="text-sm text-navy-700 dark:text-white/80">{error.message}</p>
        <Button type="button" variant="brand" size="sm" className="w-fit" onClick={() => void refetch()}>
          Try again
        </Button>
      </section>
    );
  }

  const categories = data?.categories ?? [];
  const max = data?.maxCategories ?? 0;
  const used = categories.length;
  const atLimit = used >= max;
  const labels = categories.map((c) => c.name);

  function validateAndOpenConfirm(normalized: string): boolean {
    if (!normalized) {
      toast.error("Name is required");
      return false;
    }
    if (normalized.length > 255) {
      toast.error("Category name is too long");
      return false;
    }
    if (labels.some((label) => label.toLowerCase() === normalized.toLowerCase())) {
      toast.error("That category already exists");
      return false;
    }
    if (atLimit) {
      toast.error(`At most ${max} categories`);
      return false;
    }
    return true;
  }

  function requestAddCategory() {
    const normalized = draft.trim();
    if (!validateAndOpenConfirm(normalized)) return;
    setPendingName(normalized);
    setConfirmOpen(true);
  }

  async function confirmAddCategory() {
    const normalized = pendingName.trim();
    if (!validateAndOpenConfirm(normalized)) {
      setConfirmOpen(false);
      setPendingName("");
      return;
    }
    try {
      await create.mutateAsync(normalized);
      setDraft("");
      setPendingName("");
      setConfirmOpen(false);
      toast.success("Category added");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not add category";
      toast.error(msg);
    }
  }

  function cancelConfirm() {
    setConfirmOpen(false);
    setPendingName("");
  }

  return (
    <section aria-labelledby="feedback-categories-heading" className="flex flex-col gap-5">
      <div>
        <Heading variant="tertiary" as="h2" className="mb-2">
          <span id="feedback-categories-heading">Feedback categories</span>
        </Heading>
        <p className="max-w-2xl text-sm leading-relaxed text-navy-700 dark:text-white/85">
          Use short labels to guide AI classification (for example: Billing, UX, Performance). Categories cannot be
          renamed or removed after you add them, so choose names you are happy to keep for this workspace.
        </p>
      </div>

      <ChipCollectionEditor
        collectionLabel="Feedback categories"
        items={labels}
        maxItems={max}
        emptyMessage="No categories yet. Add one below."
        inputAriaLabel="Add category"
        inputPlaceholder="e.g. Billing"
        inputValue={draft}
        onInputChange={setDraft}
        onAdd={requestAddCategory}
        disabled={create.isPending || atLimit}
        footer={
          <p className="text-sm text-navy-700 dark:text-white/80">
            {used} of {max} used.
          </p>
        }
      />

      <Dialog open={confirmOpen} onOpenChange={(open) => !open && cancelConfirm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add feedback category</DialogTitle>
            <DialogDescription className="space-y-3 text-left text-navy-700 dark:text-white/80">
              <span className="block">
                You are about to add{" "}
                <strong className="font-semibold text-navy-900 dark:text-white">{pendingName}</strong> as a permanent
                category for this workspace.
              </span>
              <span className="block">
                You will <strong className="font-semibold text-navy-900 dark:text-white">not</strong> be able to edit or
                remove categories later. Add labels thoughtfully so they stay useful for classification and reporting.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={cancelConfirm}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="brand"
              disabled={create.isPending}
              onClick={() => void confirmAddCategory()}
            >
              {create.isPending ? "Adding…" : "Add category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
