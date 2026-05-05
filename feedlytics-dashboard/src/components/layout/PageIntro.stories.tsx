import type { Meta, StoryObj } from "@storybook/nextjs";

import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";

import { PageIntro } from "./PageIntro";

const meta: Meta<typeof PageIntro> = {
  title: "Layout/PageIntro",
  component: PageIntro,
};
export default meta;

type Story = StoryObj<typeof PageIntro>;

export const Default: Story = {
  render: () => (
    <PageIntro
      kicker={<MutedText tone="subtle">Welcome back, Ada</MutedText>}
      title={
        <Heading variant="display" as="h1">
          Choose Your Workspace
        </Heading>
      }
    />
  ),
};
