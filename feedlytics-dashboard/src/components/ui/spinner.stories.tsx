import type { Meta, StoryObj } from "@storybook/nextjs";

import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "UI/Atoms/Spinner",
  component: Spinner,
  args: { size: 20 },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Brand: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size={16} />
      <Spinner size={20} />
      <Spinner size={28} />
      <Spinner size={40} />
    </div>
  ),
};
