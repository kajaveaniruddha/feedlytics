import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Example workspace members table.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Alex Rivera</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell className="text-right text-secondary-gray-600 dark:text-secondary-gray-400">Jan 12, 2025</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jordan Lee</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell className="text-right text-secondary-gray-600 dark:text-secondary-gray-400">Feb 3, 2025</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
