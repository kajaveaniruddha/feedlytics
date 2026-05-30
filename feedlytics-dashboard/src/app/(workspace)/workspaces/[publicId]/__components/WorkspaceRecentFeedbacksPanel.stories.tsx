import type { Meta, StoryObj } from "@storybook/nextjs";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import { feedbackWorkspaceListHandlers } from "@/mocks/handlers/feedbackWorkspace.handlers";

import { WorkspaceRecentFeedbacksPanel } from "./WorkspaceRecentFeedbacksPanel";

const meta: Meta<typeof WorkspaceRecentFeedbacksPanel> = {
  title: "Workspace/WorkspaceRecentFeedbacksPanel",
  component: WorkspaceRecentFeedbacksPanel,
  args: {
    workspacePublicId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  },
  parameters: {
    layout: "padded",
    msw: { handlers: feedbackWorkspaceListHandlers },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      },
    },
  },
  decorators: [
    withAuthSession,
    (Story) => (
      <div className="min-h-[400px] w-full max-w-xl bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspaceRecentFeedbacksPanel>;

export const Default: Story = {};
