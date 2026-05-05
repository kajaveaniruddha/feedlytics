"use client";

import * as React from "react";
import { FileJsonIcon, KeyRoundIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";

import {
  IntegrationCredentialSection,
  IntegrationCurlCredentialsRow,
  CopyableShellCommand,
  IntegrationHighlightItem,
  IntegrationHighlightRow,
} from "@/components/integration/integration-doc-kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceIntegration } from "@/features/workspace/hooks/useWorkspaceIntegration";
import { buildSendFeedbackCurlApi } from "@/features/workspace/lib/workspace-send-feedback-curl";
import { ApiError } from "@/services/api/errors/ApiError";

export type WorkspaceApiIntegrationSectionProps = {
  workspacePublicId: string;
};

export function WorkspaceApiIntegrationSection({ workspacePublicId }: WorkspaceApiIntegrationSectionProps) {
  const { data, isPending, isError, error, refetch, rotateApiKey, revokeApiKey } =
    useWorkspaceIntegration(workspacePublicId);

  const [confirmRotate, setConfirmRotate] = React.useState(false);
  const [revealKey, setRevealKey] = React.useState<string | null>(null);

  const forbidden = isError && error instanceof ApiError && error.status === 403;

  const curlCommand = React.useMemo(
    () => buildSendFeedbackCurlApi(workspacePublicId),
    [workspacePublicId],
  );

  if (forbidden) {
    return (
      <section aria-label="API documentation" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">
          Only workspace owners and admins can manage API keys.
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section aria-label="API documentation" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">Loading…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="API documentation" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">{error.message}</p>
        <Button type="button" variant="brand" size="sm" className="w-fit" onClick={() => void refetch()}>
          Try again
        </Button>
      </section>
    );
  }

  const busy = rotateApiKey.isPending || revokeApiKey.isPending;

  async function copySecret(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <article aria-label="API documentation" className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="space-y-4">
        <p className="text-base leading-relaxed text-navy-700 dark:text-white/85">
          Send feedback from your backend with an <strong className="font-semibold text-navy-900 dark:text-white">API key</strong> on every request. Allowed browser origins for client-side flows live in{" "}
          <strong className="font-semibold text-navy-900 dark:text-white">Settings</strong> for this workspace.
        </p>
        <IntegrationHighlightRow>
          <IntegrationHighlightItem
            icon={<KeyRoundIcon className="size-5" aria-hidden />}
            label="API key"
            value={data.hasApiKey ? "Active — rotate below if needed" : "Not set — generate below"}
          />
          <IntegrationHighlightItem
            icon={<ShieldCheckIcon className="size-5" aria-hidden />}
            label="Auth header"
            value={<code className="font-mono text-[13px]">X-Feedlytics-Api-Key</code>}
          />
          <IntegrationHighlightItem
            icon={<FileJsonIcon className="size-5" aria-hidden />}
            label="Payload"
            value="JSON: content, rating, sourceType"
          />
        </IntegrationHighlightRow>
      </header>

      <Separator />

      <IntegrationCurlCredentialsRow
        curlSlot={
          <CopyableShellCommand
            title="Example request (cURL)"
            description={
              <>
                Copy and run in a terminal. Replace <code className="font-mono text-[13px]">YOUR_API_KEY</code> with a
                key you generate in the panel on the right. The JSON body matches{" "}
                <code className="font-mono text-[13px]">SendFeedbackRequest</code> (rating 0–5).
              </>
            }
            command={curlCommand}
          />
        }
        credentialsSlot={
          <IntegrationCredentialSection
            title="API key"
            description="Keys are shown only once when created or rotated. Keep them in a secure secret manager, never in browser code."
            statusLabel={`Status: ${data.hasApiKey ? "Active" : "Not set"}`}
            actions={
              <>
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  disabled={busy}
                  onClick={() => setConfirmRotate(true)}
                >
                  {data.hasApiKey ? "Rotate key" : "Generate key"}
                </Button>
                {data.hasApiKey ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      void (async () => {
                        try {
                          await revokeApiKey.mutateAsync();
                          toast.success("API key revoked");
                        } catch (e) {
                          const msg = e instanceof ApiError ? e.message : "Could not revoke";
                          toast.error(msg);
                        }
                      })()
                    }
                  >
                    Revoke
                  </Button>
                ) : null}
              </>
            }
            footnote={"Keep the secret out of public repositories and rotate after team or environment changes."}
          />
        }
      />

      <Dialog
        open={confirmRotate}
        onOpenChange={(open) => {
          if (!open) setConfirmRotate(false);
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>{data.hasApiKey ? "Rotate API key?" : "Generate API key?"}</DialogTitle>
            <DialogDescription>
              {data.hasApiKey
                ? "The current key stops working immediately. This cannot be undone."
                : "A new key will be shown once. Store it securely."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2 border-0 bg-transparent p-0 sm:justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setConfirmRotate(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="brand"
              size="sm"
              disabled={rotateApiKey.isPending}
              onClick={() =>
                void (async () => {
                  try {
                    const res = await rotateApiKey.mutateAsync();
                    setRevealKey(res.apiKey);
                    setConfirmRotate(false);
                  } catch (e) {
                    const msg = e instanceof ApiError ? e.message : "Could not rotate key";
                    toast.error(msg);
                  }
                })()
              }
            >
              {data.hasApiKey ? "Rotate" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={revealKey !== null}
        onOpenChange={(open) => {
          if (!open) setRevealKey(null);
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Copy your API key</DialogTitle>
            <DialogDescription>
              You will not see this value again. Store it in a password manager or secret store.
            </DialogDescription>
          </DialogHeader>
          {revealKey ? (
            <div className="rounded-lg border border-secondary-gray-200 bg-muted/40 p-3 dark:border-white/10">
              <code className="block break-all font-mono text-xs">{revealKey}</code>
            </div>
          ) : null}
          <DialogFooter className="flex-row justify-end gap-2 border-0 bg-transparent p-0 sm:justify-end">
            {revealKey ? (
              <Button type="button" variant="brand" size="sm" onClick={() => void copySecret(revealKey)}>
                Copy
              </Button>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => setRevealKey(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
