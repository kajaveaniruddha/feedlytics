import type { Meta, StoryObj } from "@storybook/nextjs";

import { workspaceRolling30DayFixture } from "@/mocks/fixtures/workspace-overview-rolling.fixture";

import { WorkspaceMonthlyFeedbacksPanel } from "./WorkspaceMonthlyFeedbacksPanel";

const meta: Meta<typeof WorkspaceMonthlyFeedbacksPanel> = {
  title: "Workspace/WorkspaceMonthlyFeedbacksPanel",
  component: WorkspaceMonthlyFeedbacksPanel,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="min-h-[360px] w-full max-w-sm bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspaceMonthlyFeedbacksPanel>;

export const Default: Story = {
  args: {
    trend: workspaceRolling30DayFixture,
  },
};

export const NegativeTrend: Story = {
  args: {
    trend: {
      ...workspaceRolling30DayFixture,
      count: 80,
      previousPeriodCount: 100,
      changePercent: -20,
    },
  },
};
