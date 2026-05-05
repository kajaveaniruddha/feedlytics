"use client";

import * as React from "react";
import { GlobeIcon, MonitorIcon, ShieldIcon } from "lucide-react";
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
import { buildSendFeedbackCurlWidget } from "@/features/workspace/lib/workspace-send-feedback-curl";
import { ApiError } from "@/services/api/errors/ApiError";

export type WorkspaceWidgetIntegrationSectionProps = {
  workspacePublicId: string;
};

export function WorkspaceWidgetIntegrationSection({
  workspacePublicId,
}: WorkspaceWidgetIntegrationSectionProps) {
  const { data, isPending, isError, error, refetch, rotateWidgetSecret, revokeWidgetSecret } =
    useWorkspaceIntegration(workspacePublicId);

  const [confirmRotate, setConfirmRotate] = React.useState(false);
  const [revealSecret, setRevealSecret] = React.useState<string | null>(null);

  const forbidden = isError && error instanceof ApiError && error.status === 403;

  const curlCommand = React.useMemo(
    () => buildSendFeedbackCurlWidget(workspacePublicId),
    [workspacePublicId],
  );

  if (forbidden) {
    return (
      <section aria-label="Widget integration" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">
          Only workspace owners and admins can manage the widget secret.
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section aria-label="Widget integration" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">Loading widget settings…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Widget integration" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">{error.message}</p>
        <Button type="button" variant="brand" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </section>
    );
  }

  const busy = rotateWidgetSecret.isPending || revokeWidgetSecret.isPending;

  async function copySecret(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <article aria-label="Widget integration" className="flex w-full max-w-6xl flex-col gap-6">
      <header className="space-y-4">
        <p className="text-base leading-relaxed text-navy-700 dark:text-white/85">
          Use the widget flow when feedback is sent from a{" "}
          <strong className="font-semibold text-navy-900 dark:text-white">browser page</strong> (JavaScript on the
          client). You send the same JSON as the API, but authenticate with{" "}
          <code className="font-mono text-[13px]">X-Feedlytics-Widget-Secret</code> and an{" "}
          <strong className="font-semibold text-navy-900 dark:text-white">Origin</strong> that you have allowed in{" "}
          <strong className="font-semibold text-navy-900 dark:text-white">Settings</strong>.
        </p>
        <IntegrationHighlightRow>
          <IntegrationHighlightItem
            icon={<MonitorIcon className="size-5" aria-hidden />}
            label="Widget secret"
            value={data.hasWidgetSecret ? "Active — rotate below if needed" : "Not set — generate below"}
          />
          <IntegrationHighlightItem
            icon={<ShieldIcon className="size-5" aria-hidden />}
            label="Header"
            value={<code className="font-mono text-[13px]">X-Feedlytics-Widget-Secret</code>}
          />
          <IntegrationHighlightItem
            icon={<GlobeIcon className="size-5" aria-hidden />}
            label="Origin"
            value="Must match allowed origins in Settings"
          />
        </IntegrationHighlightRow>
      </header>

      <Separator />

      <IntegrationCurlCredentialsRow
        curlSlot={
          <CopyableShellCommand
            title="Example browser-style request (cURL)"
            description={
              <>
                Copy and run locally. Replace <code className="font-mono text-[13px]">YOUR_WIDGET_SECRET</code> and the{" "}
                <code className="font-mono text-[13px]">Origin</code> header using the secret from the panel on the
                right. The origin must match <strong className="font-semibold">Allowed origins</strong> in Settings.
              </>
            }
            command={curlCommand}
          />
        }
        credentialsSlot={
          <IntegrationCredentialSection
            title="Widget secret"
            description="Rotate immediately if you suspect exposure. Requests from browsers are accepted only when Origin matches your allowed list in Settings."
            statusLabel={`Status: ${data.hasWidgetSecret ? "Active" : "Not set"}`}
            actions={
              <>
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  disabled={busy}
                  onClick={() => setConfirmRotate(true)}
                >
                  {data.hasWidgetSecret ? "Rotate secret" : "Generate secret"}
                </Button>
                {data.hasWidgetSecret ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      void (async () => {
                        try {
                          await revokeWidgetSecret.mutateAsync();
                          toast.success("Widget secret revoked");
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
            footnote="Keep the secret out of public repositories and rotate after team or environment changes."
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
            <DialogTitle>
              {data.hasWidgetSecret ? "Rotate widget secret?" : "Generate widget secret?"}
            </DialogTitle>
            <DialogDescription>
              {data.hasWidgetSecret
                ? "The current secret stops working immediately. This cannot be undone."
                : "A new secret will be shown once. Store it securely."}
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
              disabled={rotateWidgetSecret.isPending}
              onClick={() =>
                void (async () => {
                  try {
                    const res = await rotateWidgetSecret.mutateAsync();
                    setRevealSecret(res.widgetSecret);
                    setConfirmRotate(false);
                  } catch (e) {
                    const msg = e instanceof ApiError ? e.message : "Could not rotate secret";
                    toast.error(msg);
                  }
                })()
              }
            >
              {data.hasWidgetSecret ? "Rotate" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={revealSecret !== null}
        onOpenChange={(open) => {
          if (!open) setRevealSecret(null);
        }}
      >
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Copy your widget secret</DialogTitle>
            <DialogDescription>
              You will not see this value again. Store it in a password manager or secret store.
            </DialogDescription>
          </DialogHeader>
          {revealSecret ? (
            <div className="rounded-lg border border-secondary-gray-200 bg-muted/40 p-3 dark:border-white/10">
              <code className="block break-all font-mono text-xs">{revealSecret}</code>
            </div>
          ) : null}
          <DialogFooter className="flex-row justify-end gap-2 border-0 bg-transparent p-0 sm:justify-end">
            {revealSecret ? (
              <Button type="button" variant="brand" size="sm" onClick={() => void copySecret(revealSecret)}>
                Copy
              </Button>
            ) : null}
            <Button type="button" variant="outline" size="sm" onClick={() => setRevealSecret(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
