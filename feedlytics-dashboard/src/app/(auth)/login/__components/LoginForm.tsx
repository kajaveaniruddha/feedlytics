"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { TextLink } from "@/components/ui/text-link";
import { IconButton } from "@/components/ui/icon-button";
import { routes } from "@/config/routes";
import { useSessionBootstrap } from "@/features/auth/context/session-bootstrap";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginRequest } from "@/features/auth/schemas/login.schema";
import { sanitizeInternalNextPath } from "@/lib/utils/safe-next-path";
import { useAuthStore } from "@/stores/auth.store";

import { OAuthProviders } from "./OAuthProviders";
import { loginCopy } from "../constants/login.constants";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bootstrapStatus = useSessionBootstrap();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const { mutate, isPending } = useLogin();

  React.useEffect(() => {
    if (bootstrapStatus !== "resolved" || !isAuthenticated) return;
    const rawNext = searchParams.get("next");
    const next = sanitizeInternalNextPath(rawNext) ?? routes.workspaces;
    router.replace(next);
  }, [bootstrapStatus, isAuthenticated, router, searchParams]);

  const onSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onError: (err) => {
        if (err.isValidationError() && err.fields) {
          for (const [field, message] of Object.entries(err.fields)) {
            if (field in values) {
              form.setError(field as keyof LoginRequest, { message });
            }
          }
        } else if (err.code === "INVALID_CREDENTIALS") {
          form.setError("password", { message: err.message });
        }
      },
    });
  });

  return (
    <div data-slot="login-form" className="flex flex-col gap-8">
      <Heading variant="primary" subheading={loginCopy.subheading}>
        {loginCopy.heading}
      </Heading>

      <OAuthProviders />

      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{loginCopy.emailLabel}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    placeholder={loginCopy.emailPlaceholder}
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
                <FormLabel required>{loginCopy.passwordLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={loginCopy.passwordPlaceholder}
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
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Label className="flex cursor-pointer items-center gap-2 font-normal">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
              />
              <span>{loginCopy.rememberMe}</span>
            </Label>

            <TextLink href={loginCopy.forgotPasswordHref} variant="inlineSm">
              {loginCopy.forgotPassword}
            </TextLink>
          </div>

          <Button type="submit" variant="brand" size="lg" loading={isPending}>
            {loginCopy.submit}
          </Button>
        </form>
      </Form>

      <MutedText>
        {loginCopy.noAccountPrompt}{" "}
        <TextLink href={loginCopy.signupHref}>{loginCopy.createAccountCta}</TextLink>
      </MutedText>
    </div>
  );
}
