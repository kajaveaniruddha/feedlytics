import { ColumnDef } from "@tanstack/react-table";
import { ExtendedMessage } from "./table-box";
import { ArrowUpDown, EllipsisVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"

const CategoryColors: { [key: string]: string } = {
  bug: "bg-red-600",
  request: "bg-blue-600",
  praise: "bg-green-600",
  complaint: "bg-yellow-600",
  suggestion: "bg-purple-600",
  question: "bg-teal-600",
  other:"bg-gray-600"
};

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
                  column.clearSorting();
                }}
                className="hover:cursor-pointer"
              >
                {i === 0 ? `${i + 1}-star` : `${i + 1}-stars`}
              </DropdownMenuItem>
            ))}

            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue(undefined);
                column.clearSorting();
              }}
              className="hover:cursor-pointer text-red-500"
            >
              Clear Filter
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
    accessorKey: "sentiment",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center">
            Sentiment <EllipsisVertical size={15} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
              Clear Filter
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
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center">
            Category <EllipsisVertical size={15} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(CategoryColors).map((category, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  column.setFilterValue(category);
                  column.clearSorting();
                }}
                className="hover:cursor-pointer"
              >
                {category}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => {
                column.setFilterValue(undefined);
                column.clearSorting();
              }}
              className="hover:cursor-pointer text-red-500"
            >
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ getValue }) => (
      <ul className="flex flex-wrap gap-1">
        {getValue()?.length && (
          getValue().map((cat: string, index: number) => (
            <li
              className={`text-xs text-white font-semibold border p-1 text-center rounded-sm shadow-inner ${CategoryColors[cat]
                }`}
              key={index}
            >
              {cat.toUpperCase()}
            </li>
          ))
        )}
      </ul>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const categories = row.getValue(columnId) as string[];
      return categories.includes(filterValue);
    },
    sortingFn: (rowA, rowB, columnId) => {
      const aCategories = rowA.getValue(columnId) as string[];
      const bCategories = rowB.getValue(columnId) as string[];

      const aCategory = aCategories[0] || '';
      const bCategory = bCategories[0] || '';

      return aCategory.localeCompare(bCategory);
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
];
