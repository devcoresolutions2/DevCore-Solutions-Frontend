"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  KeyRound,
  Link2,
  MonitorSmartphone,
  History,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  apiGetAccountOverview,
  apiGetSessions,
  apiGetAuditEvents,
  type AccountOverviewResponse,
  type AccountSessionItem,
  type AccountAuditEventItem,
  type AccountProfile,
} from "@/lib/api";
import { ProfileSection } from "@/components/account/ProfileSection";
import { SecurityPasswordSection } from "@/components/account/SecurityPasswordSection";
import { ConnectedProvidersSection } from "@/components/account/ConnectedProvidersSection";
import { ActiveSessionsSection } from "@/components/account/ActiveSessionsSection";
import { AuditTracesSection } from "@/components/account/AuditTracesSection";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "security" | "providers" | "sessions" | "audit";

const NAV_ITEMS: {
  key: SettingsTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { key: "profile", label: "Profile & Identity", icon: BadgeCheck },
  { key: "security", label: "Security & Passwords", icon: KeyRound },
  { key: "providers", label: "Connected Providers", icon: Link2 },
  { key: "sessions", label: "Active Sessions", icon: MonitorSmartphone },
  { key: "audit", label: "Audit Traces", icon: History },
];

function AccountSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, loading: authLoading, setUser: setGlobalUser } = useAuth();

  const initialTabParam = searchParams.get("tab") as SettingsTab | null;
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    initialTabParam && NAV_ITEMS.some((i) => i.key === initialTabParam)
      ? initialTabParam
      : "profile"
  );

  // Backend data states
  const [overview, setOverview] = useState<AccountOverviewResponse | null>(null);
  const [sessions, setSessions] = useState<AccountSessionItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<AccountAuditEventItem[]>([]);
  const [auditPagination, setAuditPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.replace("/auth/signin?redirect=/account/settings");
    }
  }, [authLoading, authUser, router]);

  // Handle OAuth link callback query params
  useEffect(() => {
    const linked = searchParams.get("linked");
    const err = searchParams.get("error");
    if (linked) {
      toast.success(`${linked.charAt(0).toUpperCase() + linked.slice(1)} account linked successfully.`);
    }
    if (err === "provider_in_use") {
      toast.error("That OAuth account is already connected to a different DevCore user.");
    }
  }, [searchParams]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoadingPage(true);
      setLoadError("");
      const [ov, sess, aud] = await Promise.all([
        apiGetAccountOverview(),
        apiGetSessions(),
        apiGetAuditEvents(1, 15),
      ]);
      setOverview(ov);
      setSessions(sess.sessions || []);
      setAuditEvents(aud.events || []);
      setAuditPagination(aud.pagination);
    } catch (err: any) {
      setLoadError(err.message || "Failed to load account settings.");
    } finally {
      setLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      fetchAllData();
    }
  }, [authUser, fetchAllData]);

  const refreshSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await apiGetSessions();
      setSessions(res.sessions || []);
      if (overview) {
        setOverview({ ...overview, activeSessionsCount: res.sessions.length });
      }
    } catch {
      toast.error("Failed to refresh sessions.");
    } finally {
      setLoadingSessions(false);
    }
  };

  const refreshAudit = async (page = auditPagination.page) => {
    try {
      setLoadingAudit(true);
      const res = await apiGetAuditEvents(page, 15);
      setAuditEvents(res.events || []);
      setAuditPagination(res.pagination);
    } catch {
      toast.error("Failed to refresh security events.");
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleProfileUpdated = (updated: AccountProfile) => {
    if (overview) {
      setOverview({ ...overview, user: updated });
    }
    // Sync global AuthProvider state (updates Navbar avatar, dropdown, and Dashboard)
    setGlobalUser({
      id: updated.id,
      name: updated.name,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      emailVerified: updated.emailVerified,
      avatarUrl: updated.avatarUrl,
      hasPassword: updated.hasPassword,
    });
    refreshAudit(1);
  };

  const handleTabSelect = (key: SettingsTab) => {
    setActiveTab(key);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", key);
    window.history.replaceState({}, "", url.toString());

    const el = document.getElementById(`section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (authLoading || (!authUser && !loadError)) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="animate-spin text-[var(--brand-primary)]" />
        <p className="font-mono text-xs text-[var(--text-muted)]">Verifying session custody...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Authenticated Identity &amp; Security</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
            Account Settings &amp; Identity Mesh
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Manage your personal information, account security, connected login providers, and active devices.
          </p>
        </div>

        {overview && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {overview.activeSessionsCount} Active Session{overview.activeSessionsCount === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>

      {/* Error State with Retry */}
      {loadError && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display font-semibold text-sm">Unable to load account data</h2>
              <p className="font-mono text-xs mt-1">{loadError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchAllData}
            className="h-10 px-4 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 inline-flex items-center gap-2 shrink-0"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Mobile & Tablet Horizontal Navigation */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTabSelect(key)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap inline-flex items-center gap-2 transition-colors shrink-0 border",
                isActive
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)] shadow-xs"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 sticky top-28">
          <nav
            aria-label="Account settings navigation"
            className="devcore-glass-card rounded-2xl p-3 flex flex-col gap-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-3 py-2">
              Identity &amp; Control
            </span>
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabSelect(key)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all group",
                    isActive
                      ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{label}</span>
                  </span>
                  {key === "sessions" && overview ? (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                      )}
                    >
                      {overview.activeSessionsCount}
                    </span>
                  ) : (
                    <ChevronRight
                      size={14}
                      className={cn(
                        "transition-transform",
                        isActive ? "opacity-90" : "opacity-0 group-hover:opacity-70"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Real Account Summary Widget */}
          {overview && (
            <div className="devcore-glass-card rounded-2xl p-4 space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] block">
                Account Summary
              </span>
              <div className="p-3 rounded-xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Email Status</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {overview.user.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Password</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {overview.user.hasPassword ? "Set" : "OAuth Only"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">OAuth Links</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {overview.providers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Audit Events</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {overview.recentEventsCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Column */}
        <div className="lg:col-span-9 flex flex-col gap-6 sm:gap-8">
          {loadingPage || !overview ? (
            /* Skeleton Loading States */
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="devcore-glass-card rounded-2xl p-8 space-y-4 animate-pulse"
                >
                  <div className="h-6 w-48 rounded bg-[var(--bg-surface)]" />
                  <div className="h-24 w-full rounded-xl bg-[var(--bg-surface)]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-11 rounded-xl bg-[var(--bg-surface)]" />
                    <div className="h-11 rounded-xl bg-[var(--bg-surface)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <ProfileSection
                profile={overview.user}
                onProfileUpdated={handleProfileUpdated}
              />

              <SecurityPasswordSection
                hasPassword={overview.user.hasPassword}
                emailVerified={overview.user.emailVerified}
                activeSessionsCount={overview.activeSessionsCount}
                onPasswordUpdated={() => {
                  fetchAllData();
                }}
              />

              <ConnectedProvidersSection
                email={overview.user.email}
                hasPassword={overview.user.hasPassword}
                providers={overview.providers}
                oauthConfigured={overview.oauthConfigured}
                onProvidersChanged={() => {
                  fetchAllData();
                }}
              />

              <ActiveSessionsSection
                sessions={sessions}
                loading={loadingSessions}
                onRefresh={() => {
                  refreshSessions();
                  refreshAudit(1);
                }}
              />

              <AuditTracesSection
                events={auditEvents}
                pagination={auditPagination}
                loading={loadingAudit}
                onPageChange={(p) => refreshAudit(p)}
                onRefresh={() => refreshAudit(auditPagination.page)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--brand-primary)]" />
        </div>
      }
    >
      <AccountSettingsContent />
    </Suspense>
  );
}
