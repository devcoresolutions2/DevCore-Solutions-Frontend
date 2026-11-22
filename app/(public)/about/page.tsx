import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Cpu, ShieldCheck, Award, Users } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { ReleasePill } from "@/components/glass/ReleasePill";

export const metadata: Metadata = {
  title: "About DevCore Solutions — Engineering Craftsmanship",
  description: "DevCore Solutions is an enterprise software development and distributed systems engineering company.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">About</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <ReleasePill className="mb-3">
          <Cpu size={13} className="text-[var(--brand-primary)]" />
          &nbsp;OUR ENGINEERING MANIFESTO
        </ReleasePill>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Engineering the Digital Core with Zero Compromise
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
          DevCore Solutions was founded on a singular conviction: critical business infrastructure requires uncompromising mathematical rigor, deterministic architecture, and genuine technical craftsmanship.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <GlassCard className="p-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-sm mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
            Deterministic Reliability
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            We architect for real-world chaos: network partitions, high-concurrency spikes, and hostile latency environments. Zero split-brain states and guaranteed idempotency.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-sm mb-6">
            <Award size={24} />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
            Strict Code Quality
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            End-to-end type safety, automated continuous verification pipelines, strict domain modeling, and zero technical debt handoffs.
          </p>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-sm mb-6">
            <Users size={24} />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
            Principal-Led Execution
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Direct collaboration with seasoned software architects and engineers. Transparent communication, sprint demos, and fixed milestone pricing.
          </p>
        </GlassCard>
      </div>

      {/* Call to action */}
      <GlassCard className="p-8 sm:p-12 text-center bg-[var(--bg-surface)]">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mb-3">
          Build With DevCore Solutions
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
          Whether you need a full-lifecycle SaaS platform, high-throughput cloud engine, or AI pipeline integration, we are ready to engineer your core.
        </p>
        <Link
          href="/contact"
          className="btn-liquid-hover inline-flex items-center gap-2 text-xs font-semibold px-6 py-3 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm hover:bg-[var(--brand-hover)]"
        >
          <span>Discuss Your Architecture</span>
          &rarr;
        </Link>
      </GlassCard>
    </div>
  );
}
