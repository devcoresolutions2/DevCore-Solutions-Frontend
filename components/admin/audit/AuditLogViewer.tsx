"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  Download,
  PauseCircle,
  PlayCircle,
  Search,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import {
  apiGetAuditFilters,
  apiGetAuditStats,
  apiListAuditLogs,
  getAdminAuditExportUrl,
  type AuditLogRecord,
} from "@/lib/api";

export default function AuditLogViewer() {
  const [items, setItems] = useState<AuditLogRecord[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [stats, setStats] = useState<{
    mutations24h: number;
    privilegedChanges: number;
    accessDenialsAndFailures: number;
    integrityStatus: string;
    integrityNote: string;
  } | null>(null);
  const [filtersMeta, setFiltersMeta] = useState<{
    actions: string[];
    entities: string[];
    actors: Array<{ id: string; name: string; email: string }>;
  }>({ actions: [], entities: [], actors: [] });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [actorId, setActorId] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [windowRange, setWindowRange] = useState("7d");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveStream, setLiveStream] = useState(false);

  const loadAll = useCallback(async () => {
    setError(null);
    try {
      const [st, fl, list] = await Promise.all([
        apiGetAuditStats(windowRange),
        apiGetAuditFilters(),
        apiListAuditLogs({
          page,
          limit,
          search: search.trim() || undefined,
          actorId: actorId || undefined,
          action: action || undefined,
          entity: entity || undefined,
          window: windowRange,
        }),
      ]);
      setStats(st.stats);
      setFiltersMeta(fl);
      setItems(list.items);
      setPagination(list.pagination);
    } catch (err: any) {
      setError(err?.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, actorId, action, entity, windowRange]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // Real polling when Live Stream is active
  useEffect(() => {
    if (!liveStream) return;
    const timer = setInterval(() => {
      void loadAll();
    }, 5000);
    return () => clearInterval(timer);
  }, [liveStream, loadAll]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[var(--text-tertiary)] uppercase mb-1">
            Admin / Administration / Security & Audit Log
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Audit Log & Security Event Stream
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Append-only PostgreSQL record of authenticated administrative mutations and access denials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getAdminAuditExportUrl()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV Ledger
          </a>
          <button
            type="button"
            onClick={() => setLiveStream((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              liveStream
                ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            }`}
          >
            {liveStream ? (
              <>
                <PauseCircle className="w-4 h-4" /> Live Stream: Active (5s)
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" /> Live Stream: Paused
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">
              Total Mutations (24h)
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {stats.mutations24h}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Recorded in past 24 hours
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">
              Role Changes ({windowRange})
            </div>
            <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              {stats.privilegedChanges}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              USER_ROLE_CHANGED events
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">
              Denials & Auth Failures
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-500">
              {stats.accessDenialsAndFailures}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              403 denials + failed logins
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[var(--text-tertiary)]">
                Audit Integrity
              </span>
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div className="mt-2 text-sm font-bold font-mono text-[var(--text-primary)]">
              {stats.integrityStatus}
            </div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              {stats.integrityNote}
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search event ID, action, entity, or IP..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          />
        </div>
        <select
          value={actorId}
          onChange={(e) => {
            setActorId(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-2 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
        >
          <option value="">All Actors</option>
          {filtersMeta.actors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name || a.email}
            </option>
          ))}
        </select>
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-2 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
        >
          <option value="">All Actions</option>
          {filtersMeta.actions.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
        <select
          value={entity}
          onChange={(e) => {
            setEntity(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-2 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
        >
          <option value="">All Entities</option>
          {filtersMeta.entities.map((ent) => (
            <option key={ent} value={ent}>
              {ent}
            </option>
          ))}
        </select>
        <div className="lg:col-span-2 flex items-center gap-1.5">
          <select
            value={windowRange}
            onChange={(e) => {
              setWindowRange(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-2 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="all">All</option>
          </select>
          <button
            type="button"
            onClick={() => void loadAll()}
            className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500">
          {error}
        </div>
      )}

      {/* Audit Table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="p-10 text-center text-xs text-[var(--text-secondary)]">
            Loading audit records...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-xs text-[var(--text-secondary)]">
            No audit events recorded for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-tertiary)] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-3 w-8"></th>
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {items.map((row) => {
                  const expanded = expandedId === row.id;
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => setExpandedId(expanded ? null : row.id)}
                        className="hover:bg-[var(--bg-elevated)]/40 cursor-pointer"
                      >
                        <td className="px-3 py-3 text-[var(--text-tertiary)]">
                          {expanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                          {new Date(row.createdAt).toISOString().replace("T", " ").slice(0, 19)} UTC
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[var(--text-primary)]">
                            {row.actor.name}
                          </div>
                          <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                            {row.actor.email || row.actor.role}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono text-[10px] font-semibold">
                            {row.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-secondary)]">
                          {row.entity}:{row.entityId.slice(0, 16)}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-[var(--text-tertiary)]">
                          {row.ip || "—"}
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="bg-[var(--bg-elevated)]/60">
                          <td colSpan={6} className="p-4">
                            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)]">
                                <span>Event ID: {row.id}</span>
                                <span>Actor ID: {row.actorId}</span>
                              </div>
                              <pre className="p-3 rounded-lg bg-[var(--bg-elevated)] font-mono text-[11px] text-[var(--text-primary)] overflow-x-auto">
                                {JSON.stringify(row.meta || {}, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} events)
            </span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
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
    </div>
  );
}
