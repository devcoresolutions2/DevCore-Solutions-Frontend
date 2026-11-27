"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { Eye, Target, CheckCircle2, Sparkles, Activity } from "lucide-react";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface VisionMissionProps {
  content: AboutGeneralContent;
}

const VISION_MILESTONES = [
  { label: "Contract", x: 10, y: 74, metric: "Typed" },
  { label: "Sandbox", x: 37, y: 54, metric: "Verified" },
  { label: "Canary", x: 64, y: 36, metric: "99.99%" },
  { label: "Prod Core", x: 92, y: 18, metric: "<14ms" },
] as const;

function SpotlightCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(420px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-300);
    mouseY.set(-300);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-md p-6 sm:p-8 lg:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/45 hover:shadow-xl"
    >
      {/* Top Specular Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/55 to-transparent"
      />

      {/* Interactive Cursor Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {children}
      </div>
    </motion.div>
  );
}

export function VisionMission({ content }: VisionMissionProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-clip">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* Left Glass: Vision */}
        <SpotlightCard delay={0.05}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-4 bg-[var(--brand-primary)]/60" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                  Strategic Intent
                </span>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/45 flex items-center justify-center text-[var(--brand-primary)] shadow-2xs transition-colors">
                <Eye size={18} />
              </div>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
              {content.visionTitle}
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {content.visionText}
            </p>
          </div>

          {/* Upgraded Telemetry Trajectory Panel */}
          <div className="mt-8 bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5">
                <Activity size={14} className="text-[var(--brand-primary)]" />
                <span>System Reliability Trajectory</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-[var(--brand-primary)] font-bold px-2.5 py-0.5 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
                <span>Continuous Invariance</span>
              </span>
            </div>

            {/* Framed Graph Stage */}
            <div className="relative w-full h-24 rounded-xl bg-[var(--bg-elevated)]/80 border border-[var(--border-subtle)]/80 overflow-hidden px-3 py-2">
              {/* Vertical Milestone Guide Lines */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                {VISION_MILESTONES.map((m) => (
                  <div
                    key={m.label}
                    style={{ left: `${m.x}%` }}
                    className="absolute inset-y-0 border-l border-dashed border-[var(--border-subtle)]/70"
                  />
                ))}
              </div>

              <svg
                className="relative z-10 w-full h-full text-[var(--brand-primary)] overflow-visible"
                fill="none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="visionAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.26"
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Gradient Fill */}
                <path
                  d="M 0 82 C 5 80, 7 74, 10 74 C 20 74, 27 54, 37 54 C 48 54, 54 36, 64 36 C 75 36, 82 18, 92 18 L 100 16 L 100 98 L 0 98 Z"
                  fill="url(#visionAreaGrad)"
                />

                {/* Smooth Animated Trajectory Curve */}
                <motion.path
                  d="M 0 82 C 5 80, 7 74, 10 74 C 20 74, 27 54, 37 54 C 48 54, 54 36, 64 36 C 75 36, 82 18, 92 18 L 100 16"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.15, delay: 0.2, ease: "easeOut" }}
                />
              </svg>

              {/* Distortion-Free Milestone Nodes & Badges */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
              >
                {VISION_MILESTONES.map((m, idx) => {
                  const isFinal = idx === VISION_MILESTONES.length - 1;
                  return (
                    <div
                      key={m.label}
                      style={{ left: `${m.x}%`, top: `${m.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    >
                      <span
                        className={
                          isFinal
                            ? "w-3 h-3 rounded-full bg-[var(--brand-primary)] ring-4 ring-[var(--brand-primary)]/20"
                            : "w-2.5 h-2.5 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--brand-primary)]"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stage Checkpoints */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5 font-mono text-[10px]">
              {VISION_MILESTONES.map((m, idx) => {
                const isFinal = idx === VISION_MILESTONES.length - 1;
                return (
                  <div
                    key={m.label}
                    className="flex flex-col items-center text-center px-1 py-1 rounded-lg bg-[var(--bg-elevated)]/75 border border-[var(--border-subtle)]/70"
                  >
                    <span className="text-[var(--text-muted)] uppercase truncate max-w-full">
                      {m.label}
                    </span>
                    <span
                      className={
                        isFinal
                          ? "font-bold text-[var(--brand-primary)] mt-0.5"
                          : "font-semibold text-[var(--text-primary)] mt-0.5"
                      }
                    >
                      {m.metric}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </SpotlightCard>

        {/* Right Glass: Mission */}
        <SpotlightCard delay={0.14}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-4 bg-[var(--brand-primary)]/60" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                  Execution Rigor
                </span>
              </div>

              <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/45 flex items-center justify-center text-[var(--brand-primary)] shadow-2xs transition-colors">
                <Target size={18} />
              </div>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
              {content.missionTitle}
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {content.missionText}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/30 transition-colors flex flex-col justify-between">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
                  100%
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1.5">
                  Founder &amp; Core Engineering Lead
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/30 transition-colors flex flex-col justify-between">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--brand-primary)]">
                  Zero
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1.5">
                  Proxy Handover Friction
                </span>
              </div>
            </div>

            <div className="px-4 py-3 rounded-xl bg-[var(--bg-surface)]/85 border border-[var(--border-subtle)] flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
              <CheckCircle2
                size={14}
                className="text-emerald-500 shrink-0"
              />
              <span>
                End-to-end ownership from architecture to production deployment
              </span>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}