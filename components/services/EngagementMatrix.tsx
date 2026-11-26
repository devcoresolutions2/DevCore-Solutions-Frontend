import Link from "next/link";
import { EngagementTier } from "@/lib/api";
import { Shield, ShieldCheck, CheckCircle2, Lock, ArrowRight } from "lucide-react";

interface EngagementMatrixProps {
  tiers: EngagementTier[];
}

export function EngagementMatrix({ tiers }: EngagementMatrixProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col gap-2 mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
          Contractual Rigor
        </span>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight">
          Service Engagement Matrix
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Every tier includes guaranteed contractual SLAs and dedicated Principal engineers. We do not maintain junior or mid-level staffing pools.
        </p>
      </div>

      {/* Table Card */}
      <div className="w-full overflow-hidden rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs uppercase tracking-wider border-b border-[var(--border-subtle)]">
                <th className="py-4 px-5 font-bold">Engagement Tier</th>
                <th className="py-4 px-5 font-bold">SLA Guarantee</th>
                <th className="py-4 px-5 font-bold">Engineering Composition</th>
                <th className="py-4 px-5 font-bold">Deployment Cadence</th>
                <th className="py-4 px-5 font-bold">Governance & Audit</th>
                <th className="py-4 px-5 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-sans text-xs text-[var(--text-primary)]">
              {tiers.map((tier) => (
                <tr
                  key={tier.id}
                  className="hover:bg-[var(--bg-surface)]/70 transition-colors"
                >
                  {/* Tier */}
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-sm text-[var(--text-primary)]">
                        {tier.tier}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5">
                        {tier.subtitle}
                      </span>
                    </div>
                  </td>

                  {/* SLA */}
                  <td className="py-4 px-5">
                    <span className="font-mono text-xs font-bold text-[var(--brand-primary)] block">
                      {tier.sla}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5 block">
                      {tier.slaDetail}
                    </span>
                  </td>

                  {/* Composition */}
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono text-[11px] font-semibold">
                      {tier.composition}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5 block">
                      {tier.compositionDetail}
                    </span>
                  </td>

                  {/* Deployment Cadence */}
                  <td className="py-4 px-5 font-mono text-xs text-[var(--text-secondary)]">
                    {tier.cadence}
                  </td>

                  {/* Governance */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-primary)]">
                      <ShieldCheck size={15} className="text-[var(--brand-primary)] shrink-0" />
                      <span className="font-medium">{tier.governance}</span>
                    </div>
                  </td>

                  {/* Action CTA */}
                  <td className="py-4 px-5 text-right">
                    <Link
                      href={`/contact?service=${encodeURIComponent(
                        tier.serviceQuery
                      )}&tier=${encodeURIComponent(tier.tier)}`}
                      className="h-8 px-3.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-sm btn-liquid-hover whitespace-nowrap"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
