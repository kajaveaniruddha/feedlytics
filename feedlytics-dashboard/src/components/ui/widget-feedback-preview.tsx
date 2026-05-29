"use client";

import type * as React from "react";
import { useEffect, useState } from "react";

import type { WidgetThemeDto } from "@/services/workspace/workspaceWidget.service";
import {
  FONT_MAP,
  GOOGLE_FONT_URLS,
  PADDING_MAP,
  SHADOW_MAP,
} from "@/features/workspace/lib/widget-theme-maps";

const RATING_LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent!"];

export type WidgetFeedbackPreviewProps = {
  formTheme: WidgetThemeDto;
  collectName: boolean;
  collectEmail: boolean;
  previewView: "form" | "success";
  /** Narrower card when simulating mobile */
  variant?: "desktop" | "mobile";
};

export function WidgetFeedbackPreview({
  formTheme,
  collectName,
  collectEmail,
  previewView,
  variant = "desktop",
}: WidgetFeedbackPreviewProps) {
  const [rating, setRating] = useState(4);
  const [hoveredStar, setHoveredStar] = useState(0);
  const activeStar = hoveredStar || rating;
  const padding = PADDING_MAP[formTheme.cardPadding] ?? 24;
  const maxWidth = variant === "mobile" ? Math.min(formTheme.cardMaxWidth, 340) : formTheme.cardMaxWidth;

  useEffect(() => {
    const fontUrl = GOOGLE_FONT_URLS[formTheme.fontFamily];
    if (!fontUrl) return;
    const id = `widget-preview-font-${formTheme.fontFamily.replace(/\s/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);
  }, [formTheme.fontFamily]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: formTheme.formBgColor,
    color: formTheme.formTextColor,
    borderRadius: formTheme.borderRadius,
    maxWidth,
    boxShadow: SHADOW_MAP[formTheme.shadow] ?? SHADOW_MAP.subtle,
    fontFamily: FONT_MAP[formTheme.fontFamily] ?? FONT_MAP.System,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: formTheme.inputBgColor,
    borderColor: formTheme.inputBorderColor,
    color: formTheme.inputTextColor,
    borderRadius: Math.max(formTheme.borderRadius - 4, 4),
  };

  return (
    <div className="relative w-full flex justify-center" style={{ maxWidth }}>
      <div style={cardStyle} className="w-full overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(to right, ${formTheme.accentColor}, ${formTheme.accentColor}88)`,
          }}
        />
        <div style={{ padding }}>
          {previewView === "form" ? (
            <FormView
              formTheme={formTheme}
              collectName={collectName}
              collectEmail={collectEmail}
              inputStyle={inputStyle}
              activeStar={activeStar}
              onSelectStar={(i) => setRating(i + 1)}
              onHoverStar={(i) => setHoveredStar(i + 1)}
              onHoverLeave={() => setHoveredStar(0)}
            />
          ) : (
            <SuccessView formTheme={formTheme} rating={rating} />
          )}
          <div
            className="mt-4 border-t pt-3 text-center"
            style={{ borderColor: formTheme.inputBorderColor }}
          >
            <span className="text-[11px]" style={{ color: formTheme.secondaryTextColor }}>
              Powered by{" "}
              <span style={{ color: formTheme.accentColor }} className="font-medium">
                Feedlytics
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormView({
  formTheme,
  collectName,
  collectEmail,
  inputStyle,
  activeStar,
  onSelectStar,
  onHoverStar,
  onHoverLeave,
}: {
  formTheme: WidgetThemeDto;
  collectName: boolean;
  collectEmail: boolean;
  inputStyle: React.CSSProperties;
  activeStar: number;
  onSelectStar: (i: number) => void;
  onHoverStar: (i: number) => void;
  onHoverLeave: () => void;
}) {
  return (
    <div>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold" style={{ color: formTheme.formTextColor }}>
          How was your experience?
        </h3>
        <p className="mt-0.5 text-sm" style={{ color: formTheme.secondaryTextColor }}>
          We&apos;d love to hear from you
        </p>
      </div>
      <div className="mb-5 flex flex-col items-center">
        <div className="flex items-center gap-1.5" onMouseLeave={onHoverLeave}>
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              type="button"
              className="cursor-pointer transition-transform duration-150 hover:scale-125 focus:outline-none"
              onClick={() => onSelectStar(index)}
              onMouseEnter={() => onHoverStar(index)}
            >
              <StarIcon className="h-8 w-8" filled={activeStar > index} accentColor={formTheme.accentColor} />
            </button>
          ))}
        </div>
        <span
          className={`mt-1.5 h-5 text-sm font-medium transition-opacity duration-200 ${activeStar > 0 ? "opacity-100" : "opacity-0"}`}
          style={{ color: formTheme.accentColor }}
        >
          {activeStar > 0 ? RATING_LABELS[activeStar - 1] : ""}
        </span>
      </div>
      <div className="space-y-3">
        {collectName ? (
          <div className="space-y-1.5">
            <span className="text-xs font-medium" style={{ color: formTheme.secondaryTextColor }}>
              Name
            </span>
            <input
              readOnly
              placeholder="Your name"
              className="h-10 w-full border px-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        ) : null}
        {collectEmail ? (
          <div className="space-y-1.5">
            <span className="text-xs font-medium" style={{ color: formTheme.secondaryTextColor }}>
              Email
            </span>
            <input
              readOnly
              placeholder="you@example.com"
              className="h-10 w-full border px-3 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <span className="text-xs font-medium" style={{ color: formTheme.secondaryTextColor }}>
            Feedback
          </span>
          <textarea
            readOnly
            placeholder="Share your thoughts..."
            className="min-h-[100px] w-full resize-none border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <button
          type="button"
          className="w-full cursor-pointer py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
          style={{
            backgroundColor: formTheme.accentColor,
            color: formTheme.formBgColor,
            borderRadius: Math.max(formTheme.borderRadius - 4, 4),
          }}
        >
          {formTheme.buttonText}
        </button>
      </div>
    </div>
  );
}

function SuccessView({ formTheme, rating }: { formTheme: WidgetThemeDto; rating: number }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: formTheme.accentColor }}
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke={formTheme.formBgColor}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h3 className="mt-4 text-xl font-bold" style={{ color: formTheme.formTextColor }}>
        {formTheme.successMessage.replace(/\{\s*name\s*\}/g, "John")}
      </h3>
      <p className="mt-1 text-sm" style={{ color: formTheme.secondaryTextColor }}>
        Your feedback helps us improve
      </p>
      {rating > 0 ? (
        <div className="mt-4 flex flex-col items-center">
          <span
            className="mb-1 text-xs font-medium uppercase tracking-wide"
            style={{ color: formTheme.secondaryTextColor }}
          >
            Your rating
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className="h-5 w-5"
                filled={rating > index}
                accentColor={formTheme.accentColor}
              />
            ))}
          </div>
        </div>
      ) : null}
      {formTheme.successCtaText && formTheme.successCtaUrl ? (
        <button
          type="button"
          className="mt-4 rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
          style={{ backgroundColor: formTheme.accentColor, color: formTheme.formBgColor }}
        >
          {formTheme.successCtaText}
        </button>
      ) : null}
      {formTheme.successRedirectUrl ? (
        <p className="mt-3 text-xs" style={{ color: formTheme.secondaryTextColor }}>
          Redirecting in 3s...
        </p>
      ) : null}
      <button
        type="button"
        className="mt-4 rounded-lg border-2 px-6 py-2 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ borderColor: formTheme.accentColor, color: formTheme.accentColor }}
      >
        Submit another
      </button>
    </div>
  );
}

function StarIcon({
  filled,
  className,
  accentColor,
}: {
  filled: boolean;
  className?: string;
  accentColor: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? accentColor : "#E5E7EB"}
      stroke={filled ? accentColor : "#D1D5DB"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
