import type { Meta, StoryObj } from "@storybook/nextjs";

import { Stack } from "./stack";
import { Button } from "./button";

const meta: Meta<typeof Stack> = {
  title: "UI/Atoms/Stack",
  component: Stack,
  args: { gap: "md", children: null },
};
export default meta;

type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Button type="button" variant="outline" size="md">
        First
      </Button>
      <Button type="button" variant="brand" size="md">
        Second
      </Button>
    </Stack>
  ),
};
