import Link from "next/link";
import { CheckCircle2, Activity, Gauge, GitBranch, Server, Zap } from "lucide-react";

export function ServicesHero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
      {/* Ambient Lighting Gradient */}
      <div
        className="absolute -top-10 left-1/3 w-[36rem] h-[18rem] bg-[var(--brand-primary)]/10 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6">
        {/* Breadcrumb + Release Pill Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
              DEVCORE
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <span>SYSTEMS</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-primary)] font-semibold">SERVICES & CAPABILITIES</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm">
            <CheckCircle2 size={13} className="text-[var(--brand-primary)]" />
            <span className="font-mono text-[11px] text-[var(--text-secondary)] tracking-wide uppercase font-semibold">
              ENTERPRISE DISCIPLINES &bull; SLA-BACKED DELIVERY
            </span>
          </div>
        </div>

        {/* Main Headline & Editorial Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-1">
          <div className="lg:col-span-8 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Deterministic Execution Matrix
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight font-extrabold max-w-3xl leading-[1.12]">
              Engineered Services & Architectural Capabilities
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Rigorous engineering squads delivering mission-critical cloud infrastructure, high-throughput distributed systems, and deterministic AI pipelines with mathematically bounded latency.
            </p>
          </div>

          {/* System Fingerprint / Realtime Telemetry HUD Snippet */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 p-4 rounded-xl devcore-glass-card shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                Infrastructure Status
              </span>
              <div className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="font-mono text-[11px] text-[var(--success)] font-bold">
                  CLUSTER ACTIVE
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="text-[var(--text-muted)]">Active Topology:</span>
              <span className="text-[var(--text-primary)] font-medium">Multi-Region us-east/eu-west</span>
            </div>

            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="text-[var(--text-muted)]">Trace Target:</span>
              <span className="text-[var(--text-primary)] font-medium">P99.9 Bound &lt; 14ms</span>
            </div>

            <div className="w-full bg-[var(--bg-surface)] rounded-full h-1 mt-1 overflow-hidden border border-[var(--border-subtle)]">
              <div className="bg-[var(--brand-primary)] h-full rounded-full w-full opacity-85" />
            </div>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Card 1 */}
          <div className="relative overflow-hidden p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Contractual SLA
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold mt-1 tracking-tight">
                99.995%
              </span>
              <span className="font-mono text-xs text-[var(--brand-primary)] mt-0.5 font-medium">
                High-Availability SLA Target
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] service-icon-box shrink-0 shadow-inner">
              <Activity size={24} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Trace Guarantee
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold mt-1 tracking-tight">
                &lt;14ms
              </span>
              <span className="font-mono text-xs text-[var(--brand-primary)] mt-0.5 font-medium">
                P99 Ingestion Latency Upper-Bound
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] service-icon-box shrink-0 shadow-inner">
              <Gauge size={24} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                State Convergence
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold mt-1 tracking-tight">
                100%
              </span>
              <span className="font-mono text-xs text-[var(--brand-primary)] mt-0.5 font-medium">
                Zero-Drift GitOps Verified
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] service-icon-box shrink-0 shadow-inner">
              <GitBranch size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
