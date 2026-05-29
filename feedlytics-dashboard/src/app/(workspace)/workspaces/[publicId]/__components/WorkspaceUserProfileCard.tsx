"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";

export type WorkspaceUserProfileCardProps = {
  name: string;
  initials: string;
  roleLabel: string;
  stats: { label: string; value: number }[];
  isLoading?: boolean;
};

function ProfileCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden p-0" aria-busy aria-label="Loading profile">
      <div className="h-[140px] animate-pulse bg-secondary-gray-200 dark:bg-white/10" />
      <div className="flex flex-col items-center px-6 pb-7">
        <div
          className="-mt-[60px] size-[120px] animate-pulse rounded-full border-[6px] border-surface bg-secondary-gray-200 dark:bg-white/10"
          aria-hidden
        />
        <div className="mt-4 h-7 w-40 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" aria-hidden />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" aria-hidden />
        <div className="mt-6 grid w-full max-w-[280px] grid-cols-2 gap-4">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="flex flex-col items-center gap-2" aria-hidden>
              <div className="h-8 w-12 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" />
              <div className="h-3.5 w-16 animate-pulse rounded bg-secondary-gray-200 dark:bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function WorkspaceUserProfileCard({
  name,
  initials,
  roleLabel,
  stats,
  isLoading = false,
}: WorkspaceUserProfileCardProps) {
  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  return (
    <Card className="h-full overflow-hidden p-0">
      <div
        className="h-32 bg-gradient-to-br from-[#FFDEA8] via-[#FFAEB8] to-[#C4A7E7]"
        aria-hidden
      />
      <div className="flex flex-col items-center px-6 pb-7 text-center">
        <Avatar className="size-[120px] -mt-[60px] border-[6px] border-surface shadow-md after:hidden">
          <AvatarFallback tone="brand" className="text-3xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <p className="mt-4 text-[26px] leading-tight font-bold text-navy-900 dark:text-white">{name}</p>
        <p className="mt-1 text-[15px] text-secondary-gray-500 dark:text-white/60">{roleLabel}</p>
        <div className="mt-6 grid w-full max-w-[280px] grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-[32px] leading-none font-bold text-navy-900 dark:text-white">
                {formatNumber(stat.value)}
              </p>
              <p className="mt-1 text-sm text-secondary-gray-500 dark:text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
