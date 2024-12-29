"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const TotalMessagesPieChart = dynamic(
  () => import("@/components/custom/total-messages-pie-chart"),
  { loading: () => <Skeleton className="w-full h-full bg-white" /> }
);

export const MessageAnalytics = React.memo(({ username }: { username: string }) => (
  <div className="w-full">
    <TotalMessagesPieChart username={username} />
  </div>
));

MessageAnalytics.displayName = 'MessageAnalytics';