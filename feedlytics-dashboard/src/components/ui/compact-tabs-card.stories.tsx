import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { CompactTabsCard } from "./compact-tabs-card";

const meta: Meta<typeof CompactTabsCard> = {
  title: "UI/CompactTabsCard",
  component: CompactTabsCard,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof CompactTabsCard>;

function TwoTabsStateful() {
  const [value, setValue] = useState<"form" | "success">("form");
  return (
    <CompactTabsCard
      tabs={[
        { id: "form", label: "Form" },
        { id: "success", label: "Success" },
      ]}
      value={value}
      onValueChange={setValue}
      tablistLabel="Preview view"
    />
  );
}

function ManyTabsStateful() {
  const [value, setValue] = useState<"a" | "b" | "c" | "d">("a");
  return (
    <CompactTabsCard
      tabs={[
        { id: "a", label: "Theme" },
        { id: "b", label: "Success" },
        { id: "c", label: "Fields" },
        { id: "d", label: "Advanced" },
      ]}
      value={value}
      onValueChange={setValue}
      tablistLabel="Editor sections"
    />
  );
}

function DisabledTabs() {
  return (
    <CompactTabsCard
      tabs={[
        { id: "one", label: "One" },
        { id: "two", label: "Two" },
      ]}
      value="one"
      onValueChange={() => {}}
      tablistLabel="Disabled example"
      disabled
    />
  );
}

export const FormSuccessPreview: Story = {
  render: () => <TwoTabsStateful />,
};

export const ManyTabs: Story = {
  render: () => <ManyTabsStateful />,
};

export const Disabled: Story = {
  render: () => <DisabledTabs />,
};
