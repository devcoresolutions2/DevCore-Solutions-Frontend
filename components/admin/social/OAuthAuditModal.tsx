"use client";

import React from "react";
import { X, History } from "lucide-react";
import type { SocialAuditLogItem } from "@/lib/api";

interface OAuthAuditModalProps {
  open: boolean;
  loading: boolean;
  logs: SocialAuditLogItem[];
  onClose: () => void;
}

export default function OAuthAuditModal({
  open,
  loading,
  logs,
  onClose,
}: OAuthAuditModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                OAuth & Webhook Audit Logs
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Immutable security trail from PostgreSQL AuditLog
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

        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
              Loading audit events...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
              No social integration or webhook audit events recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono text-[10px] font-semibold">
                        {log.action}
                      </span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {log.actor.name || log.actor.email}
                      </span>
                      {log.ip && (
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                          {log.ip}
                        </span>
                      )}
                    </div>
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <div className="font-mono text-[10px] text-[var(--text-secondary)] break-all">
                        {JSON.stringify(log.meta)}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
