import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorkspaceAppChrome } from "./WorkspaceAppChrome";

const meta: Meta<typeof WorkspaceAppChrome> = {
  title: "Layout/WorkspaceAppChrome",
  component: WorkspaceAppChrome,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/workspaces/demo-public-id",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof WorkspaceAppChrome>;

export const Default: Story = {
  render: () => (
    <WorkspaceAppChrome>
      <div className="mx-auto w-full max-w-4xl px-6 py-9 text-sm text-navy-700 dark:text-white">
        Main content area (scroll test — sidebar stays fixed on large viewports).
      </div>
    </WorkspaceAppChrome>
  ),
};
