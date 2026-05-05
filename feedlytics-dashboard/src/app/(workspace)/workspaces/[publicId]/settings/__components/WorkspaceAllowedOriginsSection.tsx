"use client";

import * as React from "react";
import { toast } from "sonner";

import { ChipCollectionEditor } from "@/components/integration/integration-doc-kit";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { useWorkspaceIntegration } from "@/features/workspace/hooks/useWorkspaceIntegration";
import { normalizeOriginInput } from "@/features/workspace/lib/normalize-origin";
import { ApiError } from "@/services/api/errors/ApiError";

export type WorkspaceAllowedOriginsSectionProps = {
  workspacePublicId: string;
};

const MAX_ORIGINS = 5;

/**
 * Chip list + single-line add — no card wrapper. Applies to browser calls (widget secret and any Origin-checked API use).
 */
export function WorkspaceAllowedOriginsSection({ workspacePublicId }: WorkspaceAllowedOriginsSectionProps) {
  const { data, isPending, isError, error, refetch, updateWidgetOrigins } =
    useWorkspaceIntegration(workspacePublicId);

  const [draft, setDraft] = React.useState("");
  /** When non-null, overrides server list until save succeeds or workspace changes. */
  const [pendingOrigins, setPendingOrigins] = React.useState<string[] | null>(null);

  const serverOrigins = data?.widgetOrigins ?? [];
  const localOrigins = pendingOrigins ?? serverOrigins;
  const dirty =
    pendingOrigins !== null &&
    JSON.stringify([...pendingOrigins].sort()) !== JSON.stringify([...serverOrigins].sort());

  const forbidden = isError && error instanceof ApiError && error.status === 403;

  if (forbidden) {
    return (
      <section aria-label="Allowed origins" className="flex flex-col gap-2">
        <Heading variant="tertiary" as="h2">
          Allowed origins
        </Heading>
        <p className="text-sm text-navy-700 dark:text-white/80">
          Only workspace owners and admins can manage allowed origins.
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section aria-label="Allowed origins" className="flex flex-col gap-2">
        <Heading variant="tertiary" as="h2">
          Allowed origins
        </Heading>
        <p className="text-sm text-navy-700 dark:text-white/80">Loading…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Allowed origins" className="flex flex-col gap-2">
        <Heading variant="tertiary" as="h2">
          Allowed origins
        </Heading>
        <p className="text-sm text-navy-700 dark:text-white/80">{error.message}</p>
        <Button type="button" variant="brand" size="sm" className="w-fit" onClick={() => void refetch()}>
          Try again
        </Button>
      </section>
    );
  }

  function addOrigin() {
    const result = normalizeOriginInput(draft);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    if (localOrigins.includes(result.value)) {
      toast.error("That origin is already listed");
      return;
    }
    if (localOrigins.length >= MAX_ORIGINS) {
      toast.error(`At most ${MAX_ORIGINS} origins`);
      return;
    }
    setPendingOrigins((prev) => [...(prev ?? serverOrigins), result.value]);
    setDraft("");
  }

  function removeOrigin(origin: string) {
    setPendingOrigins((prev) => (prev ?? serverOrigins).filter((o) => o !== origin));
  }

  return (
    <section aria-label="Allowed origins" className="flex flex-col gap-5">
      <div>
        <Heading variant="tertiary" as="h2" className="mb-2">
          Allowed origins
        </Heading>
        <p className="max-w-2xl text-sm leading-relaxed text-navy-700 dark:text-white/85">
          Browsers send an <strong className="font-semibold text-navy-900 dark:text-white">Origin</strong> header.
          Only URLs you add here may call the public feedback endpoint with the{" "}
          <code className="font-mono text-xs">X-Feedlytics-Widget-Secret</code> from the page. Use the same list for
          local testing with cURL (see <strong className="font-semibold">Widget</strong>).
        </p>
      </div>

      <ChipCollectionEditor
        collectionLabel="Trusted origins"
        items={localOrigins}
        maxItems={MAX_ORIGINS}
        emptyMessage="No origins yet. Add your production and local dev URLs below."
        inputAriaLabel="Add origin URL"
        inputPlaceholder="https://app.example.com"
        inputValue={draft}
        onInputChange={setDraft}
        onAdd={addOrigin}
        onRemove={removeOrigin}
        disabled={updateWidgetOrigins.isPending}
        chipTextClassName="font-mono"
        footer={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="brand"
              size="sm"
              disabled={updateWidgetOrigins.isPending || !dirty}
              onClick={() =>
                void (async () => {
                  try {
                    await updateWidgetOrigins.mutateAsync(localOrigins);
                    setPendingOrigins(null);
                    toast.success("Allowed origins saved");
                  } catch (e) {
                    const msg = e instanceof ApiError ? e.message : "Could not save origins";
                    toast.error(msg);
                  }
                })()
              }
            >
              Save changes
            </Button>
            {dirty ? (
              <MutedText tone="subtle" className="text-xs">
                Unsaved changes
              </MutedText>
            ) : null}
          </div>
        }
      />
    </section>
  );
}
