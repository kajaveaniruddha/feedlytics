/**
 * Decorative glass “widget preview” for workspace ads carousel (slide 1).
 * Mirrors `.widget-preview` in Plans/Future/UX/workspace-dashboard.html.
 */
export function WidgetPreviewPlaceholder() {
  return (
    <div
      className="w-[140px] rounded-[14px] border border-white/20 bg-white/15 p-3 backdrop-blur-[4px]"
      aria-hidden
    >
      <div className="mb-2 flex gap-1">
        <span className="size-[5px] rounded-full bg-white/40" />
        <span className="size-[5px] rounded-full bg-white/40" />
        <span className="size-[5px] rounded-full bg-white/40" />
      </div>
      <div className="mb-[5px] h-1 rounded-sm bg-white/25" />
      <div className="mb-[5px] h-1 w-[60%] rounded-sm bg-white/25" />
      <div className="mt-1.5 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="size-3 shrink-0 fill-white/60"
            aria-hidden
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    </div>
  );
}
