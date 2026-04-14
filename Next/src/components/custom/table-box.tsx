"use client";
import React, { useState, useCallback } from "react";
import { Message } from "@/types";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../ui/columns";
import { useMessageContext } from "@/hooks/use-message-context";
import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { useApiErrorToast } from "@/hooks/use-api-error-toast";

export interface ExtendedMessage extends Message {
  id: string;
}

export interface Filters {
  content: string;
  stars: number[];
  sentiment: string[];
  category: string[];
}

const MessageTable: React.FC = () => {
  const { setMessageCount } = useMessageContext();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState<"createdAt" | "stars">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Filters>({
    content: "",
    stars: [],
    sentiment: [],
    category: [],
  });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages-table", page, limit, sortBy, sortOrder, filters],
    queryFn: async () => {
      const res = await api.getMessages({
        page,
        limit,
        sortBy,
        sortOrder,
        content: filters.content || undefined,
        stars: filters.stars.length > 0 ? filters.stars : undefined,
        sentiment: filters.sentiment.length > 0 ? filters.sentiment : undefined,
        category: filters.category.length > 0 ? filters.category : undefined,
      });
      setMessageCount(res.data.totalCount ?? 0);
      return {
        messages: (res.data.messages || []) as ExtendedMessage[],
        totalPages: res.data.totalPages || 1,
        totalCount: res.data.totalCount || 0,
        currentPage: res.data.currentPage || 1,
      };
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  useApiErrorToast(isError, error as Error | null);

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSortChange = useCallback((column: string, direction: "asc" | "desc") => {
    if (column === "createdAt" || column === "stars") {
      setSortBy(column);
      setSortOrder(direction);
      setPage(1);
    }
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Card className="w-full min-h-screen flex flex-col gap-y-4 p-6">
      <Button onClick={() => refetch()} variant="outline" size="sm" className="z-20 border-border w-fit">
        {isLoading ?
          <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : <RefreshCcw className="h-4 w-4" />
        }
      </Button>
      {!isLoading && (
        <DataTable
          columns={columns}
          data={data?.messages ?? []}
          pageCount={data?.totalPages ?? 1}
          currentPage={page}
          totalCount={data?.totalCount ?? 0}
          onPageChange={handlePageChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </Card>
  );
};

export default MessageTable;
