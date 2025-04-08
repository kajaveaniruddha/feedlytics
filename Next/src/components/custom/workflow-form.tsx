"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workflowsSchema } from "@/schemas/workFlowsSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandItem, CommandList, CommandGroup, CommandInput } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import DeleteWebhookButton from "@/components/ui/delete-webhook-button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { IWorkFlows } from "@/types";
import { IconPhChatsFill } from "@/components/icons/googlechat";
import { IconDeviconPlainSlack } from "@/components/icons/slack";

type IWorkFlowsProps = {
  onSuccess?: (updatedWorkflow?: IWorkFlows) => void;
  selectedWorkflow?: IWorkFlows | null;
};

const WorkflowForm: React.FC<IWorkFlowsProps> = ({ onSuccess, selectedWorkflow }) => {
  const form = useForm<IWorkFlows>({
    resolver: zodResolver(workflowsSchema),
    defaultValues: {
      provider: "googlechat",
      groupName: "",
      webhookUrl: "",
      notifyCategories: [],
    },
  });

  useEffect(() => {
    if (selectedWorkflow) {
      form.reset({
        provider: selectedWorkflow.provider,
        groupName: selectedWorkflow.groupName,
        webhookUrl: selectedWorkflow.webhookUrl,
        notifyCategories: selectedWorkflow.notifyCategories,
      });
    } else {
      form.reset({
        provider: "googlechat",
        groupName: "",
        webhookUrl: "",
        notifyCategories: [],
      });
    }
  }, [selectedWorkflow, form]);

  const onSubmit = async (values: IWorkFlows) => {
    try {
      let res;
      if (selectedWorkflow) {
        // Update existing workflow via PATCH.
        res = await axios.patch("/api/user-workflows", { ...values, id: selectedWorkflow.id });
      } else {
        res = await axios.post("/api/user-workflows", values);
      }
      if (res.data.success) {
        form.reset();
        if (selectedWorkflow) {
          // Optimistically return updated workflow details.
          onSuccess && onSuccess({ ...values, id: selectedWorkflow.id });
        } else {
          onSuccess && onSuccess();
        }
      } else {
        console.error(res.data.error || "Error submitting form");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {/* Responsive fields container - stack on mobile, row on tablet+ */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Provider Field */}
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="googlechat">
                          <span className="flex items-center">
                            <IconPhChatsFill height="1em" width="1em" className="mr-2" />
                            Google Chat
                          </span>
                        </SelectItem>
                        <SelectItem value="slack">
                          <span className="flex items-center">
                            <IconDeviconPlainSlack height="1em" width="1em" className="mr-2" />
                            Slack
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Name Field */}
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Workflow Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Workflow Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Webhook URL Field */}
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Webhook URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notification Categories Field as multi select */}
          <FormField
            control={form.control}
            name="notifyCategories"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Notification Categories</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Input
                        readOnly
                        className="w-full justify-between"
                        value={field.value && field.value.length > 0 ? field.value.join(" | ") : "Select categories"}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-[300px] sm:max-w-[350px] p-0">
                      <Command>
                        <CommandInput placeholder="Filter..." />
                        <CommandList className="max-h-[200px] overflow-auto">
                          <CommandGroup>
                            {["bug", "request", "praise", "complaint", "suggestion", "question", "other"].map(
                              (option) => {
                                const isSelected = field.value?.includes(option)
                                return (
                                  <CommandItem
                                    key={option}
                                    onSelect={() => {
                                      let newValues = field.value || []
                                      if (isSelected) {
                                        newValues = newValues.filter((v) => v !== option)
                                      } else {
                                        newValues = [...newValues, option]
                                      }
                                      field.onChange(newValues)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary-foreground",
                                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50",
                                      )}
                                    />
                                    {option}
                                  </CommandItem>
                                )
                              },
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>

          {selectedWorkflow && (
            <DeleteWebhookButton
              channelId={selectedWorkflow.id}
              onDeleteSuccess={() => {
                onSuccess && onSuccess()
              }}
              disableState={form.formState.isSubmitting}
            />
          )}
        </div>
      </form>
    </Form>
  );
};

export default WorkflowForm;
