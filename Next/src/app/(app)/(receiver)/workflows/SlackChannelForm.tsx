"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSlackChannelSchema, UserSlackChannel } from "@/schemas/userSlackChannelSchema";
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
import type { SlackChannel } from "@/types/ApiResponse";

type SlackChannelFormProps = {
  onSuccess?: (updatedChannel?: SlackChannel) => void;
  selectedChannel?: SlackChannel | null;
};

const SlackChannelForm: React.FC<SlackChannelFormProps> = ({ onSuccess, selectedChannel }) => {
  const form = useForm<UserSlackChannel>({
    resolver: zodResolver(userSlackChannelSchema),
    defaultValues: {
      channelName: "",
      webhookUrl: "",
      notifyCategories: [],
    },
  });

  useEffect(() => {
    if (selectedChannel) {
      form.reset({
        channelName: selectedChannel.channelName,
        webhookUrl: selectedChannel.webhookUrl,
        notifyCategories: selectedChannel.notifyCategories,
      });
    } else {
      form.reset({
        channelName: "",
        webhookUrl: "",
        notifyCategories: [],
      });
    }
  }, [selectedChannel, form]);

  const onSubmit = async (values: UserSlackChannel) => {
    try {
      let res;
      if (selectedChannel) {
        // Update existing channel via PATCH route.
        res = await axios.patch("/api/user-slack-channels", { id: selectedChannel.id, ...values });
      } else {
        res = await axios.post("/api/user-slack-channels", values);
      }
      if (res.data.success) {
        form.reset();
        if (selectedChannel) {
          // Optimistically return updated channel details.
          onSuccess && onSuccess({ id: selectedChannel.id, ...values });
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
        <div className="flex flex-col flex-wrap gap-4">
          {/* Channel Name Field */}
          <div className=" flex gap-4">
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Channel Name" {...field} />
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
                <FormItem className="flex-1">
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
              <FormItem className="flex-1">
                <FormLabel>Notification Categories</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {field.value && field.value.length > 0
                          ? field.value.join(" | ")
                          : "Select categories"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0">
                      <Command>
                        <CommandInput placeholder="Filter..." />
                        <CommandList>
                          <CommandGroup>
                            {["bug", "request", "praise", "complaint", "suggestion", "question", "other"].map((option) => {
                              const isSelected = field.value?.includes(option);
                              return (
                                <CommandItem key={option} onSelect={() => {
                                  let newValues = field.value || [];
                                  if (isSelected) {
                                    newValues = newValues.filter(v => v !== option);
                                  } else {
                                    newValues = [...newValues, option];
                                  }
                                  field.onChange(newValues);
                                }}>
                                  <Check className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary-foreground",
                                    isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                  )} />
                                  {option}
                                </CommandItem>
                              );
                            })}
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        {selectedChannel && (
          <DeleteWebhookButton
            channelId={selectedChannel.id}
            onDeleteSuccess={() => {
              onSuccess && onSuccess();
            }}
            disableState={form.formState.isSubmitting}
          />
        )}
      </form>
    </Form>
  );
};

export default SlackChannelForm;
