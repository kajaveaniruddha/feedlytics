"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useMessageContext } from "@/hooks/use-message-context";
import { PLAN_LIMITS, type PlanTier } from "@/config/plans";
import CurrentPlanCard from "./current-plan-card";
import PlanComparison from "./plan-comparison";

export default function SettingsContent() {
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
      const res = await api.createBillingPortalSession();
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

  const workflowMax = PLAN_LIMITS[userInfo.userTier]?.maxWorkflows ?? maxWorkflows;

  return (
    <>
      <CurrentPlanCard
        userTier={userInfo.userTier}
        periodFeedbackCount={periodFeedbackCount}
        maxMessages={maxMessages}
        workflowCount={workflowCount}
        workflowMax={workflowMax}
        billingPeriodEnd={userInfo.billingPeriodEnd}
        billingLoading={billingLoading}
        onManageSubscription={handleManageSubscription}
      />
      <PlanComparison
        currentTier={userInfo.userTier}
        interval={interval}
        onIntervalChange={setInterval}
        upgradeLoading={upgradeLoading}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}
