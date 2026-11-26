"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, Send, CalendarClock, Info } from "lucide-react";
import type { BroadcastAccountItem, SocialMediaAssetItem } from "@/lib/api";

interface ConfirmTarget {
  account: BroadcastAccountItem;
  valid: boolean;
  charCount: number;
  maxChars: number;
  errors: string[];
  resolvedText: string;
}

interface BroadcastConfirmModalProps {
  open: boolean;
  submitting: boolean;
  mode: "IMMEDIATE" | "SCHEDULE";
  scheduledDisplay: string | null;
  targets: ConfirmTarget[];
  skippedAccounts: BroadcastAccountItem[];
  media: SocialMediaAssetItem[];
  onClose: () => void;
  onConfirm: () => void;
}

export default function BroadcastConfirmModal({
  open,
  submitting,
  mode,
  scheduledDisplay,
  targets,
  skippedAccounts,
  media,
  onClose,
  onConfirm,
}: BroadcastConfirmModalProps) {
  if (!open) return null;

  const allReady = targets.length > 0 && targets.every((t) => t.valid);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              {mode === "SCHEDULE" ? (
                <CalendarClock className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-base text-[var(--text-primary)]">
                {mode === "SCHEDULE" ? "Confirm Scheduled Broadcast" : "Confirm Broadcast Dispatch"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {mode === "SCHEDULE" && scheduledDisplay
                  ? `Scheduled execution: ${scheduledDisplay}`
                  : "Review verified target endpoints before dispatching."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Endpoints */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
            Selected Target Endpoints ({targets.length})
          </div>
          {targets.map((t) => (
            <div
              key={t.account.platform}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--text-primary)]">
                    {t.account.displayName}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-secondary)] truncate">
                    {t.account.accountName || t.account.accountHandle || "Connected Account"}
                  </div>
                </div>
                {t.valid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready ({t.charCount}/{t.maxChars})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Blocked
                  </span>
                )}
              </div>
              {!t.valid && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400">
                  {t.errors.join(" ")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Attached Media Summary */}
        {media.length > 0 && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {media.length} verified Cloudinary asset{media.length > 1 ? "s" : ""}
            </span>{" "}
            attached ({media.map((m) => m.fileName).join(", ")}).
          </div>
        )}

        {/* Skipped Accounts */}
        {skippedAccounts.length > 0 && (
          <div className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-3 text-xs text-[var(--text-secondary)] flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--text-tertiary)]" />
            <span>
              Skipped ({skippedAccounts.length}):{" "}
              {skippedAccounts.map((a) => `${a.displayName} (${a.status})`).join(", ")}.
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
          >
            Back to Edit
          </button>
          <button
            type="button"
            disabled={submitting || !allReady}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90 disabled:opacity-40 inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting
              ? "Dispatching..."
              : mode === "SCHEDULE"
                ? "Confirm & Schedule"
                : "Confirm & Publish Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
