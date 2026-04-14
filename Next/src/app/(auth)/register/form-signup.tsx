"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { api } from "@/lib/api";
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
import { AtSign, Loader2, Lock, Mail, User } from "lucide-react";
import { useCheckUsername } from "@/hooks/use-check-username";


const FormSignup = () => {
    const { isCheckingUsername, usernameMessage, debouncedSetUsername } = useCheckUsername();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await api.register(data);
            toast({ title: "Success", description: response.data.message });
            if (response.status === 201) {
                router.replace(`/verify/${data.username}`);
            } else if (response.status === 403) {
                router.replace(`/login`);
            }
        } catch (error) {
            console.error("Error signing up user", error);
            toast({
                title: "Sign up failed",
                description: (error as Error).message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Form {...form}>
            <form
                action=""
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <span className='flex gap-2'>
                                <User className="w-4 h-4 " />
                                <FormLabel >Name</FormLabel>
                            </span>
                            <FormControl>
                                <Input
                                    placeholder="Enter your name"
                                    {...field}
                                    className="placeholder:text-[hsl(var(--form-placeholder))]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <span className='flex gap-2'>
                                <Mail className="w-4 h-4 " />
                                <FormLabel >Email</FormLabel>
                            </span>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    {...field}
                                    className="placeholder:text-[hsl(var(--form-placeholder))]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <span className='flex gap-2'>
                                <AtSign className="w-4 h-4 " />
                                <FormLabel >Username</FormLabel>
                            </span>
                            <FormControl>
                                <Input
                                    placeholder="Enter your username"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedSetUsername(e.target.value);
                                    }}
                                    className="placeholder:text-[hsl(var(--form-placeholder))]"
                                />
                            </FormControl>
                            {isCheckingUsername && (
                                <Loader2 className="animate-spin mt-2 text-[hsl(var(--brand-green))]" />
                            )}
                            <p className={`text-sm mt-2 ${usernameMessage === "Username is unique"
                                ? "text-[hsl(var(--brand-green))]"
                                : "text-[hsl(var(--form-label))]"
                                }`}
                            >
                                {usernameMessage}</p>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <span className='flex gap-2'>
                                <Lock className="w-4 h-4 " />
                                <FormLabel >Password</FormLabel>
                            </span>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <span className="flex gap-2">
                                <Lock className="w-4 h-4 " />
                                <FormLabel>Confirm Password</FormLabel>
                            </span>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className='w-full'
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                            wait
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </form>
            <div className="text-center mt-6 text-sm ">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-[hsl(var(--brand-green))] hover:underline"
                >
                    Login
                </Link>
            </div>

        </Form>

    )
}

export default FormSignup