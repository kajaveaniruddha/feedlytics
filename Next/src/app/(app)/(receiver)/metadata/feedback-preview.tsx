"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Helper function to compute lighter shade of a hex color
function lightenColor(color: string, percent: number): string {
  // Assumes color in the format "#RRGGBB"
  const num = Number.parseInt(color.slice(1), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff

  const newR = Math.min(255, Math.max(0, r + Math.round(2.55 * percent)))
  const newG = Math.min(255, Math.max(0, g + Math.round(2.55 * percent)))
  const newB = Math.min(255, Math.max(0, b + Math.round(2.55 * percent)))

  return "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)
}

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
  const [rating, setRating] = useState(3)

  // Theme styles based on form values
  const themeStyle = {
    backgroundColor: formValues.bg_color,
    color: formValues.text_color,
  }

  const themeInputStyle = {
    backgroundColor: lightenColor(formValues.bg_color, 60),
  }

  const onSelectStar = (index: number): void => {
    setRating(index + 1)
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Feedback Form */}
      <div style={themeStyle} className="rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h3 className="font-bold text-base sm:text-lg mb-4">Send us your feedback</h3>

          <form className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {formValues.collect_info.name && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" style={themeInputStyle} />
                </div>
              )}

              {formValues.collect_info.email && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" style={themeInputStyle} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think"
                className="min-h-[100px]"
                style={themeInputStyle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-5 w-5 cursor-pointer ${
                      rating > index ? "fill-[#FFD700]" : "fill-muted stroke-muted-foreground"
                    }`}
                    onClick={() => onSelectStar(index)}
                  />
                ))}
              </div>

              <Button
                type="button"
                style={{
                  backgroundColor: lightenColor(formValues.bg_color, -20),
                  color: formValues.text_color,
                }}
                className=" rounded"
              >
                Submit
              </Button>
            </div>
          </form>

          <div className="text-xs mt-4 opacity-70">
            Powered by <span className="text-indigo-600 hover:underline">Feedlytics</span>
            ⚡️
          </div>
        </div>
      </div>

      {/* Feedback Widget Button - Fixed at bottom right */}
      <div className="absolute -bottom-16 right-0">
        <Button className="rounded-full shadow-lg flex items-center gap-2" style={themeStyle}>
          <MessageCircleIcon className="h-5 w-5" />
          Feedback
        </Button>
      </div>
    </div>
  )
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

function StarIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#FFD700"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function MessageCircleIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
