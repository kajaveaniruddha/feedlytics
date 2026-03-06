import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState, useEffect, useRef } from "react";
import tailwindStyles from "../index.css?inline";
import axios from "axios";
import { DASHBOARD_BASE_URL, lightenColor, blendColor } from "@/lib/utils";
import root from "react-shadow";

const RATING_LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent!"];

export const Widget = ({ username }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [widgetSettings, setWidgetSettings] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    axios
      .post(`${DASHBOARD_BASE_URL}/api/get-widget-settings`, { username })
      .then((response) => setWidgetSettings(response.data))
      .catch((error) =>
        console.error("Error fetching widget settings:", error)
      );
  }, [username]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      const path = event.composedPath ? event.composedPath() : [];
      const clickedOutsidePopup =
        popupRef.current && !path.includes(popupRef.current);
      const clickedOutsideButton =
        buttonRef.current && !path.includes(buttonRef.current);
      if (clickedOutsidePopup && clickedOutsideButton) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const themeStyle = widgetSettings
    ? { backgroundColor: widgetSettings.bg_color, color: widgetSettings.text_color }
    : {};
  const themeInputStyle = widgetSettings
    ? { backgroundColor: lightenColor(widgetSettings.bg_color, 60) }
    : {};
  const accentColor = widgetSettings
    ? lightenColor(widgetSettings.bg_color, -20)
    : "#4F46E5";
  const accentTextColor = widgetSettings?.text_color || "#FFFFFF";

  const bgColor = widgetSettings?.bg_color || "#FFFFFF";
  const textColor = widgetSettings?.text_color || "#000000";
  const secondaryColor = blendColor(textColor, bgColor, 0.4);
  const tertiaryColor = blendColor(textColor, bgColor, 0.6);

  const activeStar = hoveredStar || rating;

  const resetForm = () => {
    setSubmitted(false);
    setRating(0);
    setHoveredStar(0);
    setErrorMessage("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const form = e.target;
    const data = {
      username,
      name: form.name?.value || "",
      email: form.email?.value || "",
      content: form.feedback.value,
      stars: rating,
    };

    try {
      await axios.post(`${DASHBOARD_BASE_URL}/api/send-message`, data);
      setSubmitted(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <root.div>
      <>
        <style>{tailwindStyles}</style>

        {/* ─── Popup Card ─── */}
        {isOpen && (
          <div
            ref={popupRef}
            style={themeStyle}
            className="animate-slide-fade-in fixed bottom-20 right-3 sm:right-4 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] widget z-50 overflow-hidden"
          >
            <style>{tailwindStyles}</style>

            {/* Accent gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: widgetSettings
                  ? `linear-gradient(to right, ${accentColor}, ${lightenColor(accentColor, 30)})`
                  : "linear-gradient(to right, #4F46E5, #7C3AED)",
              }}
            />

            <div className="p-5">
              {submitted ? (
                <ThankYouScreen
                  rating={rating}
                  accentColor={accentColor}
                  accentTextColor={accentTextColor}
                  secondaryColor={secondaryColor}
                  tertiaryColor={tertiaryColor}
                  onReset={resetForm}
                />
              ) : (
                <FeedbackForm
                  rating={rating}
                  activeStar={activeStar}
                  widgetSettings={widgetSettings}
                  themeInputStyle={themeInputStyle}
                  accentColor={accentColor}
                  accentTextColor={accentTextColor}
                  secondaryColor={secondaryColor}
                  isSubmitting={isSubmitting}
                  errorMessage={errorMessage}
                  onSelectStar={(i) => setRating(i + 1)}
                  onHoverStar={(i) => setHoveredStar(i + 1)}
                  onHoverLeave={() => setHoveredStar(0)}
                  onSubmit={submit}
                />
              )}

              {/* Footer */}
              <div
                className="text-center mt-4 pt-3 border-t"
                style={{ borderColor: lightenColor(bgColor, bgColor < "#888888" ? 20 : -10) }}
              >
                <span className="text-[11px]" style={{ color: tertiaryColor }}>
                  Powered by{" "}
                  <a
                    href="https://feedlytics.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 hover:underline font-medium"
                  >
                    Feedlytics
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Floating Trigger Button ─── */}
        <button
          ref={buttonRef}
          className={`widget fixed bottom-4 right-4 z-50 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer ${
            !isOpen ? "animate-pulse-ring" : ""
          }`}
          style={{
            background: widgetSettings
              ? `linear-gradient(135deg, ${accentColor}, ${lightenColor(accentColor, 20)})`
              : "linear-gradient(135deg, #4F46E5, #7C3AED)",
            color: accentTextColor,
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <>
              <MessageCircleIcon className="h-5 w-5" />
              <span>Feedback</span>
            </>
          )}
        </button>
      </>
    </root.div>
  );
};

/* ━━━ Feedback Form ━━━ */
function FeedbackForm({
  rating,
  activeStar,
  widgetSettings,
  themeInputStyle,
  accentColor,
  accentTextColor,
  secondaryColor,
  isSubmitting,
  errorMessage,
  onSelectStar,
  onHoverStar,
  onHoverLeave,
  onSubmit,
}) {
  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg">
          How was your experience?
        </h3>
        <p className="text-sm mt-0.5" style={{ color: secondaryColor }}>
          We'd love to hear from you
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex flex-col items-center mb-5">
        <div className="flex items-center gap-1.5" onMouseLeave={onHoverLeave}>
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              type="button"
              className="transition-transform duration-150 hover:scale-125 focus:outline-none cursor-pointer"
              onClick={() => onSelectStar(index)}
              onMouseEnter={() => onHoverStar(index)}
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

      {errorMessage && (
        <div className="animate-fade-in-up mb-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form className="space-y-3" onSubmit={onSubmit}>
        {(!widgetSettings || widgetSettings.collect_info?.name) && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium" style={{ color: secondaryColor }}>
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              className="rounded-lg h-10 text-sm"
              style={themeInputStyle}
            />
          </div>
        )}
        {(!widgetSettings || widgetSettings.collect_info?.email) && (
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium" style={{ color: secondaryColor }}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="rounded-lg h-10 text-sm"
              style={themeInputStyle}
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="feedback" className="text-xs font-medium" style={{ color: secondaryColor }}>
            Feedback
          </Label>
          <Textarea
            id="feedback"
            placeholder="Share your thoughts..."
            className="rounded-lg min-h-[110px] text-sm resize-none"
            style={themeInputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${lightenColor(accentColor, 20)})`,
            color: accentTextColor,
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin-slow h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            "Submit Feedback"
          )}
        </button>
      </form>
    </div>
  );
}

/* ━━━ Thank You Screen ━━━ */
function ThankYouScreen({ rating, accentColor, accentTextColor, secondaryColor, tertiaryColor, onReset }) {
  return (
    <div className="flex flex-col items-center py-4">
      {/* Confetti dots */}
      <div className="relative mb-2">
        {[
          { top: "-8px", left: "-16px", bg: "#4F46E5", delay: "0s" },
          { top: "-12px", right: "-10px", bg: "#F59E0B", delay: "0.1s" },
          { bottom: "-4px", left: "-20px", bg: "#10B981", delay: "0.15s" },
          { bottom: "-8px", right: "-16px", bg: "#7C3AED", delay: "0.2s" },
          { top: "50%", left: "-24px", bg: "#F59E0B", delay: "0.25s" },
          { top: "50%", right: "-22px", bg: "#4F46E5", delay: "0.08s" },
        ].map((dot, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              ...dot,
              backgroundColor: dot.bg,
              animationDelay: dot.delay,
            }}
          />
        ))}

        {/* Checkmark circle */}
        <div className="animate-scale-in w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      </div>

      <h3 className="animate-fade-in-up text-xl font-bold mt-3">
        Thank you!
      </h3>
      <p
        className="animate-fade-in-up text-sm mt-1 text-center"
        style={{ color: secondaryColor, animationDelay: "0.1s" }}
      >
        Your feedback helps us improve
      </p>

      {/* Rating recap */}
      {rating > 0 && (
        <div
          className="animate-fade-in-up flex flex-col items-center mt-4"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: tertiaryColor }}>
            Your rating
          </span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className="h-5 w-5"
                filled={rating > index}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="animate-fade-in-up mt-5 rounded-lg border-2 px-6 py-2 text-sm font-semibold transition-colors duration-200 hover:opacity-80 cursor-pointer"
        style={{
          borderColor: accentColor,
          color: accentColor,
          animationDelay: "0.3s",
        }}
      >
        Submit another
      </button>
    </div>
  );
}

/* ━━━ Icons ━━━ */

function StarIcon({ filled, className, ...props }) {
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
  );
}

function MessageCircleIcon(props) {
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
  );
}

function CloseIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
