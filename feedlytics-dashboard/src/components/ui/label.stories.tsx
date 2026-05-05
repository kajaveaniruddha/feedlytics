import type { Meta, StoryObj } from "@storybook/nextjs";

import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "UI/Atoms/Label",
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-2">
      <Label htmlFor="email">
        Email <span className="required-asterisk">*</span>
      </Label>
      <Input id="email" placeholder="mail@feedlytics.com" />
    </div>
  ),
};
