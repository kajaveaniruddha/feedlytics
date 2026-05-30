import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import { userHappyPathHandlers } from "@/mocks/handlers/user.handlers";
import {
  workspaceHappyPathHandlers,
  workspaceListAtLimitHandlers,
  workspaceListEmptyHandlers,
  workspaceListErrorHandlers,
} from "@/mocks/handlers/workspace.handlers";

import { WorkspacesPageContent } from "./WorkspacesPageContent";

const meta: Meta<typeof WorkspacesPageContent> = {
  title: "Workspace/WorkspacesPageContent",
  component: WorkspacesPageContent,
  parameters: {
    layout: "fullscreen",
    msw: { handlers: [...userHappyPathHandlers, ...workspaceHappyPathHandlers] },
    nextjs: {
      navigation: {
        pathname: "/workspaces",
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

type Story = StoryObj<typeof WorkspacesPageContent>;

export const HappyPath: Story = {};

export const EmptyList: Story = {
  parameters: { msw: { handlers: [...userHappyPathHandlers, ...workspaceListEmptyHandlers] } },
};

export const ListError: Story = {
  parameters: { msw: { handlers: [...userHappyPathHandlers, ...workspaceListErrorHandlers] } },
};

export const AtFreeWorkspaceLimit: Story = {
  parameters: { msw: { handlers: [...userHappyPathHandlers, ...workspaceListAtLimitHandlers] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/You can only have 3 free workspaces/i),
    ).toBeInTheDocument();
  },
};

export const ClientSearchFilters: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByRole("heading", { name: "My SaaS Project" })).toBeInTheDocument(),
    );
    const search = canvas.getByRole("searchbox", { name: /search workspaces/i });
    await userEvent.clear(search);
    await userEvent.type(search, "Acme");
    await waitFor(() => {
      expect(canvas.getByRole("heading", { name: "Acme Corp Dashboard" })).toBeInTheDocument();
    });
    expect(canvas.queryByRole("heading", { name: "My SaaS Project" })).not.toBeInTheDocument();
  },
};
