import type { Meta, StoryObj } from "@storybook/nextjs";

import { KpiStatCard } from "./KpiStatCard";
import { KpiStatCardGrid } from "./KpiStatCardGrid";
import { WorkspaceDashboardShell } from "./WorkspaceDashboardShell";

const meta: Meta<typeof WorkspaceDashboardShell> = {
  title: "Layout/WorkspaceDashboardShell",
  component: WorkspaceDashboardShell,
};
export default meta;

type Story = StoryObj<typeof WorkspaceDashboardShell>;

export const KpiOnly: Story = {
  render: () => (
    <WorkspaceDashboardShell
      kpiSection={
        <KpiStatCardGrid>
          <KpiStatCard label="A" value="1" />
          <KpiStatCard label="B" value="2" />
          <KpiStatCard label="C" value="3" />
          <KpiStatCard label="D" value="4" />
        </KpiStatCardGrid>
      }
    />
  ),
};

export const WithFutureSlot: Story = {
  render: () => (
    <WorkspaceDashboardShell
      kpiSection={
        <KpiStatCardGrid>
          <KpiStatCard label="Metric" value="42" />
        </KpiStatCardGrid>
      }
    >
      <p className="text-sm text-navy-700 dark:text-white">Future section placeholder.</p>
    </WorkspaceDashboardShell>
  ),
};
