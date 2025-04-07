import { ColumnDef } from "@tanstack/react-table";
import { ExtendedMessage } from "../custom/table-box";
import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { sentiments, categories } from "../custom/data";
type CategoryType = 'bug' | 'request' | 'praise' | 'complaint' | 'suggestion' | 'question' | 'other';

const CategoryColors: Record<CategoryType, string> = {
  bug: "bg-red-600",
  request: "bg-blue-600",
  praise: "bg-green-600",
  complaint: "bg-yellow-600",
  suggestion: "bg-purple-600",
  question: "bg-teal-600",
  other: "bg-gray-600",
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
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => (
      <p className="">{new Date(getValue()).toLocaleDateString()}</p>
    ),
  },
  {
    accessorKey: "stars",
    header: "Ratings",
    cell: ({ row }) => {
      const stars = Number(row.getValue("stars"));

      if (!stars || stars < 1 || stars > 5) {
        return null; // Ensure valid star ratings
      }

      return (
        <div className="flex text-center">
          {[...Array(stars)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-500" />
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true; // No filter applied
      }

      const rowStars = String(row.getValue(columnId));

      // Check if the row's star rating matches any of the selected filter values
      return filterValues.includes(rowStars);
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    cell: ({ row }) => {
      const sentiment = sentiments.find(
        (sentiment) => sentiment.value === row.getValue("sentiment")
      )

      if (!sentiment) {
        return null
      }

      return (
          <span className=" flex justify-center">
            {sentiment.icon && (
              <sentiment.icon className="text-secondary-foreground " />
            )}
          </span>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categoriesArray = row.getValue("category") as string[];

      if (!Array.isArray(categoriesArray) || categoriesArray.length === 0) {
        return null;
      }

      const matchedCategories = categoriesArray
        .map((categoryValue) =>
          categories.find((category) => category.value === categoryValue)
        )
        .filter((category) => category !== undefined);

      return (
        <div className="flex items-center flex-wrap gap-2">
          {matchedCategories.map((category, index) => (
            <span
              key={index}
              className={`p-1 rounded text-xs uppercase custom-shadow ${CategoryColors[category!.label as CategoryType]
                }`}
            >
              {category!.label}
            </span>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true; // No filter applied
      }

      const rowCategories = row.getValue(columnId) as string[];

      // Check if any filter value matches the row's categories
      return rowCategories.some((category) => filterValues.includes(category));
    },
  },

  {
    accessorKey: "content",
    header: "Feedback Content",
    cell: ({ getValue }) => <p className="">{getValue()}</p>,
  },
];
