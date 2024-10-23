import { ColumnDef } from "@tanstack/react-table";
import { ExtendedMessage } from "./MessageTable";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<ExtendedMessage, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "content",
    header: "Message Content",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    accessorKey: "stars",
    header: "Rating",
    cell: ({ getValue }) => (
      <div className="flex items-center">
        {[...Array(getValue())].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-500" />
        ))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => <span>{new Date(getValue()).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    cell: ({ getValue }) => <span>{getValue()+ "Neutral"}</span>,
  },
];
