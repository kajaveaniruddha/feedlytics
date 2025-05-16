"use client";
import React, { useEffect } from "react";
import { Message } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../ui/columns";
import { useMessageContext } from "@/hooks/use-message-context";
import { Card, CardContent } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
export interface ExtendedMessage extends Message {
  id: string;
}

const MessageTable: React.FC = () => {
  const { setMessageCount } = useMessageContext();
  const { toast } = useToast();

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ["messages-table"],
    queryFn: async () => {
      const res = await axios.get<ApiResponse>("/api/get-messages");
      const messagesData: Message[] = res.data?.messages || [];
      setMessageCount(messagesData.length);
      return messagesData;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  // Show toast on error
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error)?.message || "Failed to fetch messages",
      });
    }
  }, [isError, error, toast]);

  return (
    <Card className="w-full min-h-screen flex flex-col gap-y-4 p-6">
        <Button onClick={() => refetch()} variant="outline" size="sm" className=" z-20 border-border w-fit">
          {isLoading ?
            <Loader2 className="h-4 w-4 animate-spin mx-auto " /> : <RefreshCcw className="h-4 w-4 " />
          }
        </Button>
        {!isLoading &&
          <DataTable columns={columns} data={messages as ExtendedMessage[]} />}
    </Card>
  );
};

export default MessageTable;
