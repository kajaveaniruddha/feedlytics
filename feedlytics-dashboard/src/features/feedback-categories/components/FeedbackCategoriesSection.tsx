"use client";

import * as React from "react";
import { toast } from "sonner";

import { ChipCollectionEditor } from "@/components/integration/integration-doc-kit";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useFeedbackCategories } from "@/features/feedback-categories/hooks/useFeedbackCategories";
import { ApiError } from "@/services/api/errors/ApiError";

export type FeedbackCategoriesSectionProps = {
  workspacePublicId: string;
};

export function FeedbackCategoriesSection({ workspacePublicId }: FeedbackCategoriesSectionProps) {
  const { data, isPending, isError, error, refetch, create, remove } = useFeedbackCategories(workspacePublicId);
  const [draft, setDraft] = React.useState("");

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

  function addCategory() {
    const normalized = draft.trim();
    if (!normalized) {
      toast.error("Name is required");
      return;
    }
    if (normalized.length > 255) {
      toast.error("Category name is too long");
      return;
    }
    if (labels.some((label) => label.toLowerCase() === normalized.toLowerCase())) {
      toast.error("That category already exists");
      return;
    }
    if (atLimit) {
      toast.error(`At most ${max} categories`);
      return;
    }
    void (async () => {
      try {
        await create.mutateAsync(normalized);
        setDraft("");
        toast.success("Category added");
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Could not add category";
        toast.error(msg);
      }
    })();
  }

  function removeCategoryByName(name: string) {
    const category = categories.find((c) => c.name === name);
    if (!category) return;
    void (async () => {
      try {
        await remove.mutateAsync(category.id);
        toast.success("Category removed");
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Could not remove category";
        toast.error(msg);
      }
    })();
  }

  return (
    <section aria-labelledby="feedback-categories-heading" className="flex flex-col gap-5">
      <div>
        <Heading variant="tertiary" as="h2" className="mb-2">
          <span id="feedback-categories-heading">Feedback categories</span>
        </Heading>
        <p className="max-w-2xl text-sm leading-relaxed text-navy-700 dark:text-white/85">
          Use short labels to guide AI classification (for example: Billing, UX, Performance).
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
        onAdd={addCategory}
        onRemove={removeCategoryByName}
        disabled={create.isPending || remove.isPending || atLimit}
        footer={
          <p className="text-sm text-navy-700 dark:text-white/80">
            {used} of {max} used.
          </p>
        }
      />
    </section>
  );
}
