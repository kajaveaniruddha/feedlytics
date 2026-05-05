"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query/queryKeys";
import { workspaceService } from "@/services/workspace/workspace.service";
import { ApiError } from "@/services/api/errors/ApiError";

import type { CreateWorkspaceInput } from "@/services/workspace/workspace.service";
import type { WorkspaceData } from "@/features/workspace/types/workspace.types";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<WorkspaceData, ApiError, CreateWorkspaceInput>({
    mutationFn: (input) => workspaceService.createWorkspace(input),
    onSuccess: (workspace) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list() });
      toast.success("Workspace created", { description: workspace.name });
    },
    onError: (err) => {
      if (err.isValidationError()) return;
      if (err.code === "FREE_WORKSPACE_LIMIT_EXCEEDED" || err.status === 429) {
        toast.error("Free workspace limit reached", { description: err.message });
        return;
      }
      toast.error("Could not create workspace", { description: err.message });
    },
  });
}
