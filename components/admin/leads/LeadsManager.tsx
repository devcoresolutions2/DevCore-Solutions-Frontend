"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Table2,
  Kanban,
  Download,
  RefreshCw,
  Inbox,
  Clock,
  Handshake,
  DollarSign,
  FilterX,
  Phone,
  MessageCircle,
  Mail,
  Archive,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiGetAdminLeadStats,
  apiGetAdminLeads,
  apiUpdateAdminLead,
  apiBulkAdminLeads,
  getAdminLeadsExportUrl,
  type AdminLeadsStatsResponse,
  type LeadRecord,
  type LeadAssignee,
  type LeadStatus,
} from "@/lib/api";
import { LeadStatusBadge, LeadSourceBadge, LeadPriorityBadge } from "./LeadStatusBadge";
import { LeadKanbanBoard } from "./LeadKanbanBoard";
import { LeadDetailsDrawer } from "./LeadDetailsDrawer";
import { UserAvatar } from "@/components/shared/UserAvatar";

export function LeadsManager() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Query & Filter states
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Data
  const [stats, setStats] = useState<AdminLeadsStatsResponse | null>(null);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [assignees, setAssignees] = useState<LeadAssignee[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 15, total: 0, totalPages: 1 });

  // Selection & Drawer
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLeadsAndStats = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const [statsRes, listRes] = await Promise.all([
        apiGetAdminLeadStats({
          dateRange,
          startDate: dateRange === "custom" ? customStart : undefined,
          endDate: dateRange === "custom" ? customEnd : undefined,
          slaHours: 4,
        }),
        apiGetAdminLeads({
          page: viewMode === "kanban" ? 1 : page,
          pageSize: viewMode === "kanban" ? 100 : pageSize,
          q: debouncedQ,
          source: sourceFilter,
          status: viewMode === "kanban" ? "ALL" : statusFilter,
          priority: priorityFilter,
          assignedToId: assigneeFilter,
          dateRange,
          startDate: dateRange === "custom" ? customStart : undefined,
          endDate: dateRange === "custom" ? customEnd : undefined,
          sortBy,
          sortOrder,
        }),
      ]);

      setStats(statsRes);
      setLeads(listRes.items || []);
      setPagination(listRes.pagination);
      setAssignees(listRes.assignees || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load lead pipeline.");
    } finally {
      setLoading(false);
    }
  }, [
    viewMode,
    page,
    pageSize,
    debouncedQ,
    sourceFilter,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    dateRange,
    customStart,
    customEnd,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchLeadsAndStats();
  }, [fetchLeadsAndStats]);

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedQ("");
    setSourceFilter("ALL");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setAssigneeFilter("ALL");
    setDateRange("30d");
    setCustomStart("");
    setCustomEnd("");
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMoveStatus = async (leadId: string, toStatus: LeadStatus) => {
    try {
      const res = await apiUpdateAdminLead(leadId, { status: toStatus });
      if (res.success && res.lead) {
        toast.success(`Lead moved to ${toStatus}.`);
        await fetchLeadsAndStats();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to change lead status.");
      throw err;
    }
  };

  const handleBulkAction = async (
    action: "ARCHIVE" | "STATUS" | "ASSIGN",
    extra?: { status?: LeadStatus; assignedToId?: string | null }
  ) => {
    if (selectedIds.length === 0) return;
    try {
      setBulkBusy(true);
      const res = await apiBulkAdminLeads({
        leadIds: selectedIds,
        action,
        status: extra?.status,
        assignedToId: extra?.assignedToId,
      });
      if (res.success) {
        toast.success(res.message);
        setSelectedIds([]);
        await fetchLeadsAndStats();
      }
    } catch (err: any) {
      toast.error(err.message || "Bulk update failed.");
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Inbound Lead Pipeline</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
            Enterprise Inbound Leads
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Database-connected inquiry triage, status lifecycle management, and auditable internal notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Table2 size={14} />
              <span>Inbox Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "kanban"
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Kanban size={14} />
              <span>Kanban Board</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchLeadsAndStats}
            disabled={loading}
            className="h-9 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <a
            href={getAdminLeadsExportUrl({
              format: "csv",
              status: statusFilter,
              source: sourceFilter,
            })}
            download
            className="h-9 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Real Database-Driven Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>INBOUND ({dateRange.toUpperCase()})</span>
            <Inbox size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-2">
            {stats ? stats.totalInbound : "—"}
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1 block">
            Verified database submissions
          </span>
        </div>

        <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>AWAITING RESPONSE</span>
            <Clock
              size={16}
              className={
                stats && stats.awaitingSla.breachingCount > 0
                  ? "text-rose-500"
                  : "text-[var(--brand-primary)]"
              }
            />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
              {stats ? stats.awaitingSla.newCount : "—"}
            </span>
            {stats && stats.awaitingSla.breachingCount > 0 && (
              <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {stats.awaitingSla.breachingCount} &gt; {stats.awaitingSla.slaHours}h
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1 block">
            Status: NEW (Target: {stats?.awaitingSla.slaHours || 4}h)
          </span>
        </div>

        <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>ACTIVE NEGOTIATION</span>
            <Handshake size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-2">
            {stats ? stats.activeNegotiationCount : "—"}
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1 block">
            CONTACTED + PROPOSAL_SENT
          </span>
        </div>

        <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>EST. PIPELINE VALUE</span>
            <DollarSign size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-2">
            {stats ? `$${stats.pipelineValue.estimatedTotal.toLocaleString()}` : "—"}
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1 block">
            From {stats?.pipelineValue.leadsWithBudget || 0} active budgeted inquiries
          </span>
        </div>
      </div>

      {/* Search & Multi-Filters Bar */}
      <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Debounced Search */}
          <div className="flex-1 min-w-[240px] relative">
            <Search size={15} className="absolute left-3 top-3 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, company, email, phone, ID, or brief..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30"
            />
          </div>

          <select
            aria-label="Filter by source"
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
          >
            <option value="ALL">Source: All</option>
            <option value="ESTIMATOR">Cost Estimator</option>
            <option value="QUICK_CALLBACK">Quick Callback</option>
            <option value="BOOKING">Booking</option>
            <option value="CONTACT_FORM">Contact Form</option>
          </select>

          {viewMode === "table" && (
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
            >
              <option value="ALL">Status: All</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
              <option value="WON">WON</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          )}

          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
          >
            <option value="ALL">Priority: All</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            aria-label="Filter by assignee"
            value={assigneeFilter}
            onChange={(e) => {
              setAssigneeFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
          >
            <option value="ALL">Assignee: All</option>
            <option value="UNASSIGNED">Unassigned</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by date range"
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
          >
            <option value="all">Date: All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="quarter">Quarter to Date</option>
            <option value="custom">Custom Range</option>
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset Filters"
            className="h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs text-[var(--text-secondary)] inline-flex items-center gap-1.5"
          >
            <FilterX size={14} />
            <span>Reset</span>
          </button>
        </div>

        {dateRange === "custom" && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border-subtle)] text-xs font-mono">
            <span>From:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => {
                setCustomStart(e.target.value);
                setPage(1);
              }}
              className="h-9 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            />
            <span>To:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => {
                setCustomEnd(e.target.value);
                setPage(1);
              }}
              className="h-9 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            />
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && viewMode === "table" && (
        <div className="p-3 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
            {selectedIds.length} lead(s) selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <select
              disabled={bulkBusy}
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkAction("ASSIGN", { assignedToId: e.target.value });
                  e.target.value = "";
                }
              }}
              className="h-8 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
            >
              <option value="" disabled>
                Assign to...
              </option>
              {assignees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction("STATUS", { status: "CONTACTED" })}
              className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium hover:border-[var(--brand-primary)]"
            >
              Mark Contacted
            </button>

            <a
              href={getAdminLeadsExportUrl({ format: "csv", ids: selectedIds })}
              download
              className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium hover:border-[var(--brand-primary)] inline-flex items-center gap-1"
            >
              <Download size={12} />
              Export Selected
            </a>

            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction("ARCHIVE")}
              className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 inline-flex items-center gap-1"
            >
              <Archive size={12} />
              Archive Selected
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="h-8 px-2.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Workspace Split: Table/Kanban + Details Drawer */}
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        {viewMode === "kanban" ? (
          <LeadKanbanBoard
            leads={leads}
            selectedLeadId={activeLeadId}
            onSelectLead={(id) => setActiveLeadId(id)}
            onMoveLeadStatus={handleMoveStatus}
          />
        ) : (
          <div className="flex-1 w-full rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden flex flex-col">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] font-mono text-[11px] uppercase text-[var(--text-muted)]">
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={leads.length > 0 && selectedIds.length === leads.length}
                        onChange={toggleSelectAll}
                        aria-label="Select all leads on page"
                      />
                    </th>
                    <th className="py-3 px-4">Company / Contact</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleSort("budgetMin")}
                        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
                      >
                        <span>Budget</span>
                        <ArrowUpDown size={11} />
                      </button>
                    </th>
                    <th className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleSort("status")}
                        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
                      >
                        <span>Status</span>
                        <ArrowUpDown size={11} />
                      </button>
                    </th>
                    <th className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleSort("priority")}
                        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
                      >
                        <span>Priority</span>
                        <ArrowUpDown size={11} />
                      </button>
                    </th>
                    <th className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleSort("createdAt")}
                        className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]"
                      >
                        <span>Received</span>
                        <ArrowUpDown size={11} />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-right">Quick Taps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]/60">
                  {loading && leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-[var(--brand-primary)]" />
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center font-mono text-xs text-[var(--text-muted)]">
                        No leads match your current search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      const isActive = activeLeadId === lead.id;
                      const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, "") : "";
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setActiveLeadId(lead.id)}
                          className={`cursor-pointer transition-colors ${
                            isActive
                              ? "bg-[var(--brand-primary)]/10"
                              : "hover:bg-[var(--bg-surface)]/70"
                          }`}
                        >
                          <td
                            className="py-3 px-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(lead.id)}
                              onChange={() => toggleSelectOne(lead.id)}
                              aria-label={`Select ${lead.name}`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <UserAvatar
                                name={lead.company || lead.name}
                                size={64}
                                className="w-8 h-8 rounded-lg"
                                textClassName="text-xs"
                              />
                              <div className="min-w-0">
                                <div
                                  className={`font-display font-semibold text-sm text-[var(--text-primary)] truncate ${
                                    lead.status === "ARCHIVED" ? "line-through opacity-60" : ""
                                  }`}
                                >
                                  {lead.company || lead.name}
                                </div>
                                <div className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                                  {lead.name} {lead.email ? `• ${lead.email}` : ""}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <LeadSourceBadge source={lead.source} />
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-[var(--text-primary)] whitespace-nowrap">
                            {lead.budget || <span className="text-[var(--text-muted)] font-normal">—</span>}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <LeadStatusBadge status={lead.status} />
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <LeadPriorityBadge priority={lead.priority} />
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-secondary)] whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                          <td
                            className="py-3 px-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex items-center gap-1">
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  title={`Call ${lead.phone}`}
                                  className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
                                >
                                  <Phone size={14} />
                                </a>
                              )}
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp"
                                  className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--success)]"
                                >
                                  <MessageCircle size={14} />
                                </a>
                              )}
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  title={`Email ${lead.email}`}
                                  className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
                                >
                                  <Mail size={14} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Server-Side Pagination Footer */}
            <div className="px-4 py-3 bg-[var(--bg-surface)]/70 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-[var(--text-primary)]">{leads.length}</strong> of{" "}
                  <strong className="text-[var(--text-primary)]">{pagination.total}</strong> leads
                </span>
                <select
                  aria-label="Page size"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-8 px-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                >
                  <option value={10}>10 / page</option>
                  <option value={15}>15 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Lead Inspection Drawer */}
        <LeadDetailsDrawer
          leadId={activeLeadId}
          assignees={assignees}
          onClose={() => setActiveLeadId(null)}
          onLeadMutated={() => {
            fetchLeadsAndStats();
          }}
        />
      </div>
    </div>
  );
}
