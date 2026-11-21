import { GitCommit } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";

const STAGES = [
  {
    num: "01",
    title: "Discovery & PRD",
    weeks: "WEEKS 1-2",
    desc: "Requirements synthesis, technical constraint mapping, non-functional requirements (SLA/QPS), and data model entity definitions.",
    deliverable: "Engineered PRD & Technical Spec",
  },
  {
    num: "02",
    title: "Architecture & UI/UX",
    weeks: "WEEKS 3-5",
    desc: "System topology schematics, API contract schemas (OpenAPI/Protobuf), database normalization, and interactive Figma design systems.",
    deliverable: "System RFC & High-Fidelity UI",
  },
  {
    num: "03",
    title: "Agile Full-Stack Build",
    weeks: "WEEKS 6-12",
    desc: "Two-week sprint cadences, automated CI/CD pipeline tests, code reviews with 90%+ branch coverage, and weekly staging deployments.",
    deliverable: "Staging Builds & Continuous Demo",
  },
  {
    num: "04",
    title: "Deployment & Scale",
    weeks: "ONGOING",
    desc: "Blue/green production cutover, load stress validation, eBPF telemetry hooks, runbook documentation, and 24/7 Tier-3 on-call rotation.",
    deliverable: "Zero-Downtime Live Release & SLA",
  },
];

export function ProcessTimeline() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="py-24 px-4 sm:px-6 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ReleasePill>
            <GitCommit size={13} aria-hidden="true" />
            &nbsp;DISCIPLINED DELIVERY
          </ReleasePill>
          <h2
            id="process-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] mt-3 tracking-tight"
          >
            Our 4-Stage Engineering Process
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Eliminating guesswork through rigorous engineering stages from discovery to planet-scale telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map((stage) => (
            <GlassCard key={stage.num} className="p-6 border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-extrabold text-2xl text-[var(--brand-primary)]">
                    {stage.num}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {stage.weeks}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{stage.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{stage.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                <span className="font-mono text-[11px] text-[var(--text-muted)] block uppercase tracking-wide">
                  Deliverable:
                </span>
                <span className="font-display text-xs font-semibold text-[var(--text-primary)] mt-0.5 block">
                  {stage.deliverable}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
