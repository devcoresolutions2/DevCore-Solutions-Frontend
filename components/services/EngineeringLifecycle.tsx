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

export function EngineeringLifecycle({ stages }: EngineeringLifecycleProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="p-6 sm:p-10 rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 shadow-md flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Continuous Delivery Topology
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold tracking-tight mt-1">
              Standard Engineering Lifecycle Rig
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="font-mono text-xs text-[var(--text-secondary)] font-semibold">
              GitOps Trunk-Based Verified
            </span>
          </div>
        </div>

        {/* 4 Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <div
              key={stage.stage}
              className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                  {stage.code}
                </span>
                <h4 className="font-display text-base text-[var(--text-primary)] font-bold">
                  {stage.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold">
                  {stage.timeline}
                </span>
                <span className="text-[var(--text-muted)]">
                  {getStageIcon(stage.icon)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Realtime SVG Telemetry Waveform */}
        <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-inner flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--text-secondary)] font-medium uppercase tracking-wide">
              Synthetic Traffic Stress Test &bull; 1,250,000 req/sec
            </span>
            <span className="text-[var(--brand-primary)] font-bold">
              Jitter &lt; 0.4ms
            </span>
          </div>

          <div className="w-full h-20 flex items-end overflow-hidden pt-2">
            <svg
              className="w-full h-full text-[var(--brand-primary)]"
              preserveAspectRatio="none"
              viewBox="0 0 500 60"
              aria-label="Realtime telemetry waveform graph showing stable sub-millisecond execution"
            >
              <defs>
                <linearGradient id="waveformGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,45 Q25,12 50,38 T100,25 T150,42 T200,18 T250,30 T300,15 T350,35 T400,22 T450,28 T500,19 L500,60 L0,60 Z"
                fill="url(#waveformGradient)"
              />
              <path
                d="M0,45 Q25,12 50,38 T100,25 T150,42 T200,18 T250,30 T300,15 T350,35 T400,22 T450,28 T500,19"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.2"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
