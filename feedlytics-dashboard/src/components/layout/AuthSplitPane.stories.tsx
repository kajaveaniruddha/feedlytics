import type { Meta, StoryObj } from "@storybook/nextjs";

import { AuthSplitPane } from "./AuthSplitPane";

const meta: Meta<typeof AuthSplitPane> = {
  title: "Layout/AuthSplitPane",
  component: AuthSplitPane,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AuthSplitPane>;

export const Basic: Story = {
  render: () => (
    <AuthSplitPane>
      <div className="flex h-80 items-center justify-center text-base text-navy-700 dark:text-white">
        Auth form goes here
      </div>
    </AuthSplitPane>
  ),
};
