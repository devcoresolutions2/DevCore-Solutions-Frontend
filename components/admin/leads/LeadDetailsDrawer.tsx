"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Copy,
  Archive,
  RotateCcw,
  Loader2,
  AlertCircle,
  Send,
  Calendar,
  Globe,
  UserCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiGetAdminLeadById,
  apiUpdateAdminLead,
  apiAppendLeadNote,
  type LeadRecord,
  type LeadStatus,
  type LeadPriority,
  type LeadAssignee,
} from "@/lib/api";
import { LeadStatusBadge, LeadSourceBadge, LeadPriorityBadge } from "./LeadStatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";

const STATUS_OPTIONS: { value: LeadStatus; short: string }[] = [
  { value: "NEW", short: "NEW" },
  { value: "CONTACTED", short: "CONT" },
  { value: "PROPOSAL_SENT", short: "PROP" },
  { value: "WON", short: "WON" },
  { value: "ARCHIVED", short: "ARCH" },
];

interface LeadDetailsDrawerProps {
  leadId: string | null;
  assignees: LeadAssignee[];
  onClose: () => void;
  onLeadMutated: (updated: LeadRecord) => void;
}

export function LeadDetailsDrawer({
  leadId,
  assignees,
  onClose,
  onLeadMutated,
}: LeadDetailsDrawerProps) {
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [updating, setUpdating] = useState(false);

  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    if (!leadId) {
      setLead(null);
      return;
    }

    let active = true;
    setLoading(true);
    setErrorMsg("");

    apiGetAdminLeadById(leadId)
      .then((res) => {
        if (!active) return;
        setLead(res.lead);
        setFollowUpDate(
          res.lead.nextFollowUpAt ? res.lead.nextFollowUpAt.split("T")[0] : ""
        );
      })
      .catch((err) => {
        if (!active) return;
        setErrorMsg(err.message || "Failed to load lead details.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [leadId]);

  if (!leadId) return null;

  const handlePatch = async (payload: {
    status?: LeadStatus;
    priority?: LeadPriority;
    assignedToId?: string | null;
    nextFollowUpAt?: string | null;
  }) => {
    if (!lead) return;
    try {
      setUpdating(true);
      const res = await apiUpdateAdminLead(lead.id, payload);
      if (res.success && res.lead) {
        setLead(res.lead);
        onLeadMutated(res.lead);
        toast.success("Lead updated.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update lead.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || noteInput.trim().length < 2) return;

    try {
      setSavingNote(true);
      const res = await apiAppendLeadNote(lead.id, noteInput.trim());
      if (res.success && res.note) {
        // Reload full lead so both notes & activity timeline are synced
        const fresh = await apiGetAdminLeadById(lead.id);
        setLead(fresh.lead);
        onLeadMutated(fresh.lead);
        setNoteInput("");
        toast.success("Internal note appended.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to append note.");
    } finally {
      setSavingNote(false);
    }
  };

  const handleCopyDetails = () => {
    if (!lead) return;
    const lines = [
      `LEAD: ${lead.id}`,
      `Company: ${lead.company || "N/A"}`,
      `Contact: ${lead.name}${lead.jobTitle ? ` (${lead.jobTitle})` : ""}`,
      lead.email ? `Email: ${lead.email}` : null,
      lead.phone ? `Phone: ${lead.phone}` : null,
      `Source: ${lead.source} | Status: ${lead.status} | Priority: ${lead.priority}`,
      lead.budget ? `Budget: ${lead.budget} (${lead.currency})` : null,
      lead.timeline ? `Timeline: ${lead.timeline}` : null,
      lead.brief ? `Brief: ${lead.brief}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      toast.success("Lead details copied to clipboard.");
    });
  };

  const cleanPhoneDigits = lead?.phone ? lead.phone.replace(/\D/g, "") : "";

  return (
    <aside className="w-full xl:w-[460px] shrink-0 devcore-glass-card rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-xl flex flex-col overflow-hidden xl:sticky xl:top-6">
      {/* Header */}
      <div className="p-5 bg-[var(--bg-surface)]/80 border-b border-[var(--border-subtle)] flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] font-semibold text-[var(--brand-primary)]">
              {lead ? `LEAD-${lead.id.slice(-6).toUpperCase()}` : "LOADING"}
            </span>
            {lead && <LeadStatusBadge status={lead.status} />}
          </div>
          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] truncate">
            {lead ? lead.company || lead.name : "Inspecting Lead..."}
          </h3>
          {lead && (
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {lead.name}
              {lead.jobTitle ? ` — ${lead.jobTitle}` : ""}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close lead inspection drawer"
          className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-[var(--brand-primary)]" />
          <span className="font-mono text-xs text-[var(--text-muted)]">Loading lead record...</span>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="p-6">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Body */}
      {!loading && lead && (
        <>
          <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
            {/* Status Switcher */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>STAGE LIFECYCLE</span>
                {updating && <Loader2 size={12} className="animate-spin text-[var(--brand-primary)]" />}
              </div>
              <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {STATUS_OPTIONS.map((opt) => {
                  const active = lead.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={updating}
                      onClick={() => handlePatch({ status: opt.value })}
                      className={`py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                        active
                          ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                      }`}
                    >
                      {opt.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real Communication Taps */}
            {(lead.phone || lead.email) && (
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  Communication
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] flex flex-col items-center justify-center gap-1 text-center transition-colors"
                    >
                      <Phone size={16} className="text-[var(--brand-primary)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">Call</span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)]/40 border border-[var(--border-subtle)]/50 flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed">
                      <Phone size={16} />
                      <span className="text-xs">No Phone</span>
                    </div>
                  )}

                  {cleanPhoneDigits ? (
                    <a
                      href={`https://wa.me/${cleanPhoneDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] flex flex-col items-center justify-center gap-1 text-center transition-colors"
                    >
                      <MessageCircle size={16} className="text-[var(--success)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">WhatsApp</span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)]/40 border border-[var(--border-subtle)]/50 flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed">
                      <MessageCircle size={16} />
                      <span className="text-xs">No WA</span>
                    </div>
                  )}

                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] flex flex-col items-center justify-center gap-1 text-center transition-colors"
                    >
                      <Mail size={16} className="text-[var(--brand-primary)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">Email</span>
                    </a>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)]/40 border border-[var(--border-subtle)]/50 flex flex-col items-center justify-center gap-1 opacity-40 cursor-not-allowed">
                      <Mail size={16} />
                      <span className="text-xs">No Email</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact & Assignment Controls */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
                    Priority
                  </label>
                  <select
                    value={lead.priority}
                    disabled={updating}
                    onChange={(e) => handlePatch({ priority: e.target.value as LeadPriority })}
                    className="w-full h-9 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
                    Assigned To
                  </label>
                  <select
                    value={lead.assignedToId || ""}
                    disabled={updating}
                    onChange={(e) => handlePatch({ assignedToId: e.target.value || null })}
                    className="w-full h-9 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="">Unassigned</option>
                    {assignees.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
                  Next Follow-Up Date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="flex-1 h-9 px-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handlePatch({ nextFollowUpAt: followUpDate || null })}
                    className="h-9 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-medium text-[var(--text-primary)]"
                  >
                    Set
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5 font-mono text-[11px]">
                {lead.email && (
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--text-muted)]">Email:</span>
                    <span className="text-[var(--text-primary)] select-all truncate">{lead.email}</span>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--text-muted)]">Phone:</span>
                    <span className="text-[var(--text-primary)] select-all">{lead.phone}</span>
                  </div>
                )}
                {lead.website && (
                  <div className="flex justify-between gap-2">
                    <span className="text-[var(--text-muted)]">Website:</span>
                    <span className="text-[var(--brand-primary)] truncate inline-flex items-center gap-1">
                      <Globe size={11} />
                      {lead.website}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquiry Scope & Brief */}
            <div className="p-4 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  Inquiry Details
                </span>
                <LeadSourceBadge source={lead.source} />
              </div>

              {lead.services && lead.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {lead.services.map((srv) => (
                    <span
                      key={srv}
                      className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--brand-primary)]"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              )}

              {(lead.budget || lead.timeline) && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {lead.budget && (
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">EST. BUDGET</span>
                      <span className="font-mono font-bold text-[var(--text-primary)]">
                        {lead.budget} ({lead.currency})
                      </span>
                    </div>
                  )}
                  {lead.timeline && (
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">TIMELINE</span>
                      <span className="font-medium text-[var(--text-primary)]">{lead.timeline}</span>
                    </div>
                  )}
                </div>
              )}

              {lead.subject && (
                <div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">SUBJECT</span>
                  <span className="font-semibold text-[var(--text-primary)]">{lead.subject}</span>
                </div>
              )}

              {lead.brief && (
                <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {lead.brief}
                </div>
              )}

              {/* Attribution (only show real captured fields) */}
              {(lead.pageUrl || lead.referrer || lead.utm) && (
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1 font-mono text-[11px] text-[var(--text-muted)]">
                  {lead.pageUrl && (
                    <div className="flex justify-between gap-2">
                      <span>Landing Page:</span>
                      <span className="text-[var(--text-primary)] truncate">{lead.pageUrl}</span>
                    </div>
                  )}
                  {lead.referrer && (
                    <div className="flex justify-between gap-2">
                      <span>Referrer:</span>
                      <span className="text-[var(--text-primary)] truncate">{lead.referrer}</span>
                    </div>
                  )}
                  {lead.utm && Object.keys(lead.utm).length > 0 && (
                    <div className="flex justify-between gap-2">
                      <span>UTM:</span>
                      <span className="text-[var(--brand-primary)] truncate">
                        {Object.entries(lead.utm)
                          .map(([k, v]) => `${k}=${v}`)
                          .join(" • ")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Append-Only Internal Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                  Internal Notes (Append-Only)
                </span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {lead.notes?.length || 0} entries
                </span>
              </div>

              {lead.notes && lead.notes.length > 0 ? (
                <div className="space-y-2">
                  {lead.notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <UserAvatar
                            name={n.author.name}
                            avatarUrl={n.author.avatarUrl}
                            size={64}
                            className="w-5 h-5"
                            textClassName="text-[9px]"
                          />
                          <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {n.author.name}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--brand-primary)]">
                            {n.author.role}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] pl-7 whitespace-pre-wrap">
                        {n.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[var(--bg-surface)]/40 border border-dashed border-[var(--border-subtle)] text-center font-mono text-[11px] text-[var(--text-muted)]">
                  No internal notes yet.
                </div>
              )}

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Append an auditable internal note..."
                  className="w-full p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingNote || noteInput.trim().length < 2}
                    className="h-9 px-3.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {savingNote ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    <span>Append Note</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Activity & Audit Timeline */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
                Activity &amp; Audit Timeline
              </span>
              {lead.history && lead.history.length > 0 ? (
                <div className="space-y-2.5 pl-2 border-l border-[var(--border-subtle)]">
                  {lead.history.map((ev) => (
                    <div key={ev.id} className="pl-3 relative text-xs">
                      <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] absolute -left-[4.5px] top-1.5" />
                      <div className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                        {ev.eventType} {ev.details ? `— ${ev.details}` : ""}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                        <Clock size={10} />
                        <span>{new Date(ev.createdAt).toLocaleString()}</span>
                        {ev.actor && <span>• by {ev.actor.name}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-[11px] text-[var(--text-muted)]">No activity recorded.</p>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 bg-[var(--bg-surface)]/80 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCopyDetails}
              className="h-9 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5"
            >
              <Copy size={13} />
              <span>Copy Details</span>
            </button>

            {lead.status === "ARCHIVED" ? (
              <button
                type="button"
                disabled={updating}
                onClick={() => handlePatch({ status: "NEW" })}
                className="h-9 px-3.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>Restore Lead</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={updating}
                onClick={() => handlePatch({ status: "ARCHIVED" })}
                className="h-9 px-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Archive size={13} />
                <span>Archive</span>
              </button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
