"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, RefreshCcw, Star } from "lucide-react";
import MessageRow from "./message-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessageContext } from "../MessageProvider";
import { Pagination, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const MessageTable = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const [position, setPosition] = useState<string>("0");
  const [itemsPerPage] = useState<number>(10);
  const { data: session } = useSession();
  const { toast } = useToast();
  const { messageCount, setMessageCount } = useMessageContext();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    setMessageCount(messageCount - 1);
  };

  const handleSetPosition = (value: string) => {
    setPosition(value);
  };

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse>(
        `/api/get-messages/?rating=${position}`
      );
      const messagesData: Message[] = res.data?.messages || [];
      setMessages(messagesData);
      setMessageCount(res.data?.messageCount as number);
      setFilteredMessages(messagesData.slice(0, itemsPerPage));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [position, setMessageCount, toast, itemsPerPage]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
  }, [session, fetchMessages]);

  const handlePageChange = (page: number) => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = page * itemsPerPage;
    setFilteredMessages(messages.slice(startIdx, endIdx));
    setCurrPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Echos</CardTitle>
          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages();
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <div className="ml-6 mb-4 -mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by rating</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={(value) => handleSetPosition(value)}
            >
              <DropdownMenuRadioItem value="0">All</DropdownMenuRadioItem>
              {[...Array(5)].map((_, i) => (
                <DropdownMenuRadioItem key={i} value={`${i + 1}`}>
                  {[...Array(i + 1)].map((_, j) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-yellow-400"
                      size={20}
                    />
                  ))}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table className="mx-auto w-[95%] border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">Sr.no.</TableHead>
            <TableHead className="w-[10%]">Rating</TableHead>
            <TableHead className="w-[60%]">Review</TableHead>
            <TableHead className="w-[20%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="bg-slate-200 h-10 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="bg-slate-200 h-10 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="bg-slate-200 h-10 w-60" />
              </TableCell>
              <TableCell>
                <Skeleton className="bg-slate-200 h-10 w-20" />
              </TableCell>
            </TableRow>
          ) : filteredMessages.length > 0 ? (
            filteredMessages.map((message, index) => (
              <MessageRow
                key={index}
                id={(currPage - 1) * itemsPerPage + index + 1}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>No messages to display</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="ml-6 mt-2 text-xs font-semibold text-gray-800">
        Showing: {messages.length}/{messageCount}
      </p>
      <Pagination>
        <PaginationPrevious
          onClick={() => handlePageChange(currPage - 1)}
          className={
            currPage === 1
              ? "pointer-events-none hover:cursor-not-allowed opacity-50"
              : "hover:cursor-pointer opacity-100"
          }
        >
          Previous
        </PaginationPrevious>

        <PaginationNext
          onClick={() => handlePageChange(currPage + 1)}
          className={
            currPage * itemsPerPage >= messages.length
              ? "pointer-events-none hover:cursor-not-allowed opacity-50"
              : "hover:cursor-pointer opacity-100"
          }
        >
          Next
        </PaginationNext>
      </Pagination>
    </Card>
  );
};

export default MessageTable;
