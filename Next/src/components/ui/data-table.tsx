"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import DeleteTasksButton from "./delete-task-button";
import TablePagination from "./table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableToolbar } from "../custom/data-table-toolbar";
import type { Filters } from "../custom/table-box";

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    currentPage: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    filters: Filters;
    onFilterChange: (filters: Partial<Filters>) => void;
    onSortChange: (column: string, direction: "asc" | "desc") => void;
    onDeleteSuccess: () => void;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    pageCount,
    currentPage,
    totalCount,
    onPageChange,
    filters,
    onFilterChange,
    onSortChange,
    onDeleteSuccess,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
        const newSorting = typeof updater === "function" ? updater(sorting) : updater;
        setSorting(newSorting);
        if (newSorting.length > 0) {
            const { id, desc } = newSorting[0];
            onSortChange(id, desc ? "desc" : "asc");
        }
    };

    const table = useReactTable({
        data,
        columns,
        onRowSelectionChange: setRowSelection,
        onSortingChange: handleSortingChange,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        state: { sorting, rowSelection },
    });

    return (
        <>
            <DataTableToolbar
                table={table}
                filters={filters}
                onFilterChange={onFilterChange}
            />
            <div className="rounded-md border w-full mx-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : ""}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-wrap gap-2 text-sm max-sm:text-xs w-full justify-between items-baseline">
                <div className="flex flex-wrap items-center gap-2">
                    <DeleteTasksButton
                        table={table}
                        onDeleteSuccess={onDeleteSuccess}
                    />
                    {table.getSelectedRowModel().rows.length} of {data.length} row(s) selected.
                </div>
                <TablePagination
                    currentPage={currentPage}
                    totalPages={pageCount}
                    onPageChange={onPageChange}
                />
            </div>
        </>
    );
}
