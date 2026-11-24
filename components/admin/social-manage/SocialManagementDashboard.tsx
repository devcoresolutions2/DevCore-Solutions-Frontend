"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import {
  apiCancelScheduledBroadcast,
  apiDeleteManagedBroadcast,
  apiGetManagedBroadcastDetail,
  apiGetSocialManageAnalytics,
  apiListManagedBroadcasts,
  apiRetryAllFailedBroadcasts,
  apiRetryBroadcast,
  apiUpdateManagedBroadcast,
  getSocialManageExportUrl,
  type SocialBroadcastPostItem,
  type SocialManageAnalyticsResponse,
} from "@/lib/api";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";

export default function SocialManagementDashboard() {
  const [analyticsData, setAnalyticsData] = useState<SocialManageAnalyticsResponse | null>(null);
  const [broadcasts, setBroadcasts] = useState<SocialBroadcastPostItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("30d");
  const [page, setPage] = useState(1);
  const [openErrorId, setOpenErrorId] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "delete";
    id: string;
    label: string;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<{
    broadcast: SocialBroadcastPostItem;
    auditLogs: Array<{ id: string; action: string; actorId: string; meta: any; createdAt: string }>;
  } | null>(null);

  const [editSchedule, setEditSchedule] = useState<{
    id: string;
    scheduledFor: string;
    timezone: string;
  } | null>(null);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [ana, list] = await Promise.all([
        apiGetSocialManageAnalytics(dateRange),
        apiListManagedBroadcasts({
          page,
          limit: 10,
          search: search.trim() || undefined,
          status: statusFilter,
          platform: platformFilter,
          dateRange,
        }),
      ]);
      setAnalyticsData(ana);
      setBroadcasts(list.items);
      setPagination(list.pagination);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load social management data." });
    } finally {
      setLoading(false);
    }
  }, [dateRange, page, search, statusFilter, platformFilter]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const handleRetryAllFailed = async () => {
    try {
      const res = await apiRetryAllFailedBroadcasts();
      await loadAll();
      setBanner({
        type: "success",
        text: `Retried ${res.retriedCount} failed broadcast(s).`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Bulk retry failed." });
    }
  };

  const handleRetryOne = async (id: string) => {
    try {
      const res = await apiRetryBroadcast(id);
      await loadAll();
      setBanner({
        type: res.broadcast.status === "FAILED" ? "error" : "success",
        text: `Broadcast ${id} retry finished: ${res.broadcast.status}`,
      });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Retry failed." });
    }
  };

  const handleCancel = (b: SocialBroadcastPostItem) => {
    setConfirmAction({
      type: "cancel",
      id: b.id,
      label: b.title || b.baseContent.slice(0, 48),
    });
  };

  const handleDelete = (b: SocialBroadcastPostItem) => {
    setConfirmAction({
      type: "delete",
      id: b.id,
      label: b.title || b.baseContent.slice(0, 48),
    });
  };

  const confirmExecute = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      if (confirmAction.type === "cancel") {
        await apiCancelScheduledBroadcast(confirmAction.id);
        setBanner({ type: "success", text: "Scheduled broadcast cancelled." });
      } else {
        await apiDeleteManagedBroadcast(confirmAction.id);
        setBanner({ type: "success", text: "Broadcast removed." });
      }
      await loadAll();
      setConfirmAction(null);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Action failed." });
    } finally {
      setConfirmLoading(false);
    }
  };

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await apiGetManagedBroadcastDetail(id);
      setDetailData(res);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load broadcast details." });
    } finally {
      setDetailLoading(false);
    }
  };

  const openEditScheduleModal = (b: SocialBroadcastPostItem) => {
    const dt = b.scheduledFor ? new Date(b.scheduledFor) : new Date(Date.now() + 3600_000);
    const localIso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setEditSchedule({
      id: b.id,
      scheduledFor: localIso,
      timezone: b.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    });
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSchedule) return;
    setSavingSchedule(true);
    try {
      await apiUpdateManagedBroadcast(editSchedule.id, {
        scheduledFor: new Date(editSchedule.scheduledFor).toISOString(),
        timezone: editSchedule.timezone,
      });
      setEditSchedule(null);
      await loadAll();
      setBanner({ type: "success", text: "Broadcast schedule updated." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to update schedule." });
    } finally {
      setSavingSchedule(false);
    }
  };

  if (loading && !analyticsData) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
      </div>
    );
  }

  const ana = analyticsData?.analytics;
  const alert = analyticsData?.failedAlert;
  const diag = analyticsData?.diagnostics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[var(--text-tertiary)] uppercase mb-1">
            Admin / Growth / Social Management
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Social Syndication Management
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Monitor, audit, and orchestrate outbound dispatches across connected social endpoints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getSocialManageExportUrl(statusFilter)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Dispatch Audit CSV
          </a>
          <Link
            href="/admin/social/broadcast"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Broadcast
          </Link>
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
          <span>{banner.text}</span>
          <button type="button" onClick={() => setBanner(null)} className="underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Real Telemetry Cards */}
      {ana && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs text-[var(--text-tertiary)] uppercase font-mono">
              Total Dispatches ({dateRange})
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {ana.totalDispatches}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Broadcast records in selected window
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] uppercase font-mono">
                Successful Deliveries
              </span>
              {ana.successRate !== null && (
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {ana.successRate}%
                </span>
              )}
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {ana.successfulDeliveries}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Out of {ana.eligibleDeliveries} completed attempts
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs text-[var(--text-tertiary)] uppercase font-mono">
              Pending / Scheduled
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {ana.pendingScheduledCount}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)] truncate">
              {ana.nextScheduled?.scheduledFor
                ? `Next: ${new Date(ana.nextScheduled.scheduledFor).toLocaleString()}`
                : "No scheduled broadcasts"}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-tertiary)] uppercase font-mono">
                Failed / Partial
              </span>
              {ana.failedCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("FAILED");
                    setPage(1);
                  }}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500 text-white"
                >
                  Triage
                </button>
              )}
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-500">{ana.failedCount}</div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Actionable broadcast failures
            </div>
          </div>
        </div>
      )}

      {/* Real Failed Dispatch Alert Banner */}
      {alert && alert.affectedDeliveriesCount > 0 && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-semibold text-[var(--text-primary)]">
                {alert.affectedDeliveriesCount} failed delivery attempt(s) across{" "}
                {alert.affectedPlatforms.join(", ")}
              </div>
              {alert.errors.length > 0 && (
                <div className="font-mono text-[11px] text-[var(--text-secondary)]">
                  {alert.errors.join(" · ")}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleRetryAllFailed()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-semibold shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry All Failed
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search broadcast ID, content, or external post ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
            >
              <option value="ALL">All Platforms</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="TWITTER_X">X (Twitter)</option>
              <option value="META_FACEBOOK">Meta Facebook</option>
              <option value="REDDIT">Reddit</option>
            </select>
            <button
              type="button"
              onClick={() => void loadAll()}
              className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {["ALL", "PUBLISHED", "SCHEDULED", "FAILED", "PARTIAL_FAILED", "DRAFT", "CANCELLED"].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {st}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Broadcasts Data Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        {broadcasts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              No broadcasts match the current filters
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Create your first broadcast in the Social Broadcast Composer to see live dispatch records here.
            </p>
            <Link
              href="/admin/social/broadcast"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              Create New Broadcast
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-tertiary)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Broadcast ID</th>
                  <th className="px-4 py-3 min-w-[260px]">Content & Media</th>
                  <th className="px-4 py-3 min-w-[220px]">Endpoint Status</th>
                  <th className="px-4 py-3">Sent / Scheduled</th>
                  <th className="px-4 py-3">Analytics</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {broadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-[var(--bg-elevated)]/40">
                    <td className="px-4 py-3.5 align-top">
                      <div className="font-mono font-semibold text-[var(--brand-primary)]">
                        {b.id.slice(0, 10)}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--text-tertiary)] mt-0.5">
                        {b.status}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex items-start gap-2.5">
                        {b.mediaAssets?.[0] && (
                          <img
                            src={b.mediaAssets[0].secureUrl}
                            alt={b.mediaAssets[0].altText || "Media"}
                            className="w-14 h-10 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-[var(--text-primary)] line-clamp-2">
                            {b.title || b.baseContent}
                          </div>
                          {b.author && (
                            <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                              by {b.author.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      {b.deliveryLogs.length === 0 ? (
                        <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                          {b.status === "SCHEDULED"
                            ? `Queued (${b.targetPlatforms.join(", ")})`
                            : "No deliveries dispatched"}
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {b.deliveryLogs.map((log) => (
                            <div key={log.id} className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenErrorId(openErrorId === log.id ? null : log.id)
                                }
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] ${
                                  log.status === "SUCCESS"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {log.status === "SUCCESS" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                {log.platform}
                                {log.externalUrl && (
                                  <a
                                    href={log.externalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </button>
                              {openErrorId === log.id && log.error?.message && (
                                <div className="absolute left-0 top-6 z-20 w-64 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-rose-500/30 shadow-xl text-[11px] text-rose-600 dark:text-rose-400">
                                  {log.error.message}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 align-top font-mono text-[11px] text-[var(--text-secondary)]">
                      {b.publishedAt
                        ? new Date(b.publishedAt).toLocaleString()
                        : b.scheduledFor
                          ? `Sched: ${new Date(b.scheduledFor).toLocaleString()}`
                          : new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[11px] text-[var(--text-tertiary)] italic">
                      Analytics unavailable
                    </td>
                    <td className="px-4 py-3.5 align-top text-right space-x-1">
                      {(b.status === "FAILED" || b.status === "PARTIAL_FAILED") && (
                        <button
                          type="button"
                          onClick={() => void handleRetryOne(b.id)}
                          className="p-1.5 rounded-lg text-[var(--brand-primary)] hover:bg-[var(--bg-elevated)]"
                          title="Retry"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void openDetail(b.id)}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {(b.status === "SCHEDULED" || b.status === "DRAFT") && (
                        <button
                          type="button"
                          onClick={() => openEditScheduleModal(b)}
                          className="p-1.5 rounded-lg text-[var(--brand-primary)] hover:bg-[var(--bg-elevated)]"
                          title="Edit Schedule"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {b.status === "SCHEDULED" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(b)}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-[var(--bg-elevated)]"
                          title="Cancel Schedule"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(b.status === "DRAFT" || b.status === "CANCELLED") && (
                        <button
                          type="button"
                          onClick={() => handleDelete(b)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>
            Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Split: Integration Health + Real Queue Worker Diagnostics */}
      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                  Target Platform Integration Health
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Live status from Social Channel Connections
                </p>
              </div>
              <Link
                href="/admin/social"
                className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
              >
                Manage All Connectors →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {analyticsData.platformHealth.map((ph) => {
                const statusLabel =
                  ph.status === "CONNECTED"
                    ? "Connected"
                    : ph.status === "NOT_CONFIGURED"
                      ? "Not Configured"
                      : ph.status === "PUBLISHING_UNSUPPORTED"
                        ? "Read-Only"
                        : ph.status === "TOKEN_EXPIRED"
                          ? "Expired"
                          : ph.status === "ERROR"
                            ? "Error"
                            : ph.status.replace(/_/g, " ");
                const statusTone =
                  ph.status === "CONNECTED"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : ph.status === "ERROR" || ph.status === "TOKEN_EXPIRED"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]";
                return (
                  <div
                    key={ph.key}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3.5 space-y-1.5 text-xs min-w-0 overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                      <span className="font-semibold text-[var(--text-primary)] truncate">
                        {ph.displayName}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border shrink-0 whitespace-nowrap ${statusTone}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-tertiary)] truncate">
                      {ph.accountName || (ph.lastLatencyMs ? `${ph.lastLatencyMs}ms` : "Not linked")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--brand-primary)]" />
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Scheduler Worker Diagnostics
              </h2>
            </div>
            {diag && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3.5 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">Worker State</span>
                  <span className={diag.workerActive ? "text-emerald-500" : "text-rose-500"}>
                    {diag.workerActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">Poll Interval</span>
                  <span>{diag.pollIntervalSeconds}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">Pending / Processing</span>
                  <span>
                    {diag.pendingCount} / {diag.processingCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">Last Heartbeat</span>
                  <span>
                    {diag.lastHeartbeatAt
                      ? new Date(diag.lastHeartbeatAt).toLocaleTimeString()
                      : "Pending"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast Detail Drawer */}
      {(detailLoading || detailData) && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
          onClick={() => {
            if (!detailLoading) setDetailData(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-[var(--bg-surface)] h-full border-l border-[var(--border-subtle)] p-6 overflow-y-auto space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {detailData?.broadcast.title || "Broadcast Details"}
                </h3>
                {detailData && (
                  <p className="text-[11px] font-mono text-[var(--text-tertiary)]">
                    {detailData.broadcast.id} • {detailData.broadcast.status}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDetailData(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading && !detailData ? (
              <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
                Loading broadcast details...
              </div>
            ) : detailData ? (
              <>
                <div>
                  <div className="text-[11px] font-mono uppercase text-[var(--text-tertiary)] mb-1">
                    Base Content
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs whitespace-pre-wrap">
                    {detailData.broadcast.baseContent}
                  </div>
                </div>

                {detailData.broadcast.mediaAssets?.length > 0 && (
                  <div>
                    <div className="text-[11px] font-mono uppercase text-[var(--text-tertiary)] mb-1.5">
                      Attached Media ({detailData.broadcast.mediaAssets.length})
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {detailData.broadcast.mediaAssets.map((m) => (
                        <a
                          key={m.id}
                          href={m.secureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] block"
                        >
                          {m.resourceType === "video" ? (
                            <video src={m.secureUrl} className="w-full h-28 object-cover" />
                          ) : (
                            <img src={m.secureUrl} alt={m.fileName} className="w-full h-28 object-cover" />
                          )}
                          <div className="px-2 py-1 text-[10px] truncate text-[var(--text-secondary)]">
                            {m.fileName}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-mono uppercase text-[var(--text-tertiary)] mb-1.5">
                    Delivery Logs ({detailData.broadcast.deliveryLogs?.length || 0})
                  </div>
                  <div className="space-y-2">
                    {(detailData.broadcast.deliveryLogs || []).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span>{log.platform}</span>
                          <span className="font-mono text-[11px]">{log.status}</span>
                        </div>
                        {log.externalUrl && (
                          <a
                            href={log.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[var(--brand-primary)] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Open Published Post
                          </a>
                        )}
                        {log.error?.message && (
                          <div className="text-[11px] text-rose-500 font-mono">
                            {log.error.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase text-[var(--text-tertiary)] mb-1.5">
                    Audit Trail ({detailData.auditLogs?.length || 0})
                  </div>
                  <div className="space-y-1.5">
                    {(detailData.auditLogs || []).length === 0 ? (
                      <div className="text-xs text-[var(--text-tertiary)]">No audit entries recorded.</div>
                    ) : (
                      detailData.auditLogs.map((a) => (
                        <div
                          key={a.id}
                          className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] flex items-center justify-between"
                        >
                          <span className="font-mono font-semibold">{a.action}</span>
                          <span className="text-[var(--text-tertiary)]">
                            {new Date(a.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {editSchedule && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => {
            if (!savingSchedule) setEditSchedule(null);
          }}
        >
          <form
            onSubmit={(e) => void handleSaveSchedule(e)}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Edit Broadcast Schedule</h3>
              <button
                type="button"
                onClick={() => setEditSchedule(null)}
                className="p-1 rounded-lg hover:bg-[var(--bg-elevated)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={editSchedule.scheduledFor}
                  onChange={(e) =>
                    setEditSchedule({ ...editSchedule, scheduledFor: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Timezone</label>
                <input
                  type="text"
                  required
                  value={editSchedule.timezone}
                  onChange={(e) => setEditSchedule({ ...editSchedule, timezone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={savingSchedule}
                onClick={() => setEditSchedule(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingSchedule}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white disabled:opacity-50"
              >
                {savingSchedule ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmAction?.type === "cancel" ? "Cancel Scheduled Broadcast" : "Delete Broadcast"}
        description={
          confirmAction
            ? confirmAction.type === "cancel"
              ? `Cancel scheduled delivery for "${confirmAction.label}"? It will be moved to CANCELLED status.`
              : `Permanently delete "${confirmAction.label}"? This cannot be undone.`
            : ""
        }
        confirmLabel={confirmAction?.type === "cancel" ? "Cancel Schedule" : "Delete Broadcast"}
        destructive
        loading={confirmLoading}
        onConfirm={() => void confirmExecute()}
        onCancel={() => {
          if (!confirmLoading) setConfirmAction(null);
        }}
      />
    </div>
  );
}
