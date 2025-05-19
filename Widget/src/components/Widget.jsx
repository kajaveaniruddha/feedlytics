import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState, useEffect, useRef } from "react";
import tailwindStyles from "../index.css?inline";
import axios from "axios";
import { DASHBOARD_BASE_URL } from "@/lib/utils";
import root from "react-shadow";

// Add helper to compute lighter shade of a hex color
function lightenColor(color, percent) {
  // Assumes color in the format "#RRGGBB"
  let num = parseInt(color.slice(1), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.min(255, Math.max(0, r + Math.round(2.55 * percent)));
  g = Math.min(255, Math.max(0, g + Math.round(2.55 * percent)));
  b = Math.min(255, Math.max(0, b + Math.round(2.55 * percent)));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const Widget = ({ username }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [widgetSettings, setWidgetSettings] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    axios
      .post(`${DASHBOARD_BASE_URL}/api/get-widget-settings`, { username })
      .then((response) => {
        setWidgetSettings(response.data);
      })
      .catch((error) =>
        console.error("Error fetching widget settings:", error)
      );
  }, [username]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      const path = event.composedPath ? event.composedPath() : [];
      if (
        popupRef.current &&
        path.length > 0 &&
        !path.includes(popupRef.current)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Optimised theme styles
  const themeStyle = widgetSettings
    ? {
        backgroundColor: widgetSettings.bg_color,
        color: widgetSettings.text_color,
      }
    : {};
  const themeInputStyle = widgetSettings
    ? { backgroundColor: lightenColor(widgetSettings.bg_color, 60) }
    : {};

  const onSelectStar = (index) => {
    setRating(index + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const form = e.target;
    const data = {
      username: username,
      name: form.name?.value || "",
      email: form.email?.value || "",
      content: form.feedback.value,
      stars: rating,
    };

    const apiUrl = `${DASHBOARD_BASE_URL}/api/send-message`;
    // console.log("Sending feedback:", data);

    try {
      const response = await axios.post(apiUrl, data);
      // console.log(response.data);
      setSuccessMessage(response.data.message || "Feedback sent successfully!");
      setSubmitted(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
      console.error("Error sending feedback:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <root.div>
      <>
        <style>{tailwindStyles}</style>
        <style>{`
          @keyframes slideFadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-fade-in {
            animation: slideFadeIn 0.5s ease-out;
          }
        `}</style>

        {isOpen && (
          <div
            ref={popupRef}
            style={themeStyle}
            className="fixed bottom-20 right-2 sm:right-4 rounded-lg bg-card p-4 shadow-lg w-full max-w-md sm:max-w-[90%] md:max-w-[80%] lg:max-w-md widget z-50"
          >
            <style>{tailwindStyles}</style>
            {submitted ? (
              <div
                style={themeStyle}
                className="animate-slide-fade-in flex flex-col items-center"
              >
                <h3 className="text-lg font-bold">
                  Thank you for your feedback 🎉
                </h3>
              </div>
            ) : (
              <div style={themeStyle}>
                <h3 className="font-bold text-base sm:text-lg">
                  Send us your feedback
                </h3>
                {errorMessage && (
                  <div className="mt-2 text-sm text-red-600 animate-slide-fade-in">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="mt-2 text-sm text-green-600 animate-slide-fade-in">
                    {successMessage}
                  </div>
                )}
                <form className="space-y-2" onSubmit={submit}>
                  <div className="grid grid-cols-2 gap-4">
                    {(!widgetSettings || widgetSettings.collect_info.name) && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          style={themeInputStyle}
                        />
                      </div>
                    )}
                    {(!widgetSettings || widgetSettings.collect_info.email) && (
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          style={themeInputStyle}
                        />
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
                            rating > index
                              ? "fill-[#FFD700]"
                              : "fill-muted stroke-muted-foreground"
                          }`}
                          onClick={() => onSelectStar(index)}
                        />
                      ))}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: widgetSettings
                          ? lightenColor(widgetSettings.bg_color, -20)
                          : "#4F46E5",
                        color: widgetSettings?.text_color || "#FFFFFF",
                      }}
                    >
                      {isSubmitting ? "Sending..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            <div style={themeStyle} className="text-gray-600 text-xs mt-2">
              Powered by{" "}
              <a href="https://feedlytics.in/" target="_blank">
                <span className="text-indigo-600 hover:underline">
                  Feedlytics
                </span>
                ⚡️
              </a>
            </div>
          </div>
        )}
        <Button
          style={themeStyle}
          className="widget fixed bottom-4 right-4 z-50 rounded-full shadow-lg transition-all hover:scale-105"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircleIcon className="mr-2 h-5 w-5 " />
          Feedback
        </Button>
      </>
    </root.div>
  );
};

function StarIcon(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />{" "}
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const MessageCircleIcon = (props) => {
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
      className="lucide lucide-message-circle"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />{" "}
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
};
