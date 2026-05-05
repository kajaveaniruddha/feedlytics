"use client";

import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkspaceDashboardShell } from "@/components/layout/WorkspaceDashboardShell";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import { FeedbackCategoriesSection } from "@/features/feedback-categories/components/FeedbackCategoriesSection";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";

import { WorkspaceAllowedOriginsSection } from "./WorkspaceAllowedOriginsSection";

export type WorkspaceSettingsContentProps = {
  workspacePublicId: string;
};

export function WorkspaceSettingsContent({ workspacePublicId }: WorkspaceSettingsContentProps) {
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
                    Settings
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
        </Stack>
      }
    >
      <Stack gap="lg" className="w-full max-w-5xl">
        <div className="rounded-[20px] border border-border bg-surface p-6 shadow-card md:p-8">
          <WorkspaceAllowedOriginsSection key={workspacePublicId} workspacePublicId={workspacePublicId} />
        </div>
        <div className="rounded-[20px] border border-border bg-surface p-6 shadow-card md:p-8">
          <FeedbackCategoriesSection workspacePublicId={workspacePublicId} />
        </div>
      </Stack>
    </WorkspaceDashboardShell>
  );
}
