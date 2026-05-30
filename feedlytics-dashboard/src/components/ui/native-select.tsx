"use client";

import { inputVariants } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export type NativeSelectOption = { value: string; label: string };

export type NativeSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: NativeSelectOption[];
  disabled?: boolean;
};

/** Label above select (full width of grid cell). */
export function NativeSelect({ id, label, value, onChange, options, disabled }: NativeSelectProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-navy-700 dark:text-white">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          inputVariants({ variant: "main", size: "md" }),
          "w-full min-w-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
