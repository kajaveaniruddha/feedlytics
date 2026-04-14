"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useApiErrorToast(
  isError: boolean,
  error: Error | null,
  options?: {
    title?: string;
    description?: string;
  }
) {
  const { toast } = useToast();

  useEffect(() => {
    if (isError && error) {
      toast({
        title: options?.title || "Error",
        description:
          error.message || options?.description || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [isError, error, options?.title, options?.description, toast]);
}
