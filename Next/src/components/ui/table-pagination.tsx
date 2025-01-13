import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps<TData> {
    table: any; // Replace `any` with the appropriate table type from @tanstack/react-table
}

const TablePagination = <TData extends { id: string }>({ table }: PaginationProps<TData>) => {
    const totalPages = Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize);

    return (
        <div className="flex items-center justify-end space-x-4">
            <span className="flex items-center justify-end text-sm text-muted-foreground ml-2">
                Page {table.getState().pagination.pageIndex + 1} of {totalPages}
            </span>
            <div className="flex items-center justify-end space-x-1">

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronsLeft size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronsRight size={18} />
                </Button>
            </div>
        </div>

    );
};

export default TablePagination;
