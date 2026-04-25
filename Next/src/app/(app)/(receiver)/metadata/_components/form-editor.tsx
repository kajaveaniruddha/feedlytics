"use client";

import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  RotateCcw,
  Copy,
  Check,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserData } from "@/schemas/updateUserData";
import { userDetailsType } from "@/types";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import FeedbackPreview from "./feedback-preview";
import { api } from "@/lib/api";
import { useCheckUsername } from "@/hooks/use-check-username";
import {
  DEFAULT_FORM_THEME,
  FONT_OPTIONS,
  mergeWithDefaults,
  type FormTheme,
  type FontFamily,
} from "@/lib/theme-utils";
import { THEME_PRESETS } from "./theme-presets";

type FormValues = z.infer<typeof updateUserData> & { form_theme?: FormTheme };

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 border rounded"
          style={{ backgroundColor: value }}
        />
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 p-1 cursor-pointer"
        />
      </div>
    </div>
  );
}

const FormEditor = () => {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [previewView, setPreviewView] = useState<"form" | "success">("form");

  const form = useForm<FormValues>({
    resolver: zodResolver(updateUserData),
    defaultValues: {
      name: "",
      username: "",
      avatar_url: "",
      introduction: "",
      questions: ["", ""],
      bg_color: "#ffffff",
      text_color: "#000000",
      collect_info: { name: false, email: true },
      form_theme: DEFAULT_FORM_THEME,
    },
    mode: "onChange",
  });

  const {
    setValue,
    watch,
    formState: { isDirty },
  } = form;

  const {
    data: userDetails,
    isLoading: isUserLoading,
    isError,
    error,
  } = useQuery<userDetailsType>({
    queryKey: ["user-details-metadata"],
    queryFn: async () => {
      const res = await api.getUserDetails();
      return res.data.userDetails;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description:
          (error as Error)?.message || "Failed to fetch user details.",
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (userDetails) {
      setValue("name", userDetails?.name || "");
      setValue("username", userDetails?.username || "");
      setValue("avatar_url", userDetails?.avatar_url || "");
      setValue("introduction", userDetails?.introduction || "");
      setValue("questions.0", userDetails?.questions?.[0] || "");
      setValue("questions.1", userDetails?.questions?.[1] || "");
      setValue("bg_color", userDetails?.bgColor || "#ffffff");
      setValue("text_color", userDetails?.textColor || "#000000");
      setValue("collect_info", {
        name: userDetails?.collectName ?? false,
        email: userDetails?.collectEmail ?? true,
      });
      const baseTheme = userDetails.formTheme
        ? userDetails.formTheme
        : {
            formBgColor: userDetails?.bgColor || "#ffffff",
            formTextColor: userDetails?.textColor || "#000000",
          };
      setValue("form_theme", mergeWithDefaults(baseTheme));
    }
  }, [userDetails, setValue]);

  const { isCheckingUsername, usernameMessage, debounced } = useCheckUsername(
    userDetails?.username,
  );

  const formTheme = watch("form_theme") as FormTheme | undefined;
  const currentCollectInfo = watch("collect_info");

  const [debouncedTheme, setDebouncedTheme] =
    useState<FormTheme>(DEFAULT_FORM_THEME);
  const debouncedThemeCallback = useDebounceCallback(setDebouncedTheme, 150);

  useEffect(() => {
    if (formTheme) debouncedThemeCallback(formTheme);
  }, [formTheme, debouncedThemeCallback]);

  const applyPreset = (preset: (typeof THEME_PRESETS)[number]) => {
    setValue("form_theme", preset.theme, { shouldDirty: true });
    setValue("bg_color", preset.theme.formBgColor, { shouldDirty: true });
    setValue("text_color", preset.theme.formTextColor, { shouldDirty: true });
  };

  const setThemeField = <K extends keyof FormTheme>(
    key: K,
    value: FormTheme[K],
  ) => {
    const current = form.getValues("form_theme") || DEFAULT_FORM_THEME;
    setValue("form_theme", { ...current, [key]: value } as FormTheme, {
      shouldDirty: true,
    });
    if (key === "formBgColor")
      setValue("bg_color", value as string, { shouldDirty: true });
    if (key === "formTextColor")
      setValue("text_color", value as string, { shouldDirty: true });
  };

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await api.updateUserData(data);
      return res.data;
    },
    onSuccess: (result) => {
      toast({ title: "Success", description: result.message });
      queryClient.invalidateQueries({ queryKey: ["user-details-metadata"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong.",
      });
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  const handleReset = () => {
    if (userDetails) {
      const resetValues: FormValues = {
        name: userDetails?.name || "",
        username: userDetails?.username || "",
        avatar_url: userDetails?.avatar_url || "",
        introduction: userDetails?.introduction || "",
        questions: [
          userDetails?.questions?.[0] || "",
          userDetails?.questions?.[1] || "",
        ],
        bg_color: userDetails?.bgColor || "#ffffff",
        text_color: userDetails?.textColor || "#000000",
        collect_info: {
          name: userDetails?.collectName ?? false,
          email: userDetails?.collectEmail ?? true,
        },
        form_theme: userDetails.formTheme || mergeWithDefaults({
          formBgColor: userDetails?.bgColor || "#ffffff",
          formTextColor: userDetails?.textColor || "#000000",
        }),
      };
      form.reset(resetValues);
      toast({
        title: "Reset Complete",
        description: "All values have been reset.",
      });
    }
  };

  const handleCopyLink = () => {
    const username = form.getValues("username");
    if (username) {
      navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const theme = formTheme || DEFAULT_FORM_THEME;
  const previewTheme = debouncedTheme;

  return (
    <section className="container py-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-8">
        {/* Left: Editor */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="theme" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* ── Theme Tab ── */}
                    <TabsContent value="theme" className="space-y-5">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Presets</h3>
                        <div className="grid grid-cols-4 gap-2 pb-2">
                          {THEME_PRESETS.map((preset) => (
                            <div key={preset.name} className="flex flex-col items-center justify-center">
                              <button
                                type="button"
                                onClick={() => applyPreset(preset)}
                                className={`flex-shrink-0 w-20 h-16 rounded-lg border-2 transition-all overflow-hidden cursor-pointer ${
                                  theme.formBgColor ===
                                    preset.theme.formBgColor &&
                                  theme.accentColor === preset.theme.accentColor
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-muted hover:border-muted-foreground/30"
                                }`}
                                style={{
                                  backgroundColor: preset.theme.formBgColor,
                                }}
                              >
                                <div
                                  className="h-1.5 w-full"
                                  style={{
                                    backgroundColor: preset.theme.accentColor,
                                  }}
                                />
                                <div className="p-1.5">
                                  <div
                                    className="h-1.5 w-8 rounded-full mb-1"
                                    style={{
                                      backgroundColor:
                                        preset.theme.formTextColor,
                                      opacity: 0.6,
                                    }}
                                  />
                                  <div
                                    className="h-1 w-6 rounded-full"
                                    style={{
                                      backgroundColor:
                                        preset.theme.secondaryTextColor,
                                      opacity: 0.4,
                                    }}
                                  />
                                  <div
                                    className="h-2.5 w-full rounded mt-1"
                                    style={{
                                      backgroundColor: preset.theme.accentColor,
                                    }}
                                  />
                                </div>
                              </button>
                              <p className="flex-shrink-0 w-20 text-[10px] text-center text-muted-foreground truncate">
                                {preset.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />
                      <h3 className="text-sm font-medium">Colors</h3>
                      <div className="space-y-3">
                        <ColorPicker
                          label="Background"
                          value={theme.formBgColor}
                          onChange={(v) => setThemeField("formBgColor", v)}
                        />
                        <ColorPicker
                          label="Text"
                          value={theme.formTextColor}
                          onChange={(v) => setThemeField("formTextColor", v)}
                        />
                        <ColorPicker
                          label="Accent"
                          value={theme.accentColor}
                          onChange={(v) => setThemeField("accentColor", v)}
                        />
                        <ColorPicker
                          label="Input Background"
                          value={theme.inputBgColor}
                          onChange={(v) => setThemeField("inputBgColor", v)}
                        />
                        <ColorPicker
                          label="Input Border"
                          value={theme.inputBorderColor}
                          onChange={(v) => setThemeField("inputBorderColor", v)}
                        />
                        <ColorPicker
                          label="Input Text"
                          value={theme.inputTextColor}
                          onChange={(v) => setThemeField("inputTextColor", v)}
                        />
                        <ColorPicker
                          label="Secondary Text"
                          value={theme.secondaryTextColor}
                          onChange={(v) =>
                            setThemeField("secondaryTextColor", v)
                          }
                        />
                      </div>

                      <Separator />
                      <h3 className="text-sm font-medium">Typography</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Font Family</Label>
                          <Select
                            value={theme.fontFamily}
                            onValueChange={(v) =>
                              setThemeField("fontFamily", v as FontFamily)
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_OPTIONS.map((f) => (
                                <SelectItem key={f} value={f}>
                                  {f}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />
                      <h3 className="text-sm font-medium">Shape</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Border Radius</Label>
                            <span className="text-xs text-muted-foreground">
                              {theme.borderRadius}px
                            </span>
                          </div>
                          <Slider
                            value={[theme.borderRadius]}
                            onValueChange={([v]) =>
                              setThemeField("borderRadius", v)
                            }
                            min={0}
                            max={32}
                            step={1}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Shadow</Label>
                          <Select
                            value={theme.shadow}
                            onValueChange={(v) =>
                              setThemeField("shadow", v as FormTheme["shadow"])
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="subtle">Subtle</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="strong">Strong</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Card Width</Label>
                            <span className="text-xs text-muted-foreground">
                              {theme.cardMaxWidth}px
                            </span>
                          </div>
                          <Slider
                            value={[theme.cardMaxWidth]}
                            onValueChange={([v]) =>
                              setThemeField("cardMaxWidth", v)
                            }
                            min={380}
                            max={560}
                            step={4}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Card Padding</Label>
                          <Select
                            value={theme.cardPadding}
                            onValueChange={(v) =>
                              setThemeField(
                                "cardPadding",
                                v as FormTheme["cardPadding"],
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="spacious">Spacious</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Collect info toggles */}
                      <Separator />
                      <h3 className="text-sm font-medium">Fields</h3>
                      <FormField
                        control={form.control}
                        name="collect_info.name"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Collect Name</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Show name field in the form
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="collect_info.email"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Collect Email</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Show email field in the form
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    {/* ── Content Tab ── */}
                    <TabsContent value="content" className="space-y-4">
                      <h2 className="text-xl font-semibold">
                        Content Settings
                      </h2>
                      <Separator />
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
                            <p
                              className={`text-sm mt-2 ${usernameMessage === "Username is available" ? "text-[hsl(var(--brand-green))]" : "text-[hsl(var(--form-label))]"}`}
                            >
                              {usernameMessage}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="avatar_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avatar URL</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your avatar URL"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="introduction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Introduction</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter introduction"
                                className="min-h-24"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="questions.0"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question 1</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter first question"
                                className="min-h-20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="questions.1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question 2</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter second question"
                                className="min-h-20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Button Text</Label>
                        <Input
                          value={theme.buttonText}
                          onChange={(e) =>
                            setThemeField("buttonText", e.target.value)
                          }
                          className="w-48"
                          maxLength={30}
                        />
                      </div>
                    </TabsContent>

                    {/* ── Success Tab ── */}
                    <TabsContent value="success" className="space-y-4">
                      <h2 className="text-xl font-semibold">Success Screen</h2>
                      <Separator />
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm">Thank-you Message</Label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Use { "{ name   }" } &nbsp; to include the respondent&apos;s
                            name
                          </p>
                          <Textarea
                            value={theme.successMessage}
                            onChange={(e) =>
                              setThemeField("successMessage", e.target.value)
                            }
                            maxLength={200}
                            className="min-h-20"
                          />
                          <span className="text-xs text-muted-foreground">
                            {theme.successMessage.length}/200
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <Label>Show Confetti</Label>
                            <div className="text-sm text-muted-foreground">
                              Play confetti animation on submit
                            </div>
                          </div>
                          <Switch
                            checked={theme.showConfetti}
                            onCheckedChange={(v) =>
                              setThemeField("showConfetti", v)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm">
                            Redirect URL (optional)
                          </Label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Redirect after 3 seconds
                          </p>
                          <Input
                            value={theme.successRedirectUrl || ""}
                            onChange={(e) =>
                              setThemeField(
                                "successRedirectUrl",
                                e.target.value || null,
                              )
                            }
                            placeholder="https://yoursite.com/thank-you"
                          />
                        </div>
                        <Separator />
                        <h3 className="text-sm font-medium">
                          CTA Button (optional)
                        </h3>
                        <div>
                          <Label className="text-sm">Button Text</Label>
                          <Input
                            value={theme.successCtaText || ""}
                            onChange={(e) =>
                              setThemeField(
                                "successCtaText",
                                e.target.value || null,
                              )
                            }
                            placeholder="Visit our website"
                            maxLength={30}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Button URL</Label>
                          <Input
                            value={theme.successCtaUrl || ""}
                            onChange={(e) =>
                              setThemeField(
                                "successCtaUrl",
                                e.target.value || null,
                              )
                            }
                            placeholder="https://yoursite.com"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                      </Button>
                      <Button
                        type="submit"
                        disabled={isUserLoading || !isDirty}
                        className="flex-1"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Saving...
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Preview</h2>
                <div className="flex items-center gap-2">
                  <div className="flex border rounded-md">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`p-1.5 ${previewMode === "desktop" ? "bg-muted" : ""}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`p-1.5 ${previewMode === "mobile" ? "bg-muted" : ""}`}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Share"}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={previewView === "form" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewView("form")}
                >
                  Form
                </Button>
                <Button
                  variant={previewView === "success" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewView("success")}
                >
                  Success
                </Button>
              </div>
              <Separator className="mb-4" />
              <div
                className={`flex justify-center w-full ${previewMode === "mobile" ? "px-8" : ""}`}
              >
                <div
                  className={`relative w-full mx-auto ${
                    previewMode === "mobile"
                      ? "max-w-[375px] border-[8px] border-gray-800 rounded-[32px] p-2 bg-gray-800"
                      : ""
                  }`}
                >
                  {previewMode === "mobile" && (
                    <div className="w-20 h-1.5 bg-gray-600 rounded-full mx-auto mb-2" />
                  )}
                  <FeedbackPreview
                    formTheme={previewTheme}
                    collectInfo={currentCollectInfo}
                    previewView={previewView}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(FormEditor);
