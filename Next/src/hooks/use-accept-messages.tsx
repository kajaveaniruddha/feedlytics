import { useCallback } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiErrorToast } from "@/hooks/use-api-error-toast";

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
      const res = await api.getAcceptMessagesStatus();
      return res.data?.isAcceptingMessages as boolean;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  useApiErrorToast(isError, error as Error | null);

  const mutation = useMutation({
    mutationFn: async (newValue: boolean) => {
      const res = await api.updateAcceptMessagesStatus(newValue);
      return res.data;
    },
    onSuccess: (data) => {
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
