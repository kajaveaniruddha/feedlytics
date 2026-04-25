"use client";

import { Check, Crown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLAN_LIMITS, type PlanTier } from "@/config/plans";

const PLAN_PRICES: Record<Exclude<PlanTier, "free">, { monthly: number; yearly: number }> = {
  pro: { monthly: 19, yearly: 190 },
  business: { monthly: 79, yearly: 790 },
};

const PLAN_FEATURES: Record<PlanTier, string[]> = {
  free: [
    "AI sentiment analysis",
    "AI categorization",
    "Slack & Google Chat alerts",
    "Customizable widget",
  ],
  pro: [
    "Everything in Free",
    "CSV export",
    "Feedback replies",
    "Webhook integrations",
    "Priority support",
  ],
  business: [
    "Everything in Pro",
    "API access",
    "Remove Feedlytics branding",
    "Dedicated support",
    "Custom integrations",
  ],
};

interface PlanComparisonProps {
  currentTier: PlanTier;
  interval: "monthly" | "yearly";
  onIntervalChange: (interval: "monthly" | "yearly") => void;
  upgradeLoading: string | null;
  onUpgrade: (plan: "pro" | "business") => void;
}

function tierLabel(tier: PlanTier) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

export default function PlanComparison({
  currentTier,
  interval,
  onIntervalChange,
  upgradeLoading,
  onUpgrade,
}: PlanComparisonProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold">Compare Plans</h2>
        <Tabs
          defaultValue="monthly"
          onValueChange={(v) => onIntervalChange(v as "monthly" | "yearly")}
        >
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly <span className="ml-1 text-xs text-primary">Save 2 months</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["free", "pro", "business"] as PlanTier[]).map((tier) => {
          const limits = PLAN_LIMITS[tier];
          const isCurrent = currentTier === tier;
          const price =
            tier === "free"
              ? 0
              : interval === "monthly"
                ? PLAN_PRICES[tier].monthly
                : PLAN_PRICES[tier].yearly;

          return (
            <Card
              key={tier}
              className={`relative flex flex-col ${isCurrent ? "border-primary ring-1 ring-primary/30" : ""}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Current Plan</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{tierLabel(tier)}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${price}</span>
                  {tier !== "free" && (
                    <span className="text-muted-foreground text-sm">
                      /{interval === "monthly" ? "mo" : "yr"}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>{limits.maxFeedbacksPerMonth.toLocaleString()} feedbacks/month</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>
                      {limits.maxWorkflows === Infinity ? "Unlimited" : limits.maxWorkflows} workflows
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>
                      {limits.maxTeamMembers} team member{limits.maxTeamMembers > 1 ? "s" : ""}
                    </span>
                  </li>
                  {PLAN_FEATURES[tier].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : tier === "free" ? (
                    <Button variant="outline" className="w-full" disabled>
                      Free
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => onUpgrade(tier)}
                      disabled={upgradeLoading === tier}
                    >
                      {upgradeLoading === tier ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Crown className="w-4 h-4 mr-2" />
                      )}
                      Upgrade to {tierLabel(tier)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
