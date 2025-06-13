"use client";

import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, RotateCcw } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserData } from "@/schemas/updateUserData";
import { ApiResponse, ApiResponseUserDetails, userDetailsType } from "@/types";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import FeedbackPreview from "./feedback-preview";

const MetadataPage = () => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(updateUserData),
    defaultValues: {
      name: "",
      username: "",
      avatar_url: "",
      introduction: "",
      questions: ["", ""],
      bg_color: "#ffffff",
      text_color: "#000000",
      collect_info: {
        name: false,
        email: true,
      },
    },
    mode: "onChange",
  });

  const { setValue, watch, formState: { isDirty } } = form;

  const { data: userDetails, isLoading: isUserLoading, isError, error } = useQuery<userDetailsType>({
    queryKey: ["user-details-metadata"],
    queryFn: async () => {
      const res = await axios.get<ApiResponseUserDetails>("/api/get-user-details");
      return res.data.userDetails;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      toast({ title: "Error", description: (error as Error)?.message || "Failed to fetch user details." });
    }
  }, [isError, error]);

  useEffect(() => {
    if (userDetails) {
      setValue("name", userDetails?.name || "");
      setValue("username", userDetails?.username || "");
      setValue("avatar_url", userDetails?.avatar_url || "");
      setValue("introduction", userDetails?.introduction || "");
      setValue("questions.0", userDetails?.questions?.[0] || "");
      setValue("questions.1", userDetails?.questions?.[1] || "");
      setValue("bg_color", userDetails?.bgColor || "#ffffff");
      setValue("text_color", userDetails?.textColor || "#000000");
      setValue("collect_info", {
        name: userDetails?.collectName ?? false,
        email: userDetails?.collectEmail ?? true,
      });
    }
  }, [userDetails, setValue]);

  const [username, setUsername] = useState(form.getValues("username") || "");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const currentIntroduction = watch("introduction");
  const currentQuestions = watch("questions");
  const currentUsername = watch("username");
  const currentBgColor = watch("bg_color");
  const currentTextColor = watch("text_color");
  const currentCollectInfo = watch("collect_info");

  // Username uniqueness check effect
  useEffect(() => {
    const checkUsernameUnique = async () => {
      // Only check if username is non-empty and changed from original value
      if (username && username !== userDetails?.username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        // When unchanged revert message (consider it valid)
        setUsernameMessage("Username is available");
      }
    };
    checkUsernameUnique();
  }, [username, userDetails]);

  const isSameAsInitialValues = () => {
    return (
      userDetails?.introduction === currentIntroduction &&
      userDetails?.questions?.[0] === currentQuestions?.[0] &&
      userDetails?.questions?.[1] === currentQuestions?.[1] &&
      userDetails?.username === currentUsername &&
      userDetails?.name === form.getValues("name") &&
      userDetails?.avatar_url === form.getValues("avatar_url") &&
      userDetails?.bgColor === form.getValues("bg_color") &&
      userDetails?.textColor === form.getValues("text_color") &&
      userDetails?.collectName === form.getValues("collect_info.name") &&
      userDetails?.collectEmail === form.getValues("collect_info.email")
    );
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateUserData>) => {
      const response = await fetch("/api/update-user-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      return result;
    },
    onSuccess: (result) => {
      toast({ title: "Success", description: result.message });
      queryClient.invalidateQueries({ queryKey: ["user-details-metadata"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error?.message || "Something went wrong." });
    },
  });

  const onSubmit = async (data: z.infer<typeof updateUserData>) => {
    mutation.mutate(data);
  };

  const handleReset = () => {
    console.log(userDetails)
    if (userDetails) {
      setValue("name", userDetails?.name || "");
      setValue("username", userDetails?.username || "");
      setValue("avatar_url", userDetails?.avatar_url || "");
      setValue("introduction", userDetails?.introduction || "");
      setValue("questions.0", userDetails?.questions?.[0] || "");
      setValue("questions.1", userDetails?.questions?.[1] || "");
      setValue("bg_color", userDetails?.bgColor || "#ffffff");
      setValue("text_color", userDetails?.textColor || "#000000");
      setValue("collect_info.name", userDetails?.collectName ?? false);
      setValue("collect_info.email", userDetails?.collectEmail ?? true);

      toast({
        title: "Reset Complete",
        description: "All values have been reset to their default settings."
      });

    }
  };

  // Preview values
  const previewValues = {
    name: form.getValues("name"),
    introduction: form.getValues("introduction"),
    bg_color: currentBgColor,
    text_color: currentTextColor,
    collect_info: currentCollectInfo
  };

  return (
    <section className="container py-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Form controls */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="appearance" className="space-y-4">
                      <h2 className="text-xl font-semibold">Visual Settings</h2>
                      <Separator />

                      {/* Background Color */}
                      <FormField
                        control={form.control}
                        name="bg_color"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Background Color</FormLabel>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border rounded" style={{ backgroundColor: field.value }} />
                                <FormControl>
                                  <Input {...field} type="color" className="w-10 h-10 p-1" />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Text Color */}
                      <FormField
                        control={form.control}
                        name="text_color"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Text Color</FormLabel>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border rounded" style={{ backgroundColor: field.value }} />
                                <FormControl>
                                  <Input {...field} type="color" className="w-10 h-10 p-1" />
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Avatar URL */}
                      <FormField
                        control={form.control}
                        name="avatar_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your avatar URL" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collect Name Toggle */}
                      <FormField
                        control={form.control}
                        name="collect_info.name"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Collect Name</FormLabel>
                              <div className="text-sm text-muted-foreground">Show name field in the feedback form</div>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collect Email Toggle */}
                      <FormField
                        control={form.control}
                        name="collect_info.email"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Collect Email</FormLabel>
                              <div className="text-sm text-muted-foreground">Show email field in the feedback form</div>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                      <h2 className="text-xl font-semibold">Content Settings</h2>
                      <Separator />

                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Username Field with uniqueness check */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your username"
                                onChange={(e) => {
                                  field.onChange(e);
                                  debounced(e.target.value);
                                }}
                              />
                            </FormControl>
                            {isCheckingUsername && (
                              <Loader2 className="animate-spin mt-2 text-[hsl(var(--brand-green))]" />
                            )}
                            <p className={`text-sm mt-2 ${usernameMessage === "Username is available"
                              ? "text-[hsl(var(--brand-green))]"
                              : "text-[hsl(var(--form-label))]"
                              }`}>
                              {usernameMessage}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Introduction Field */}
                      <FormField
                        control={form.control}
                        name="introduction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Introduction</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Enter introduction" className="min-h-24" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Question 1 Field */}
                      <FormField
                        control={form.control}
                        name="questions.0"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question 1</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Enter first question" className="min-h-20" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Question 2 Field */}
                      <FormField
                        control={form.control}
                        name="questions.1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question 2</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Enter second question" className="min-h-20" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUserLoading || !isDirty || isSameAsInitialValues()}
                        className="flex-1"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Preview */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This is how your feedback widget will appear to your users.
            </p>
            <Separator className="mb-6" />
            <div className="flex justify-center">
              <div className="relative pb-16">
                <FeedbackPreview formValues={previewValues} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default memo(MetadataPage);
