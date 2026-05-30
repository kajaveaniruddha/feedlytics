/**
 * Free vs Pro comparison mini-cards (slide 2). Mirrors `.pro-compare` in workspace-dashboard.html.
 */
export function ProComparePlaceholder() {
  return (
    <div className="flex gap-2.5" aria-hidden>
      <div className="w-[100px] rounded-xl border border-white/15 bg-white/12 px-3.5 py-3 backdrop-blur-[4px]">
        <div className="mb-2 text-[10px] font-bold tracking-wide text-white/60 uppercase">Free</div>
        <div className="text-base font-bold">200</div>
        <div className="text-[9px] text-white/60">feedbacks/mo</div>
        <div className="mt-2">
          <div className="text-base font-bold">90</div>
          <div className="text-[9px] text-white/60">days retention</div>
        </div>
      </div>
      <div className="w-[100px] rounded-xl border border-white/35 bg-white/22 px-3.5 py-3 backdrop-blur-[4px]">
        <div className="mb-2 text-[10px] font-bold tracking-wide text-white uppercase">Pro</div>
        <div className="text-base font-bold">20K</div>
        <div className="text-[9px] text-white/60">feedbacks/mo</div>
        <div className="mt-2">
          <div className="text-base font-bold">365</div>
          <div className="text-[9px] text-white/60">days retention</div>
        </div>
      </div>
    </div>
  );
}
