import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { NativeSelect } from "./native-select";

const meta: Meta<typeof NativeSelect> = {
  title: "UI/NativeSelect",
  component: NativeSelect,
};

export default meta;

type Story = StoryObj<typeof NativeSelect>;

function NativeSelectDemo() {
  const [v, setV] = useState("b");
  return (
    <NativeSelect
      id="demo-native-select"
      label="Option"
      value={v}
      onChange={setV}
      options={[
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
      ]}
    />
  );
}

export const Default: Story = {
  render: () => <NativeSelectDemo />,
};
