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
        <div className="w-11 h-11 rounded-xl bg-[#0A66C2]/12 dark:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#3B82F6] flex items-center justify-center border border-[#0A66C2]/20 shrink-0 shadow-xs">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </div>
      );
    case "x":
      return (
        <div className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center border border-[var(--border-subtle)] shrink-0 shadow-xs">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );
    case "meta":
      return (
        <div className="w-11 h-11 rounded-xl bg-[#0668E1]/12 dark:bg-[#0668E1]/20 text-[#0668E1] dark:text-[#60A5FA] flex items-center justify-center border border-[#0668E1]/20 shrink-0 shadow-xs">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
          </svg>
        </div>
      );
    case "youtube":
      return (
        <div className="w-11 h-11 rounded-xl bg-[#FF0000]/10 dark:bg-[#FF0000]/18 text-[#FF0000] dark:text-[#F87171] flex items-center justify-center border border-[#FF0000]/20 shrink-0 shadow-xs">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    case "reddit":
      return (
        <div className="w-11 h-11 rounded-xl bg-[#FF4500]/10 dark:bg-[#FF4500]/18 text-[#FF4500] dark:text-[#FB923C] flex items-center justify-center border border-[#FF4500]/20 shrink-0 shadow-xs">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.8 11.33c.02.16.03.33.03.5 0 2.55-2.97 4.62-6.63 4.62-3.66 0-6.63-2.07-6.63-4.62 0-.17.01-.34.03-.5a1.42 1.42 0 0 1-.57-1.14c0-.79.64-1.43 1.43-1.43.38 0 .73.15.99.4.98-.71 2.33-1.16 3.83-1.22l.72-3.39a.34.34 0 0 1 .4-.26l2.38.5a1.01 1.01 0 0 1 1.93.42c0 .56-.45 1.01-1.01 1.01-.55 0-.99-.44-1.01-.98l-2.12-.45-.64 3.04c1.46.07 2.78.52 3.74 1.21.26-.24.6-.39.98-.39.79 0 1.43.64 1.43 1.43 0 .46-.22.87-.55 1.15zM9.22 12.6a1.01 1.01 0 1 0 0 2.02 1.01 1.01 0 0 0 0-2.02zm5.56 0a1.01 1.01 0 1 0 0 2.02 1.01 1.01 0 0 0 0-2.02zm-5.22 3.45c-.12-.12-.12-.32 0-.44.12-.12.31-.12.43 0 .56.56 1.45.84 2.01.84s1.45-.28 2.01-.84c.12-.12.31-.12.43 0 .12.12.12.32 0 .44-.71.71-1.76 1.02-2.44 1.02-.68 0-1.73-.31-2.44-1.02z" />
          </svg>
        </div>
      );
    case "glassdoor":
      return (
        <div className="w-11 h-11 rounded-xl bg-[#0CAA41]/12 dark:bg-[#0CAA41]/20 text-[#0CAA41] dark:text-[#34D399] flex items-center justify-center border border-[#0CAA41]/20 shrink-0 shadow-xs">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.144 20.572H6.857A3.429 3.429 0 0 1 3.43 17.144V6.857a3.429 3.429 0 0 1 3.428-3.428h10.287v3.428H6.857v10.287h10.287v-5.143h3.428v5.143a3.429 3.429 0 0 1-3.428 3.428zm3.428-13.715h-3.428V3.429h3.428v3.428z" />
          </svg>
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
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between transition-all hover:border-[var(--border-strong)] hover:shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <ProviderBrandIcon channelKey={channel.key} />
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)] truncate leading-tight">
                {channel.displayName}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{channel.subtitle}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shrink-0 whitespace-nowrap ${badge.classes}`}
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
          channel.configured ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onConnect(channel.key)}
              className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Link2 className="w-3.5 h-3.5" />
              {isBusy ? "Redirecting..." : `Connect ${channel.displayName}`}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border border-[var(--border-subtle)] cursor-not-allowed"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Configure Env First
            </button>
          )
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
