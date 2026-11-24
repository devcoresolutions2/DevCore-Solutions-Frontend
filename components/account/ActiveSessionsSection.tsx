"use client";

import React, { useState } from "react";
import {
  Laptop,
  Smartphone,
  Terminal,
  RefreshCw,
  Power,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiRevokeSession,
  apiRevokeOtherSessions,
  type AccountSessionItem,
} from "@/lib/api";

interface ActiveSessionsSectionProps {
  sessions: AccountSessionItem[];
  loading: boolean;
  onRefresh: () => void;
}

export function ActiveSessionsSection({
  sessions,
  loading,
  onRefresh,
}: ActiveSessionsSectionProps) {
  const [confirmSessionId, setConfirmSessionId] = useState<string | null>(null);
  const [confirmRevokeOthers, setConfirmRevokeOthers] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [revokingOthers, setRevokingOthers] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  const handleRevokeOne = async (sessionId: string) => {
    try {
      setBusyId(sessionId);
      setErrorMsg("");
      const res = await apiRevokeSession(sessionId);
      if (res.success) {
        toast.success("Session revoked.");
        setConfirmSessionId(null);
        onRefresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to revoke session.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRevokeOthers = async () => {
    try {
      setRevokingOthers(true);
      setErrorMsg("");
      const res = await apiRevokeOtherSessions();
      if (res.success) {
        toast.success(res.message);
        setConfirmRevokeOthers(false);
        onRefresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to revoke other sessions.");
    } finally {
      setRevokingOthers(false);
    }
  };

  const renderDeviceIcon = (deviceType: AccountSessionItem["deviceType"]) => {
    if (deviceType === "mobile") return <Smartphone size={20} />;
    if (deviceType === "cli") return <Terminal size={20} />;
    return <Laptop size={20} />;
  };

  return (
    <section
      id="section-sessions"
      className="devcore-glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 scroll-mt-28"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
            Active Sessions
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Review and sign out of devices currently logged into your account.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="h-9 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          {otherSessionsCount > 0 && (
            <button
              type="button"
              onClick={() => setConfirmRevokeOthers(true)}
              disabled={revokingOthers}
              className="h-9 px-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Power size={13} />
              <span>Sign Out Other Sessions ({otherSessionsCount})</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {confirmRevokeOthers && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-mono text-rose-700 dark:text-rose-300">
            Revoke all {otherSessionsCount} other active session(s)? Those devices will be signed out immediately.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRevokeOthers}
              disabled={revokingOthers}
              className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {revokingOthers && <Loader2 size={12} className="animate-spin" />}
              <span>Confirm Revoke All</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmRevokeOthers(false)}
              disabled={revokingOthers}
              className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-surface)]/50 rounded-xl border border-[var(--border-subtle)]">
          No active sessions found.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                      session.isCurrent
                        ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30 text-[var(--brand-primary)]"
                        : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {renderDeviceIcon(session.deviceType)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-semibold text-sm text-[var(--text-primary)]">
                        {session.browser} on {session.os}
                      </span>
                      {session.isCurrent && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          CURRENT SESSION
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[var(--text-secondary)]">
                      {session.ip && <span>IP: {session.ip}</span>}
                      {session.approxLocation && <span>• {session.approxLocation}</span>}
                      <span>
                        • Last active: {new Date(session.lastActiveAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[var(--text-muted)]">
                      Created: {new Date(session.createdAt).toLocaleString()} • Expires:{" "}
                      {new Date(session.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-center shrink-0">
                  {session.isCurrent ? (
                    <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--brand-primary)] font-semibold">
                      Active Now
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmSessionId(session.id)}
                      disabled={busyId === session.id}
                      className="h-9 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-rose-600 hover:border-rose-500/40 inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              </div>

              {confirmSessionId === session.id && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-mono text-rose-700 dark:text-rose-300">
                    Revoke this session ({session.browser} on {session.os})?
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRevokeOne(session.id)}
                      disabled={busyId === session.id}
                      className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {busyId === session.id && <Loader2 size={12} className="animate-spin" />}
                      <span>Confirm Revoke</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmSessionId(null)}
                      className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
