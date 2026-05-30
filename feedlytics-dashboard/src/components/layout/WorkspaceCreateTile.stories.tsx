import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorkspaceCreateTile } from "./WorkspaceCreateTile";

const meta: Meta<typeof WorkspaceCreateTile> = {
  title: "Layout/WorkspaceCreateTile",
  component: WorkspaceCreateTile,
  args: {
    title: "Create New Workspace",
    subtitle: "Start collecting feedback today",
    onActivate: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof WorkspaceCreateTile>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    disabledHint:
      "You can only have 3 free workspaces. Upgrade an existing workspace to PRO or BUSINESS to create more.",
  },
};
