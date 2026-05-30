"use client";

import * as React from "react";

import { AppWordMark } from "@/components/layout/AppWordMark";
import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardPageShell } from "@/components/layout/DashboardPageShell";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { InteractiveCardLink } from "@/components/layout/InteractiveCardLink";
import { LoadingViewportCenter } from "@/components/layout/LoadingViewportCenter";
import { PageIntro } from "@/components/layout/PageIntro";
import { PickerCardGrid } from "@/components/layout/PickerCardGrid";
import { SearchFieldShell } from "@/components/layout/SearchFieldShell";
import { WorkspaceCreateTile } from "@/components/layout/WorkspaceCreateTile";
import { WorkspaceSummaryCard } from "@/components/layout/WorkspaceSummaryCard";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { MutedText } from "@/components/ui/muted-text";
import { APP_NAME } from "@/constants/app.constants";
import { routes } from "@/config/routes";
import { formatWorkspacePlanLabel } from "@/features/workspace/constants/workspace-ui.constants";
import { isAtFreeWorkspaceCreationLimit } from "@/features/workspace/lib/free-workspace-limit";
import {
  workspacePlanBadgeVariant,
  workspaceRoleBadgeVariant,
} from "@/features/workspace/lib/workspace-badge-variants";
import { workspaceTileTone } from "@/features/workspace/lib/workspace-tile-tone";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useWorkspacesList } from "@/features/workspace/hooks/useWorkspacesList";
import { formatNumber } from "@/lib/utils/format";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";

import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

import type { WorkspaceData } from "@/features/workspace/types/workspace.types";

function filterWorkspaces(workspaces: WorkspaceData[], query: string): WorkspaceData[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...workspaces];
  return workspaces.filter((w) => {
    const name = w.name.toLowerCase();
    const desc = (w.description ?? "").toLowerCase();
    return name.includes(q) || desc.includes(q);
  });
}

function memberLabel(n: number): string {
  return `${formatNumber(n)} ${n === 1 ? "member" : "members"}`;
}

function feedbackLabel(n: number): string {
  return `${formatNumber(n)} ${n === 1 ? "feedback" : "feedbacks"}`;
}

export function WorkspacesPageContent() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: workspaces, isPending, isError, error, refetch } = useWorkspacesList();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const list = workspaces ?? [];
  const filtered = React.useMemo(
    () => filterWorkspaces(workspaces ?? [], searchQuery),
    [workspaces, searchQuery],
  );
  const atLimit = isAtFreeWorkspaceCreationLimit(list);
  const userInitials = user?.name ? workspaceInitials(user.name) : "?";

  const welcomeName = user?.name?.split(/\s+/)[0] ?? "there";

  if (isPending || userLoading) {
    return <LoadingViewportCenter label="Loading workspaces" />;
  }

  if (isError) {
    return (
      <ErrorPanel message={error.message}>
        <Button type="button" variant="brand" onClick={() => void refetch()}>
          Try again
        </Button>
      </ErrorPanel>
    );
  }

  return (
    <DashboardPageShell>
      <DashboardToolbar
        leading={<AppWordMark initials={workspaceInitials(APP_NAME)}>{APP_NAME}</AppWordMark>}
        trailing={
          <DashboardHeaderCapsule
            showSearch
            userInitials={userInitials}
            search={
              <SearchFieldShell
                preset="search"
                minWidth="toolbar"
                className="bg-transparent shadow-none dark:bg-transparent dark:shadow-none"
              >
                <Input
                  type="search"
                  variant="searchInset"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search workspaces"
                />
              </SearchFieldShell>
            }
          />
        }
      />

      <PageIntro
        kicker={<MutedText tone="subtle">Welcome back, {welcomeName}</MutedText>}
        title={
          <Heading variant="display" as="h1">
            Choose Your Workspace
          </Heading>
        }
      />

      {list.length === 0 ? <MutedText>You are not a member of any workspaces yet.</MutedText> : null}

      <PickerCardGrid>
        {filtered.map((ws) => (
          <InteractiveCardLink key={ws.publicId} href={routes.workspace(ws.publicId)} prefetch={false}>
            <WorkspaceSummaryCard
              name={ws.name}
              planLabel={formatWorkspacePlanLabel(ws.plan)}
              planBadgeVariant={workspacePlanBadgeVariant(ws.plan)}
              role={ws.role}
              roleBadgeVariant={workspaceRoleBadgeVariant(ws.role)}
              memberLabel={memberLabel(ws.memberCount)}
              feedbackLabel={feedbackLabel(ws.feedbackCount)}
              initials={workspaceInitials(ws.name)}
              tileTone={workspaceTileTone(ws)}
              avgRating={ws.avgRating}
            />
          </InteractiveCardLink>
        ))}

        <WorkspaceCreateTile
          title="Create New Workspace"
          subtitle="Start collecting feedbacks today"
          disabled={atLimit}
          disabledHint="You can only have 3 free workspaces. Upgrade an existing workspace to PRO or BUSINESS to create more."
          onActivate={() => {
            if (!atLimit) setCreateOpen(true);
          }}
        />
      </PickerCardGrid>

      {list.length > 0 && filtered.length === 0 ? (
        <MutedText align="center">No workspaces match your search.</MutedText>
      ) : null}

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </DashboardPageShell>
  );
}
