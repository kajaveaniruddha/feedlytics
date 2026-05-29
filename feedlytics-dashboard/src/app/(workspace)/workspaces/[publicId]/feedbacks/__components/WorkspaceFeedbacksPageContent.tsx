"use client";

import { FrownIcon, LaughIcon, MehIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { LoadingViewportCenter } from "@/components/layout/LoadingViewportCenter";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkspaceDashboardShell } from "@/components/layout/WorkspaceDashboardShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExpandableTruncatedText } from "@/components/ui/expandable-truncated-text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWorkspaceFeedbackMutations } from "@/features/feedback/hooks/useWorkspaceFeedbackMutations";
import { useWorkspaceFeedbacks } from "@/features/feedback/hooks/useWorkspaceFeedbacks";
import type { FeedbackItemDto, FeedbackSentiment } from "@/features/feedback/types/workspace-feedback.types";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useWorkspaceDetail } from "@/features/workspace/hooks/useWorkspaceDetail";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";
import { formatDate } from "@/lib/utils/format";
import { ApiError } from "@/services/api/errors/ApiError";

type WorkspaceFeedbacksPageContentProps = {
  workspacePublicId: string;
};

const FIXED_PAGE_SIZE = 10;
const EMPTY_PAGE_ROWS: FeedbackItemDto[] = [];

function toErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

const SENTIMENT_CONFIG: Record<
  FeedbackSentiment,
  { label: string; Icon: typeof LaughIcon }
> = {
  POSITIVE: { label: "Positive", Icon: LaughIcon },
  NEGATIVE: { label: "Negative", Icon: FrownIcon },
  NEUTRAL: { label: "Neutral", Icon: MehIcon },
};

function formatSubmitterLine(feedback: FeedbackItemDto): string {
  const parts = [feedback.submitterName, feedback.submitterEmail].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "";
}

function FeedbackSentimentCell({ sentiment }: { sentiment: FeedbackSentiment | null }) {
  if (sentiment == null) {
    return (
      <MutedText tone="subtle" className="text-xs">
        —
      </MutedText>
    );
  }
  const { Icon, label } = SENTIMENT_CONFIG[sentiment];
  return (
    <span className="inline-flex items-center justify-center" title={label}>
      <span className="sr-only">{label}</span>
      <Icon className="size-5 text-navy-600 dark:text-white/80" aria-hidden />
    </span>
  );
}

