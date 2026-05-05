import {
  BarChart3Icon,
  CreditCardIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  MonitorIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/config/routes";

export type WorkspaceSidebarNavEntry = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Resolved href; omit when not navigable yet */
  resolveHref: (ctx: { workspacePublicId: string }) => string | undefined;
  resolveActive: (pathname: string, ctx: { workspacePublicId: string }) => boolean;
};

export const workspaceSidebarNavEntries: WorkspaceSidebarNavEntry[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    resolveHref: ({ workspacePublicId }) => routes.workspace(workspacePublicId),
    resolveActive: (pathname, ctx) => pathname === routes.workspace(ctx.workspacePublicId),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3Icon,
    resolveHref: () => undefined,
    resolveActive: () => false,
  },
  {
    id: "feedbacks",
    label: "Feedbacks",
    icon: MessageSquareIcon,
    resolveHref: () => undefined,
    resolveActive: () => false,
  },
  {
    id: "widget",
    label: "Widget",
    icon: MonitorIcon,
    resolveHref: ({ workspacePublicId }) => routes.workspaceWidget(workspacePublicId),
    resolveActive: (pathname, ctx) => pathname === routes.workspaceWidget(ctx.workspacePublicId),
  },
  {
    id: "api",
    label: "API",
    icon: KeyRoundIcon,
    resolveHref: ({ workspacePublicId }) => routes.workspaceApiSettings(workspacePublicId),
    resolveActive: (pathname, ctx) => pathname === routes.workspaceApiSettings(ctx.workspacePublicId),
  },
  {
    id: "team",
    label: "Team",
    icon: UsersIcon,
    resolveHref: () => undefined,
    resolveActive: () => false,
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCardIcon,
    resolveHref: () => undefined,
    resolveActive: () => false,
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    resolveHref: ({ workspacePublicId }) => routes.workspaceSettings(workspacePublicId),
    resolveActive: (pathname, ctx) => pathname === routes.workspaceSettings(ctx.workspacePublicId),
  },
];
