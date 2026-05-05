"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useRegenerateEmailCode,
  useVerifyEmail,
} from "@/features/auth/hooks/useVerifyEmail";
import {
  verifyEmailSchema,
  type VerifyEmailRequest,
} from "@/features/auth/schemas/verify-email.schema";

import { verifyCopy } from "../constants/signup.constants";

export function EmailVerificationStep() {
  const searchParams = useSearchParams();
  const presetEmail = searchParams.get("email") ?? "";

  const form = useForm<VerifyEmailRequest>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: presetEmail, code: "" },
    mode: "onBlur",
  });

  const { mutate, isPending } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useRegenerateEmailCode();

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return (
    <div data-slot="verify-email" className="flex flex-col gap-8">
      <Heading variant="primary" subheading={verifyCopy.subheading}>
        {verifyCopy.heading}
      </Heading>

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{verifyCopy.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    aria-required="true"
                    readOnly={!!presetEmail}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{verifyCopy.codeLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder={verifyCopy.codePlaceholder}
                    className="text-center tracking-[0.6em]"
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="brand" size="lg" loading={isPending}>
            {verifyCopy.submit}
          </Button>
        </form>
      </Form>

      <MutedText className="flex flex-wrap items-center gap-2">
        {verifyCopy.resendPrompt}
        <Button
          type="button"
          variant="link"
          size="sm"
          loading={isResending}
          disabled={!form.getValues("email")}
          onClick={() => resend({ email: form.getValues("email") })}
          className="px-0 text-sm"
        >
          {isResending ? "Sending…" : verifyCopy.resendCta}
        </Button>
      </MutedText>
    </div>
  );
}
