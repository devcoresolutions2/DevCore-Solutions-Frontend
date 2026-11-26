"use client";

import { X, Calendar, Clock, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingUrl?: string;
}

export function BookingDialog({ isOpen, onClose, bookingUrl }: BookingDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const url = bookingUrl || "https://cal.com/devcore-solutions/discovery";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-2xl space-y-6 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
              ENGINEERING DISCOVERY
            </span>
            <h3 id="booking-dialog-title" className="font-display font-bold text-xl text-[var(--text-primary)]">
              Schedule Architecture Consultation
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              30-minute direct technical review with a DevCore Principal Architect.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Timezone and Slot Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Timezone: <strong>Asia/Dhaka (GMT+6)</strong></span>
            <span className="text-[var(--success)] font-semibold">LIVE SLOTS</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <Clock size={15} className="text-[var(--brand-primary)]" />
              <span>Session Agenda:</span>
            </div>
            <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 list-disc list-inside">
              <li>High-level requirements, data models & system topology</li>
              <li>Estimated timelines, budget allocation & resource scoping</li>
              <li>Security constraints, SLA mandates & deployment architecture</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Cancel
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm"
          >
            <Calendar size={14} />
            <span>Open Dedicated Scheduler</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
