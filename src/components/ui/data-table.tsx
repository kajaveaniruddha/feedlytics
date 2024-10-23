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
} from "@tanstack/react-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Trash2 } from "lucide-react";

interface DataTableProps<TData extends { _id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends { _id: string }, TValue>({
    columns,
    data: initialData,
}: DataTableProps<TData, TValue>) {
    const { toast } = useToast();
    const [data, setData] = useState<TData[]>(initialData);
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/delete-message/${id}`);
            // Remove the deleted message from the local state
            setData((prevData) => prevData.filter((item) => item._id !== id));
            toast({
                title: "Success",
                description: "Message deleted successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete message",
            });
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    })

    return (
        <>
            <div className="rounded-md border w-[95%] mx-auto">
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
                                    <TableCell>
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
                                                    <AlertDialogAction onClick={() => handleDelete(row.original._id)}>
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
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
            <div className="flex items-center justify-end space-x-2 py-4 mr-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </>
    )
}
