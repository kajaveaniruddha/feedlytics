import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorkspaceSidebarBody } from "./WorkspaceSidebarBody";

const meta: Meta<typeof WorkspaceSidebarBody> = {
  title: "Layout/WorkspaceSidebarBody",
  component: WorkspaceSidebarBody,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/workspaces/demo-public-id",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[640px] w-[280px] overflow-hidden rounded-xl border border-secondary-gray-200 bg-surface dark:border-white/10 dark:bg-navy-800">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof WorkspaceSidebarBody>;

export const InWorkspace: Story = {};
