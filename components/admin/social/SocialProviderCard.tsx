"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Link2,
  Unlink,
  ShieldCheck,
  AlertTriangle,
  Power,
  ChevronDown,
  ChevronUp,
  Clock,
  KeyRound,
  Ban,
} from "lucide-react";
import type { SocialChannelItem, SocialChannelStatus } from "@/lib/api";

interface SocialProviderCardProps {
  channel: SocialChannelItem;
  busyKey: string | null;
  onConnect: (key: string) => void;
  onSync: (key: string) => void;
  onToggle: (key: string) => void;
  onDisconnect: (key: string) => void;
}

const STATUS_BADGE: Record<
  SocialChannelStatus,
  { label: string; classes: string; dotClass: string }
> = {
  CONNECTED: {
    label: "Connected",
    classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  EXPIRING_SOON: {
    label: "Expiring Soon",
    classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  EXPIRED: {
    label: "Expired",
    classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
  REAUTH_REQUIRED: {
    label: "Reauth Required",
    classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
  ERROR: {
    label: "Error",
    classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
  DISABLED: {
    label: "Disabled",
    classes: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
  DISCONNECTED: {
    label: "Disconnected",
    classes: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
    dotClass: "bg-[var(--text-tertiary)]",
  },
  NOT_CONFIGURED: {
    label: "Not Configured",
    classes: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  UNAVAILABLE: {
    label: "API Unavailable",
    classes: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
};

function ProviderBrandIcon({ channelKey }: { channelKey: SocialChannelItem["key"] }) {
  switch (channelKey) {
    case "linkedin":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center font-bold text-sm border border-[#0A66C2]/20">
          in
        </div>
      );
    case "x":
      return (
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center font-bold text-base border border-[var(--border-subtle)]">
          𝕏
        </div>
      );
    case "meta":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#0668E1]/10 text-[#0668E1] flex items-center justify-center font-bold text-sm border border-[#0668E1]/20">
          ∞
        </div>
      );
    case "youtube":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center font-bold text-xs border border-[#FF0000]/20">
          ▶
        </div>
      );
    case "reddit":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#FF4500]/10 text-[#FF4500] flex items-center justify-center font-bold text-sm border border-[#FF4500]/20">
          r/
        </div>
      );
    case "glassdoor":
      return (
        <div className="w-10 h-10 rounded-xl bg-[#0CAA41]/10 text-[#0CAA41] flex items-center justify-center font-bold text-sm border border-[#0CAA41]/20">
          gd
        </div>
      );
  }
}

export default function SocialProviderCard({
  channel,
  busyKey,
  onConnect,
  onSync,
  onToggle,
  onDisconnect,
}: SocialProviderCardProps) {
  const [showScopes, setShowScopes] = useState(false);
  const badge = STATUS_BADGE[channel.status];
  const isBusy = busyKey === channel.key;
  const hasToken =
    channel.status === "CONNECTED" ||
    channel.status === "EXPIRING_SOON" ||
    channel.status === "EXPIRED" ||
    channel.status === "REAUTH_REQUIRED" ||
    channel.status === "ERROR" ||
    channel.status === "DISABLED";

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between transition-all hover:border-[var(--border-strong)]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <ProviderBrandIcon channelKey={channel.key} />
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] truncate">
                {channel.displayName}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">{channel.subtitle}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shrink-0 ${badge.classes}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
            {badge.label}
          </span>
        </div>

        {/* Account / Configuration Details */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-2.5 text-xs">
          {!channel.apiSupported ? (
            <div className="rounded-xl bg-[var(--bg-elevated)] p-3 text-[var(--text-secondary)] flex items-start gap-2">
              <Ban className="w-4 h-4 shrink-0 mt-0.5 text-[var(--text-tertiary)]" />
              <span>{channel.unavailableReason}</span>
            </div>
          ) : !channel.configured ? (
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-300">
                <KeyRound className="w-3.5 h-3.5" />
                Provider Credentials Not Configured
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Add the following environment variables on the backend server to enable OAuth:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {channel.requiredEnvKeys.map((envKey) => (
                  <code
                    key={envKey}
                    className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-primary)]"
                  >
                    {envKey}
                  </code>
                ))}
              </div>
            </div>
          ) : hasToken ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--text-tertiary)]">Connected Account</span>
                <span className="font-medium text-[var(--text-primary)] truncate">
                  {channel.accountName || "Verified Account"}
                  {channel.accountHandle ? ` (${channel.accountHandle})` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--text-tertiary)]">Last Sync</span>
                <span className="font-mono text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {channel.lastSyncAt
                    ? new Date(channel.lastSyncAt).toLocaleString()
                    : "Never"}
                  {channel.lastLatencyMs !== null ? ` · ${channel.lastLatencyMs}ms` : ""}
                </span>
              </div>
              {channel.tokenExpiresAt && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--text-tertiary)]">Token Expiry</span>
                  <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                    {new Date(channel.tokenExpiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {channel.lastError && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{channel.lastError}</span>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl bg-[var(--bg-elevated)] p-3 text-[var(--text-secondary)] flex items-center justify-between">
              <span>OAuth configured & ready</span>
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                {channel.apiLabel}
              </span>
            </div>
          )}

          {/* Expandable Scopes */}
          {channel.apiSupported && (
            <div>
              <button
                type="button"
                onClick={() => setShowScopes((s) => !s)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Permissions & Scopes ({(channel.scopes.length || channel.defaultScopes.length)})
                {showScopes ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {showScopes && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(channel.scopes.length > 0 ? channel.scopes : channel.defaultScopes).map(
                    (scope) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                      >
                        {scope}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
        {!channel.apiSupported ? (
          <span className="text-[11px] text-[var(--text-tertiary)]">
            No OAuth integration available
          </span>
        ) : !hasToken ? (
          <button
            type="button"
            disabled={!channel.configured || isBusy}
            onClick={() => onConnect(channel.key)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Link2 className="w-3.5 h-3.5" />
            {isBusy ? "Redirecting..." : channel.configured ? "Connect OAuth" : "Configure Env First"}
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onSync(channel.key)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? "animate-spin" : ""}`} />
              Sync
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onConnect(channel.key)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] disabled:opacity-50 transition-all"
            >
              <Link2 className="w-3.5 h-3.5" />
              Reconnect
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onToggle(channel.key)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] disabled:opacity-50 transition-all"
            >
              <Power className="w-3.5 h-3.5" />
              {channel.isActive ? "Disable" : "Enable"}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onDisconnect(channel.key)}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 disabled:opacity-50 transition-all"
              title="Disconnect and revoke stored token"
            >
              <Unlink className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}
