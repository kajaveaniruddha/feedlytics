import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { ColorField } from "./color-field";

const meta: Meta<typeof ColorField> = {
  title: "UI/ColorField",
  component: ColorField,
};

export default meta;

type Story = StoryObj<typeof ColorField>;

function ColorFieldDemo() {
  const [v, setV] = useState("#6366F1");
  return <ColorField id="demo-color" label="Accent" value={v} onChange={setV} />;
}

export const Default: Story = {
  render: () => <ColorFieldDemo />,
};
