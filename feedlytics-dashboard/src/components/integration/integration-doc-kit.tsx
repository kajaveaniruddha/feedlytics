/**
 * Dashboard “API docs” primitives — Horizon UI–inspired stat tiles and copyable shell blocks.
 */
"use client";

import * as React from "react";
import { CopyIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export type IntegrationHighlightItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
};

export function IntegrationHighlightItem({ icon, label, value, className }: IntegrationHighlightItemProps) {
  return (
    <div
      className={cn(
        "flex items-center flex-1 gap-3 rounded-[20px] border border-border bg-surface p-4 shadow-card",
        className,
      )}
    >
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:bg-brand-400/15 dark:text-brand-300"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary-gray-500 dark:text-white/55">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold leading-snug text-navy-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

export function IntegrationHighlightRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:flex-wrap", className)}>
      {children}
    </div>
  );
}

export type CopyableShellCommandProps = {
  title: string;
  description?: React.ReactNode;
  command: string;
  copyLabel?: string;
};

export function CopyableShellCommand({
  title,
  description,
  command,
  copyLabel = "Copy cURL",
}: CopyableShellCommandProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      toast.success("cURL copied");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <section aria-label={title} className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy-900 dark:text-white">{title}</h3>
          {description ? (
            <div className="mt-1 text-sm leading-relaxed text-navy-700 dark:text-white/80">{description}</div>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 self-start"
          onClick={() => void copy()}
        >
          <CopyIcon className="size-3.5" aria-hidden />
          {copyLabel}
        </Button>
      </div>
      <pre className="max-h-[min(420px,55vh)] overflow-auto bg-navy-900 px-4 py-3 font-mono text-[12px] leading-relaxed text-white tabular-nums dark:bg-navy-950">
        {command}
      </pre>
    </section>
  );
}

export type CopyableCodeSnippetProps = {
  title: string;
  description?: React.ReactNode;
  code: string;
  copyLabel?: string;
  copiedToast?: string;
};

export function CopyableCodeSnippet({
  title,
  description,
  code,
  copyLabel = "Copy snippet",
  copiedToast = "Snippet copied",
}: CopyableCodeSnippetProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(copiedToast);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <section aria-label={title} className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy-900 dark:text-white">{title}</h3>
          {description ? (
            <div className="mt-1 text-sm leading-relaxed text-navy-700 dark:text-white/80">{description}</div>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 self-start"
          onClick={() => void copy()}
        >
          <CopyIcon className="size-3.5" aria-hidden />
          {copyLabel}
        </Button>
      </div>
      <pre className="max-h-[min(420px,55vh)] overflow-auto whitespace-pre-wrap break-all bg-navy-900 px-4 py-3 font-mono text-[12px] leading-relaxed text-white dark:bg-navy-950">
        {code}
      </pre>
    </section>
  );
}

/**
 * Docs layout: example cURL (primary, left) + credential controls (sidebar, right).
 * Stacks on small screens; sticky sidebar from `lg` when scrolling long commands.
 */
export function IntegrationCurlCredentialsRow({
  curlSlot,
  credentialsSlot,
  className,
}: {
  curlSlot: React.ReactNode;
  credentialsSlot: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)] lg:items-start lg:gap-8",
        className,
      )}
    >
      <div className="min-w-0">{curlSlot}</div>
      <aside className="min-w-0 border-border dark:border-white/10">
        <div className="lg:sticky lg:top-20">{credentialsSlot}</div>
      </aside>
    </div>
  );
}

export type IntegrationCredentialSectionProps = {
  title: string;
  description: React.ReactNode;
  statusLabel: string;
  actions: React.ReactNode;
  footnote?: React.ReactNode;
};

export function IntegrationCredentialSection({
  title,
  description,
  statusLabel,
  actions,
  footnote,
}: IntegrationCredentialSectionProps) {
  return (
    <section aria-label={title} className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary-gray-500 dark:text-white/55">
          {title}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-navy-700 dark:text-white/85">{description}</div>
      </div>
      <div className="flex flex-col gap-3 px-4 py-4">
        <span className="text-sm font-semibold text-navy-900 dark:text-white">{statusLabel}</span>
        <div className="flex flex-wrap gap-2">{actions}</div>
        {footnote ? (
          <div className="text-xs leading-relaxed text-navy-700 dark:text-white/75">{footnote}</div>
        ) : null}
      </div>
    </section>
  );
}

export type ChipCollectionEditorProps = {
  collectionLabel: string;
  items: string[];
  maxItems: number;
  emptyMessage: string;
  inputAriaLabel: string;
  inputPlaceholder: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  /** When omitted, chips are display-only (no remove control). */
  onRemove?: (item: string) => void;
  disabled?: boolean;
  chipTextClassName?: string;
  footer?: React.ReactNode;
};

export function ChipCollectionEditor({
  collectionLabel,
  items,
  maxItems,
  emptyMessage,
  inputAriaLabel,
  inputPlaceholder,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  disabled,
  chipTextClassName,
  footer,
}: ChipCollectionEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary-gray-600 dark:text-white/70">
        {collectionLabel} ({items.length} / {maxItems})
      </p>
      <div
        className="flex min-h-12 flex-wrap content-start gap-2 rounded-2xl border border-dashed border-secondary-gray-200 bg-secondary-gray-100/40 px-3 py-3 dark:border-white/20 dark:bg-white/5"
        aria-label={`List of ${collectionLabel.toLowerCase()}`}
      >
        {items.length === 0 ? (
          <p className="w-full py-1 text-sm text-navy-700 dark:text-white/80">{emptyMessage}</p>
        ) : (
          items.map((item) => (
            <span
              key={item}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-secondary-gray-200 bg-surface px-2.5 py-1 text-xs font-medium text-navy-700 shadow-sm dark:border-white/10 dark:bg-navy-800 dark:text-white"
            >
              <span className={cn("truncate", chipTextClassName)}>{item}</span>
              {onRemove ? (
                <IconButton
                  type="button"
                  label={`Remove ${item}`}
                  size="icon-sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => onRemove(item)}
                  disabled={disabled}
                >
                  <XIcon className="size-3.5" />
                </IconButton>
              ) : null}
            </span>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          variant="main"
          size="md"
          className="sm:min-w-0 sm:flex-1"
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={disabled}
          aria-label={inputAriaLabel}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="md"
          className="shrink-0"
          disabled={disabled || inputValue.trim() === ""}
          onClick={onAdd}
        >
          Add
        </Button>
      </div>

      {footer}
    </div>
  );
}
