"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckIcon, CrownIcon, ExternalLinkIcon, RocketIcon, ZapIcon } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { LoadingViewportCenter } from "@/components/layout/LoadingViewportCenter";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkspaceDashboardShell } from "@/components/layout/WorkspaceDashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useWorkspaceBilling } from "@/features/workspace/hooks/useWorkspaceBilling";
import { useWorkspaceDetail } from "@/features/workspace/hooks/useWorkspaceDetail";
import {
  useCreateCheckoutSession,
  useCreatePortalSession,
} from "@/features/workspace/hooks/useWorkspaceBillingMutations";
import { PLAN_FEATURES, type PlanFeatureEntry } from "@/features/workspace/lib/plan-features";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";
import { cn } from "@/lib/utils/cn";

import type { BillingInterval, PaidPlan } from "@/features/workspace/types/billing.types";
import type { WorkspacePlan } from "@/features/workspace/types/workspace.types";

export type WorkspaceBillingPageContentProps = {
  workspacePublicId: string;
};

const PLAN_ORDER: Record<WorkspacePlan, number> = {
  ARCHIVED: 0,
  FREE: 1,
  PRO: 2,
  BUSINESS: 3,
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  FREE: <ZapIcon className="size-5" />,
  PRO: <RocketIcon className="size-5" />,
  BUSINESS: <CrownIcon className="size-5" />,
};