export function WorkspaceFeedbacksPageContent({
  workspacePublicId,
}: WorkspaceFeedbacksPageContentProps) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [singleDeleteTarget, setSingleDeleteTarget] = React.useState<FeedbackItemDto | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  const { data: user } = useCurrentUser();
  const userInitials = user?.name ? workspaceInitials(user.name) : "?";
  const detailQuery = useWorkspaceDetail(workspacePublicId);
  const feedbacksQuery = useWorkspaceFeedbacks(workspacePublicId, {
    page: pageIndex,
    size: FIXED_PAGE_SIZE,
  });
  const feedbackMutations = useWorkspaceFeedbackMutations(workspacePublicId);

  const workspace = detailQuery.data;
  const pageRows = feedbacksQuery.data?.feedbacks ?? EMPTY_PAGE_ROWS;
  const totalElements = feedbacksQuery.data?.totalElements ?? 0;
  const totalPages = feedbacksQuery.data?.totalPages ?? 0;
  const canDelete = workspace?.role === "OWNER" || workspace?.role === "ADMIN";

  const selectedOnPageCount = React.useMemo(
    () => pageRows.filter((row) => selectedIds.has(row.publicId)).length,
    [pageRows, selectedIds],
  );
  const allPageSelected = pageRows.length > 0 && selectedOnPageCount === pageRows.length;

  const isDeletingOne = feedbackMutations.deleteOne.isPending;
  const isDeletingMany = feedbackMutations.deleteMany.isPending;

  const toggleRowSelection = (feedbackId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(feedbackId);
      } else {
        next.delete(feedbackId);
      }
      return next;
    });
  };

  const togglePageSelection = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const row of pageRows) {
        if (checked) {
          next.add(row.publicId);
        } else {
          next.delete(row.publicId);
        }
      }
      return next;
    });
  };

  const goToPreviousPage = () => {
    setPageIndex((current) => Math.max(current - 1, 0));
    setSelectedIds(new Set());
  };

  const goToNextPage = () => {
    setPageIndex((current) => Math.min(current + 1, Math.max(totalPages - 1, 0)));
    setSelectedIds(new Set());
  };

  const onDeleteSingle = () => {
    if (!singleDeleteTarget) return;
    feedbackMutations.deleteOne.mutate(singleDeleteTarget.publicId, {
      onSuccess: () => {
        toast.success("Feedback deleted");
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(singleDeleteTarget.publicId);
          return next;
        });
        setSingleDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(toErrorMessage(err, "Could not delete feedback"));
      },
    });
  };

  const onDeleteBulk = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    feedbackMutations.deleteMany.mutate(ids, {
      onSuccess: () => {
        toast.success(`${ids.length} feedback item${ids.length > 1 ? "s" : ""} deleted`);
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
      },
      onError: (err) => {
        toast.error(toErrorMessage(err, "Could not delete selected feedback"));
      },
    });
  };

  if (detailQuery.isPending || feedbacksQuery.isPending) {
    return <LoadingViewportCenter label="Loading feedbacks" />;
  }

  if (detailQuery.isError || feedbacksQuery.isError) {
    const err = detailQuery.error ?? feedbacksQuery.error;
    const message = err instanceof Error ? err.message : "Something went wrong";
    return (
      <ErrorPanel message={message}>
        <Button
          type="button"
          variant="brand"
          onClick={() => {
            void detailQuery.refetch();
            void feedbacksQuery.refetch();
          }}
        >
          Try again
        </Button>
      </ErrorPanel>
    );
  }

  return (
    <WorkspaceDashboardShell
      kpiSection={
        <Stack gap="md">
          <DashboardToolbar
            leading={
              <PageIntro
                kicker={<MutedText tone="subtle">Workspace</MutedText>}
                title={
                  <Heading variant="workspacePageTitle" as="h1">
                    Feedbacks
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
          <MutedText tone="subtle">
            All workspace feedbacks in a single view.
          </MutedText>
        </Stack>
      }
    >
      <Stack gap="md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MutedText tone="subtle">
            {totalElements} total feedback{totalElements === 1 ? "" : "s"}
          </MutedText>
        </div>

        {canDelete ? (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={selectedIds.size === 0 || isDeletingMany}
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2Icon className="size-4" />
              Delete selected
            </Button>
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              {canDelete ? (
                <TableHead className="w-[52px]">
                  <Checkbox
                    aria-label="Select all rows on page"
                    checked={allPageSelected}
                    onCheckedChange={(checked) => togglePageSelection(Boolean(checked))}
                  />
                </TableHead>
              ) : null}
              <TableHead>Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[72px]">Sentiment</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Message</TableHead>
              {canDelete ? <TableHead className="w-[80px] text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canDelete ? 7 : 5}>
                  <MutedText tone="subtle">No feedback found for this workspace.</MutedText>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((feedback) => {
                const submitterLine = formatSubmitterLine(feedback);
                return (
                <TableRow key={feedback.publicId}>
                  {canDelete ? (
                    <TableCell>
                      <Checkbox
                        aria-label={`Select feedback ${feedback.publicId}`}
                        checked={selectedIds.has(feedback.publicId)}
                        onCheckedChange={(checked) =>
                          toggleRowSelection(feedback.publicId, Boolean(checked))
                        }
                      />
                    </TableCell>
                  ) : null}
                  <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                  <TableCell>{feedback.rating}/5</TableCell>
                  <TableCell>
                    <FeedbackSentimentCell sentiment={feedback.sentiment} />
                  </TableCell>
                  <TableCell>
                    {submitterLine ? (
                      <ExpandableTruncatedText text={submitterLine} maxLength={48} />
                    ) : (
                      <MutedText tone="subtle" className="text-xs">
                        —
                      </MutedText>
                    )}
                  </TableCell>
                  <TableCell>
                    <ExpandableTruncatedText text={feedback.content} maxLength={100} />
                  </TableCell>
                  {canDelete ? (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <IconButton
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              label="Feedback row actions"
                            >
                              <MoreHorizontalIcon className="size-4" />
                            </IconButton>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={isDeletingOne}
                            onClick={() => {
                              setSingleDeleteTarget(feedback);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : null}
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between">
          <MutedText tone="subtle">
            Page {totalElements === 0 ? 0 : pageIndex + 1} of {totalPages}
          </MutedText>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pageIndex === 0}
              onClick={goToPreviousPage}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={totalPages === 0 || pageIndex >= totalPages - 1}
              onClick={goToNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </Stack>

      <Dialog open={singleDeleteTarget !== null} onOpenChange={(open) => !open && setSingleDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete feedback</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The selected feedback will be removed permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSingleDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeletingOne || singleDeleteTarget === null}
              onClick={onDeleteSingle}
            >
              {isDeletingOne ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete selected feedbacks</DialogTitle>
            <DialogDescription>
              This action cannot be undone. {selectedIds.size} selected feedback
              {selectedIds.size === 1 ? "" : "s"} will be removed permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={selectedIds.size === 0 || isDeletingMany}
              onClick={onDeleteBulk}
            >
              {isDeletingMany ? "Deleting..." : "Delete selected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WorkspaceDashboardShell>
  );
}
