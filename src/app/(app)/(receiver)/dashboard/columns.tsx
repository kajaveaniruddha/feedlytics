import { ColumnDef } from "@tanstack/react-table";
import { ExtendedMessage } from "./table-box";
import { ArrowUpDown, EllipsisVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<ExtendedMessage, any>[] = [
  {
    accessorKey: "content",
    header: "Feedback Content",
    cell: ({ getValue }) => <p className="w-[29rem]">{getValue()}</p>,
  },
  {
    accessorKey: "stars",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center">
            Ratings <EllipsisVertical size={15} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === "asc")
              }}
              className="flex w-full hover:cursor-pointer"
            >
              Sort <ArrowUpDown className="ml-2 h-4 w-4" />
            </DropdownMenuItem>

            {[...Array(5)].map((_, i) => (
              <DropdownMenuItem
                key={i}
                onClick={() => {
                  column.setFilterValue(i + 1);
                  column.clearSorting(); // Clear sorting for consistent filtering
                }}
                className="hover:cursor-pointer"
              >
                {i === 0 ? `${i + 1}-star` : `${i + 1}-stars`}
              </DropdownMenuItem>
            ))}

            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue(undefined); // Show all ratings
                column.clearSorting(); // Clear sorting when resetting filter
              }}
              className="hover:cursor-pointer text-red-500"
            >
              clear sort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ getValue }) => (
      <div className="flex text-center w-[5rem]">
        {[...Array(getValue())].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-500" />
        ))}
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      return filterValue ? row.getValue(columnId) === filterValue : true;
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => (
      <p className="w-[5rem]">{new Date(getValue()).toLocaleDateString()}</p>
    ),
  },
  {
    accessorKey: "sentiment",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center">
            Sentiment <EllipsisVertical size={15} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue("positive");
                column.clearSorting(); // Clear sorting for consistent filtering
              }}
              className="hover:cursor-pointer"
            >
              positive
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue("negative");
                column.clearSorting(); // Clear sorting for consistent filtering
              }}
              className="hover:cursor-pointer"
            >
              negative
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue("neutral");
                column.clearSorting(); // Clear sorting for consistent filtering
              }}
              className="hover:cursor-pointer"
            >
              neutral
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue(undefined); // Show all ratings
                column.clearSorting(); // Clear sorting when resetting filter
              }}
              className="hover:cursor-pointer text-red-500"
            >
              clear sort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ getValue }) => <p className="w-[5rem]">{getValue()}</p>,
    filterFn: (row, columnId, filterValue) => {
      return filterValue ? row.getValue(columnId) === filterValue : true;
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
];
