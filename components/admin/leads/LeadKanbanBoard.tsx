"use client";

import React, { useState } from "react";
import { Calendar, DollarSign, Loader2 } from "lucide-react";
import type { LeadRecord, LeadStatus } from "@/lib/api";
import { LeadPriorityBadge } from "./LeadStatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";

const COLUMNS: { status: LeadStatus; label: string; dotClass: string }[] = [
  { status: "NEW", label: "NEW", dotClass: "bg-rose-500" },
  { status: "CONTACTED", label: "CONTACTED", dotClass: "bg-sky-500" },
  { status: "PROPOSAL_SENT", label: "PROPOSAL_SENT", dotClass: "bg-amber-500" },
  { status: "WON", label: "WON", dotClass: "bg-emerald-500" },
  { status: "ARCHIVED", label: "ARCHIVED", dotClass: "bg-[var(--text-muted)]" },
];

interface LeadKanbanBoardProps {
  leads: LeadRecord[];
  selectedLeadId: string | null;
  onSelectLead: (leadId: string) => void;
  onMoveLeadStatus: (leadId: string, toStatus: LeadStatus) => Promise<void>;
}

export function LeadKanbanBoard({
  leads,
  selectedLeadId,
  onSelectLead,
  onMoveLeadStatus,
}: LeadKanbanBoardProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<LeadStatus | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const handleDrop = async (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    setDragOverStatus(null);
    const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
    setDraggedLeadId(null);
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === targetStatus) return;

    try {
      setUpdatingLeadId(leadId);
      await onMoveLeadStatus(leadId, targetStatus);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  return (
    <div className="flex-1 w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px]">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          const colBudgetSum = colLeads.reduce((acc, l) => acc + (l.budgetMin || 0), 0);
          const isDropTarget = dragOverStatus === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStatus(col.status);
              }}
              onDragLeave={() => {
                if (dragOverStatus === col.status) setDragOverStatus(null);
              }}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`flex-1 min-w-[260px] rounded-2xl p-4 flex flex-col gap-3 border transition-colors ${
                isDropTarget
                  ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]"
                  : "bg-[var(--bg-surface)]/70 border-[var(--border-subtle)]"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotClass}`} />
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    {col.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] font-bold text-[var(--text-secondary)]">
                    {colLeads.length}
                  </span>
                </div>
                {colBudgetSum > 0 && (
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    ${colBudgetSum.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Cards */}
              {colLeads.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[var(--border-subtle)] text-center font-mono text-[11px] text-[var(--text-muted)]">
                  No leads in {col.label}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {colLeads.map((lead) => {
                    const isSelected = selectedLeadId === lead.id;
                    const isUpdating = updatingLeadId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        draggable={!isUpdating}
                        onDragStart={(e) => {
                          setDraggedLeadId(lead.id);
                          e.dataTransfer.setData("text/plain", lead.id);
                        }}
                        onDragEnd={() => {
                          setDraggedLeadId(null);
                          setDragOverStatus(null);
                        }}
                        onClick={() => onSelectLead(lead.id)}
                        className={`p-3.5 rounded-xl bg-[var(--bg-elevated)] border transition-all cursor-pointer flex flex-col gap-2 shadow-xs hover:shadow-md ${
                          isSelected
                            ? "border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                            : "border-[var(--border-subtle)]"
                        } ${col.status === "ARCHIVED" ? "opacity-65" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-display font-bold text-sm text-[var(--text-primary)] truncate">
                            {lead.company || lead.name}
                          </span>
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin text-[var(--brand-primary)] shrink-0" />
                          ) : (
                            <LeadPriorityBadge priority={lead.priority} />
                          )}
                        </div>

                        {lead.company && (
                          <span className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                            {lead.name}
                          </span>
                        )}

                        {lead.brief && (
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                            {lead.brief}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]/60 text-[11px] font-mono">
                          <span className="text-[var(--brand-primary)] font-semibold inline-flex items-center gap-1">
                            {lead.budget ? (
                              <>
                                <DollarSign size={11} />
                                {lead.budget}
                              </>
                            ) : (
                              <span className="text-[var(--text-muted)]">No budget</span>
                            )}
                          </span>

                          <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            {lead.assignedTo && (
                              <UserAvatar
                                name={lead.assignedTo.name}
                                avatarUrl={lead.assignedTo.avatarUrl}
                                size={64}
                                className="w-5 h-5"
                                textClassName="text-[9px]"
                              />
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
