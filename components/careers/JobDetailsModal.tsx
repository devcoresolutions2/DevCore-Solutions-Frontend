"use client";

import { useEffect, useRef } from "react";
import { X, MapPin, Briefcase, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { JobItem } from "@/lib/api";

interface JobDetailsModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: JobItem) => void;
}

export function JobDetailsModal({ job, isOpen, onClose, onApply }: JobDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl devcore-glass-card border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-2xl p-6 sm:p-8 flex flex-col gap-6 animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--border-subtle)] font-bold uppercase">
                {job.department}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                <MapPin size={12} /> {job.location} ({job.workplaceType})
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">&bull; {job.type}</span>
            </div>
            <h2 id="job-details-title" className="font-display text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {job.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
            About the Role
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
              Core Responsibilities
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              {job.responsibilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
              Candidate Qualifications
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              {job.requirements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
          <div className="font-mono text-xs text-[var(--text-muted)]">
            {job.salary && <span>{job.salary}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(job);
                onClose();
              }}
              className="h-10 px-6 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs inline-flex items-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover"
            >
              <span>Apply For This Role</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
