"use client";

import * as React from "react";

type Strength = 0 | 1 | 2 | 3 | 4;

const labels: Record<Strength, string> = {
  0: "Too short",
  1: "Weak",
  2: "Okay",
  3: "Strong",
  4: "Excellent",
};

const tones: Record<Strength, string> = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-orange-500",
  3: "bg-green-500",
  4: "bg-green-500",
};

function score(password: string): Strength {
  if (password.length < 8) return 0;
  let s = 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
  if (/\d/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return Math.min(s, 4) as Strength;
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = React.useMemo(() => score(password), [password]);

  return (
    <div data-slot="password-strength" className="flex flex-col gap-1.5">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? tones[strength] : "bg-secondary-gray-100 dark:bg-white-alpha-100"
            }`}
          />
        ))}
      </div>
      <p className="ml-0.5 text-xs text-muted dark:text-secondary-gray-600">
        {password ? `Password strength: ${labels[strength]}` : "Use at least 8 characters"}
      </p>
    </div>
  );
}
