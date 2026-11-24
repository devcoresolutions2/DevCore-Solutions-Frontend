"use client";

import React from "react";
import {
  Plus,
  Send,
  KeyRound,
  Pause,
  Play,
  Pencil,
  Trash2,
  RotateCw,
  Webhook,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { WebhookEndpointItem, WebhookDeliveryItem } from "@/lib/api";

interface WebhookManagerPanelProps {
  webhooks: WebhookEndpointItem[];
  deliveries: WebhookDeliveryItem[];
  busyWebhookId: string | null;
  onOpenCreate: () => void;
  onOpenEdit: (webhook: WebhookEndpointItem) => void;
  onRotateSecret: (id: string) => void;
  onTest: (id: string) => void;
  onToggleActive: (webhook: WebhookEndpointItem) => void;
  onDelete: (id: string) => void;
  onRetryDelivery: (deliveryId: string) => void;
}

export default function WebhookManagerPanel({
  webhooks,
  deliveries,
  busyWebhookId,
  onOpenCreate,
  onOpenEdit,
  onRotateSecret,
  onTest,
  onToggleActive,
  onDelete,
  onRetryDelivery,
}: WebhookManagerPanelProps) {
  return (
    <div className="space-y-6">
      {/* Registered Endpoints */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
              <Webhook className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Custom Webhook Endpoints
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Signed with HMAC-SHA256 (`X-DevCore-Signature`) and protected against SSRF
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Webhook
          </button>
        </div>

        {webhooks.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              No webhook endpoints registered
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              Register an HTTPS endpoint to receive real-time signed events for lead updates,
              post publishing, and social channel health changes.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {webhooks.map((wh) => {
              const isBusy = busyWebhookId === wh.id;
              return (
                <div
                  key={wh.id}
                  className="p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        {wh.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          wh.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        }`}
                      >
                        {wh.isActive ? "Active" : "Paused"}
                      </span>
                      {wh.lastStatusCode !== null && (
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            wh.lastStatusCode >= 200 && wh.lastStatusCode < 300
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          HTTP {wh.lastStatusCode}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-[var(--text-secondary)] truncate">
                      {wh.url}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                        Secret: {wh.secretPrefix} (v{wh.keyVersion})
                      </span>
                      <span className="text-[var(--text-tertiary)]">·</span>
                      {wh.events.map((ev) => (
                        <span
                          key={ev}
                          className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                    {wh.lastError && (
                      <div className="text-[11px] text-rose-600 dark:text-rose-400">
                        Last error: {wh.lastError}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onTest(wh.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Test
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onRotateSecret(wh.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] disabled:opacity-50"
                      title="Rotate HMAC signing secret"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Rotate
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onToggleActive(wh)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                    >
                      {wh.isActive ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Resume
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onOpenEdit(wh)}
                      className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                      title="Edit webhook"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onDelete(wh.id)}
                      className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                      title="Delete webhook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Webhook Deliveries */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">
            Recent Webhook Deliveries
          </h3>
          <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
            Latest {deliveries.length} attempts
          </span>
        </div>

        {deliveries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
            No webhook deliveries logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-tertiary)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Endpoint</th>
                  <th className="px-4 py-2.5">Event</th>
                  <th className="px-4 py-2.5">HTTP / Latency</th>
                  <th className="px-4 py-2.5">Delivered At</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-[var(--bg-elevated)]/50">
                    <td className="px-4 py-2.5">
                      {d.status === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> OK
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium"
                          title={d.errorMessage || "Failed"}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                      {d.endpoint?.name || d.endpointId}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--text-secondary)]">
                      {d.eventType}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--text-secondary)]">
                      {d.responseStatus ? `HTTP ${d.responseStatus}` : "Network Error"}
                      {d.latencyMs !== null ? ` · ${d.latencyMs}ms` : ""}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--text-tertiary)]">
                      {new Date(d.deliveredAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRetryDelivery(d.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)]"
                      >
                        <RotateCw className="w-3 h-3" />
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
