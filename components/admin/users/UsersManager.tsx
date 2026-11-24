"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  UserPlus,
  Download,
  RefreshCw,
  Search,
  Shield,
  LogOut,
  Mail,
  UserX,
  UserCheck,
  X,
} from "lucide-react";
import {
  apiBulkAdminUsers,
  apiChangeUserRole,
  apiGetAdminUserDetail,
  apiInviteAdminUser,
  apiListAdminUsers,
  apiResendUserVerification,
  apiRevokeUserSessions,
  apiToggleUserActive,
  getAdminUsersExportUrl,
  type AdminUserRecord,
  type AdminUsersListResponse,
} from "@/lib/api";
import { UserAvatar } from "@/components/shared/UserAvatar";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";

function UsersManagerInner() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") || "directory";
  const activeTab =
    rawTab === "invitations" || rawTab === "roles" ? rawTab : "directory";

  const [data, setData] = useState<AdminUsersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Invite Modal
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [inviteMsg, setInviteMsg] = useState("");
  const [inviting, setInviting] = useState(false);

  // Detail Drawer
  const [selectedUser, setSelectedUser] = useState<Awaited<ReturnType<typeof apiGetAdminUserDetail>> | null>(null);

  // Bulk Selection & Confirm Dialog
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const res = await apiListAdminUsers({
        page,
        limit,
        search: search.trim() || undefined,
        role: roleFilter,
        status: statusFilter,
      });
      setData(res);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load user directory." });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, statusFilter]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await apiInviteAdminUser({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        message: inviteMsg.trim() || undefined,
      });
      setInviteOpen(false);
      setInviteName("");
      setInviteEmail("");
      setInviteMsg("");
      await loadUsers();
      setBanner({
        type: "success",
        text: res.emailDelivered
          ? `Invitation sent via SMTP to ${res.invitation.email}.`
          : `Invitation recorded for ${res.invitation.email} (SMTP delivery failed).`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to invite user." });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (u: AdminUserRecord, nextRole: string) => {
    try {
      await apiChangeUserRole(u.id, nextRole);
      await loadUsers();
      setBanner({ type: "success", text: `Updated ${u.name}'s role to ${nextRole}.` });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Role change failed." });
    }
  };

  const handleToggleActive = async (u: AdminUserRecord) => {
    try {
      await apiToggleUserActive(u.id, !u.isActive);
      await loadUsers();
      setBanner({
        type: "success",
        text: u.isActive
          ? `Deactivated ${u.name} and revoked active sessions.`
          : `Reactivated ${u.name}.`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Status update failed." });
    }
  };

  const handleRevokeSessions = async (u: AdminUserRecord) => {
    try {
      const res = await apiRevokeUserSessions(u.id);
      await loadUsers();
      setBanner({
        type: "success",
        text: `Revoked ${res.revokedCount} active session(s) for ${u.name}.`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to revoke sessions." });
    }
  };

  const handleResendVerification = async (u: AdminUserRecord) => {
    try {
      const res = await apiResendUserVerification(u.id);
      setBanner({
        type: res.sent ? "success" : "error",
        text: res.sent
          ? `Verification email sent to ${u.email}.`
          : "SMTP delivery failed for verification email.",
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to resend verification." });
    }
  };

  const openDetails = async (id: string) => {
    try {
      const detail = await apiGetAdminUserDetail(id);
      setSelectedUser(detail);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load user details." });
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[var(--text-tertiary)] uppercase mb-1">
            Admin / Administration / Users & IAM
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Users & Identity Access Management
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage registered accounts, RBAC roles, SMTP invitations, and active sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/audit-log"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            <Shield className="w-3.5 h-3.5" />
            Audit RBAC Policy
          </Link>
          <a
            href={getAdminUsersExportUrl()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export User Directory
          </a>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite New User
          </button>
        </div>
      </div>

      {banner && (
        <div
          className={`rounded-2xl border p-3.5 text-xs flex items-center justify-between gap-3 ${
            banner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
          }`}
        >
          <span>{banner.text}</span>
          <button type="button" onClick={() => setBanner(null)} className="underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-navigation Tabs synced with Sidebar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <Link
          href="/admin/users"
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "directory"
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          User Directory
          {data && (
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/15 text-[10px] font-mono">
              {data.stats.totalUsers}
            </span>
          )}
        </Link>
        <Link
          href="/admin/users?tab=invitations"
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "invitations"
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          User Invitations
          {data && (
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/15 text-[10px] font-mono">
              {data.stats.pendingInvitationsCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/users?tab=roles"
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === "roles"
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Roles &amp; Access
        </Link>
      </div>

      {activeTab === "invitations" ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Pending SMTP Invitations</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Single-use onboarding tokens awaiting signup acceptance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Send Invitation
            </button>
          </div>
          {!data || data.pendingInvitations.length === 0 ? (
            <div className="p-10 text-center text-xs text-[var(--text-secondary)]">
              No pending invitations. Use &ldquo;Send Invitation&rdquo; to onboard an admin or editor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-elevated)] text-[var(--text-tertiary)] font-mono uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Invitee</th>
                    <th className="px-4 py-3">Assigned Role</th>
                    <th className="px-4 py-3">Sent</th>
                    <th className="px-4 py-3">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {data.pendingInvitations.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[var(--bg-elevated)]/40">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[var(--text-primary)]">{inv.name}</div>
                        <div className="text-[11px] text-[var(--text-tertiary)] font-mono">{inv.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                          {inv.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {new Date(inv.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {new Date(inv.expiresAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === "roles" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              role: "SUPER_ADMIN",
              title: "Super Administrator",
              desc: "Full platform authority across IAM, RBAC role changes, Platform Settings, Social OAuth, and Audit Logs.",
              perms: [
                "Manage Users, Invitations & Roles",
                "Edit Platform Settings & Integrations",
                "Publish & Manage Social Broadcasts",
                "Full CMS & Media Library Access",
              ],
            },
            {
              role: "EDITOR",
              title: "Content & Growth Editor",
              desc: "Operational access to Content CMS, Media Library, Leads Pipeline, and Social Broadcasts.",
              perms: [
                "Create & Edit Blog, Jobs, Services, About CMS",
                "Upload & Manage Media Library Assets",
                "Manage Leads & Social Broadcasts",
                "No IAM Role Mutation or Settings Write",
              ],
            },
            {
              role: "USER",
              title: "Standard Account",
              desc: "Authenticated public/portal user with zero access to /admin routes (enforced by 403 policy).",
              perms: [
                "Manage Own Account & Password",
                "Blocked from /admin/* APIs (403 Forbidden)",
                "Upgradeable via Super Admin IAM",
              ],
            },
          ].map((card) => (
            <div
              key={card.role}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)]">
                    {card.role}
                  </span>
                  <Shield className="w-4 h-4 text-[var(--text-tertiary)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{card.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
                <ul className="pt-2 space-y-1.5 text-xs text-[var(--text-primary)]">
                  {card.perms.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/admin/users"
                onClick={() => {
                  setRoleFilter(card.role);
                  setPage(1);
                }}
                className="inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
              >
                View {card.role} Accounts in Directory
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <>

      {/* Real Summary Stats */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">Total Users</div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {data.stats.totalUsers}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Registered in PostgreSQL
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">Active Today</div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {data.stats.activeToday}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Successful logins today (UTC)
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">
              Pending Verification
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-500">
              {data.stats.pendingVerification}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Awaiting email verification
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">
              Pending Invitations
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {data.stats.pendingInvitationsCount}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Active single-use invite links
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="CLIENT">CLIENT</option>
            <option value="USER">USER</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            <option value="ALL">All States</option>
            <option value="ACTIVE">Active & Verified</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      {selectedIds.length > 0 && (
        <div className="rounded-2xl border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-[var(--text-primary)]">
            {selectedIds.length} user(s) selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setConfirmState({
                  open: true,
                  title: "Revoke Sessions for Selected Users",
                  description: `Immediately invalidate active sessions for ${selectedIds.length} selected user(s).`,
                  confirmLabel: "Revoke Sessions",
                  onConfirm: async () => {
                    const r = await apiBulkAdminUsers({
                      userIds: selectedIds,
                      action: "REVOKE_SESSIONS",
                    });
                    setSelectedIds([]);
                    await loadUsers();
                    setBanner({
                      type: "success",
                      text: `Revoked sessions for ${r.succeeded} user(s).`,
                    });
                  },
                })
              }
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-medium"
            >
              Revoke Sessions
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmState({
                  open: true,
                  title: "Deactivate Selected Users",
                  description: `Deactivate ${selectedIds.length} user(s) and revoke all active sessions. Protected accounts will be skipped.`,
                  confirmLabel: "Deactivate Selected",
                  onConfirm: async () => {
                    const r = await apiBulkAdminUsers({
                      userIds: selectedIds,
                      action: "DEACTIVATE",
                    });
                    setSelectedIds([]);
                    await loadUsers();
                    setBanner({
                      type: "success",
                      text: `Deactivated ${r.succeeded} user(s)${r.skipped.length ? ` (${r.skipped.length} skipped)` : ""}.`,
                    });
                  },
                })
              }
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 font-semibold"
            >
              Deactivate Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-[var(--text-secondary)] underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        {!data || data.items.length === 0 ? (
          <div className="p-10 text-center text-xs text-[var(--text-secondary)]">
            No users match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-tertiary)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-3 w-9">
                    <input
                      type="checkbox"
                      checked={data.items.length > 0 && selectedIds.length === data.items.length}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? data.items.map((x) => x.id) : [])
                      }
                    />
                  </th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Verification / Status</th>
                  <th className="px-4 py-3">Last Sign-In</th>
                  <th className="px-4 py-3">Active Sessions</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {data.items.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-elevated)]/40">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(u.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void openDetails(u.id)}
                        className="flex items-center gap-2.5 text-left"
                      >
                        <UserAvatar
                          name={u.name}
                          avatarUrl={u.avatarUrl}
                          size={64}
                          className="w-8 h-8"
                          textClassName="text-xs"
                        />
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] hover:underline">
                            {u.name}
                          </div>
                          <div className="font-mono text-[11px] text-[var(--text-secondary)]">
                            {u.email}
                          </div>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => void handleRoleChange(u, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px]"
                      >
                        <option value="USER">USER</option>
                        <option value="CLIENT">CLIENT</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            !u.isActive
                              ? "bg-rose-500/10 text-rose-500"
                              : u.emailVerified
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {!u.isActive
                            ? "Deactivated"
                            : u.emailVerified
                              ? "Verified"
                              : "Pending Verification"}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                        Provider: {u.authProvider}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-secondary)]">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-primary)]">
                      {u.activeSessionCount} active
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {!u.emailVerified && u.isActive && (
                        <button
                          type="button"
                          onClick={() => void handleResendVerification(u)}
                          className="p-1.5 rounded-lg text-[var(--brand-primary)] hover:bg-[var(--bg-elevated)]"
                          title="Resend Verification Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {u.activeSessionCount > 0 && (
                        <button
                          type="button"
                          onClick={() => void handleRevokeSessions(u)}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-[var(--bg-elevated)]"
                          title="Revoke All Sessions"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleToggleActive(u)}
                        className={`p-1.5 rounded-lg ${
                          u.isActive
                            ? "text-rose-500 hover:bg-rose-500/10"
                            : "text-emerald-500 hover:bg-emerald-500/10"
                        }`}
                        title={u.isActive ? "Deactivate User" : "Reactivate User"}
                      >
                        {u.isActive ? (
                          <UserX className="w-3.5 h-3.5" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && (
          <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span>
                Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} users)
              </span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--brand-primary)]" />
                Invite New User via SMTP
              </h3>
              <button type="button" onClick={() => setInviteOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-tertiary)]" />
              </button>
            </div>
            <form onSubmit={(e) => void handleInvite(e)} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono"
                >
                  <option value="USER">USER</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Optional Message
                </label>
                <textarea
                  rows={2}
                  value={inviteMsg}
                  onChange={(e) => setInviteMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="px-3 py-2 rounded-xl text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white font-semibold"
                >
                  {inviting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-[var(--text-primary)]">
                {selectedUser.user.name}
              </h3>
              <button type="button" onClick={() => setSelectedUser(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs space-y-2 rounded-xl bg-[var(--bg-elevated)] p-4 border border-[var(--border-subtle)]">
              <div>Email: {selectedUser.user.email}</div>
              <div>Role: {selectedUser.user.role}</div>
              <div>Permissions: {selectedUser.user.permissions.join(", ")}</div>
              <div>
                Created: {new Date(selectedUser.user.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[var(--text-primary)]">
                Active Sessions ({selectedUser.user.sessions.length})
              </div>
              {selectedUser.user.sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] space-y-0.5"
                >
                  <div>IP: {s.ip || "Unknown"}</div>
                  <div className="truncate text-[var(--text-tertiary)]">
                    {s.userAgent || "Unknown agent"}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[var(--text-primary)]">
                Recent Audit Events ({selectedUser.auditLogs.length})
              </div>
              {selectedUser.auditLogs.map((a) => (
                <div
                  key={a.id}
                  className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] flex justify-between"
                >
                  <span className="font-mono">{a.action}</span>
                  <span className="text-[var(--text-tertiary)]">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmState?.open)}
        title={confirmState?.title || ""}
        description={confirmState?.description || ""}
        confirmLabel={confirmState?.confirmLabel || "Confirm"}
        loading={confirmBusy}
        onCancel={() => setConfirmState(null)}
        onConfirm={async () => {
          if (!confirmState) return;
          setConfirmBusy(true);
          try {
            await confirmState.onConfirm();
            setConfirmState(null);
          } catch (err: any) {
            setBanner({ type: "error", text: err?.message || "Action failed." });
            setConfirmState(null);
          } finally {
            setConfirmBusy(false);
          }
        }}
      />
    </div>
  );
}

export default function UsersManager() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
          Loading user management...
        </div>
      }
    >
      <UsersManagerInner />
    </Suspense>
  );
}
