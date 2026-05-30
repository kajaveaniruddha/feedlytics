/**
 * Centered error message + action slot (query failures, empty permissions).
 */
import * as React from "react";

import { MutedText } from "@/components/ui/muted-text";

export type ErrorPanelProps = {
  message: string;
  children?: React.ReactNode;
};

export function ErrorPanel({ message, children }: ErrorPanelProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 px-6 py-16 text-center">
      <MutedText tone="destructive">{message}</MutedText>
      {children}
    </div>
  );
}
