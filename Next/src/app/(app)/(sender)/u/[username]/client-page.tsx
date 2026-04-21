"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { userDetailsType } from "@/types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { SendMessageSchema } from "@/schemas/sendMessageSchema";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "@/components/custom/star-rating";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useApiErrorToast } from "@/hooks/use-api-error-toast";
import { SubmitButton } from "@/components/custom/submit-button";

const ClientPage = ({ username }: { username: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { toast } = useToast();

    const { data: userDetails, isLoading, isError, error } = useQuery<userDetailsType>({
        queryKey: ["user-form-details", username],
        queryFn: async () => {
            const res = await api.getUserFormDetails(username);
            return res.data.userDetails;
        },
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    useApiErrorToast(isError, error as Error | null, "Error");

    const form = useForm({
        resolver: zodResolver(SendMessageSchema),
        defaultValues: {
            username: username,
            name: "",
            email: "",
            stars: 5,
            content: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof SendMessageSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await api.sendMessage(data);
            toast({ title: "Success", description: response.data.message });
            setSubmitted(true);
        } catch (error) {
            toast({
                title: "Couldn't send message",
                description: (error as Error).message || "An error occurred",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        {userDetails?.collectName && (
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        {userDetails?.collectEmail && (
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Email"
                                                                {...field}
                                                                type="email"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
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
                                        <SubmitButton
                                            isLoading={isSubmitting}
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-b from-primary to-primary/80"
                                        >
                                            Send
                                        </SubmitButton>
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
