"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  type?: "submit" | "button";
}

export function SubmitButton({
  isLoading,
  loadingText = "Loading...",
  children,
  disabled,
  variant = "default",
  className,
  type = "submit",
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      disabled={isLoading || disabled}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
