/**
 * Intl-based formatters — intentionally locale- and timezone-agnostic so
 * pages render identically on the server and the client (no hydration drift).
 */

const DEFAULT_LOCALE = "en-US";

export function formatRelativeTime(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input);
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, { numeric: "auto" });

  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, sec] of ranges) {
    if (Math.abs(diffSec) >= sec || unit === "second") {
      return rtf.format(Math.round(diffSec / sec), unit);
    }
  }
  return rtf.format(0, "second");
}

export function formatDate(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(value);
}

/** Single-decimal rating for workspace cards (matches common star display). */
export function formatRating(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** `value` is 0–100 (backend `positiveSentimentPercentage`). */
export function formatPercentFromHundred(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100);
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, Math.max(0, max - 1))}…`;
}
