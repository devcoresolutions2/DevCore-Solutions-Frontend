"use client";

import React from "react";
import { Calculator, PhoneCall, Calendar, Mail } from "lucide-react";
import type { LeadStatus, LeadSource, LeadPriority } from "@/lib/api";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 font-mono text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          NEW
        </span>
      );
    case "CONTACTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 font-mono text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          CONTACTED
        </span>
      );
    case "PROPOSAL_SENT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          PROPOSAL_SENT
        </span>
      );
    case "WON":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          WON
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-mono text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
          ARCHIVED
        </span>
      );
  }
}

export function LeadPriorityBadge({ priority }: { priority: LeadPriority }) {
  const styles: Record<LeadPriority, string> = {
    LOW: "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)]",
    MEDIUM: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    HIGH: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
    URGENT: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

export function LeadSourceBadge({ source }: { source: LeadSource }) {
  const map: Record<LeadSource, { label: string; icon: React.ReactNode }> = {
    ESTIMATOR: { label: "Cost Estimator", icon: <Calculator size={12} /> },
    QUICK_CALLBACK: { label: "Quick Callback", icon: <PhoneCall size={12} /> },
    BOOKING: { label: "Booking", icon: <Calendar size={12} /> },
    CONTACT_FORM: { label: "Contact Form", icon: <Mail size={12} /> },
  };
  const info = map[source] || { label: source, icon: <Mail size={12} /> };

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)]">
      {info.icon}
      <span>{info.label}</span>
    </span>
  );
}
