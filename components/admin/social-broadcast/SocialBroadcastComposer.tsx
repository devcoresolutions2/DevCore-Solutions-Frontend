"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Share2,
  Send,
  CalendarClock,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import {
  apiCancelScheduledBroadcast,
  apiCreateBroadcast,
  apiGetBroadcastContext,
  apiRetryBroadcast,
  type BroadcastContextResponse,
  type BroadcastPlatformKey,
  type SocialMediaAssetItem,
} from "@/lib/api";
import BroadcastEditor from "./BroadcastEditor";
import MediaUploader from "./MediaUploader";
import ChannelPreviewPanel from "./ChannelPreviewPanel";
import BroadcastConfirmModal from "./BroadcastConfirmModal";
import { validateAccountDraft } from "./platformValidation";

const TIMEZONES = [
  "UTC",
  "Asia/Dhaka",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
];

export default function SocialBroadcastComposer() {
  const [context, setContext] = useState<BroadcastContextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState<BroadcastPlatformKey[]>([]);
  const [activeScope, setActiveScope] = useState<"MASTER" | BroadcastPlatformKey>("MASTER");
  const [baseContent, setBaseContent] = useState("");
  const [platformContent, setPlatformContent] = useState<Record<string, string>>({});
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [media, setMedia] = useState<SocialMediaAssetItem[]>([]);

  const [timingMode, setTimingMode] = useState<"IMMEDIATE" | "SCHEDULE">("IMMEDIATE");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("14:00");
  const [timezone, setTimezone] = useState("UTC");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadContext = useCallback(async () => {
    setError(null);
    try {
      const res = await apiGetBroadcastContext();
      setContext(res);
      setVariables((prev) => ({ ...res.defaultVariables, ...prev }));
      setSelectedPlatforms((prev) =>
        prev.length > 0
          ? prev
          : res.accounts.filter((a) => a.canPublish).map((a) => a.platform),
      );
    } catch (err: any) {
      setError(err?.message || "Failed to load broadcast composer context.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContext();
  }, [loadContext]);

  const accounts = context?.accounts || [];
  const publishableAccounts = useMemo(() => accounts.filter((a) => a.canPublish), [accounts]);
  const selectedAccounts = useMemo(
    () => accounts.filter((a) => selectedPlatforms.includes(a.platform)),
    [accounts, selectedPlatforms],
  );
  const skippedAccounts = useMemo(
    () => accounts.filter((a) => !selectedPlatforms.includes(a.platform)),
    [accounts, selectedPlatforms],
  );

  const targetValidations = useMemo(() => {
    return selectedAccounts.map((acc) => {
      const raw =
        platformContent[acc.platform]?.trim()
          ? platformContent[acc.platform]!
          : baseContent;
      const v = validateAccountDraft(acc, raw, variables, media);
      return { account: acc, ...v };
    });
  }, [selectedAccounts, platformContent, baseContent, variables, media]);

  const togglePlatform = (platform: BroadcastPlatformKey) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

  const computeScheduledIso = (): string | null => {
    if (timingMode !== "SCHEDULE" || !scheduleDate || !scheduleTime) return null;
    const localDt = new Date(`${scheduleDate}T${scheduleTime}:00`);
    if (Number.isNaN(localDt.getTime())) return null;
    return localDt.toISOString();
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    setBanner(null);
    try {
      await apiCreateBroadcast({
        baseContent,
        platformContent,
        variables,
        targetPlatforms: selectedPlatforms,
        mediaAssetIds: media.map((m) => m.id),
        mode: "DRAFT",
      });
      await loadContext();
      setBanner({ type: "success", text: "Broadcast draft saved to PostgreSQL." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to save draft." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDispatch = async () => {
    setSubmitting(true);
    setBanner(null);
    try {
      const scheduledFor = computeScheduledIso() || undefined;
      const res = await apiCreateBroadcast({
        baseContent,
        platformContent,
        variables,
        targetPlatforms: selectedPlatforms,
        mediaAssetIds: media.map((m) => m.id),
        mode: timingMode,
        scheduledFor,
        timezone,
      });
      setConfirmOpen(false);
      await loadContext();
      setBanner({
        type: res.broadcast.status === "FAILED" ? "error" : "success",
        text:
          timingMode === "SCHEDULE"
            ? `Broadcast scheduled (${res.broadcast.status}).`
            : `Broadcast executed with status: ${res.broadcast.status}.`,
      });
    } catch (err: any) {
      setConfirmOpen(false);
      setBanner({ type: "error", text: err?.message || "Broadcast dispatch failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSchedule = async (id: string) => {
    try {
      await apiCancelScheduledBroadcast(id);
      await loadContext();
      setBanner({ type: "success", text: "Scheduled broadcast cancelled." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to cancel schedule." });
    }
  };

  const handleRetryBroadcast = async (id: string) => {
    try {
      const res = await apiRetryBroadcast(id);
      await loadContext();
      setBanner({
        type: res.broadcast.status === "FAILED" ? "error" : "success",
        text: `Retry finished with status: ${res.broadcast.status}.`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Retry failed." });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 h-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          <div className="xl:col-span-5 h-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
        </div>
      </div>
    );
  }

  if (error || !context) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center space-y-3">
        <AlertTriangle className="w-6 h-6 text-rose-500 mx-auto" />
        <p className="text-sm text-[var(--text-primary)]">{error || "Unable to load composer."}</p>
        <button
          type="button"
          onClick={() => void loadContext()}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] mb-1">
            <span>ADMIN / GROWTH / SOCIAL BROADCAST</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Create Social Broadcast
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Compose, adapt, validate, and publish or schedule multi-channel dispatches across connected accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/social"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            Manage Channels ({publishableAccounts.length} / {accounts.length} Ready)
          </Link>
          <button
            type="button"
            onClick={() => void loadContext()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
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
          <div className="flex items-center gap-2">
            {banner.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{banner.text}</span>
          </div>
          <button type="button" onClick={() => setBanner(null)} className="underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 7 cols */}
        <div className="xl:col-span-7 space-y-6">
          {/* 1. Target Distribution Channels */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[var(--brand-primary)]" />
                <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                  Target Distribution Channels
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPlatforms(publishableAccounts.map((a) => a.platform))}
                  className="text-[var(--brand-primary)] hover:underline font-medium"
                >
                  Select All Connected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlatforms([])}
                  className="text-[var(--text-secondary)] hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {publishableAccounts.length === 0 && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between gap-3">
                <span>
                  No social accounts are currently authorized for publishing. Connect an account in Social Channel Connections first.
                </span>
                <Link
                  href="/admin/social"
                  className="inline-flex items-center gap-1 font-semibold underline shrink-0"
                >
                  Connect <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {accounts.map((acc) => {
                const checked = selectedPlatforms.includes(acc.platform);
                return (
                  <label
                    key={acc.platform}
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border transition-all ${
                      acc.canPublish
                        ? checked
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 cursor-pointer"
                          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] cursor-pointer hover:border-[var(--border-strong)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 opacity-65 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        disabled={!acc.canPublish}
                        checked={checked}
                        onChange={() => togglePlatform(acc.platform)}
                        className="w-4 h-4 accent-[var(--brand-primary)]"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {acc.displayName}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--text-secondary)] truncate">
                          {acc.canPublish
                            ? acc.accountHandle || acc.accountName || acc.status
                            : acc.publishBlockReason || acc.status}
                        </div>
                      </div>
                    </div>
                    {!acc.canPublish ? (
                      <Link
                        href="/admin/social"
                        className="text-[10px] font-mono text-[var(--brand-primary)] underline shrink-0"
                      >
                        {acc.status === "NOT_CONFIGURED" ? "Setup" : "Reconnect"}
                      </Link>
                    ) : (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        {acc.status}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          {/* 2. Master Dispatch Payload Editor */}
          <BroadcastEditor
            baseContent={baseContent}
            platformContent={platformContent}
            activeScope={activeScope}
            selectedAccounts={selectedAccounts}
            allowedVariables={context.allowedVariables}
            aiStatus={context.aiStatus}
            onChangeScope={setActiveScope}
            onChangeBase={setBaseContent}
            onChangeOverride={(platform, text) =>
              setPlatformContent((prev) => ({ ...prev, [platform]: text }))
            }
            onClearOverride={(platform) =>
              setPlatformContent((prev) => {
                const copy = { ...prev };
                delete copy[platform];
                return copy;
              })
            }
          />

          {/* Controlled Variables Configuration */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              Controlled Template Variables
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {context.allowedVariables.map((v) => (
                <div key={v}>
                  <label className="block font-mono text-[10px] text-[var(--text-tertiary)] mb-1">
                    {`{{${v}}}`}
                  </label>
                  <input
                    type="text"
                    value={variables[v] || ""}
                    onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 3. Live Per-Network Character Counters */}
          {targetValidations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {targetValidations.map((tv) => {
                const pct = Math.min(100, Math.round((tv.charCount / tv.maxChars) * 100));
                return (
                  <div
                    key={tv.account.platform}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {tv.account.displayName}
                      </span>
                      <span className={tv.valid ? "text-[var(--brand-primary)]" : "text-rose-500 font-bold"}>
                        {tv.charCount} / {tv.maxChars}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          tv.valid ? "bg-[var(--brand-primary)]" : "bg-rose-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)]">
                      {tv.valid
                        ? `${tv.maxChars - tv.charCount} chars remaining`
                        : tv.errors[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. Cloudinary Media Uploader */}
          <MediaUploader assets={media} onChange={setMedia} />

          {/* 5. Execution Timing & Actions */}
          <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[var(--brand-primary)]" />
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Execution Timing
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] cursor-pointer">
                <input
                  type="radio"
                  name="timing"
                  checked={timingMode === "IMMEDIATE"}
                  onChange={() => setTimingMode("IMMEDIATE")}
                  className="mt-1 accent-[var(--brand-primary)]"
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    Publish Immediately
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Validates tokens & dispatches to selected provider APIs immediately.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] cursor-pointer">
                <input
                  type="radio"
                  name="timing"
                  checked={timingMode === "SCHEDULE"}
                  onChange={() => setTimingMode("SCHEDULE")}
                  className="mt-1 accent-[var(--brand-primary)]"
                />
                <div className="w-full space-y-2">
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    Schedule Broadcast (Durable Worker)
                  </div>
                  {timingMode === "SCHEDULE" && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px]"
                      />
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px]"
                      />
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="col-span-2 px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px]"
                      >
                        {TIMEZONES.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBaseContent("");
                    setPlatformContent({});
                    setMedia([]);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Form
                </button>
                <button
                  type="button"
                  disabled={submitting || (!baseContent.trim() && media.length === 0)}
                  onClick={() => void handleSaveDraft()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" /> Save as Draft
                </button>
              </div>

              <button
                type="button"
                disabled={selectedPlatforms.length === 0 || submitting}
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                {timingMode === "SCHEDULE"
                  ? `Schedule for ${selectedPlatforms.length} Channel${selectedPlatforms.length === 1 ? "" : "s"}`
                  : `Publish Broadcast to ${selectedPlatforms.length} Channel${selectedPlatforms.length === 1 ? "" : "s"}`}
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: 5 cols */}
        <div className="xl:col-span-5">
          <ChannelPreviewPanel
            accounts={accounts}
            selectedPlatforms={selectedPlatforms}
            baseContent={baseContent}
            platformContent={platformContent}
            variables={variables}
            media={media}
            recentBroadcasts={context.recentBroadcasts}
            onCancelBroadcast={(id) => void handleCancelSchedule(id)}
            onRetryBroadcast={(id) => void handleRetryBroadcast(id)}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <BroadcastConfirmModal
        open={confirmOpen}
        submitting={submitting}
        mode={timingMode}
        scheduledDisplay={
          timingMode === "SCHEDULE" && scheduleDate
            ? `${scheduleDate} ${scheduleTime} (${timezone})`
            : null
        }
        targets={targetValidations}
        skippedAccounts={skippedAccounts}
        media={media}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmDispatch()}
      />
    </div>
  );
}
