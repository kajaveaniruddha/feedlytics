"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, XCircle } from "lucide-react";
import { useMessageContext } from "@/context/MessageProvider";
import { Badge } from "./badge";

interface DataTableProps<TData extends { _id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends { _id: string }, TValue>({
    columns,
    data: initialData,
}: DataTableProps<TData, TValue>) {
    const { toast } = useToast();
    const { messageCount, setMessageCount } =
        useMessageContext();
    const [data, setData] = useState<TData[]>(initialData);
    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const handleDelete = async (ids: string[]) => {
        try {
            // Join the IDs into a comma-separated string and make a DELETE request
            const idsParam = ids.join(",");
            await axios.delete(`/api/delete-message/${idsParam}`);

            setData((prevData) => prevData.filter((item) => !ids.includes(item._id)));
            setMessageCount(messageCount - ids.length);
            setRowSelection({});
            toast({
                title: "Success",
                description: "Messages deleted successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete messages",
            });
        }
    };
    const table = useReactTable({
        data,
        columns,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { sorting, pagination, rowSelection },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })
    const totalPages = Math.ceil(data.length / pagination.pageSize);
    return (
        <>
            <div className="flex items-center justify-end space-x-1 mr-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.firstPage()}
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
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronsRight size={18} />
                </Button>
            </div>
            <span className="flex items-center justify-end mr-6 text-sm text-muted-foreground"> showing page ( {pagination.pageIndex + 1 + " of " + totalPages} )</span>
            <div className="flex flex-col text-sm text-muted-foreground gap-1 items-baseline">
                <p className=" min-w-fit inline-flex gap-1 items-center">
                    <Button disabled={table.getFilteredSelectedRowModel().rows.length === 0} variant={table.getFilteredSelectedRowModel().rows.length === 0 ? "ghost" : "destructive"} className="">
                        <Trash2
                            size={14}
                            onClick={() => {
                                const selectedIds = table.getFilteredSelectedRowModel().rows.map((row) => row.original._id);
                                if (selectedIds.length > 0) {
                                    handleDelete(selectedIds);
                                }
                            }}
                        />&nbsp;DELETE
                    </Button>
                </p>

                <span className="text-sm font-medium ml-2"> {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </span>

                <div className="flex gap-2 flex-wrap font-normal">
                    <span className="text-sm font-medium"> Active Filters:</span> {table.getState().columnFilters.length > 0 ? (
                        table.getState().columnFilters.map((filter: any, index) => (
                            <Badge variant="default" key={index} className="h-7 flex items-center">
                                <span className=" text-muted-foreground capitalize text-white">
                                    {filter.id + " : " + filter.value}
                                </span>
                            </Badge>
                        ))
                    ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                    )}
                    {table.getState().columnFilters.length > 0 && (
                        <Button variant="ghost" size="sm" className="h-7" onClick={() => table.resetColumnFilters()}>
                            <XCircle /> Clear all
                        </Button>
                    )}
                </div>
            </div>
            <div className="rounded-md shadow-lg border w-full mx-auto bg-white">
                <Table>
                    <TableHeader>
                        {table?.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {/* <TableCell>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <Trash2 size={20} className=" opacity-70 hover:opacity-100 transition-all" />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete
                                                        the message from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className=" bg-red-500" onClick={() => handleDelete(row.original._id)}>
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell> */}
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
            </div >
        </>
    )
}
