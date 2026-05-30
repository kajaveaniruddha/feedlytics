import type { Meta, StoryObj } from "@storybook/nextjs";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Atoms/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Interactive: Story = {
  render: () => (
    <Card interactive className="w-[420px]">
      <CardHeader>
        <CardTitle>Workspace card</CardTitle>
        <CardDescription>Hover to preview picker lift.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted dark:text-secondary-gray-600">Used on /workspaces.</p>
      </CardContent>
    </Card>
  ),
};

export const Basic: Story = {
  render: () => (
    <Card className="w-[420px]">
      <CardHeader>
        <CardTitle>Weekly feedback digest</CardTitle>
        <CardDescription>Your team received 124 new responses.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted dark:text-secondary-gray-600">
          72% positive, 18% neutral, 10% negative. Up 14% from last week.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="brand" size="md">
          View report
        </Button>
      </CardFooter>
    </Card>
  ),
};
