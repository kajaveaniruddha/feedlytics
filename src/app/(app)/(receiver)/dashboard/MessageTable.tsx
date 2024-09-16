"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageRow from "@/components/message-row";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMessageContext } from "../MessageProvider";

const MessageTable = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currPage, setCurrPage] = useState<number>(1);
  const { data: session } = useSession();
  const { toast } = useToast();
  const { messageCount, setMessageCount } =
    useMessageContext();

  const totalPages = Math.ceil(messageCount / 10);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    setMessageCount(messageCount - 1);
  };

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const res = await axios.get<ApiResponse>(
          `/api/get-messages/?page=${currPage}`
        );
        const messagesData: Message[] = res.data?.messages || [];
        setMessages(messagesData);
        setMessageCount(res.data?.messageCount as number);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currPage, setIsLoading, setMessages, setMessageCount]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
  }, [session, fetchMessages]);

  const handlePageChange = (page: number) => {
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
              fetchMessages(true);
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
      <Table>
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
          ) : messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageRow
                key={index}
                id={(currPage - 1) * 10 + index + 1}
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
      <Pagination>
        <PaginationPrevious
          onClick={() => handlePageChange(Math.max(1, currPage - 1))}
          className={
            currPage === 1
              ? "pointer-events-none hover:cursor-not-allowed"
              : "hover:cursor-pointer"
          }
        >
          Previous
        </PaginationPrevious>
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currPage}
                  onClick={() => handlePageChange(page)}
                  className="hover:cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        </PaginationContent>
        <PaginationNext
          onClick={() => handlePageChange(Math.min(totalPages, currPage + 1))}
          className={
            currPage === totalPages
              ? "pointer-events-none hover:cursor-not-allowed"
              : " hover:cursor-pointer"
          }
        >
          Next
        </PaginationNext>
      </Pagination>
    </Card>
  );
};

export default MessageTable;
