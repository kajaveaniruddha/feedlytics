import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  workspaceOverviewFixture,
  workspaceOverviewNotConfiguredFixture,
} from "@/mocks/fixtures/workspace-overview.fixture";

import { WorkspaceSentimentBreakdownPanel } from "./WorkspaceSentimentBreakdownPanel";

const meta: Meta<typeof WorkspaceSentimentBreakdownPanel> = {
  title: "Workspace/WorkspaceSentimentBreakdownPanel",
  component: WorkspaceSentimentBreakdownPanel,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="min-h-[320px] w-full max-w-md bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspaceSentimentBreakdownPanel>;

export const WithData: Story = {
  args: {
    sentimentCounts: workspaceOverviewFixture.sentimentCounts,
  },
};

export const Empty: Story = {
  args: {
    sentimentCounts: workspaceOverviewNotConfiguredFixture.sentimentCounts,
  },
};
