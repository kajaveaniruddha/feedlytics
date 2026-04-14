import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const TablePagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    return (
        <div className="flex  items-center justify-end space-x-4">
            <span className="flex items-center justify-end text-sm ml-2">
                Page {currentPage} of {totalPages}
            </span>
            <div className="flex flex-wrap gap-2 items-center justify-end space-x-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronsLeft size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronRight size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                >
                    <ChevronsRight size={18} />
                </Button>
            </div>
        </div>

    );
};

export default TablePagination;
