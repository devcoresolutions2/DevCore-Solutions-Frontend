"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
  ArrowRight,
  RotateCcw,
  MessageCircle,
  Phone,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { ContactSettings, ShowcaseItem } from "@/lib/api";
import { FullEstimatorInput } from "@/lib/validations/leads";
import { cn } from "@/lib/utils";

interface ConfirmationViewProps {
  submission: Partial<FullEstimatorInput> & { reference?: string };
  settings: ContactSettings;
  relatedItems?: ShowcaseItem[];
  onReset?: () => void;
}

export function ConfirmationView({
  submission,
  settings,
  relatedItems = [],
  onReset,
}: ConfirmationViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Scroll to top and focus heading for screen readers
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus();

    toast.success("Inquiry transmitted successfully. Ticket queued for review.", {
      duration: 6000,
    });
  }, []);

  const {
    fullName = "",
    workEmail = "",
    company = "",
    services = [],
    timeline = "",
    budgetTier = "",
    reference = "",
  } = submission;

  const hasDigestData = Boolean(
    fullName || workEmail || company || services.length > 0 || timeline || budgetTier
  );

  const waHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        reference
          ? `Hello DevCore, following up on our project submission (Ref: ${reference}).`
          : "Hello DevCore, following up on our project submission."
      )}`
    : "";

  return (
    <div className="w-full flex flex-col items-center py-6 animate-fadeIn">
      {/* 860px Main Confirmation Card */}
      <div className="w-full max-w-[860px] devcore-glass-card rounded-2xl p-6 sm:p-10 shadow-2xl relative flex flex-col gap-8">
        {/* Header Success Cluster */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--success)]/40 flex items-center justify-center shadow-lg">
            <CheckCircle2 size={36} className="text-[var(--success)]" strokeWidth={2.5} />
          </div>

          <div className="space-y-2 max-w-2xl">
            {reference && (
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
                INQUIRY QUEUED &bull; REF: {reference}
              </span>
            )}
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight outline-none"
            >
              Thanks, we received your project details!
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
              Your architectural requirements have been logged into our review queue. A principal engineer is assigned to analyze your scope and feasibility constraints.
            </p>
          </div>
        </div>

        {/* Guaranteed Response Promise Banner */}
        {settings.callbackPromise && (
          <div className="w-full rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Guaranteed Response Commitment
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] font-mono text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  {settings.callbackPromise}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                A systems architect will review your technical brief and respond directly via email or scheduled call.
              </p>
            </div>
          </div>
        )}

        {/* Submission Digest Card (rendered only when user provided data) */}
        {hasDigestData && (
          <div className="w-full rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
              <span className="uppercase tracking-wider font-semibold">Submitted Scope Digest</span>
              {reference && <span className="text-[var(--brand-primary)]">Ref: {reference}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {(fullName || workEmail || company) && (
                <div>
                  <span className="block text-[var(--text-muted)] mb-0.5">Contact</span>
                  {fullName && <span className="font-semibold text-[var(--text-primary)] block truncate">{fullName}</span>}
                  {company && <span className="text-[var(--text-muted)] truncate block">{company}</span>}
                  {workEmail && <span className="text-[var(--text-secondary)] truncate block">{workEmail}</span>}
                </div>
              )}

              {services.length > 0 && (
                <div>
                  <span className="block text-[var(--text-muted)] mb-0.5">Selected Domains</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {services.map((svc) => (
                      <span
                        key={svc}
                        className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-primary)]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(timeline || budgetTier) && (
                <div>
                  <span className="block text-[var(--text-muted)] mb-0.5">Timeline & Budget</span>
                  {timeline && <span className="font-semibold text-[var(--text-primary)] block">{timeline}</span>}
                  {budgetTier && <span className="text-[var(--text-muted)] block">{budgetTier}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3-Step Next Steps Roadmap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-sm text-[var(--text-primary)]">
              What Happens Next
            </h2>
            <span className="text-[11px] font-mono text-[var(--brand-primary)] font-semibold">
              PHASE 1 ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono text-[10px] font-bold">
                STAGE 01
              </span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Brief Evaluation</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Our engineering leads review your technical stack, throughput expectations, and target timeline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono text-[10px] font-bold">
                STAGE 02
              </span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Direct Outreach</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We reach out via your designated email or phone with preliminary notes and clarifying questions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="inline-block px-2 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono text-[10px] font-bold">
                STAGE 03
              </span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Discovery Call</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We hold a 30-minute scoping session to map out milestones, architecture schematics, and firm estimates.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm"
            >
              <Layers size={14} />
              <span>Explore Case Studies</span>
              <ArrowRight size={13} />
            </Link>

            {settings.bookingUrl && (
              <a
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-semibold text-[var(--text-primary)] transition-colors shadow-sm"
              >
                <Calendar size={14} className="text-[var(--brand-primary)]" />
                <span>Book Calendar Slot</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2"
            >
              <RotateCcw size={13} />
              <span>Submit Another Inquiry</span>
            </button>
          )}
        </div>

        {/* Fast Contact Strip */}
        <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                Need immediate escalation?
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                Direct dispatch channels are open for active production requirements.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors shadow-sm"
              >
                <MessageCircle size={14} className="text-[var(--success)]" />
                <span>WhatsApp</span>
              </a>
            )}
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors shadow-sm"
              >
                <Phone size={14} className="text-[var(--brand-primary)]" />
                <span>{settings.phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Related Real Projects / Showcase at bottom */}
      {relatedItems.length > 0 && (
        <div className="w-full max-w-[860px] mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Relevant Production Blueprints
            </span>
            <Link
              href="/projects"
              className="text-xs font-semibold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>View all portfolio</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedItems.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                href={`/launches/${item.slug}`}
                className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex flex-col justify-between group shadow-sm bg-[var(--bg-elevated)]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                    <span>{item.category}</span>
                    <span className="text-[var(--brand-primary)] font-semibold">{item.badge}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {item.tagline || item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--brand-primary)]">
                  <span>Explore Architecture</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
