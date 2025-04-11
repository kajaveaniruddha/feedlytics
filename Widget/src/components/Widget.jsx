import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import tailwindStyles from "../index.css?inline";
import axios from "axios";
import { DASHBOARD_BASE_URL } from "@/lib/utils";

export const Widget = ({ username }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      content: form.feedback.value,
      stars: rating,
    };

    const apiUrl = `${DASHBOARD_BASE_URL}/api/v1/send-feedback`;
    console.log('Sending feedback:', data);

    try {
      const response = await axios.post(apiUrl, data);
      console.log(response.data);
      setSuccessMessage(response.data.message || "Feedback sent successfully!");
      setSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMessage(message);
      console.error("Error sending feedback:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full shadow-lg hover:scale-105">
              <MessageCircleIcon className="mr-2 h-5 w-5" />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent className="widget rounded-lg bg-card p-4 shadow-lg w-full max-w-md">
            <style>{tailwindStyles}</style>
            {submitted ? (
              <div className="animate-slide-fade-in flex flex-col items-center">
                <h3 className="text-lg font-bold">
                  Thank you for your feedback 🎉
                </h3>
                {/* <p className="mt-4">
                  We appreciate your feedback. It helps us improve our product
                  and provide better service to our customers.
                </p> */}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold">Send us your feedback</h3>
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
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Tell us what you think"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-5 w-5 cursor-pointer ${
                            rating > index
                              ? "fill-primary"
                              : "fill-muted stroke-muted-foreground"
                          }`}
                          onClick={() => onSelectStar(index)}
                        />
                      ))}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            <div className="text-gray-600 text-xs mt-2">
              Powered by{" "}
              <a
                href="https://feedlytics.vercel.app/"
                target="_blank"
                className="text-indigo-600 hover:underline"
              >
                Feedlytics ⚡️
              </a>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
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
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      className="lucide lucide-message-circle"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
