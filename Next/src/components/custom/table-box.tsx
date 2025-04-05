"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../ui/columns";
import { useMessageContext } from "@/hooks/use-message-context";
import { Card, CardContent } from "../ui/card";
export interface ExtendedMessage extends Message {
  id: string;
}

const MessageTable: React.FC = () => {
  const { setMessageCount } = useMessageContext();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/get-messages", {});
      const messagesData: Message[] = res.data?.messages || [];
      setMessages(messagesData);
      setMessageCount(messagesData.length)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        variant: "destructive",
        title: "Error",
        description: axiosError.response?.data.message,
      });
    } finally {
      setLoading(false);
    }
  }, [setMessageCount, toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <Card className="w-full min-h-screen flex flex-col gap-y-4 p-6">
        <Button onClick={fetchMessages} variant="outline" size="sm" className=" z-20 border-border w-fit">
          {loading ?
            <Loader2 className="h-4 w-4 animate-spin mx-auto " /> : <RefreshCcw className="h-4 w-4 " />
          }
        </Button>
        {!loading &&
          <DataTable columns={columns} data={messages as ExtendedMessage[]} />}
    </Card>
  );
};

export default MessageTable;
