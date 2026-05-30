import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { adaProfile } from "@/mocks/fixtures/users.fixture";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";

import { WorkspaceUserProfileCard } from "./WorkspaceUserProfileCard";

const meta: Meta<typeof WorkspaceUserProfileCard> = {
  title: "Workspace/Dashboard/WorkspaceUserProfileCard",
  component: WorkspaceUserProfileCard,
  args: {
    name: adaProfile.name,
    initials: workspaceInitials(adaProfile.name),
    roleLabel: "Owner",
    stats: [
      { label: "Workspaces", value: 3 },
      { label: "Owned", value: 1 },
    ],
  },
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="min-h-[420px] w-full max-w-sm bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspaceUserProfileCard>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(adaProfile.name)).toBeInTheDocument();
    expect(canvas.getByText("Owner")).toBeInTheDocument();
    expect(canvas.getByText("Workspaces")).toBeInTheDocument();
    expect(canvas.getByText("Owned")).toBeInTheDocument();
    expect(canvas.getByText("3")).toBeInTheDocument();
    expect(canvas.getByText("1")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
