import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useApiErrorToast(
  isError: boolean,
  error: Error | null,
  title = "Error"
) {
  const { toast } = useToast();

  useEffect(() => {
    if (isError && error) {
      toast({
        title,
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }, [isError, error, title, toast]);
}
