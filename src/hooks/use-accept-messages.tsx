import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export const useAcceptMessages = () => {
  const { toast } = useToast();
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/accept-messages`);
      setAcceptMessages(res.data?.isAcceptingMessages);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch status" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSwitchChange = useCallback(async () => {
    try {
      const res = await axios.post(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setAcceptMessages(!acceptMessages);
      toast({ title: res.data.message });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status" });
    }
  }, [acceptMessages, toast]);

  useEffect(() => {
    fetchAcceptMessages();
  }, [fetchAcceptMessages]);

  return { acceptMessages, isLoading, handleSwitchChange };
};
