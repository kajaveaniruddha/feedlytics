"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { TextLink } from "@/components/ui/text-link";
import { routes } from "@/config/routes";
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter";
import { useSessionBootstrap } from "@/features/auth/context/session-bootstrap";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useAuthStore } from "@/stores/auth.store";
import {
  signupSchema,
  type SignupRequest,
} from "@/features/auth/schemas/signup.schema";

import { OAuthProviders } from "./OAuthProviders";
import { signupCopy } from "../constants/signup.constants";

export function SignupForm() {
  const router = useRouter();
  const bootstrapStatus = useSessionBootstrap();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  const form = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (bootstrapStatus !== "resolved" || !isAuthenticated) return;
    router.replace(routes.workspaces);
  }, [bootstrapStatus, isAuthenticated, router]);

  // useWatch (vs form.watch) is React-Compiler-safe: it subscribes via the
  // RHF context rather than returning a non-memoizable getter.
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  const { mutate, isPending } = useRegister();

  const onSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onError: (err) => {
        if (err.isValidationError() && err.fields) {
          for (const [field, message] of Object.entries(err.fields)) {
            if (field in values) {
              form.setError(field as keyof SignupRequest, { message });
            }
          }
        } else if (err.code === "EMAIL_EXISTS") {
          form.setError("email", { message: err.message });
        }
      },
    });
  });

  return (
    <div data-slot="signup-form" className="flex flex-col gap-8">
      <Heading variant="primary" subheading={signupCopy.subheading}>
        {signupCopy.heading}
      </Heading>

      <OAuthProviders />

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{signupCopy.nameLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    placeholder={signupCopy.namePlaceholder}
                    aria-required="true"
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
                <FormLabel required>{signupCopy.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder={signupCopy.emailPlaceholder}
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{signupCopy.passwordLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={signupCopy.passwordPlaceholder}
                      aria-required="true"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </IconButton>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
                <PasswordStrengthMeter password={password} />
              </FormItem>
            )}
          />

          <p className="text-xs text-subtle dark:text-secondary-gray-600">
            {signupCopy.termsCopy}
          </p>

          <Button type="submit" variant="brand" size="lg" loading={isPending}>
            {signupCopy.submit}
          </Button>
        </form>
      </Form>

      <MutedText>
        {signupCopy.haveAccountPrompt}{" "}
        <TextLink href={signupCopy.loginHref}>{signupCopy.signInCta}</TextLink>
      </MutedText>
    </div>
  );
}
