"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { lightenColor, blendColor } from "@/lib/color-utils"

const RATING_LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent!"]

interface FeedbackPreviewProps {
  formValues: {
    name: string
    introduction: string
    bg_color: string
    text_color: string
    collect_info: {
      name: boolean
      email: boolean
    }
  }
}

export default function FeedbackPreview({ formValues }: FeedbackPreviewProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  const themeStyle = {
    backgroundColor: formValues.bg_color,
    color: formValues.text_color,
  }

  const themeInputStyle = {
    backgroundColor: lightenColor(formValues.bg_color, 60),
  }

  const accentColor = lightenColor(formValues.bg_color, -20)
  const accentTextColor = formValues.text_color || "#FFFFFF"
  const activeStar = hoveredStar || rating

  const secondaryColor = blendColor(formValues.text_color, formValues.bg_color, 0.4)
  const tertiaryColor = blendColor(formValues.text_color, formValues.bg_color, 0.6)

  return (
    <div className="relative w-full max-w-md">
      {/* Feedback Card */}
      <div
        style={themeStyle}
        className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        {/* Accent gradient bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(to right, ${accentColor}, ${lightenColor(accentColor, 30)})`,
          }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="font-semibold text-lg" style={{ color: formValues.text_color }}>
              How was your experience?
            </h3>
            <p className="text-sm mt-0.5" style={{ color: secondaryColor }}>
              We&apos;d love to hear from you
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center mb-5">
            <div
              className="flex items-center gap-1.5"
              onMouseLeave={() => setHoveredStar(0)}
            >
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className="transition-transform duration-150 hover:scale-125 focus:outline-none cursor-pointer"
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHoveredStar(index + 1)}
                >
                  <StarIcon
                    className="h-8 w-8"
                    filled={activeStar > index}
                  />
                </button>
              ))}
            </div>
            <span
              className={`text-sm font-medium mt-1.5 h-5 transition-opacity duration-200 ${
                activeStar > 0 ? "opacity-100" : "opacity-0"
              }`}
              style={{ color: accentColor }}
            >
              {activeStar > 0 ? RATING_LABELS[activeStar - 1] : ""}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {formValues.collect_info.name && (
              <div className="space-y-1.5">
                <Label htmlFor="preview-name" className="text-xs font-medium" style={{ color: secondaryColor }}>
                  Name
                </Label>
                <Input
                  id="preview-name"
                  placeholder="Your name"
                  className="rounded-lg h-10 text-sm"
                  style={themeInputStyle}
                  readOnly
                />
              </div>
            )}
            {formValues.collect_info.email && (
              <div className="space-y-1.5">
                <Label htmlFor="preview-email" className="text-xs font-medium" style={{ color: secondaryColor }}>
                  Email
                </Label>
                <Input
                  id="preview-email"
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-lg h-10 text-sm"
                  style={themeInputStyle}
                  readOnly
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="preview-feedback" className="text-xs font-medium" style={{ color: secondaryColor }}>
                Feedback
              </Label>
              <Textarea
                id="preview-feedback"
                placeholder="Share your thoughts..."
                className="rounded-lg min-h-[110px] text-sm resize-none"
                style={themeInputStyle}
                readOnly
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="w-full rounded-lg py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:brightness-110 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${lightenColor(accentColor, 20)})`,
                color: accentTextColor,
              }}
            >
              Submit Feedback
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-3 border-t" style={{ borderColor: lightenColor(formValues.bg_color, 40) }}>
            <span className="text-[11px]" style={{ color: tertiaryColor }}>
              Powered by{" "}
              <span className="text-indigo-500 font-medium">Feedlytics</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <div className="absolute -bottom-16 right-0">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${lightenColor(accentColor, 20)})`,
            color: accentTextColor,
          }}
        >
          <MessageCircleIcon className="h-5 w-5" />
          <span>Feedback</span>
        </button>
      </div>
    </div>
  )
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  filled?: boolean
}

function StarIcon({ filled, className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#F59E0B" : "#E5E7EB"}
      stroke={filled ? "#F59E0B" : "#D1D5DB"}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
