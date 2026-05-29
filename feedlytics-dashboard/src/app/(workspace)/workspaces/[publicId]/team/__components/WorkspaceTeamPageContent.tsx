"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardHeaderCapsule } from "@/components/layout/DashboardHeaderCapsule";
import { DashboardToolbar } from "@/components/layout/DashboardToolbar";
import { ErrorPanel } from "@/components/layout/ErrorPanel";
import { LoadingViewportCenter } from "@/components/layout/LoadingViewportCenter";
import { PageIntro } from "@/components/layout/PageIntro";
import { WorkspaceDashboardShell } from "@/components/layout/WorkspaceDashboardShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { MutedText } from "@/components/ui/muted-text";
import { Stack } from "@/components/ui/stack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/config/routes";
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser";
import { useWorkspaceDetail } from "@/features/workspace/hooks/useWorkspaceDetail";
import { useWorkspaceMembers } from "@/features/workspace/hooks/useWorkspaceMembers";
import { useWorkspaceTeamMutations } from "@/features/workspace/hooks/useWorkspaceTeamMutations";
import {
  inviteMemberSchema,
  type InviteMemberFormValues,
} from "@/features/workspace/schemas/invite-member.schema";
import type { InviteDataDto, MemberDataDto } from "@/features/workspace/types/team.types";
import type { WorkspaceRole } from "@/features/workspace/types/workspace.types";
import { workspaceInitials } from "@/features/workspace/lib/workspace-initials";
import { formatDate } from "@/lib/utils/format";
import { ApiError } from "@/services/api/errors/ApiError";

import { MemberRowActions } from "./MemberRowActions";
import { TransferOwnershipDialog } from "./TransferOwnershipDialog";

export type WorkspaceTeamPageContentProps = {
  workspacePublicId: string;
};

function memberRoleBadgeVariant(role: WorkspaceRole): React.ComponentProps<typeof Badge>["variant"] {
  if (role === "OWNER") return "workspaceRoleOwner";
  if (role === "ADMIN") return "workspaceRoleAdmin";
  return "workspaceRoleMember";
}

