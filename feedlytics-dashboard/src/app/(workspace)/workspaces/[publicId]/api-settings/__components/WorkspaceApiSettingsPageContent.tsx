"use client";

import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkspaceDashboardShell } from "@/components/layout/WorkspaceDashboardShell";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";

import { WorkspaceApiIntegrationSection } from "../../settings/__components/WorkspaceApiIntegrationSection";

export type WorkspaceApiSettingsPageContentProps = {
  workspacePublicId: string;
};

export function WorkspaceApiSettingsPageContent({
  workspacePublicId,
}: WorkspaceApiSettingsPageContentProps) {
  const { data: user } = useCurrentUser();
  const userInitials = user?.name ? workspaceInitials(user.name) : "?";

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
                    API
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
        </Stack>
      }
    >
      <div className="w-full max-w-6xl">
        <WorkspaceApiIntegrationSection key={workspacePublicId} workspacePublicId={workspacePublicId} />
      </div>
    </WorkspaceDashboardShell>
  );
}
