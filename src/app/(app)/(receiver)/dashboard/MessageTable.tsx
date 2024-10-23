"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, RefreshCcw, Star } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
export interface ExtendedMessage extends Message {
  _id: string;
}

const MessageTable: React.FC = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/get-messages", {});
      const messagesData: Message[] = res.data?.messages || [];
      setMessages(messagesData);
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
  }, [session, toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="w-full p-4 min-h-screen flex flex-col gap-y-4">
      <div className="ml-6 flex justify-between">
        <Button onClick={fetchMessages} variant="outline" size="sm">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      {loading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : (
        <DataTable columns={columns} data={messages as ExtendedMessage[]} />
      )}
    </div>
  );
};

export default MessageTable;
