import type { Meta, StoryObj } from "@storybook/nextjs";

import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Atoms/Separator",
  component: Separator,
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="flex w-[360px] items-center gap-3 text-xs uppercase tracking-wide text-subtle dark:text-secondary-gray-600">
      <Separator className="flex-1" />
      <span>or</span>
      <Separator className="flex-1" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-3">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};
