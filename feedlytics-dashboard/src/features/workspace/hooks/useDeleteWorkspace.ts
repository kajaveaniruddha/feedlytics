"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { queryKeys } from "@/lib/query/queryKeys";
import { workspaceService } from "@/services/workspace/workspace.service";
import { ApiError } from "@/services/api/errors/ApiError";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, ApiError, string>({
    mutationFn: (publicId: string) => workspaceService.deleteWorkspace(publicId),
    onSuccess: (_, publicId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list() });
      void queryClient.removeQueries({ queryKey: queryKeys.workspace.byId(publicId) });
      router.push(routes.workspaces);
    },
  });
}
