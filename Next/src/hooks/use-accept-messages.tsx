import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAcceptMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: acceptMessages = false,
    isLoading,
    isError,
    error,
  } = useQuery<boolean>({
    queryKey: ["accept-messages-status"],
    queryFn: async () => {
      const res = await axios.get(`/api/accept-messages`);
      return res.data?.isAcceptingMessages as boolean;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      toast({ title: "Error", description: (error as Error)?.message || "Failed to fetch status." });
    }
  }, [isError, error, toast]);

  const mutation = useMutation({
    mutationFn: async (newValue: boolean) => {
      const res = await axios.put(`/api/accept-messages`, { acceptMessages: newValue });
      return res.data;
    },
    onSuccess: (data, newValue) => {
      queryClient.invalidateQueries({ queryKey: ["accept-messages-status"] });
      toast({ title: data.message });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status." });
    },
  });

  const handleSwitchChange = useCallback(() => {
    mutation.mutate(!acceptMessages);
  }, [acceptMessages, mutation]);

  return { acceptMessages, isLoading, handleSwitchChange };
};
