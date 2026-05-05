"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import { useCreateWorkspace } from "@/features/workspace/hooks/useCreateWorkspace";
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from "@/features/workspace/schemas/create-workspace.schema";
import { ApiError } from "@/services/api/errors/ApiError";

export type CreateWorkspaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "", description: "" },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!open) {
      form.reset({ name: "", description: "" });
    }
  }, [open, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutate(
      {
        name: values.name.trim(),
        description: values.description.trim() ? values.description.trim() : undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err) => {
          if (err instanceof ApiError && err.isValidationError() && err.fields) {
            for (const [field, message] of Object.entries(err.fields)) {
              if (field === "name" || field === "description") {
                form.setError(field, { message });
              }
            }
          }
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
          <DialogDescription>
            Give your workspace a name. You can add a short description (optional).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate>
            <Stack gap="md">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="organization" placeholder="My product team" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter showCloseButton={false}>
                <Button type="button" variant="outline" size="md" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand" size="md" disabled={isPending}>
                  {isPending ? "Creating…" : "Create"}
                </Button>
              </DialogFooter>
            </Stack>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
