"use client";

import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { LoadingViewportCenter } from "@/components/layout/LoadingViewportCenter";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkspaceDashboardShell } from "@/components/layout/WorkspaceDashboardShell";
import { WorkspaceUpdatesCarousel } from "@/components/layout/WorkspaceUpdatesCarousel";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useWorkspaceDetail } from "@/features/workspace/hooks/useWorkspaceDetail";
import { useWorkspaceOverviewAnalytics } from "@/features/workspace/hooks/useWorkspaceOverviewAnalytics";
import { useWorkspacesList } from "@/features/workspace/hooks/useWorkspacesList";
import { formatWorkspaceRole } from "@/features/workspace/lib/format-workspace-role";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";

import { workspaceUpdateSlides } from "./workspace-updates.slides";
import { WorkspaceKpiSection } from "./WorkspaceKpiSection";
import { WorkspaceMonthlyFeedbacksPanel } from "./WorkspaceMonthlyFeedbacksPanel";
import { WorkspacePlanUsagePanel } from "./WorkspacePlanUsagePanel";
import { WorkspaceRecentFeedbacksPanel } from "./WorkspaceRecentFeedbacksPanel";
import { WorkspaceUserProfileCard } from "./WorkspaceUserProfileCard";

export type WorkspaceDashboardContentProps = {
  workspacePublicId: string;
};

export function WorkspaceDashboardContent({ workspacePublicId }: WorkspaceDashboardContentProps) {
  const { data: user } = useCurrentUser();
  const { data, isPending, isError, error, refetch } = useWorkspaceOverviewAnalytics(workspacePublicId);
  const { data: workspaces, isPending: isWorkspacesPending } = useWorkspacesList();
  const { data: workspace, isPending: isWorkspacePending } = useWorkspaceDetail(workspacePublicId);
  const userInitials = user?.name ? workspaceInitials(user.name) : "?";
  const ownedCount = workspaces?.filter((w) => w.role === "OWNER").length ?? 0;
  const profileLoading = !user || isWorkspacesPending || isWorkspacePending;

  if (isPending) {
    return <LoadingViewportCenter label="Loading workspace overview" />;
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
    <WorkspaceDashboardShell
      kpiSection={
        <Stack gap="md">
          <DashboardToolbar
            leading={
              <PageIntro
                kicker={<MutedText tone="subtle">Workspace overview</MutedText>}
                title={
                  <Heading variant="workspacePageTitle" as="h1">
                    Dashboard
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
          <WorkspaceKpiSection analytics={data} />
        </Stack>
      }
    >
      <Stack gap="lg" className="w-full">
        <div className="grid items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
          <WorkspaceUpdatesCarousel slides={workspaceUpdateSlides(workspacePublicId)} />
          <WorkspacePlanUsagePanel workspacePublicId={workspacePublicId} />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr_1fr]">
          <WorkspaceMonthlyFeedbacksPanel trend={data.rolling30DayFeedbacks} />
          <WorkspaceRecentFeedbacksPanel workspacePublicId={workspacePublicId} />
          <WorkspaceUserProfileCard
            name={user?.name ?? "—"}
            initials={userInitials}
            roleLabel={workspace?.role ? formatWorkspaceRole(workspace.role) : "—"}
            stats={[
              { label: "Workspaces", value: workspaces?.length ?? 0 },
              { label: "Owned", value: ownedCount },
            ]}
            isLoading={profileLoading}
          />
        </div>
      </Stack>
    </WorkspaceDashboardShell>
  );
}