export function WorkspaceTeamPageContent({ workspacePublicId }: WorkspaceTeamPageContentProps) {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const userInitials = user?.name ? workspaceInitials(user.name) : "?";
  const viewerPublicId = user?.publicId ?? "";

  const detailQuery = useWorkspaceDetail(workspacePublicId);
  const membersQuery = useWorkspaceMembers(workspacePublicId);
  const team = useWorkspaceTeamMutations(workspacePublicId);

  const [transferOpen, setTransferOpen] = React.useState(false);
  const [transferTargetId, setTransferTargetId] = React.useState<string | null>(null);

  const inviteForm = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "MEMBER" },
    mode: "onBlur",
  });

  const workspace = detailQuery.data;
  const membersPayload = membersQuery.data;
  const members = membersPayload?.members ?? [];
  const pendingInvites = membersPayload?.pendingInvites ?? [];

  const viewerMember = members.find((m) => m.userPublicId === viewerPublicId);
  const viewerRole = viewerMember?.role ?? workspace?.role;
  const isOwner = viewerRole === "OWNER";
  const isAdmin = viewerRole === "ADMIN";
  const canManageTeam = isOwner || isAdmin;

  const seatUsed = members.length + pendingInvites.length;
  const seatMax = workspace?.maxMembers ?? 0;
  const atMemberLimit = seatMax > 0 && seatUsed >= seatMax;

  const adminOptions = members.filter((m) => m.role === "ADMIN" && m.userPublicId !== viewerPublicId);

  React.useEffect(() => {
    if (!transferOpen) {
      setTransferTargetId(null);
    }
  }, [transferOpen]);

  const openTransferFor = (adminUserPublicId: string) => {
    setTransferTargetId(adminUserPublicId);
    setTransferOpen(true);
  };

  const onInviteSubmit = inviteForm.handleSubmit((values) => {
    team.inviteMember.mutate(
      { email: values.email.trim(), role: values.role },
      {
        onSuccess: () => {
          toast.success("Invitation sent");
          inviteForm.reset({ email: "", role: "MEMBER" });
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : "Could not send invite");
        },
      },
    );
  });

  const onTransferConfirm = () => {
    if (!transferTargetId) {
      toast.error("Choose an admin to receive ownership");
      return;
    }
    team.transferOwnership.mutate(
      { newOwnerUserPublicId: transferTargetId },
      {
        onSuccess: () => {
          toast.success("Ownership transferred");
          setTransferOpen(false);
        },
        onError: (err) => {
          toast.error(err instanceof ApiError ? err.message : "Transfer failed");
        },
      },
    );
  };

  const onLeave = () => {
    team.leaveWorkspace.mutate(undefined, {
      onSuccess: () => {
        toast.success("You left the workspace");
        router.push(routes.workspaces);
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.message : "Could not leave workspace");
      },
    });
  };

  if (detailQuery.isPending || membersQuery.isPending) {
    return <LoadingViewportCenter label="Loading team" />;
  }

  if (detailQuery.isError || membersQuery.isError) {
    const err = detailQuery.error ?? membersQuery.error;
    const message = err instanceof Error ? err.message : "Something went wrong";
    return (
      <ErrorPanel message={message}>
        <Button
          type="button"
          variant="brand"
          onClick={() => {
            void detailQuery.refetch();
            void membersQuery.refetch();
          }}
        >
          Try again
        </Button>
      </ErrorPanel>
    );
  }

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
                    Team
                  </Heading>
                }
              />
            }
            trailing={<DashboardHeaderCapsule userInitials={userInitials} />}
          />
          <MutedText tone="subtle">
            Members and invitations for {workspace?.name ?? "this workspace"}.{" "}
            {seatMax > 0 ? (
              <>
                Seats: {seatUsed} / {seatMax} (plan limit).
              </>
            ) : null}
          </MutedText>
        </Stack>
      }
    >
      <Stack gap="lg">
        {canManageTeam ? (
          <section aria-label="Team invitations" className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            <Form {...inviteForm}>
              <form onSubmit={onInviteSubmit} noValidate>
                <Card className="gap-0 overflow-hidden p-0">
                  <CardHeader className="gap-0.5 border-b border-secondary-gray-100 px-4 py-3 dark:border-white/10">
                    <CardTitle className="text-sm">Invite a teammate</CardTitle>
                    <CardDescription className="text-xs leading-snug">
                      Email invitation and access level.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="gap-3 px-4 py-3">
                    <FormField
                      control={inviteForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel required className="text-xs">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              variant="main"
                              size="sm"
                              autoComplete="email"
                              placeholder="colleague@company.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={inviteForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-xs">Role</FormLabel>
                          <FormControl>
                            <div
                              className="flex gap-0.5 rounded-xl border border-secondary-gray-100 bg-secondary-gray-50/80 p-0.5 dark:border-white/10 dark:bg-navy-900/50"
                              role="group"
                              aria-label="Invitation role"
                            >
                              <Button
                                type="button"
                                variant={field.value === "MEMBER" ? "brand" : "ghost"}
                                size="sm"
                                className="h-8 min-h-8 flex-1 rounded-lg px-2 text-xs"
                                onClick={() => field.onChange("MEMBER")}
                              >
                                Member
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === "ADMIN" ? "brand" : "ghost"}
                                size="sm"
                                className="h-8 min-h-8 flex-1 rounded-lg px-2 text-xs"
                                disabled={!isOwner}
                                onClick={() => field.onChange("ADMIN")}
                              >
                                Admin
                              </Button>
                            </div>
                          </FormControl>
                          {!isOwner ? (
                            <MutedText tone="subtle" className="text-[11px] leading-snug">
                              Only the owner can invite admins.
                            </MutedText>
                          ) : (
                            <MutedText tone="subtle" className="text-[11px] leading-snug">
                              Admins manage members; members use the workspace.
                            </MutedText>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {atMemberLimit ? (
                      <MutedText tone="subtle" className="text-xs">
                        Member limit reached for this plan.
                      </MutedText>
                    ) : null}
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-end gap-2 border-t border-secondary-gray-100 bg-secondary-gray-50/40 px-4 py-2.5 dark:border-white/10 dark:bg-navy-900/30">
                    <Button
                      type="submit"
                      variant="brand"
                      size="sm"
                      disabled={team.inviteMember.isPending || atMemberLimit}
                    >
                      {team.inviteMember.isPending ? "Sending…" : "Send invite"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <div>
              <Heading variant="cardTitle" as="h2" className="mb-3">
                Pending invitations
              </Heading>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-12 text-right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvites.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-secondary-gray-600 dark:text-secondary-gray-400">
                        No pending invitations yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingInvites.map((inv: InviteDataDto) => (
                      <TableRow key={inv.invitePublicId}>
                        <TableCell className="font-medium">{inv.email}</TableCell>
                        <TableCell>
                          <Badge variant={memberRoleBadgeVariant(inv.role)}>{inv.role}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(inv.expiresAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <IconButton type="button" variant="ghost" size="icon-sm" label="Invite actions">
                                  <MoreHorizontalIcon className="size-4" />
                                </IconButton>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  team.resendInvite.mutate(inv.invitePublicId, {
                                    onSuccess: () => toast.success("Invitation resent"),
                                    onError: (e) =>
                                      toast.error(e instanceof ApiError ? e.message : "Could not resend"),
                                  })
                                }
                              >
                                Resend
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() =>
                                  team.cancelInvite.mutate(inv.invitePublicId, {
                                    onSuccess: () => toast.success("Invitation cancelled"),
                                    onError: (e) =>
                                      toast.error(e instanceof ApiError ? e.message : "Could not cancel"),
                                  })
                                }
                              >
                                Cancel invite
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        ) : null}

        <section aria-label="Workspace members">
          <Heading variant="cardTitle" as="h2" className="mb-3">
            Members
          </Heading>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m: MemberDataDto) => (
                <TableRow key={m.userPublicId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt="" /> : null}
                        <AvatarFallback tone="brand">{workspaceInitials(m.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{m.name}</span>
                        <MutedText tone="subtle" className="truncate text-xs">
                          {m.email}
                        </MutedText>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={memberRoleBadgeVariant(m.role)}>{m.role}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(m.joinedAt)}</TableCell>
                  <TableCell className="text-right">
                    <MemberRowActions
                      member={m}
                      viewerPublicId={viewerPublicId}
                      viewerRole={viewerRole}
                      onPromoteAdmin={() =>
                        team.updateMemberRole.mutate(
                          { memberUserPublicId: m.userPublicId, body: { role: "ADMIN" } },
                          {
                            onSuccess: () => toast.success("Role updated"),
                            onError: (e) =>
                              toast.error(e instanceof ApiError ? e.message : "Could not update role"),
                          },
                        )
                      }
                      onDemoteMember={() =>
                        team.updateMemberRole.mutate(
                          { memberUserPublicId: m.userPublicId, body: { role: "MEMBER" } },
                          {
                            onSuccess: () => toast.success("Role updated"),
                            onError: (e) =>
                              toast.error(e instanceof ApiError ? e.message : "Could not update role"),
                          },
                        )
                      }
                      onRemove={() =>
                        team.removeMember.mutate(m.userPublicId, {
                          onSuccess: () => toast.success("Member removed"),
                          onError: (e) =>
                            toast.error(e instanceof ApiError ? e.message : "Could not remove member"),
                        })
                      }
                      onLeave={onLeave}
                      onTransfer={() => openTransferFor(m.userPublicId)}
                      leavePending={team.leaveWorkspace.isPending}
                      rolePending={team.updateMemberRole.isPending}
                      removePending={team.removeMember.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {isOwner && adminOptions.length > 0 ? (
            <Button className="w-fit" type="button" variant={isOwner ? "brand" : "lightBrand"} size="sm" onClick={() => setTransferOpen(true)}>
              Transfer ownership…
            </Button>
        ) : null}
      </Stack>

      <TransferOwnershipDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        adminOptions={adminOptions}
        transferTargetId={transferTargetId}
        onTransferTargetChange={setTransferTargetId}
        onConfirm={onTransferConfirm}
        isPending={team.transferOwnership.isPending}
      />
    </WorkspaceDashboardShell>
  );
}
