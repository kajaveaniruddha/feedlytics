/**
 * Workspace dashboard page frame: constrained width + KPI region + future sections.
 */
import * as React from "react";

import { DashboardPageShell } from "@/components/layout/DashboardPageShell";
import { Stack } from "@/components/ui/stack";

export type WorkspaceDashboardShellProps = {
  kpiSection: React.ReactNode;
  children?: React.ReactNode;
};

export function WorkspaceDashboardShell({ kpiSection, children }: WorkspaceDashboardShellProps) {
  return (
    <DashboardPageShell>
      <Stack gap="lg">
        {kpiSection}
        {children}
      </Stack>
    </DashboardPageShell>
  );
}
