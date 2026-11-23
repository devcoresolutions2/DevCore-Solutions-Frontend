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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-8">
      <div className="relative overflow-hidden rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 shadow-xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Ambient Gradient Glows */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[var(--brand-primary)]/15 blur-[100px] pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[var(--border-strong)]/20 blur-[100px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Text Content */}
        <div className="relative flex flex-col gap-2.5 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--brand-primary)] font-bold">
              Immediate Technical Dispatch
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight">
            Planning an Architectural Overhaul?
          </h2>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Speak directly with our Principal Architects. We review your current repository, profiling traces, or infrastructure diagrams within 24 hours under mutual NDA.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs text-[var(--text-muted)] font-mono mt-1">
            <ShieldCheck size={14} className="text-[var(--brand-primary)]" />
            <span>Mutual NDA strictly guaranteed prior to code repository ingestion</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          {/* WhatsApp Button (dynamic) */}
          {whatsappNumber && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-11 px-5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-primary)] font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-sm btn-liquid-hover"
            >
              <MessageCircle size={17} className="text-[var(--success)]" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          {/* Primary Start a Project Button */}
          <Link
            href="/contact"
            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover whitespace-nowrap"
          >
            <span>Start a Project</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
