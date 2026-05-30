import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "@/components/ui/button";

import { ErrorPanel } from "./ErrorPanel";

const meta: Meta<typeof ErrorPanel> = {
  title: "Layout/ErrorPanel",
  component: ErrorPanel,
  args: { message: "Network error — try again." },
};
export default meta;

type Story = StoryObj<typeof ErrorPanel>;

export const Default: Story = {
  render: (args) => (
    <ErrorPanel {...args}>
      <Button type="button" variant="brand" size="md">
        Retry
      </Button>
    </ErrorPanel>
  ),
};
