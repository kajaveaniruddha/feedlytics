"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";

import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
const Page: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result?.error,
          variant: "destructive",
        });
      }
      if (result?.url) {
        router.replace("/dashboard");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error signing up user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Sign in failed",
        description: axiosError.response?.data.message ?? "Error logging in.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  return (
    <section className=" h-screen flex items-center justify-center">
      <div className="w-96 mx-auto mt-16 p-8 bg-white shadow-xl rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Enter Feedlytics</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email/username"
                      {...field}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6 text-xs  ">
          Don&apos;t have an account?{' '}
          <Link href={"/sign-up"} className="text-indigo-600 hover:underline">
            Sign-up
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Page;
