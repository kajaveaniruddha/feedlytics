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
import { ApiResponse } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface MessageContextType {
  messageCount: number;
  maxMessages: number;
  maxWorkflows: number;
  setMessageCount: (count: number) => void;
  setMaxMessages: (max: number) => void;
  session: any;
  userInfo: {
    name: string;
    userTier: "free" | "premium";
    avatarUrl: string;
    bgColor: string;
    textColor: string;
    collectEmail: boolean;
    collectName: boolean;
  };
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messageCount, setMessageCount] = useState<number>(0);
  const [maxWorkflows, setMaxWorkflows] = useState<number>(5);
  const [maxMessages, setMaxMessages] = useState<number>(50);
  const [userInfo, setUserInfo] = useState({
    name: "",
    userTier: "free" as "free" | "premium",
    avatarUrl: "",
    bgColor: "",
    textColor: "",
    collectEmail: false,
    collectName: false,
  });
  const { data: session } = useSession();
  const { toast } = useToast();
  const username = session?.user?.username;

  const fetchMessageData = useCallback(async () => {
    if (!username) return;
    try {
      const res = await axios.get<ApiResponse>(
        `/api/get-project-details`
      );
      setMessageCount(res.data?.messageCount as number);
      setMaxWorkflows(res.data?.maxWorkflows as number);
      setMaxMessages(res.data?.maxMessages as number);
      setUserInfo({
        name: res.data?.userDetails?.name as string,
        userTier: res.data?.userDetails?.userTier as "free" | "premium",
        avatarUrl: res.data?.userDetails?.avatar_url as string,
        bgColor: res.data?.userDetails?.bgColor as string,
        textColor: res.data?.userDetails?.textColor as string,
        collectEmail: res.data?.userDetails?.collectEmail as boolean,
        collectName: res.data?.userDetails?.collectName as boolean,
      });
      // console.log(res.data?.userDetails?.avatar_url);
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
      value={{
        session,
        userInfo,
        messageCount,
        maxMessages,
        maxWorkflows,
        setMessageCount,
        setMaxMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

