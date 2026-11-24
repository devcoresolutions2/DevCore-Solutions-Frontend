"use client";

import React, { useState } from "react";
import {
  Eye,
  GitBranch,
  ExternalLink,
  RotateCw,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type {
  BroadcastAccountItem,
  BroadcastPlatformKey,
  SocialBroadcastPostItem,
  SocialMediaAssetItem,
} from "@/lib/api";
import { validateAccountDraft } from "./platformValidation";

interface ChannelPreviewPanelProps {
  accounts: BroadcastAccountItem[];
  selectedPlatforms: BroadcastPlatformKey[];
  baseContent: string;
  platformContent: Record<string, string>;
  variables: Record<string, string>;
  media: SocialMediaAssetItem[];
  recentBroadcasts: SocialBroadcastPostItem[];
  onCancelBroadcast: (id: string) => void;
  onRetryBroadcast: (id: string) => void;
}

export default function ChannelPreviewPanel({
  accounts,
  selectedPlatforms,
  baseContent,
  platformContent,
  variables,
  media,
  recentBroadcasts,
  onCancelBroadcast,
  onRetryBroadcast,
}: ChannelPreviewPanelProps) {
  const previewCandidates = accounts.filter((a) =>
    selectedPlatforms.length > 0 ? selectedPlatforms.includes(a.platform) : a.rules.supportsPublish,
  );

  const [activeTab, setActiveTab] = useState<BroadcastPlatformKey>(
    previewCandidates[0]?.platform || "TWITTER_X",
  );

  const activeAccount =
    previewCandidates.find((a) => a.platform === activeTab) ||
    previewCandidates[0] ||
    accounts[0];

  const rawText = activeAccount
    ? (platformContent[activeAccount.platform]?.trim()
        ? platformContent[activeAccount.platform]!
        : baseContent)
    : baseContent;

  const validation = activeAccount
    ? validateAccountDraft(activeAccount, rawText, variables, media)
    : null;

  return (
    <div className="space-y-6 xl:sticky xl:top-6">
      {/* Simulated Channel Render */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[var(--brand-primary)]" />
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Simulated Channel Render
            </h2>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
            SIMULATED PREVIEW
          </span>
        </div>

        {/* Platform Tabs */}
        {previewCandidates.length > 0 && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-elevated)] overflow-x-auto">
            {previewCandidates.map((acc) => (
              <button
                key={acc.platform}
                type="button"
                onClick={() => setActiveTab(acc.platform)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeAccount?.platform === acc.platform
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {acc.displayName}
              </button>
            ))}
          </div>
        )}

        {/* Preview Card */}
        {activeAccount && validation ? (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {activeAccount.avatarUrl ? (
                  <img
                    src={activeAccount.avatarUrl}
                    alt={activeAccount.accountName || activeAccount.displayName}
                    className="w-9 h-9 rounded-full object-cover border border-[var(--border-subtle)]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {(activeAccount.accountName || activeAccount.displayName).slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {activeAccount.accountName || `${activeAccount.displayName} (Not Connected)`}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-tertiary)] truncate">
                    {activeAccount.accountHandle || activeAccount.status}
                  </div>
                </div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                {validation.charCount} / {validation.maxChars}
              </span>
            </div>

            <div className="text-xs text-[var(--text-primary)] whitespace-pre-wrap break-words leading-relaxed min-h-[56px]">
              {validation.resolvedText.trim() || (
                <span className="text-[var(--text-tertiary)] italic">
                  Draft content will appear here...
                </span>
              )}
            </div>

            {media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {media.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] aspect-video"
                  >
                    {m.resourceType === "video" ? (
                      <video src={m.secureUrl} className="w-full h-full object-cover" controls muted />
                    ) : (
                      <img
                        src={m.secureUrl}
                        alt={m.altText || m.fileName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {validation.errors.length > 0 && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-[11px] text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{validation.errors.join(" ")}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[var(--text-secondary)]">
            Select a channel to inspect its simulated preview.
          </div>
        )}
      </section>

      {/* Dispatch Execution Pipeline (Real DB Broadcasts & Delivery Logs) */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--brand-primary)]" />
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Dispatch Execution Pipeline
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
            {recentBroadcasts.length} recent
          </span>
        </div>

        {recentBroadcasts.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--text-secondary)]">
            No broadcasts dispatched or scheduled yet.
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {recentBroadcasts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold">
                    {post.status}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                    {post.status === "SCHEDULED" && post.scheduledFor
                      ? `Scheduled: ${new Date(post.scheduledFor).toLocaleString()}`
                      : new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                  {post.baseContent}
                </p>

                {post.deliveryLogs.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-[var(--border-subtle)]">
                    {post.deliveryLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between gap-2 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {log.status === "SUCCESS" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          )}
                          <span className="font-medium text-[var(--text-primary)]">
                            {log.platform}
                          </span>
                          {log.error?.message && (
                            <span className="text-rose-500 truncate">
                              · {log.error.message}
                            </span>
                          )}
                        </div>
                        {log.externalUrl && (
                          <a
                            href={log.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-0.5 text-[var(--brand-primary)] hover:underline shrink-0"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  {post.status === "SCHEDULED" && (
                    <button
                      type="button"
                      onClick={() => onCancelBroadcast(post.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:underline"
                    >
                      <Clock className="w-3 h-3" /> Cancel Schedule
                    </button>
                  )}
                  {(post.status === "FAILED" || post.status === "PARTIAL_FAILED") && (
                    <button
                      type="button"
                      onClick={() => onRetryBroadcast(post.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--brand-primary)] hover:underline"
                    >
                      <RotateCw className="w-3 h-3" /> Retry Dispatch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
