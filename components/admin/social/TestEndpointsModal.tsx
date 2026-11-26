"use client";

import React from "react";
import { X, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import type { SocialTestEndpointResult } from "@/lib/api";

interface TestEndpointsModalProps {
  open: boolean;
  loading: boolean;
  checkedAt: string | null;
  results: SocialTestEndpointResult[];
  onClose: () => void;
}

export default function TestEndpointsModal({
  open,
  loading,
  checkedAt,
  results,
  onClose,
}: TestEndpointsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                Endpoint Health Check Results
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {checkedAt
                  ? `Checked at ${new Date(checkedAt).toLocaleTimeString()}`
                  : "Running live provider API checks..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center text-xs text-[var(--text-secondary)]">
              Probing configured social endpoints...
            </div>
          ) : (
            results.map((r) => (
              <div
                key={r.key}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {r.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-[var(--text-primary)]">
                      {r.displayName}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] break-words">
                      {r.message}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    {r.status}
                  </span>
                  {r.latencyMs !== null && (
                    <div className="mt-1 font-mono text-[10px] text-[var(--text-tertiary)]">
                      {r.latencyMs}ms
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
