"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse, ApiResponseUserDetails, userDetailsType } from "@/types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SendMessageSchema } from "@/schemas/sendMessageSchema";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/custom/star-rating";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";
import { Skeleton } from "@/components/ui/skeleton";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ClientPage = ({ username }: { username: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<userDetailsType>();
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(SendMessageSchema),
        defaultValues: {
            username: username,
            stars: 5,
            content: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof SendMessageSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/send-feedback", data);
            toast({ title: "Success", description: response.data.message });
            setSubmitted(true);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Couldn't send message",
                description: axiosError.response?.data?.message || "An error occurred",
                variant: "destructive",
            });
            console.log(axiosError.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchUserDetails = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const res = await axios.get<ApiResponseUserDetails>(`/api/get-user-form-details/${username}`);
            setUserDetails(res.data.userDetails);
            if (refresh) {
                toast({
                    title: "Refreshed page",
                    description: "Showing latest page details.",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, username]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    return (
        <>
            <AnimatePresence>
                <Card className=" text-center">
                    <CardHeader>
                        <Avatar className="w-16 h-16 max-sm:h-14 max-sm:w-14 mx-auto mb-4">
                            <AvatarImage src={userDetails?.avatar_url ?? "https://github.com/shadcn.png"} alt="@user" />
                            <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h1 className=" font-bold my-2 text-xl">
                            {!userDetails?.name ? (
                                <Skeleton className="w-1/2 mx-auto h-4" />
                            ) : (
                                userDetails?.name
                            )}
                        </h1>
                    </CardHeader>
                    <CardContent className="w-full max-w-md">
                        {submitted ? (
                            <div className="w-full h-full">
                                <Confetti width={window.innerWidth} height={window.innerHeight} />
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="rounded-lg p-4 font-bold text-2xl text-primary"
                                >
                                    Thank you for your feedback! 🎉
                                </motion.h1>
                            </div>
                        ) : (
                            <>
                                {!userDetails?.introduction ? (
                                    <Skeleton className="min-w-[25rem] h-16" />
                                ) : (
                                    <p className=" text-sm font-medium tracking-tight text-muted-foreground">
                                        {userDetails?.introduction}
                                    </p>
                                )}
                                {!userDetails?.questions ? (
                                    <Skeleton className="w-full mt-4 mx-auto h-20" />
                                ) : (
                                    userDetails.questions.length > 0 && (
                                        <>
                                            <h2 className="light:text-secondary font-bold tracking-tighter mt-4 text-left">
                                                QUESTIONS
                                            </h2>
                                            <div className="w-8 h-1 bg-primary rounded mb-1" />
                                            <ul className="text-sm text-muted-foreground list-disc w-[90%] ml-8 text-left">
                                                {userDetails.questions.map((question, index) => (
                                                    <li key={index} className="text-sm">{question}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )
                                )}
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6 mt-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="stars"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <StarRating value={field.value} onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={
                                                                form.watch("stars") <= 2
                                                                    ? "What would you like us to improve?"
                                                                    : "What did you like about us?"
                                                            }
                                                            {...field}
                                                            autoFocus
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || isLoading}
                                            className="w-full bg-gradient-to-b from-primary to-primary/80"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                                </>
                                            ) : (
                                                "Send"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </>
                        )}
                    </CardContent>
                </Card>
            </AnimatePresence >
        </>
    );
};

export default ClientPage;
