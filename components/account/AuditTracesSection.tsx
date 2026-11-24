"use client";

import React from "react";
import { Download, RefreshCw, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { getAuditExportUrl, type AccountAuditEventItem } from "@/lib/api";

interface AuditTracesSectionProps {
  events: AccountAuditEventItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function AuditTracesSection({
  events,
  pagination,
  loading,
  onPageChange,
  onRefresh,
}: AuditTracesSectionProps) {
  return (
    <section
      id="section-audit"
      className="devcore-glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-5 scroll-mt-28"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
            <span>Section 05</span>
            <span>•</span>
            <span>Security Activity</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] mt-1">
            Audit Traces
          </h2>
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

          <a
            href={getAuditExportUrl()}
            download
            className="h-9 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono font-semibold text-[var(--brand-primary)] hover:border-[var(--brand-primary)] inline-flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </a>
        </div>
      </div>

      {/* Table or Empty State */}
      {events.length === 0 ? (
        <div className="p-8 text-center bg-[var(--bg-surface)]/50 rounded-xl border border-[var(--border-subtle)] space-y-2">
          <Shield size={24} className="mx-auto text-[var(--text-muted)]" />
          <p className="text-xs font-mono text-[var(--text-muted)]">
            No security events recorded for this account yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono uppercase text-[11px]">
                <th className="pb-3 pr-4 font-semibold">Timestamp</th>
                <th className="pb-3 pr-4 font-semibold">Event</th>
                <th className="pb-3 pr-4 font-semibold">Client</th>
                <th className="pb-3 pr-4 font-semibold">IP Address</th>
                <th className="pb-3 text-right font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]/50">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-[var(--bg-surface)]/40 transition-colors">
                  <td className="py-3 pr-4 font-mono text-[var(--text-secondary)] whitespace-nowrap">
                    {new Date(ev.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 font-mono font-semibold text-[var(--text-primary)]">
                    {ev.type}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-secondary)] whitespace-nowrap">
                    {ev.client.browser} ({ev.client.os})
                  </td>
                  <td className="py-3 pr-4 font-mono text-[var(--text-muted)] whitespace-nowrap">
                    {ev.ip || "—"}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                        ev.status === "FAILED"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} events)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => onPageChange(pagination.page - 1)}
              className="h-8 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] disabled:opacity-40 inline-flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => onPageChange(pagination.page + 1)}
              className="h-8 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] disabled:opacity-40 inline-flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
