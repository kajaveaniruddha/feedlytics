"use client";

import { inputVariants } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export type ColorFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

/** Label above swatch + color input (full width of grid cell). */
export function ColorField({ id, label, value, onChange, disabled }: ColorFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-navy-700 dark:text-white">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div
          className="size-6 shrink-0 rounded-md border border-secondary-gray-100 dark:border-white-alpha-100"
          style={{ backgroundColor: value }}
          aria-hidden
        />
        <input
          id={id}
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            inputVariants({ variant: "main", size: "md" }),
            "h-11 w-full max-w-sm border-none min-w-0 cursor-pointer p-1 disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      </div>
    </div>
  );
}
