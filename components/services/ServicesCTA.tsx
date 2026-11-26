import Link from "next/link";
import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { ContactSettings } from "@/lib/api";

interface ServicesCTAProps {
  settings: ContactSettings;
}

export function ServicesCTA({ settings }: ServicesCTAProps) {
  const { whatsappNumber } = settings;
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      "Hi DevCore Solutions, I am interested in discussing an architectural overhaul or engineering engagement."
    )}`
    : "";

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-6 sm:mb-10 overflow-x-clip">
      <div className="relative overflow-hidden rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 shadow-xl p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-10 transition-colors hover:border-[var(--brand-primary)]/40">
        {/* Top Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/55 to-transparent"
        />

        {/* Ambient Gradient Glows */}
        <div
          className="absolute -right-20 -bottom-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[var(--brand-primary)]/15 blur-[100px] pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute -top-12 -left-12 w-60 sm:w-64 h-60 sm:h-64 rounded-full bg-[var(--border-strong)]/20 blur-[100px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col gap-3 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse shrink-0" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Immediate Technical Dispatch
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight leading-[1.15]">
            Planning an{" "}
            <span className="text-liquid-gradient">Architectural Overhaul</span>?
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-[var(--text-secondary)] leading-relaxed">
            Speak directly with our Principal Architects. We review your
            current repository, profiling traces, or infrastructure diagrams
            within 24 hours under mutual NDA.
          </p>

          <div className="self-center lg:self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] text-[11px] sm:text-xs text-[var(--text-muted)] font-mono mt-1 shadow-2xs">
            <ShieldCheck
              size={14}
              className="text-[var(--brand-primary)] shrink-0"
            />
            <span className="text-left">
              Mutual NDA strictly guaranteed prior to code repository ingestion
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-end gap-3 w-full lg:w-auto shrink-0">
          {/* WhatsApp Button (dynamic) */}
          {whatsappNumber && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-primary)] font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-sm btn-liquid-hover whitespace-nowrap"
            >
              <MessageCircle size={17} className="text-[var(--success)] shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          {/* Primary Start a Project Button */}
          <Link
            href="/contact"
            className="group w-full sm:w-auto h-11 px-6 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover whitespace-nowrap"
          >
            <span>Start a Project</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}