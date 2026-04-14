"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Check, Crown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessageContext } from "@/hooks/use-message-context";
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

export default function SettingsPage() {
  const { maxMessages, maxWorkflows, userInfo } = useMessageContext();
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [billingLoading, setBillingLoading] = useState(false);
  const [workflowCount, setWorkflowCount] = useState(0);
  const [periodFeedbackCount, setPeriodFeedbackCount] = useState(0);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await api.getBilling();
        if (res.data?.workflowCount != null) {
          setWorkflowCount(res.data.workflowCount);
        }
        if (res.data?.periodFeedbackCount != null) {
          setPeriodFeedbackCount(res.data.periodFeedbackCount);
        }
      } catch {
        // billing data may not be fully available yet
      }
    };
    fetchBilling();
  }, []);

  const handleManageSubscription = async () => {
    setBillingLoading(true);
    try {
      const res = await api.createBillingPortal();
      window.location.href = res.data.url;
    } catch {
      setBillingLoading(false);
    }
  };

  const handleUpgrade = async (plan: "pro" | "business") => {
    setUpgradeLoading(plan);
    try {
      const res = await api.createCheckoutSession({ plan, interval });
      window.location.href = res.data.url;
    } catch {
      setUpgradeLoading(null);
    }
  };

  const feedbackPercent = maxMessages > 0 ? Math.min((periodFeedbackCount / maxMessages) * 100, 100) : 0;
  const workflowMax = PLAN_LIMITS[userInfo.userTier]?.maxWorkflows ?? maxWorkflows;
  const workflowPercent = workflowMax === Infinity ? 0 : workflowMax > 0 ? Math.min((workflowCount / workflowMax) * 100, 100) : 0;

  const formattedEnd = userInfo.billingPeriodEnd
    ? new Date(userInfo.billingPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const tierLabel = (tier: PlanTier) =>
    tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Current Plan */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-6">Settings &amp; Billing</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Current Plan</CardTitle>
              <Badge
                variant={userInfo.userTier === "free" ? "secondary" : "default"}
                className={
                  userInfo.userTier === "business"
                    ? "shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                    : ""
                }
              >
                {tierLabel(userInfo.userTier)}
              </Badge>
            </div>
            {formattedEnd && (
              <span className="text-sm text-muted-foreground">
                Resets on {formattedEnd}
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Feedback usage (this billing period) */}
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

            {/* Workflow usage */}
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

            {userInfo.userTier !== "free" && (
              <Button
                onClick={handleManageSubscription}
                disabled={billingLoading}
                variant="outline"
              >
                {billingLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Manage Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.section>

      {/* Plan Comparison */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold">Compare Plans</h2>
          <Tabs
            defaultValue="monthly"
            onValueChange={(v) => setInterval(v as "monthly" | "yearly")}
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
            const isCurrent = userInfo.userTier === tier;
            const price =
              tier === "free"
                ? 0
                : interval === "monthly"
                  ? PLAN_PRICES[tier].monthly
                  : PLAN_PRICES[tier].yearly;

            return (
              <Card
                key={tier}
                className={`relative flex flex-col ${
                  isCurrent ? "border-primary ring-1 ring-primary/30" : ""
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Current Plan</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{tierLabel(tier)}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      ${price}
                    </span>
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
                      <span>
                        {limits.maxFeedbacksPerMonth.toLocaleString()} feedbacks/month
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span>
                        {limits.maxWorkflows === Infinity
                          ? "Unlimited"
                          : limits.maxWorkflows}{" "}
                        workflows
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <span>{limits.maxTeamMembers} team member{limits.maxTeamMembers > 1 ? "s" : ""}</span>
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
                        onClick={() => handleUpgrade(tier)}
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
      </motion.section>
    </div>
  );
}
