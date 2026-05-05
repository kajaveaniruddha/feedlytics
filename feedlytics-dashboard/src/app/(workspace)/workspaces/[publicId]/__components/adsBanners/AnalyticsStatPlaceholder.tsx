/**
 * Mini analytics chart card (slide 4). Mirrors inline visual in workspace-dashboard.html.
 */
export function AnalyticsStatPlaceholder() {
  return (
    <div
      className="w-[160px] rounded-[14px] border border-white/20 bg-white/15 p-4 backdrop-blur-[4px]"
      aria-hidden
    >
      <div className="mb-2.5 flex gap-1.5">
        <div className="h-[50px] flex-1 rounded-md bg-white/30" />
        <div className="h-[50px] flex-1 rounded-md bg-white/50" />
        <div className="h-[50px] flex-1 rounded-md bg-white/25" />
      </div>
      <div className="mb-1 h-[3px] w-[80%] rounded-sm bg-white/25" />
      <div className="h-[3px] w-[60%] rounded-sm bg-white/25" />
    </div>
  );
}
