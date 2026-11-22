import Link from "next/link";
import { Rocket, MessageSquare, ShieldCheck } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { type ShowcaseItem } from "@/lib/api";

interface HeroProps {
  newestRelease?: ShowcaseItem | null;
}

export function Hero({ newestRelease }: HeroProps) {
  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801700000000"}?text=${encodeURIComponent("Hi DevCore, I'd like to start a project.")}`;

  return (
    <section
      id="hero"
      aria-label="Hero section"
      className="pt-8 pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">

          {/* Release Pill */}
          {newestRelease && (
            <ReleasePill dot dotColor="var(--success)" className="animate-text-reveal">
              <span className="font-bold">NEW:</span>&nbsp;
              {newestRelease.name} — {newestRelease.tagline}
            </ReleasePill>
          )}

          {/* Headline */}
          <h1
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-[var(--text-primary)] tracking-tight leading-[1.08] animate-text-reveal delay-100"
          >
            Architecting Resilient Platforms for&nbsp;
            <span className="text-liquid-gradient">High-Scale Enterprise.</span>
          </h1>

          {/* Supporting copy */}
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl animate-text-reveal delay-200">
            We engineer mission-critical SaaS, cloud infrastructure, distributed microservices, and AI-enabled software — built for zero-drift performance from day one.
          </p>

          {/* Official tagline badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] animate-text-reveal delay-300">
            <ShieldCheck size={16} className="text-[var(--brand-primary)]" aria-hidden="true" />
            "Building the Digital Core for a Smarter Tomorrow."
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2 animate-text-reveal delay-400">
            <Link
              href="/contact"
              className="btn-liquid-hover inline-flex items-center gap-2 text-sm font-semibold px-6 h-12 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-md hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
            >
              <Rocket size={16} aria-hidden="true" />
              Start a Project
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-5 h-12 rounded-[10px] border border-[var(--border-strong)] bg-[var(--bg-elevated)]/65 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <MessageSquare size={16} className="text-[var(--success)]" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>

          {/* KPIs */}
          <div
            className="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--border-subtle)] w-full max-w-lg animate-text-reveal delay-500"
            aria-label="Key performance metrics"
          >
            {[
              { value: "99.998%", label: "Core SLA Availability" },
              { value: "< 14ms", label: "P99 Edge Latency" },
              { value: "420k+", label: "Production IOPS" },
            ].map((kpi) => (
              <div key={kpi.label}>
                <div className="font-mono font-bold text-2xl sm:text-3xl text-[var(--text-primary)]" aria-label={`${kpi.value} ${kpi.label}`}>
                  {kpi.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-medium">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — glass telemetry widget */}
        <div className="lg:col-span-5 animate-text-reveal delay-200">
          <div className="devcore-glass-card p-6 animate-card-float" role="img" aria-label="Live system telemetry dashboard">
            {/* Terminal header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--error)]/60 border border-[var(--error)]" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-[var(--warning)]/60 border border-[var(--warning)]" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-[var(--success)]/60 border border-[var(--success)]" aria-hidden="true" />
                <span className="ml-2 font-mono text-xs font-semibold text-[var(--brand-primary)]">
                  devcore-kernel-v3.0.4
                </span>
              </div>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--success)] border border-[var(--border-subtle)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
                ACTIVE
              </span>
            </div>

            {/* Telemetry body */}
            <div className="mt-4 space-y-3 font-mono text-xs text-[var(--text-primary)]">
              {/* Throughput */}
              <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] shadow-sm">
                <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] pb-1 border-b border-[var(--bg-surface)]">
                  <span>CLUSTER NODE: US-EAST-01A</span>
                  <span className="text-[var(--success)]">HEALTHY</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[var(--brand-primary)]">Throughput</span>
                  <span className="font-bold text-sm text-[var(--text-primary)]">2.84 Gbps</span>
                </div>
                <div
                  className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full mt-1.5 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={78}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Throughput at 78%"
                >
                  <div className="bg-[var(--brand-primary)] h-full rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              {/* Log stream */}
              <div className="bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border-subtle)] space-y-1.5">
                {[
                  { ts: "14:22:04.18", level: "INFO", msg: "k8s_autoscaler: scaled to 36 pods", color: "var(--success)" },
                  { ts: "14:22:06.90", level: "EVENT", msg: "TLS 1.3 cert rotated [zero-downtime]", color: "var(--brand-primary)" },
                  { ts: "14:22:09.11", level: "METRIC", msg: "Mesh latency normalized: 11.2ms", color: "var(--success)" },
                ].map((log) => (
                  <div key={log.ts} className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--text-muted)] text-[10px]">{log.ts}</span>
                    <span className="font-bold" style={{ color: log.color }}>{log.level}</span>
                    <span className="truncate">{log.msg}</span>
                  </div>
                ))}
              </div>

              {/* Security */}
              <div className="devcore-glass-inset p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)]">
                    <ShieldCheck size={16} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">mTLS Strict Zero-Trust</div>
                    <div className="text-[10px] text-[var(--text-muted)]">SHA-256 eBPF Packet Filter</div>
                  </div>
                </div>
                <span className="text-xs text-[var(--success)] font-semibold">100% PASS</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
              <span>DevCore Telemetry Feed</span>
              <span>Sync interval: 500ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
