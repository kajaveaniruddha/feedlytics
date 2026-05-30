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

import { Separator } from "@/components/ui/separator";

import { WorkspaceWidgetAppearanceSection } from "./WorkspaceWidgetAppearanceSection";
import { WorkspaceWidgetIntegrationSection } from "../../settings/__components/WorkspaceWidgetIntegrationSection";

export type WorkspaceWidgetPageContentProps = {
  workspacePublicId: string;
};

export function WorkspaceWidgetPageContent({ workspacePublicId }: WorkspaceWidgetPageContentProps) {
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
                    Widget
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
        </Stack>
      }
    >
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <WorkspaceWidgetIntegrationSection key={workspacePublicId} workspacePublicId={workspacePublicId} />
        <Separator />
        <WorkspaceWidgetAppearanceSection workspacePublicId={workspacePublicId} />
      </div>
    </WorkspaceDashboardShell>
  );
}
