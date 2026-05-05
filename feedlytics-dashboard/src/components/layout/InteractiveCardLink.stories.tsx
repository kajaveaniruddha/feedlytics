import type { Meta, StoryObj } from "@storybook/nextjs";

import { InteractiveCardLink } from "./InteractiveCardLink";

const meta: Meta<typeof InteractiveCardLink> = {
  title: "Layout/InteractiveCardLink",
  component: InteractiveCardLink,
  args: { href: "/workspaces", children: null },
};
export default meta;

type Story = StoryObj<typeof InteractiveCardLink>;

export const Default: Story = {
  render: (args) => (
    <InteractiveCardLink {...args}>
      <div className="rounded-[20px] bg-surface p-6 text-sm text-navy-700 shadow-card dark:bg-navy-800 dark:text-white">
        Card body (use with `Card interactive` in the app).
      </div>
    </InteractiveCardLink>
  ),
};
