"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";

const Page:NextPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const onNext = () => {
    setStep(2);
  };
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const name = form.watch("name");
  const email = form.watch("email");

  const { errors } = form.formState;
  const isNextDisabled =
    false ||
    !name ||
    !email ||
    errors.name ||
    errors.email ||
    isSubmitting;

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          let message = response.data.message;
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      // console.log(data);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({ title: "Success", description: response.data.message });
      if (response.status === 201) {
        router.replace(`/verify/${username}`);
      } else if (response.status === 403) {
        router.replace(`/login`);
      }
    } catch (error) {
      console.error("Error signing up user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Sign up failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-96 mx-auto mt-16 p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
          Join FEEDLYTICS
        </h1>
        <p className="text-gray-600">Sign-up</p>
      </div>
      <div className="">
        <AnimatePresence initial={false}>
          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {step === 1 && (
                <motion.div
                  key="step1"
                  className=" flex flex-col gap-2 bg-white shadow-md p-4 rounded-lg"
                  initial={{ x: 50, opacity: 0 }}
                  exit={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name"
                            {...field}
                            className="w-full px-4 py-2"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email"
                            {...field}
                            className="w-full px-4 py-2 "
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    disabled={isNextDisabled as boolean}
                    onClick={onNext}
                    className="w-full mt-2 py-2 px-4"
                  >
                    Next
                  </Button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  className="bg-white shadow-md p-4 rounded-lg"
                  initial={{ x: 50, opacity: 0 }}
                  exit={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="username"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                            className="w-full px-4 py-2 "
                          />
                        </FormControl>
                        {isCheckingUsername && (
                          <Loader2 className="animate-spin mt-2" />
                        )}
                        <p
                          className={`text-sm mt-2 ${usernameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                            }`}
                        >
                          {usernameMessage}
                        </p>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="password"
                            {...field}
                            className="w-full px-4 py-2 "
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <span className="flex gap-4 mt-4">
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setStep(1);
                      }}
                      className="w-full py-2 px-4"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Please wait
                        </>
                      ) : (
                        "Signup"
                      )}
                    </Button>
                  </span>
                </motion.div>
              )}
            </form>
          </Form>
        </AnimatePresence>
      </div>
      <div className="text-center mt-6 text-xs">
        Already have an account?{" "}
        <Link href={"/sign-in"} className="text-indigo-600 hover:underline">
          Sign-in
        </Link>
      </div>
    </div>
  );
};
export default Page;
