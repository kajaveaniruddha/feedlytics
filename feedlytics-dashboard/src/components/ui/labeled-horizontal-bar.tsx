import { cn } from "@/lib/utils/cn";

export type LabeledHorizontalBarProps = {
  label: string;
  value: number;
  max: number;
  tone?: "brand" | "green" | "neutral";
  className?: string;
};

const fillToneClass: Record<NonNullable<LabeledHorizontalBarProps["tone"]>, string> = {
  brand: "bg-gradient-to-r from-[#868CFF] to-brand-500",
  green: "bg-gradient-to-r from-[#43E89E] to-[#01B574]",
  neutral: "bg-secondary-gray-500 dark:bg-white/40",
};

export function LabeledHorizontalBar({
  label,
  value,
  max,
  tone = "brand",
  className,
}: LabeledHorizontalBarProps) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-xs font-semibold text-navy-900 dark:text-white">{label}</p>
        <p className="shrink-0 text-xs font-medium text-secondary-gray-600 dark:text-white/70">
          {value.toLocaleString()}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-gray-400 dark:bg-white/15">
        <div
          className={cn("h-full rounded-full transition-[width] duration-300 ease-out", fillToneClass[tone])}
          style={{ width: `${percent}%` }}
          role="meter"
          aria-label={`${label} feedback count`}
          aria-valuemin={0}
          aria-valuenow={value}
          aria-valuemax={safeMax}
        />
      </div>
    </div>
  );
}
