import Link from "next/link";
import { CheckCircle2, Activity, Gauge, GitBranch } from "lucide-react";

const HERO_KPIS = [
  {
    eyebrow: "Contractual SLA",
    value: "99.995%",
    subtitle: "High-Availability SLA Target",
    icon: Activity,
    spanClass: "",
  },
  {
    eyebrow: "Trace Guarantee",
    value: "<14ms",
    subtitle: "P99 Ingestion Latency Upper-Bound",
    icon: Gauge,
    spanClass: "",
  },
  {
    eyebrow: "State Convergence",
    value: "100%",
    subtitle: "Zero-Drift GitOps Verified",
    icon: GitBranch,
    spanClass: "sm:col-span-2 lg:col-span-1",
  },
];

export function ServicesHero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 pb-8 sm:pb-12 overflow-x-clip">
      {/* Ambient Lighting Gradients */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 sm:left-1/3 sm:translate-x-0 w-[22rem] sm:w-[36rem] max-w-[92vw] h-[16rem] sm:h-[18rem] bg-[var(--brand-primary)]/12 blur-[110px] sm:blur-[130px] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute top-16 right-8 w-72 h-48 bg-[var(--success)]/6 blur-[110px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 sm:gap-7">
        {/* Breadcrumb + Release Pill Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs text-[var(--text-muted)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse shrink-0" />
            <Link
              href="/"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              DEVCORE
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <span>SYSTEMS</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-primary)] font-semibold">
              SERVICES &amp; CAPABILITIES
            </span>
          </nav>

          <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full devcore-glass-badge bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] shadow-sm">
            <CheckCircle2
              size={13}
              className="text-[var(--brand-primary)] shrink-0"
            />
            <span className="font-mono text-[10px] sm:text-[11px] text-[var(--text-secondary)] tracking-wide uppercase font-semibold">
              ENTERPRISE DISCIPLINES &bull; SLA-BACKED DELIVERY
            </span>
          </div>
        </div>

        {/* Main Headline & Infrastructure HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-end mt-0.5">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-5 bg-[var(--brand-primary)]/60" />
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                Deterministic Execution Matrix
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl text-[var(--text-primary)] tracking-tight font-extrabold max-w-3xl leading-[1.14]">
              Engineered Services &amp;{" "}
              <span className="text-liquid-gradient">
                Architectural Capabilities
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Rigorous engineering squads delivering mission-critical cloud
              infrastructure, high-throughput distributed systems, and
              deterministic AI pipelines with mathematically bounded latency.
            </p>
          </div>

          {/* System Fingerprint / Realtime Telemetry HUD Card */}
          <div className="lg:col-span-5 xl:col-span-4 relative overflow-hidden flex flex-col gap-3 p-4 sm:p-5 rounded-2xl devcore-glass-card shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85 transition-colors hover:border-[var(--brand-primary)]/40">
            {/* Top Specular Edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/50 to-transparent"
            />

            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]/70">
              <span className="font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                Infrastructure Status
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-[11px] text-[var(--success)] font-bold">
                  CLUSTER ACTIVE
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 font-mono text-[11px] sm:text-xs">
                <span className="text-[var(--text-muted)] shrink-0">
                  Active Topology:
                </span>
                <span className="text-[var(--text-primary)] font-medium text-right truncate">
                  Multi-Region us-east/eu-west
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 font-mono text-[11px] sm:text-xs">
                <span className="text-[var(--text-muted)] shrink-0">
                  Trace Target:
                </span>
                <span className="text-[var(--text-primary)] font-medium text-right">
                  P99.9 Bound &lt; 14ms
                </span>
              </div>
            </div>

            <div className="w-full bg-[var(--bg-surface)] rounded-full h-1.5 mt-0.5 overflow-hidden border border-[var(--border-subtle)]">
              <div className="bg-gradient-to-r from-[var(--brand-primary)]/75 via-[var(--brand-primary)] to-[var(--success)]/80 h-full rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mt-1">
          {HERO_KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.eyebrow}
                className={`group relative overflow-hidden p-4 sm:p-5 rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/40 hover:shadow-md ${kpi.spanClass}`}
              >
                {/* Specular Top Rim */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
                />

                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                    {kpi.eyebrow}
                  </span>
                  <span className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold mt-1 tracking-tight">
                    {kpi.value}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs text-[var(--brand-primary)] mt-0.5 font-medium truncate">
                    {kpi.subtitle}
                  </span>
                </div>

                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] service-icon-box shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:border-[var(--brand-primary)]/35">
                  <Icon size={22} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}