import type { Meta, StoryObj } from "@storybook/nextjs";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Atoms/Checkbox",
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = { args: {} };
export const Checked: Story = { args: { defaultChecked: true } };

export const WithLabel: Story = {
  render: () => (
    <Label className="flex cursor-pointer items-center gap-2 font-normal">
      <Checkbox defaultChecked />
      <span>Keep me logged in</span>
    </Label>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
