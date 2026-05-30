/**
 * Workspace tile body: initials, plan, title, metrics, role, rating.
 */
import type { ComponentProps } from "react";
import { MessageSquareIcon, UsersIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { MetricInline } from "@/components/layout/MetricInline";
import { RatingValue } from "@/components/layout/RatingValue";
import { WorkspaceTileIcon } from "@/components/layout/WorkspaceTileIcon";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import type { WorkspaceRole } from "@/features/workspace/types/workspace.types";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export type WorkspaceSummaryCardProps = {
  name: string;
  planLabel: string;
  planBadgeVariant: BadgeVariant;
  role: WorkspaceRole;
  roleBadgeVariant: BadgeVariant;
  memberLabel: string;
  feedbackLabel: string;
  initials: string;
  tileTone: ComponentProps<typeof WorkspaceTileIcon>["tone"];
  avgRating: number | null;
};

export function WorkspaceSummaryCard({
  name,
  planLabel,
  planBadgeVariant,
  role,
  roleBadgeVariant,
  memberLabel,
  feedbackLabel,
  initials,
  tileTone,
  avgRating,
}: WorkspaceSummaryCardProps) {
  return (
    <Card interactive>
      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-3">
          <WorkspaceTileIcon initials={initials} tone={tileTone} />
          <Badge variant={planBadgeVariant}>{planLabel}</Badge>
        </div>
        <Heading variant="cardTitle" as="h2">
          {name}
        </Heading>
        <div className="mt-2.5 flex flex-wrap gap-4">
          <MetricInline icon={<UsersIcon strokeWidth={2} aria-hidden />}>{memberLabel}</MetricInline>
          <MetricInline icon={<MessageSquareIcon strokeWidth={2} aria-hidden />}>{feedbackLabel}</MetricInline>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
          <Badge variant={roleBadgeVariant}>{role}</Badge>
          <RatingValue value={avgRating} />
        </div>
      </CardContent>
    </Card>
  );
}
