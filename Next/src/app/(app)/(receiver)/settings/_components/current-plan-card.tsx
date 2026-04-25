"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlanTier } from "@/config/plans";

interface CurrentPlanCardProps {
  userTier: PlanTier;
  periodFeedbackCount: number;
  maxMessages: number;
  workflowCount: number;
  workflowMax: number;
  billingPeriodEnd: string | Date | null;
  billingLoading: boolean;
  onManageSubscription: () => void;
}

function tierLabel(tier: PlanTier) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

export default function CurrentPlanCard({
  userTier,
  periodFeedbackCount,
  maxMessages,
  workflowCount,
  workflowMax,
  billingPeriodEnd,
  billingLoading,
  onManageSubscription,
}: CurrentPlanCardProps) {
  const feedbackPercent = maxMessages > 0 ? Math.min((periodFeedbackCount / maxMessages) * 100, 100) : 0;
  const workflowPercent = workflowMax === Infinity ? 0 : workflowMax > 0 ? Math.min((workflowCount / workflowMax) * 100, 100) : 0;

  const formattedEnd = billingPeriodEnd
    ? new Date(billingPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Settings &amp; Billing</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">Current Plan</CardTitle>
            <Badge
              variant={userTier === "free" ? "secondary" : "default"}
              className={userTier === "business" ? "shadow-[0_0_12px_hsl(var(--primary)/0.4)]" : ""}
            >
              {tierLabel(userTier)}
            </Badge>
          </div>
          {formattedEnd && (
            <span className="text-sm text-muted-foreground">Resets on {formattedEnd}</span>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Feedbacks this month</span>
              <span className="font-medium">
                {periodFeedbackCount.toLocaleString()} / {maxMessages.toLocaleString()}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${feedbackPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Workflows</span>
              <span className="font-medium">
                {workflowCount} / {workflowMax === Infinity ? "∞" : workflowMax}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: workflowMax === Infinity ? "0%" : `${workflowPercent}%` }}
              />
            </div>
          </div>

          {userTier !== "free" && (
            <Button onClick={onManageSubscription} disabled={billingLoading} variant="outline">
              {billingLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Manage Subscription
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
