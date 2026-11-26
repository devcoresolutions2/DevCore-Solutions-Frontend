"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EngagementTier } from "@/lib/api";
import {
  ShieldCheck,
  ArrowRight,
  Users,
  Clock,
  Layers,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";

interface EngagementMatrixProps {
  tiers: EngagementTier[];
}

export function EngagementMatrix({ tiers }: EngagementMatrixProps) {
  const [selectedTier, setSelectedTier] = useState<EngagementTier | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (!selectedTier) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTier(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTier]);

  const openModal = (tier: EngagementTier, index: number) => {
    setSelectedTier(tier);
    setSelectedIndex(index);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/4 w-80 h-56 max-w-[85vw] bg-[var(--brand-primary)]/8 blur-[120px] -z-10"
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-4 bg-[var(--brand-primary)]/60" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Contractual Rigor
            </span>
            <span className="md:hidden h-px w-4 bg-[var(--brand-primary)]/60" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight leading-[1.15]">
            Service Engagement{" "}
            <span className="text-liquid-gradient">Matrix</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed mt-0.5">
            Select any engagement model to inspect full SLA guarantees,
            deployment cadence, and governance protocols. Zero junior staffing.
          </p>
        </div>

        <div className="self-center md:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] shadow-sm shrink-0">
          <ShieldCheck size={14} className="text-[var(--brand-primary)]" />
          <span className="font-mono text-[11px] text-[var(--text-secondary)] font-semibold uppercase tracking-wide">
            Click Any Tier for Full Spec
          </span>
        </div>
      </div>

      {/* Main Matrix Container */}
      <div className="relative w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-lg overflow-hidden">
        {/* Top Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/50 to-transparent z-10"
        />

        {/* Desktop & Tablet Header Bar */}
        <div className="hidden md:flex items-center justify-between bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-[11px] uppercase tracking-wider font-bold border-b border-[var(--border-subtle)] px-6 py-4">
          <div className="w-[34%] text-left">Engagement Tier</div>
          <div className="w-[22%] text-left">SLA Guarantee</div>
          <div className="w-[28%] text-left">Engineering Composition</div>
          <div className="w-[16%] text-right">Specification</div>
        </div>

        {/* Rows List */}
        <div className="divide-y divide-[var(--border-subtle)]">
          {tiers.map((tier, index) => {
            const tierNum = String(index + 1).padStart(2, "0");

            return (
              <div
                key={tier.id}
                role="button"
                tabIndex={0}
                onClick={() => openModal(tier, index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(tier, index);
                  }
                }}
                className="group w-full cursor-pointer px-4 sm:px-6 py-5 hover:bg-[var(--bg-surface)]/80 transition-colors flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-3.5 md:gap-0"
              >
                {/* Col 1: Engagement Tier */}
                <div className="w-full md:w-[34%] flex flex-col md:flex-row items-center gap-2.5 md:gap-3.5 min-w-0 pr-0 md:pr-4">
                  <span className="w-8 h-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/45 group-hover:bg-[var(--brand-primary)]/10 group-hover:text-[var(--brand-primary)] font-mono text-xs text-[var(--text-muted)] font-bold inline-flex items-center justify-center shrink-0 transition-colors">
                    {tierNum}
                  </span>
                  <div className="flex flex-col items-center md:items-start min-w-0">
                    <span className="font-display font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate max-w-full">
                      {tier.tier}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5 truncate max-w-full">
                      {tier.subtitle}
                    </span>
                  </div>
                </div>

                {/* Col 2: SLA Guarantee */}
                <div className="w-full md:w-[22%] flex items-center justify-center md:justify-start gap-2 pr-0 md:pr-4">
                  <span className="md:hidden font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                    SLA:
                  </span>
                  <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-[13px] font-bold text-[var(--brand-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                    <span>{tier.sla}</span>
                  </div>
                </div>

                {/* Col 3: Engineering Composition (Single-Line Centered Badge on Mobile) */}
                <div className="w-full md:w-[28%] flex items-center justify-center md:justify-start pr-0 md:pr-4 min-w-0">
                  <span className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/35 text-[var(--text-primary)] font-mono text-[11px] font-semibold shadow-2xs max-w-full">
                    <Users
                      size={12}
                      className="text-[var(--brand-primary)] shrink-0"
                    />
                    <span className="truncate">{tier.composition}</span>
                  </span>
                </div>

                {/* Col 4: Inspect Modal Trigger */}
                <div className="w-full md:w-[16%] flex justify-center md:justify-end pt-0.5 md:pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(tier, index);
                    }}
                    className="w-full max-w-[220px] md:max-w-none md:w-auto h-9 px-4 rounded-xl bg-[var(--bg-surface)] group-hover:bg-[var(--brand-primary)] group-hover:text-[var(--brand-contrast)] group-hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL SPECIFICATION GLASS MODAL */}
      {selectedTier && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="engagement-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedTier(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl p-5 sm:p-8 flex flex-col gap-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Specular Edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/70 to-transparent"
            />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="self-start px-2.5 py-0.5 rounded-md bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/30 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                  Tier {String(selectedIndex + 1).padStart(2, "0")} {"//"}{" "}
                  Contractual Architecture
                </span>
                <h3
                  id="engagement-modal-title"
                  className="font-display text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1"
                >
                  {selectedTier.tier}
                </h3>
                <p className="font-mono text-xs text-[var(--text-muted)]">
                  {selectedTier.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTier(null)}
                aria-label="Close modal"
                className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>

            {/* Full Specification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  SLA Guarantee
                </span>
                <span className="font-mono text-sm font-bold text-[var(--brand-primary)]">
                  {selectedTier.sla}
                </span>
                <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedTier.slaDetail}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1.5 font-bold">
                  <Users size={12} className="text-[var(--brand-primary)]" />
                  Engineering Composition
                </span>
                <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
                  {selectedTier.composition}
                </span>
                <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedTier.compositionDetail}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1.5 font-bold">
                  <Clock size={12} className="text-[var(--brand-primary)]" />
                  Deployment Cadence
                </span>
                <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                  {selectedTier.cadence}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  Automated CI/CD &amp; canary rollback gates
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] inline-flex items-center gap-1.5 font-bold">
                  <Layers size={12} className="text-[var(--brand-primary)]" />
                  Governance &amp; Audit
                </span>
                <div className="flex items-start gap-2 mt-0.5">
                  <ShieldCheck
                    size={16}
                    className="text-[var(--brand-primary)] mt-0.5 shrink-0"
                  />
                  <span className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                    {selectedTier.governance}
                  </span>
                </div>
              </div>
            </div>

            {/* Contractual Assurance Strip */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-secondary)]">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  className="text-[var(--brand-primary)] shrink-0"
                />
                <span>100% Principal &amp; Staff Engineer Allocation</span>
              </div>
              <span className="text-[11px] text-[var(--text-muted)]">
                Mutual NDA Included
              </span>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setSelectedTier(null)}
                className="w-full sm:w-auto h-10 px-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>

              <Link
                href={`/contact?service=${encodeURIComponent(
                  selectedTier.serviceQuery
                )}&tier=${encodeURIComponent(selectedTier.tier)}`}
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)] font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-sm btn-liquid-hover whitespace-nowrap"
              >
                <span>{selectedTier.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}