import type { ReactNode } from "react";

/**
 * Campaign list preview (slide 3). Mirrors `.campaign-visual` / `.camp-row` in workspace-dashboard.html.
 */
function CampRow({
  icon,
  label,
  pill,
}: {
  icon: ReactNode;
  label: string;
  pill: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[10px] border border-white/15 bg-white/12 px-3 py-2 backdrop-blur-[4px]">
      <span className="size-4 shrink-0 opacity-80 [&_svg]:size-4">{icon}</span>
      <span className="text-[11px] font-semibold text-white/85">{label}</span>
      <span className="ml-auto rounded-lg bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
        {pill}
      </span>
    </div>
  );
}

export function CampaignRowsPlaceholder() {
  return (
    <div className="flex w-[min(100%,200px)] flex-col gap-1.5" aria-hidden>
      <CampRow
        pill="Active"
        label="NPS Survey"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        }
      />
      <CampRow
        pill="Scheduled"
        label="Post-Purchase"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />
      <CampRow
        pill="Draft"
        label="Churn Prevention"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
      />
    </div>
  );
}
