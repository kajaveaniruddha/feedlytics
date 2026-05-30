import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  feedbackWorkspaceListHandlers,
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
        ...feedbackWorkspaceListHandlers,
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

export const HappyPath: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/this month feedbacks/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/recent feedbacks/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/love the new dashboard redesign/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole("link", { name: /view all/i })).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/ada lovelace/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText("Workspaces")).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText("Owned")).toBeInTheDocument());
  },
};

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
