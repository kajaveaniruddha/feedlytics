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
import { useWorkspaceOverviewAnalytics } from "@/features/workspace/hooks/useWorkspaceOverviewAnalytics";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";

import { workspaceUpdateSlides } from "./workspace-updates.slides";
import { WorkspaceKpiSection } from "./WorkspaceKpiSection";

export type WorkspaceDashboardContentProps = {
  workspacePublicId: string;
};

export function WorkspaceDashboardContent({ workspacePublicId }: WorkspaceDashboardContentProps) {
  const { data: user } = useCurrentUser();
  const { data, isPending, isError, error, refetch } = useWorkspaceOverviewAnalytics(workspacePublicId);
  const userInitials = user?.name ? workspaceInitials(user.name) : "?";

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
      <div className="w-full lg:w-3/4">
        <WorkspaceUpdatesCarousel slides={workspaceUpdateSlides(workspacePublicId)} />
      </div>
    </WorkspaceDashboardShell>
  );
}
