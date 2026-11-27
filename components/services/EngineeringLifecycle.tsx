import { LifecycleStage } from "@/lib/api";
import { Network, Gauge, ShieldCheck, Rocket, GitBranch } from "lucide-react";

interface EngineeringLifecycleProps {
  stages: LifecycleStage[];
}

function getStageIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "network":
      return <Network size={18} />;
    case "gauge":
      return <Gauge size={18} />;
    case "shieldcheck":
      return <ShieldCheck size={18} />;
    case "rocket":
      return <Rocket size={18} />;
    default:
      return <GitBranch size={18} />;
  }
}

const TELEMETRY_NODES = [
  { x: 60, y: 62 },
  { x: 150, y: 38 },
  { x: 240, y: 56 },
  { x: 330, y: 30 },
  { x: 420, y: 48 },
  { x: 510, y: 26 },
  { x: 588, y: 32 },
];

export function EngineeringLifecycle({ stages }: EngineeringLifecycleProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-clip">
      <div className="relative overflow-hidden p-5 sm:p-8 lg:p-10 rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85 shadow-md flex flex-col gap-6 sm:gap-8">
        {/* Top Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/50 to-transparent"
        />

        {/* Ambient Corner Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[var(--brand-primary)]/8 blur-3xl"
        />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-4 bg-[var(--brand-primary)]/60" />
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                Continuous Delivery Topology
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight leading-[1.15]">
              Standard Engineering{" "}
              <span className="text-liquid-gradient">Lifecycle Rig</span>
            </h2>
          </div>

          <div className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full devcore-glass-badge bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse shrink-0" />
            <span className="font-mono text-[11px] sm:text-xs text-[var(--text-secondary)] font-semibold">
              GitOps Trunk-Based Verified
            </span>
          </div>
        </div>

        {/* 4 Stages Grid: 1 col (mobile) -> 2 col (sm/md) -> 4 col (lg+) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {stages.map((stage, index) => {
            const stepNum = String(index + 1).padStart(2, "0");

            return (
              <div
                key={stage.stage}
                className="group relative overflow-hidden p-4 sm:p-5 lg:p-6 rounded-xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/45 hover:shadow-md"
              >
                {/* Card Top Specular Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
                />

                <div className="relative z-10 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0" />
                      <span className="font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider truncate">
                        {stage.code}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:border-[var(--brand-primary)]/35 transition-colors shrink-0">
                      {stepNum}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg text-[var(--text-primary)] font-bold tracking-tight leading-snug">
                    {stage.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="relative z-10 pt-4 mt-5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] sm:text-xs text-[var(--brand-primary)] font-semibold">
                    {stage.timeline}
                  </span>

                  <span className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:border-[var(--brand-primary)]/35 transition-colors shrink-0">
                    {getStageIcon(stage.icon)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Realtime SVG Telemetry Analytics Panel */}
        <div className="relative z-10 p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] shadow-inner flex flex-col gap-4">
          {/* Top Telemetry Header & Percentile Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--success)]" />
              </span>
              <span className="font-mono text-[11px] sm:text-xs text-[var(--text-primary)] font-bold uppercase tracking-wide truncate">
                Synthetic Traffic Stress Test &bull; 1,250,000 req/sec
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] sm:text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                P50 <strong className="text-[var(--text-primary)]">3.1ms</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                P95 <strong className="text-[var(--text-primary)]">8.4ms</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                P99 <strong className="text-[var(--brand-primary)]">12.9ms</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] font-bold">
                Jitter &lt; 0.4ms
              </span>
            </div>
          </div>

          {/* Unclipped Telemetry Waveform Canvas */}
          <div className="relative w-full h-28 sm:h-32 rounded-xl bg-[var(--bg-elevated)]/70 border border-[var(--border-subtle)]/80 px-2 sm:px-3 py-2 flex items-center overflow-hidden">
            {/* Y-Axis Scale Labels */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none h-full flex flex-col justify-between py-1 pr-2 sm:pr-3 border-r border-[var(--border-subtle)]/60 font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)] shrink-0"
            >
              <span>20ms</span>
              <span>10ms</span>
              <span>0ms</span>
            </div>

            {/* Graph Area */}
            <div className="relative flex-1 h-full pl-1">
              <svg
                className="relative z-10 w-full h-full text-[var(--brand-primary)] overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 600 100"
                aria-label="Realtime telemetry waveform graph showing stable sub-millisecond execution"
              >
                <defs>
                  <linearGradient
                    id="waveformAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.28"
                    />
                    <stop
                      offset="75%"
                      stopColor="currentColor"
                      stopOpacity="0.06"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <path
                  d="M0,72 C25,70 40,62 60,62 C90,62 115,38 150,38 C185,38 205,56 240,56 C275,56 295,30 330,30 C365,30 385,48 420,48 C455,48 475,26 510,26 C540,26 562,32 588,32 L588,96 L0,96 Z"
                  fill="url(#waveformAreaGradient)"
                />

                {/* Smooth Bounded Stroke */}
                <path
                  d="M0,72 C25,70 40,62 60,62 C90,62 115,38 150,38 C185,38 205,56 240,56 C275,56 295,30 330,30 C365,30 385,48 420,48 C455,48 475,26 510,26 C540,26 562,32 588,32"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Distortion-Free Checkpoint Dots */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
              >
                {TELEMETRY_NODES.map((node, i) => {
                  const isLast = i === TELEMETRY_NODES.length - 1;
                  return (
                    <span
                      key={i}
                      style={{
                        left: `${(node.x / 600) * 100}%`,
                        top: `${node.y}%`,
                      }}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute rounded-full ${isLast
                          ? "w-3 h-3 bg-[var(--brand-primary)] ring-4 ring-[var(--brand-primary)]/20"
                          : "w-2 h-2 bg-[var(--bg-elevated)] border-2 border-[var(--brand-primary)]"
                        }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom X-Axis Telemetry Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[var(--text-muted)]">
            <span>T-60s</span>
            <span>T-45s</span>
            <span>T-30s</span>
            <span>T-15s</span>
            <span className="text-[var(--brand-primary)] font-semibold">
              LIVE STREAM &bull; ZERO PACKET DROP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}