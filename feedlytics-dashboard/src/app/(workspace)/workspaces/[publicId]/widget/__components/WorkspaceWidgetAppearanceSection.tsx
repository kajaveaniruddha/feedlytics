"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ColorField } from "@/components/ui/color-field";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { WidgetFeedbackPreview } from "@/components/ui/widget-feedback-preview";
import { useWorkspaceWidgetManagement } from "@/features/workspace/hooks/useWorkspaceWidgetManagement";
import { mapFormThemeToWidgetThemeDto, mapWorkspaceWidgetDtoToFormValues } from "@/features/workspace/lib/map-workspace-widget-form";
import { FONT_OPTIONS } from "@/features/workspace/lib/widget-theme-maps";
import {
  workspaceWidgetFormSchema,
  type WorkspaceWidgetFormValues,
} from "@/features/workspace/schemas/workspace-widget.schema";
import { workspaceWidgetFixture } from "@/mocks/fixtures/workspace-widget.fixture";
import { ApiError } from "@/services/api/errors/ApiError";

export type WorkspaceWidgetAppearanceSectionProps = {
  workspacePublicId: string;
};

type EditorTab = "theme" | "success" | "fields";

export function WorkspaceWidgetAppearanceSection({ workspacePublicId }: WorkspaceWidgetAppearanceSectionProps) {
  const { data, isPending, isError, error, refetch, patchWidget } = useWorkspaceWidgetManagement(workspacePublicId);
  const [editorTab, setEditorTab] = useState<EditorTab>("theme");
  const [previewView, setPreviewView] = useState<"form" | "success">("form");

  const form = useForm<WorkspaceWidgetFormValues>({
    resolver: zodResolver(workspaceWidgetFormSchema),
    defaultValues: mapWorkspaceWidgetDtoToFormValues(workspaceWidgetFixture),
    mode: "onChange",
  });
  const { reset, control } = form;

  useEffect(() => {
    if (data) {
      reset(mapWorkspaceWidgetDtoToFormValues(data));
    }
  }, [data, reset]);

  const theme =
    useWatch({ control, name: "theme" }) ?? mapWorkspaceWidgetDtoToFormValues(workspaceWidgetFixture).theme;
  const collectName = useWatch({ control, name: "collectName" }) ?? false;
  const collectEmail = useWatch({ control, name: "collectEmail" }) ?? true;

  const forbidden = isError && error instanceof ApiError && error.status === 403;

  if (forbidden) {
    return (
      <section aria-label="Widget appearance" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">
          Only workspace owners and admins can customize the widget appearance.
        </p>
      </section>
    );
  }

  if (isPending && !data) {
    return (
      <section aria-label="Widget appearance" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">Loading widget appearance…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Widget appearance" className="flex w-full flex-col gap-3">
        <p className="text-sm text-navy-700 dark:text-white/80">{error.message}</p>
        <Button type="button" variant="brand" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </section>
    );
  }

  async function onSubmit(values: WorkspaceWidgetFormValues) {
    try {
      await patchWidget.mutateAsync({
        collectName: values.collectName,
        collectEmail: values.collectEmail,
        isActive: values.isActive,
        theme: mapFormThemeToWidgetThemeDto(values.theme),
      });
      toast.success("Widget appearance saved");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not save widget";
      toast.error(msg);
    }
  }

  const busy = patchWidget.isPending;

  return (
    <section id="customize-appearance" aria-label="Widget appearance" className="flex w-full flex-col gap-6">
      <header className="space-y-2">
        <h2 className="text-lg font-bold text-navy-900 dark:text-white">Customize Appearance</h2>
        <p className="text-sm leading-relaxed text-navy-700 dark:text-white/85">
          Match the embedded widget to your brand. Changes apply to new loads of the widget on your site.
        </p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Form &amp; success screen</CardTitle>
            <CardDescription>Edit colors, typography, and success messaging.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Editor sections">
                  {(
                    [
                      ["theme", "Theme"],
                      ["success", "Success"],
                      ["fields", "Fields"],
                    ] as const
                  ).map(([id, label]) => (
                    <Button
                      key={id}
                      type="button"
                      variant={editorTab === id ? "brand" : "outline"}
                      size="sm"
                      onClick={() => setEditorTab(id)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {editorTab === "theme" ? (
                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <ColorField
                      id="w-formBg"
                      label="Form background"
                      value={theme.formBgColor}
                      onChange={(v) => form.setValue("theme.formBgColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <ColorField
                      id="w-formText"
                      label="Form text"
                      value={theme.formTextColor}
                      onChange={(v) => form.setValue("theme.formTextColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <ColorField
                      id="w-accent"
                      label="Accent"
                      value={theme.accentColor}
                      onChange={(v) => form.setValue("theme.accentColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <ColorField
                      id="w-inputBg"
                      label="Input background"
                      value={theme.inputBgColor}
                      onChange={(v) => form.setValue("theme.inputBgColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <ColorField
                      id="w-inputBorder"
                      label="Input border"
                      value={theme.inputBorderColor}
                      onChange={(v) => form.setValue("theme.inputBorderColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <ColorField
                      id="w-inputText"
                      label="Input text"
                      value={theme.inputTextColor}
                      onChange={(v) => form.setValue("theme.inputTextColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <ColorField
                      id="w-secondary"
                      label="Secondary text"
                      value={theme.secondaryTextColor}
                      onChange={(v) => form.setValue("theme.secondaryTextColor", v, { shouldDirty: true })}
                      disabled={busy}
                    />
                    <NativeSelect
                      id="w-font"
                      label="Font family"
                      value={theme.fontFamily}
                      onChange={(v) =>
                        form.setValue("theme.fontFamily", v as WorkspaceWidgetFormValues["theme"]["fontFamily"], {
                          shouldDirty: true,
                        })
                      }
                      disabled={busy}
                      options={FONT_OPTIONS.map((f) => ({ value: f, label: f }))}
                    />
                    <FormField
                      control={control}
                      name="theme.borderRadius"
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Border radius ({field.value}px)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              max={48}
                              disabled={busy}
                              variant="main"
                              size="md"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <NativeSelect
                      id="w-shadow"
                      label="Shadow"
                      value={theme.shadow}
                      onChange={(v) =>
                        form.setValue("theme.shadow", v as WorkspaceWidgetFormValues["theme"]["shadow"], {
                          shouldDirty: true,
                        })
                      }
                      disabled={busy}
                      options={[
                        { value: "none", label: "None" },
                        { value: "subtle", label: "Subtle" },
                        { value: "medium", label: "Medium" },
                        { value: "strong", label: "Strong" },
                      ]}
                    />
                    <FormField
                      control={control}
                      name="theme.cardMaxWidth"
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Card max width (px)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={280}
                              max={720}
                              disabled={busy}
                              variant="main"
                              size="md"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <NativeSelect
                      id="w-padding"
                      label="Card padding"
                      value={theme.cardPadding}
                      onChange={(v) =>
                        form.setValue("theme.cardPadding", v as WorkspaceWidgetFormValues["theme"]["cardPadding"], {
                          shouldDirty: true,
                        })
                      }
                      disabled={busy}
                      options={[
                        { value: "compact", label: "Compact" },
                        { value: "default", label: "Default" },
                        { value: "spacious", label: "Spacious" },
                      ]}
                    />
                  </div>
                ) : null}

                {editorTab === "success" ? (
                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name="theme.successMessage"
                      render={({ field }) => (
                        <FormItem className="min-w-0 sm:col-span-2">
                          <FormLabel>Success message</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={busy} variant="main" size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="theme.showConfetti"
                      render={({ field }) => (
                        <FormItem className="flex min-w-0 flex-col gap-2 space-y-0">
                          <FormLabel className="font-medium">Show confetti on success</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) => field.onChange(v === true)}
                              disabled={busy}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="theme.buttonText"
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Submit button text</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={busy} variant="main" size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="theme.successRedirectUrl"
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Success redirect URL (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} disabled={busy} variant="main" size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="theme.successCtaText"
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel>Success CTA label (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} disabled={busy} variant="main" size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="theme.successCtaUrl"
                      render={({ field }) => (
                        <FormItem className="min-w-0 sm:col-span-2">
                          <FormLabel>Success CTA URL (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} disabled={busy} variant="main" size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : null}

                {editorTab === "fields" ? (
                  <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name="collectName"
                      render={({ field }) => (
                        <FormItem className="flex min-w-0 flex-col gap-2 space-y-0">
                          <FormLabel className="font-medium">Collect name</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) => field.onChange(v === true)}
                              disabled={busy}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="collectEmail"
                      render={({ field }) => (
                        <FormItem className="flex min-w-0 flex-col gap-2 space-y-0">
                          <FormLabel className="font-medium">Collect email</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) => field.onChange(v === true)}
                              disabled={busy}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex min-w-0 flex-col gap-2 space-y-0">
                          <FormLabel className="font-medium">Widget active</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(v) => field.onChange(v === true)}
                              disabled={busy}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" variant="brand" size="sm" disabled={busy || !form.formState.isDirty}>
                    Save changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busy || !data}
                    onClick={() => data && form.reset(mapWorkspaceWidgetDtoToFormValues(data))}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

       <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Preview the widget in different views.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 items-center ">
            <div className="flex flex-wrap gap-2 mr-auto" role="tablist" aria-label="Widget preview view">
              {(
                [
                  ["form", "Form"],
                  ["success", "Success"],
                ] as const
              ).map(([id, label]) => (
                <Button
                  key={id}
                  type="button"
                  variant={previewView === id ? "brand" : "outline"}
                  size="sm"
                  disabled={busy}
                  onClick={() => setPreviewView(id)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <WidgetFeedbackPreview
              formTheme={mapFormThemeToWidgetThemeDto(theme)}
              collectName={collectName}
              collectEmail={collectEmail}
              previewView={previewView}
              variant="mobile"
            />
            </div>
          </CardContent>
        </Card>
        </div>
    </section>
  );
}
