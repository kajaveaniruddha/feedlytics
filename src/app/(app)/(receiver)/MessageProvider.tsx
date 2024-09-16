"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

interface MessageContextType {
  messageCount: number;
  maxMessages: number;
  setMessageCount: (count: number) => void;
  setMaxMessages: (max: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messageCount, setMessageCount] = useState<number>(0);
  const [maxMessages, setMaxMessages] = useState<number>(50);
  const { data: session } = useSession();
  const { toast } = useToast();
  const username = session?.user?.username;

  const fetchMessageData = useCallback(async () => {
    if (!username) return;

    try {
      const res = await axios.get<ApiResponse>(
        `/api/analytics/get-project-details/${username}`
      );
      setMessageCount(res.data?.messageCount as number);
      setMaxMessages(res.data?.maxMessages as number);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to load message data",
      });
    }
  }, [username, toast]);

  useEffect(() => {
    fetchMessageData();
  }, [fetchMessageData]);

  return (
    <MessageContext.Provider
      value={{ messageCount, maxMessages, setMessageCount, setMaxMessages }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
