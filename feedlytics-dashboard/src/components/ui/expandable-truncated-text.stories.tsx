import type { Meta, StoryObj } from "@storybook/nextjs";

import { ExpandableTruncatedText } from "./expandable-truncated-text";

const short = "Thanks for the quick fix.";
const long =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

const meta: Meta<typeof ExpandableTruncatedText> = {
  title: "UI/ExpandableTruncatedText",
  component: ExpandableTruncatedText,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ExpandableTruncatedText>;

export const ShortNoToggle: Story = {
  args: { text: short, maxLength: 100 },
};

export const LongCollapsedByDefault: Story = {
  args: { text: long, maxLength: 100 },
};

export const CustomMaxLength: Story = {
  args: { text: long, maxLength: 40 },
};
