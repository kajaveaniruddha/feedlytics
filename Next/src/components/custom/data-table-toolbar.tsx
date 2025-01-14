"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { DataTableViewOptions } from "@/components/custom/data-table-view-options"

import { sentiments, categories, ratings } from "./data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("content")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] border border-border"
        />
        {table.getColumn("stars") && (
          <DataTableFacetedFilter
            column={table.getColumn("stars")}
            title="Ratings"
            options={ratings}
          />
        )}
        {table.getColumn("sentiment") && (
          <DataTableFacetedFilter
            column={table.getColumn("sentiment")}
            title="Sentiments"
            options={sentiments}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Categories"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}