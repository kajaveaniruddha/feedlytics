import type { Meta, StoryObj } from "@storybook/nextjs";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  feedbackWorkspaceOverviewErrorHandlers,
  feedbackWorkspaceOverviewHandlers,
} from "@/mocks/handlers/feedbackWorkspace.handlers";
import { userHappyPathHandlers } from "@/mocks/handlers/user.handlers";
import { workspaceHappyPathHandlers } from "@/mocks/handlers/workspace.handlers";

import { WorkspaceDashboardContent } from "./WorkspaceDashboardContent";

const meta: Meta<typeof WorkspaceDashboardContent> = {
  title: "Workspace/Dashboard/WorkspaceDashboardContent",
  component: WorkspaceDashboardContent,
  args: { workspacePublicId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...feedbackWorkspaceOverviewHandlers,
      ],
    },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      },
    },
  },
  decorators: [
    withAuthSession,
    (Story) => (
      <div className="min-h-screen w-full bg-bg">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof WorkspaceDashboardContent>;

export const HappyPath: Story = {};

export const OverviewError: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...feedbackWorkspaceOverviewErrorHandlers,
      ],
    },
  },
};
