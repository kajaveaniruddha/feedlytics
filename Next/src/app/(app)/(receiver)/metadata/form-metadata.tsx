"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
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

const MetadataPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<userDetailsType>();
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

  const [username, setUsername] = useState(form.getValues("username") || "");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const { setValue, watch, formState: { isDirty } } = form;
  const currentIntroduction = watch("introduction");
  const currentQuestions = watch("questions");
  const currentUsername = watch("username");

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponseUserDetails>("/api/get-user-details");
      const fetchedInfo = res.data.userDetails;
      setUserInfo(fetchedInfo);
      // Set the form default values with fetched data
      setValue("name", fetchedInfo?.name || "");
      setValue("username", fetchedInfo?.username || "");
      setValue("avatar_url", fetchedInfo?.avatar_url || "");
      setValue("introduction", fetchedInfo?.introduction || "");
      setValue("questions.0", fetchedInfo?.questions?.[0] || "");
      setValue("questions.1", fetchedInfo?.questions?.[1] || "");
      setValue("bg_color", fetchedInfo?.bgColor || "#ffffff");
      setValue("text_color", fetchedInfo?.textColor || "#000000");
      // Updated mapping for collect_info using collectName and collectEmail
      setValue("collect_info", {
        name: fetchedInfo?.collectName ?? false,
        email: fetchedInfo?.collectEmail ?? true,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Username uniqueness check effect
  useEffect(() => {
    const checkUsernameUnique = async () => {
      // Only check if username is non-empty and changed from original value
      if (username && username !== userInfo?.username) {
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
  }, [username, userInfo]);

  const isSameAsInitialValues = () => {
    return (
      userInfo?.introduction === currentIntroduction &&
      userInfo?.questions?.[0] === currentQuestions?.[0] &&
      userInfo?.questions?.[1] === currentQuestions?.[1] &&
      userInfo?.username === currentUsername &&
      userInfo?.name === form.getValues("name") &&
      userInfo?.avatar_url === form.getValues("avatar_url") &&
      userInfo?.bgColor === form.getValues("bg_color") &&
      userInfo?.textColor === form.getValues("text_color") &&
      userInfo?.collectName === form.getValues("collect_info.name") &&
      userInfo?.collectEmail === form.getValues("collect_info.email")
    );
  };

  const onSubmit = async (data: z.infer<typeof updateUserData>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/update-user-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast({ title: "Error", description: result.message });
        return;
      }
      toast({ title: "Success", description: result.message });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container py-8 min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          {/* Avatar URL Field */}
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
          {/* Introduction Field */}
          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Introduction</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter introduction" className="w-full" />
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
                  <Textarea {...field} placeholder="Enter first question" className="w-full" />
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
                  <Textarea {...field} placeholder="Enter second question" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* New Field: Background Color */}
          <FormField
            control={form.control}
            name="bg_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input {...field} type="color" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* New Field: Text Color */}
          <FormField
            control={form.control}
            name="text_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <Input {...field} type="color" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* New Field: Collect Name */}
          <FormField
            control={form.control}
            name="collect_info.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collect Name ? </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* New Field: Collect Email */}
          <FormField
            control={form.control}
            name="collect_info.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collect Email ? </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !isDirty || isSameAsInitialValues()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default memo(MetadataPage);
