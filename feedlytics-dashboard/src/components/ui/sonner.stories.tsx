import type { Meta, StoryObj } from "@storybook/nextjs";
import { toast } from "sonner";

import { Button } from "./button";
import { Toaster } from "./sonner";

const Demo = () => (
  <div className="flex flex-wrap gap-3">
    <Toaster richColors position="top-right" />
    <Button variant="brand" onClick={() => toast.success("Signed in.")}>Success toast</Button>
    <Button variant="destructive" onClick={() => toast.error("Invalid credentials.")}>Error toast</Button>
    <Button variant="outline" onClick={() => toast.info("Verification email sent.")}>Info toast</Button>
  </div>
);

const meta: Meta<typeof Demo> = {
  title: "UI/Atoms/Sonner",
  component: Demo,
};
export default meta;

type Story = StoryObj<typeof Demo>;
export const Basic: Story = {};
