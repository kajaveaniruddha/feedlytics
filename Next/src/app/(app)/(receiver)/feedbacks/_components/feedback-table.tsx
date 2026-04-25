"use client";
import React from "react";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useMessageContext } from "@/hooks/use-message-context";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useApiErrorToast } from "@/hooks/use-api-error-toast";

export interface ExtendedMessage extends Message {
  id: string;
}

const MessageTable: React.FC = () => {
  const { setMessageCount } = useMessageContext();

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ["messages-table"],
    queryFn: async () => {
      const res = await api.getMessages();
      const messagesData: Message[] = res.data?.messages || [];
      setMessageCount(messagesData.length);
      return messagesData;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  useApiErrorToast(isError, error as Error | null, "Error");

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
