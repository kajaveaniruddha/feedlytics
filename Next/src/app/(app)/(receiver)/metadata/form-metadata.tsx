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
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateFeedbackForm } from "@/schemas/updatefeedbackform";
import { ApiResponse, ApiResponseUserDetails, userDetailsType } from "@/types";
import { useSession } from "next-auth/react";

const MetadataPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<userDetailsType>();
  const { data: session } = useSession();
  const username = session?.user.username;

  const form = useForm({
    resolver: zodResolver(updateFeedbackForm),
    defaultValues: {
      introduction: "",
      questions: ["", ""],
    },
    mode: "onChange", // Update form state on change
  });

  const {
    setValue,
    watch,
    formState: { isDirty },
  } = form;

  const currentIntroduction = watch("introduction");
  const currentQuestions = watch("questions");

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponseUserDetails>("/api/get-user-details");
      const fetchedDetails = res.data.userDetails;

      setUserDetails(fetchedDetails);

      // Set the form values with the fetched data
      setValue("introduction", fetchedDetails?.introduction || "");
      setValue("questions.0", fetchedDetails?.questions?.[0] || "");
      setValue("questions.1", fetchedDetails?.questions?.[1] || "");
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
  }, [fetchUserDetails, username]);

  const isSameAsInitialValues = () => {
    return (
      userDetails?.introduction === currentIntroduction &&
      userDetails?.questions?.[0] === currentQuestions?.[0] &&
      userDetails?.questions?.[1] === currentQuestions?.[1]
    );
  };

  const onSubmit = async (data: { introduction: string | undefined; questions: string[] | undefined }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/update-feedback-form", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
