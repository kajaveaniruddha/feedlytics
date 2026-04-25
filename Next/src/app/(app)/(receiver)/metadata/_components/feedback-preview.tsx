"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { FormTheme } from "@/lib/theme-utils";
import { SHADOW_MAP, PADDING_MAP, FONT_MAP, GOOGLE_FONT_URLS } from "@/lib/theme-utils";

const RATING_LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent!"];

interface FeedbackPreviewProps {
  formTheme: FormTheme;
  collectInfo: { name: boolean; email: boolean };
  previewView: "form" | "success";
}

export default function FeedbackPreview({ formTheme, collectInfo, previewView }: FeedbackPreviewProps) {
  const [rating, setRating] = useState(4);
  const [hoveredStar, setHoveredStar] = useState(0);

  const activeStar = hoveredStar || rating;
  const padding = PADDING_MAP[formTheme.cardPadding] || 24;

  useEffect(() => {
    const fontUrl = GOOGLE_FONT_URLS[formTheme.fontFamily];
    if (!fontUrl) return;
    const id = `preview-font-${formTheme.fontFamily.replace(/\s/g, "-")}`;
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
    maxWidth: formTheme.cardMaxWidth,
    boxShadow: SHADOW_MAP[formTheme.shadow],
    fontFamily: FONT_MAP[formTheme.fontFamily] || FONT_MAP.System,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: formTheme.inputBgColor,
    borderColor: formTheme.inputBorderColor,
    color: formTheme.inputTextColor,
    borderRadius: Math.max(formTheme.borderRadius - 4, 4),
  };

  return (
    <div className="relative w-full" style={{ maxWidth: formTheme.cardMaxWidth }}>
      <div style={cardStyle} className="overflow-hidden w-full">
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${formTheme.accentColor}, ${formTheme.accentColor}88)` }} />
        <div style={{ padding }}>
          {previewView === "form" ? (
            <FormView
              formTheme={formTheme}
              collectInfo={collectInfo}
              inputStyle={inputStyle}
              activeStar={activeStar}
              rating={rating}
              onSelectStar={(i) => setRating(i + 1)}
              onHoverStar={(i) => setHoveredStar(i + 1)}
              onHoverLeave={() => setHoveredStar(0)}
            />
          ) : (
            <SuccessView formTheme={formTheme} rating={rating} />
          )}
          <div className="text-center mt-4 pt-3 border-t" style={{ borderColor: formTheme.inputBorderColor }}>
            <span className="text-[11px]" style={{ color: formTheme.secondaryTextColor }}>
              Powered by{" "}
              <span style={{ color: formTheme.accentColor }} className="font-medium">Feedlytics</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormView({
  formTheme,
  collectInfo,
  inputStyle,
  activeStar,
  rating,
  onSelectStar,
  onHoverStar,
  onHoverLeave,
}: {
  formTheme: FormTheme;
  collectInfo: { name: boolean; email: boolean };
  inputStyle: React.CSSProperties;
  activeStar: number;
  rating: number;
  onSelectStar: (i: number) => void;
  onHoverStar: (i: number) => void;
  onHoverLeave: () => void;
}) {
  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg" style={{ color: formTheme.formTextColor }}>
          How was your experience?
        </h3>
        <p className="text-sm mt-0.5" style={{ color: formTheme.secondaryTextColor }}>
          We&apos;d love to hear from you
        </p>
      </div>
      <div className="flex flex-col items-center mb-5">
        <div className="flex items-center gap-1.5" onMouseLeave={onHoverLeave}>
          {[...Array(5)].map((_, index) => (
            <button key={index} type="button" className="transition-transform duration-150 hover:scale-125 focus:outline-none cursor-pointer"
              onClick={() => onSelectStar(index)} onMouseEnter={() => onHoverStar(index)}
            >
              <StarIcon className="h-8 w-8" filled={activeStar > index} accentColor={formTheme.accentColor} />
            </button>
          ))}
        </div>
        <span className={`text-sm font-medium mt-1.5 h-5 transition-opacity duration-200 ${activeStar > 0 ? "opacity-100" : "opacity-0"}`}
          style={{ color: formTheme.accentColor }}
        >
          {activeStar > 0 ? RATING_LABELS[activeStar - 1] : ""}
        </span>
      </div>
      <div className="space-y-3">
        {collectInfo.name && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: formTheme.secondaryTextColor }}>Name</label>
            <input placeholder="Your name" readOnly className="w-full h-10 px-3 text-sm border outline-none" style={inputStyle} />
          </div>
        )}
        {collectInfo.email && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: formTheme.secondaryTextColor }}>Email</label>
            <input placeholder="you@example.com" readOnly className="w-full h-10 px-3 text-sm border outline-none" style={inputStyle} />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: formTheme.secondaryTextColor }}>Feedback</label>
          <textarea placeholder="Share your thoughts..." readOnly className="w-full min-h-[100px] px-3 py-2 text-sm border outline-none resize-none" style={inputStyle} />
        </div>
        <button type="button" className="w-full py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 cursor-pointer"
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

function SuccessView({ formTheme, rating }: { formTheme: FormTheme; rating: number }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: formTheme.accentColor }}>
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke={formTheme.formBgColor}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mt-4" style={{ color: formTheme.formTextColor }}>
        {formTheme.successMessage.replace(/\{\s*name\s*\}/g, "John")}
      </h3>
      <p className="text-sm mt-1" style={{ color: formTheme.secondaryTextColor }}>
        Your feedback helps us improve
      </p>
      {rating > 0 && (
        <div className="flex flex-col items-center mt-4">
          <span className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: formTheme.secondaryTextColor }}>
            Your rating
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} className="h-5 w-5" filled={rating > index} accentColor={formTheme.accentColor} />
            ))}
          </div>
        </div>
      )}
      {formTheme.successCtaText && formTheme.successCtaUrl && (
        <button type="button" className="mt-4 px-6 py-2 text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: formTheme.accentColor, color: formTheme.formBgColor }}
        >
          {formTheme.successCtaText}
        </button>
      )}
      {formTheme.successRedirectUrl && (
        <p className="text-xs mt-3" style={{ color: formTheme.secondaryTextColor }}>
          Redirecting in 3s...
        </p>
      )}
      <button type="button" className="mt-4 border-2 px-6 py-2 text-sm font-semibold rounded-lg transition-colors hover:opacity-80"
        style={{ borderColor: formTheme.accentColor, color: formTheme.accentColor }}
      >
        Submit another
      </button>
    </div>
  );
}

function StarIcon({ filled, className, accentColor }: { filled: boolean; className?: string; accentColor: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill={filled ? accentColor : "#E5E7EB"} stroke={filled ? accentColor : "#D1D5DB"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
