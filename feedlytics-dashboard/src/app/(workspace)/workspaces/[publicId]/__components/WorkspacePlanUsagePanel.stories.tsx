import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  workspaceHappyPathHandlers,
  workspacePlanUsageArchivedHandlers,
  workspacePlanUsageErrorHandlers,
} from "@/mocks/handlers/workspace.handlers";

import { WorkspacePlanUsagePanel } from "./WorkspacePlanUsagePanel";

const meta: Meta<typeof WorkspacePlanUsagePanel> = {
  title: "Workspace/WorkspacePlanUsagePanel",
  component: WorkspacePlanUsagePanel,
  args: {
    workspacePublicId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  },
  parameters: {
    layout: "padded",
    msw: {
      handlers: workspaceHappyPathHandlers,
    },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      },
    },
  },
  decorators: [
    withAuthSession,
    (Story) => (
      <div className="min-h-[460px] w-full max-w-sm bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspacePlanUsagePanel>;

export const HappyPath: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/plan usage/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/api/i)).toBeInTheDocument());
  },
};

export const ArchivedPlan: Story = {
  parameters: {
    msw: {
      handlers: [...workspacePlanUsageArchivedHandlers, ...workspaceHappyPathHandlers],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/archived plan/i)).toBeInTheDocument());
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [...workspacePlanUsageErrorHandlers, ...workspaceHappyPathHandlers],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(/could not load plan usage/i)).toBeInTheDocument(),
    );
  },
};
