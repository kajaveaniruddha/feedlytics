"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { useState, useCallback } from "react"
import { useDebounceCallback } from "usehooks-ts"

import { DataTableViewOptions } from "@/components/custom/data-table-view-options"
import { sentiments, categories, ratings } from "./data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import type { Filters } from "./table-box"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters: Filters
  onFilterChange: (filters: Partial<Filters>) => void
}

export function DataTableToolbar<TData>({
  table,
  filters,
  onFilterChange,
}: DataTableToolbarProps<TData>) {
  const [contentInput, setContentInput] = useState(filters.content);
  const debouncedContentChange = useDebounceCallback((value: string) => {
    onFilterChange({ content: value });
  }, 300);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContentInput(e.target.value);
    debouncedContentChange(e.target.value);
  }, [debouncedContentChange]);

  const isFiltered = filters.content || filters.stars.length > 0 || filters.sentiment.length > 0 || filters.category.length > 0;

  const handleReset = useCallback(() => {
    setContentInput("");
    onFilterChange({ content: "", stars: [], sentiment: [], category: [] });
  }, [onFilterChange]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap flex-1 items-center space-x-2 gap-y-2">
        <Input
          placeholder="Filter tasks..."
          value={contentInput}
          onChange={handleContentChange}
          className="h-8 w-[150px] lg:w-[250px] border border-border"
        />
        <DataTableFacetedFilter
          title="Ratings"
          options={ratings}
          selectedValues={filters.stars.map(String)}
          onFilterChange={(values) => onFilterChange({ stars: values.map(Number) })}
        />
        <DataTableFacetedFilter
          title="Sentiments"
          options={sentiments}
          selectedValues={filters.sentiment}
          onFilterChange={(values) => onFilterChange({ sentiment: values })}
        />
        <DataTableFacetedFilter
          title="Categories"
          options={categories}
          selectedValues={filters.category}
          onFilterChange={(values) => onFilterChange({ category: values })}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
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
