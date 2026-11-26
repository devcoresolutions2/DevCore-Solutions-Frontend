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

  const showWorkplace =
    job.workplaceType &&
    !job.location?.toLowerCase().includes(job.workplaceType.toLowerCase());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl flex flex-col animate-scaleUp"
      >
        {/* Pinned Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-semibold">
                {job.department}
              </span>
              <span className="text-[var(--text-secondary)] flex items-center gap-1 font-medium">
                <MapPin size={12} className="text-[var(--text-tertiary)]" />
                {job.location}
                {showWorkplace ? ` (${job.workplaceType})` : ""}
              </span>
              <span className="text-[var(--text-tertiary)]">&bull;</span>
              <span className="text-[var(--text-secondary)] font-medium">{job.type}</span>
            </div>
            <h2 id="job-details-title" className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {job.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
              About the Role
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Core Responsibilities
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[var(--brand-primary)] shrink-0 mt-1" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Candidate Qualifications
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[var(--brand-primary)] shrink-0 mt-1" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-medium text-[var(--text-secondary)]">
            {job.salary && <span>{job.salary}</span>}
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(job);
                onClose();
              }}
              className="h-10 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs inline-flex items-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-sm"
            >
              <span>Apply for this Role</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