function IntervalToggle({
  value,
  onChange,
}: {
  value: BillingInterval;
  onChange: (v: BillingInterval) => void;
}) {
  return (
    <div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-secondary-gray-200/60 p-1 dark:bg-navy-700">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
          value === "monthly"
            ? "bg-white text-navy-700 shadow-sm dark:bg-navy-900 dark:text-white"
            : "text-secondary-gray-600 hover:text-navy-700 dark:text-secondary-gray-600 dark:hover:text-white",
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
          value === "yearly"
            ? "bg-white text-navy-700 shadow-sm dark:bg-navy-900 dark:text-white"
            : "text-secondary-gray-600 hover:text-navy-700 dark:text-secondary-gray-600 dark:hover:text-white",
        )}
      >
        Yearly
        <span className="ml-1 text-xs font-bold text-green-500">-17%</span>
      </button>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-sm text-navy-700 dark:text-white/80">
          <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function PricingCard({
  entry,
  interval,
  isCurrent,
  currentPlanOrder,
  onUpgrade,
  isUpgrading,
}: {
  entry: PlanFeatureEntry;
  interval: BillingInterval;
  isCurrent: boolean;
  currentPlanOrder: number;
  onUpgrade: (plan: PaidPlan, interval: BillingInterval) => void;
  isUpgrading: boolean;
}) {
  const planOrder = PLAN_ORDER[entry.plan as WorkspacePlan] ?? 0;
  const isHighlighted = entry.plan === "PRO";
  const price = entry.plan === "FREE" ? null : entry.prices[interval];

  function handleClick() {
    if (entry.plan !== "FREE") {
      onUpgrade(entry.plan as PaidPlan, interval);
    }
  }

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between",
        isHighlighted &&
          "ring-2 ring-brand-500 dark:ring-brand-400",
      )}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="workspacePlanPro" className="px-3 py-0.5 text-xs">
            Most popular
          </Badge>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          {PLAN_ICONS[entry.plan]}
          <CardTitle>{entry.label}</CardTitle>
        </div>
        <MutedText tone="subtle" className="min-h-[40px]">{entry.description}</MutedText>

        <div className="mt-2">
          {price != null ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-navy-700 dark:text-white">
                ${price}
              </span>
              <span className="text-sm text-secondary-gray-600">
                / {interval === "monthly" ? "mo" : "yr"}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-navy-700 dark:text-white">$0</span>
              <span className="text-sm text-secondary-gray-600">/ forever</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-5">
        <FeatureList features={entry.features} />

        {isCurrent ? (
          <Button variant="outline" size="sm" disabled className="w-full rounded-full">
            Current Plan
          </Button>
        ) : planOrder > currentPlanOrder ? (
          <Button
            variant="brand"
            size="sm"
            className="w-full rounded-full"
            onClick={handleClick}
            disabled={isUpgrading || entry.plan === "FREE"}
          >
            {isUpgrading ? "Redirecting…" : `Upgrade to ${entry.label}`}
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled className="w-full rounded-full">
            {entry.plan === "FREE" ? "Free Plan" : "Contact support"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function WorkspaceBillingPageContent({ workspacePublicId }: WorkspaceBillingPageContentProps) {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const { data: user } = useCurrentUser();
  const { data: billing, isPending, isError, error, refetch } = useWorkspaceBilling(workspacePublicId);
  const { data: workspace } = useWorkspaceDetail(workspacePublicId);
  const checkoutMutation = useCreateCheckoutSession(workspacePublicId);
  const portalMutation = useCreatePortalSession(workspacePublicId);

  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get("checkout");
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!checkoutStatus || toastShownRef.current) return;
    toastShownRef.current = true;

    if (checkoutStatus === "success") {
      toast.success("Payment successful! Your plan is being activated...");
      const pollInterval = window.setInterval(() => {
        void refetch();
      }, 2000);
      const timeout = window.setTimeout(() => {
        clearInterval(pollInterval);
      }, 20000);
      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
    if (checkoutStatus === "cancelled") {
      toast.info("Checkout was cancelled.");
    }
  }, [checkoutStatus, refetch]);

  const userInitials = user?.name ? workspaceInitials(user.name) : "?";
  const formattedPeriodEnd = useMemo(() => {
    if (!billing?.currentPeriodEnd) return null;
    try {
      return new Date(billing.currentPeriodEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return billing.currentPeriodEnd;
    }
  }, [billing?.currentPeriodEnd]);

  function handleUpgrade(plan: PaidPlan, billingInterval: BillingInterval) {
    checkoutMutation.mutate(
      { plan, interval: billingInterval },
      {
        onSuccess: (data) => {
          window.location.href = data.url;
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create checkout session");
        },
      },
    );
  }

  function handleManageBilling() {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (err) => {
        toast.error(err.message || "Failed to open billing portal");
      },
    });
  }

  if (isPending) {
    return <LoadingViewportCenter label="Loading billing info" />;
  }

  if (isError || !billing) {
    return (
      <ErrorPanel message={error?.message ?? "Could not load billing information."}>
        <Button type="button" variant="brand" onClick={() => void refetch()}>
          Try again
        </Button>
      </ErrorPanel>
    );
  }

  const currentPlan = billing.plan;
  const currentPlanOrder = PLAN_ORDER[currentPlan] ?? 0;
  const isOwner = workspace?.role === "OWNER";

  return (
    <WorkspaceDashboardShell
      kpiSection={
        <Stack gap="md">
          <DashboardToolbar
            leading={
              <PageIntro
                kicker={<MutedText tone="subtle">Workspace</MutedText>}
                title={
                  <Heading variant="workspacePageTitle" as="h1">
                    Billing
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
        </Stack>
      }
    >
      <Stack gap="lg" className="w-full max-w-5xl">
        {billing.hasSubscription && isOwner && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>Current Subscription</CardTitle>
                  <Badge
                    variant={
                      currentPlan === "PRO"
                        ? "workspacePlanPro"
                        : currentPlan === "BUSINESS"
                          ? "workspacePlanBusiness"
                          : "workspacePlanFree"
                    }
                  >
                    {currentPlan}
                  </Badge>
                </div>
                {billing.canManageBilling && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageBilling}
                    disabled={portalMutation.isPending}
                  >
                    {portalMutation.isPending ? "Opening…" : "Manage Subscription"}
                    <ExternalLinkIcon className="ml-1 size-3.5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <MutedText tone="subtle">
                  Billed {billing.billingInterval ?? "monthly"}. Use the Stripe portal to update
                  payment methods, switch plans, view invoices, or cancel.
                </MutedText>
                {billing.currentPeriodEnd && (
                  <MutedText tone="subtle" className="text-xs">
                    {billing.subscriptionStatus === "CANCELLED"
                      ? `Cancels on ${formattedPeriodEnd}`
                      : `Renews on ${formattedPeriodEnd}`}
                  </MutedText>
                )}
                {billing.subscriptionStatus === "PAST_DUE" && (
                  <Badge variant="destructive" className="mt-1 w-fit text-xs">
                    Payment past due
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Stack gap="md">
          <div className="flex flex-col items-center gap-3">
            <Heading variant="workspacePageTitle" as="h2">
              {billing.hasSubscription ? "Change Plan" : "Choose a Plan"}
            </Heading>
            <MutedText tone="subtle" align="center">
              Scale your feedback collection as your product grows
            </MutedText>
            <IntervalToggle value={interval} onChange={setInterval} />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLAN_FEATURES.map((entry) => (
              <PricingCard
                key={entry.plan}
                entry={entry}
                interval={interval}
                isCurrent={currentPlan === entry.plan}
                currentPlanOrder={currentPlanOrder}
                onUpgrade={handleUpgrade}
                isUpgrading={checkoutMutation.isPending}
              />
            ))}
          </div>
        </Stack>

        {!isOwner && (
          <Card>
            <CardContent className="py-2">
              <MutedText tone="subtle" align="center">
                Only the workspace owner can manage billing and subscriptions.
              </MutedText>
            </CardContent>
          </Card>
        )}
      </Stack>
    </WorkspaceDashboardShell>
  );
}
