"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Code2,
  Cpu,
  CheckCircle2,
  Layers,
} from "lucide-react";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface CorePhilosophyProps {
  content: AboutGeneralContent;
}

const PHILOSOPHY_PILLARS = [
  {
    id: "zero-bloat",
    code: "01",
    title: "Deterministic Zero-Bloat Core",
    tag: "Performance First",
    icon: Cpu,
    summary:
      "Every dependency, database query, and bundle chunk earns its place. We eliminate unnecessary abstraction layers so production systems stay fast, predictable, and maintainable.",
    guarantees: [
      "Lean Next.js & TypeScript runtime footprint",
      "Indexed relational schemas with zero N+1 bottlenecks",
    ],
  },
  {
    id: "contract-safety",
    code: "02",
    title: "End-to-End Contract Integrity",
    tag: "Strict Type Safety",
    icon: ShieldCheck,
    summary:
      "Schema validation from database models through REST/API boundaries to UI state ensures invalid states are caught at compile time rather than in front of your users.",
    guarantees: [
      "Shared Zod schemas & strict TypeScript enforcement",
      "Predictable error handling & resilient state transitions",
    ],
  },
  {
    id: "craft-execution",
    code: "03",
    title: "Direct Craftsmanship & Ownership",
    tag: "Founder Execution",
    icon: Code2,
    summary:
      "Great software is built when the engineers designing the architecture are the same builders shipping the interface—translating business logic directly into clean code.",
    guarantees: [
      "Cohesive light/dark glassmorphism design systems",
      "Rapid, transparent iteration without agency handoffs",
    ],
  },
] as const;

export function CorePhilosophy({ content }: CorePhilosophyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const mouseX = useMotionValue(-350);
  const mouseY = useMotionValue(-350);
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-350);
    mouseY.set(-350);
  };

  const activePillar = PHILOSOPHY_PILLARS[activeIndex];
  const ActiveIcon = activePillar.icon;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-x-clip">
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-3xl bg-[var(--bg-elevated)]/95 border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 p-6 sm:p-9 lg:p-12 backdrop-blur-xl shadow-lg transition-colors duration-300"
      >
        {/* Top Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/70 to-transparent z-20"
        />

        {/* Subtle Ambient Corner Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-28 w-80 h-80 rounded-full bg-[var(--brand-primary)]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-[var(--brand-primary)]/8 blur-3xl"
        />

        {/* Interactive Cursor Spotlight */}
        <motion.div
          aria-hidden="true"
          style={{ background: spotlightBg }}
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Main Content Stage */}
        <div className="relative z-10 flex flex-col gap-8 lg:gap-10">
          {/* Upper Split: Left Editorial Thesis + Right Interactive Pillar Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left 6 Columns: Foundational Thesis */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div>
                {/* Reflexive Shimmer Eyebrow Pill */}
                <div className="relative overflow-hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--brand-primary)]/35 text-[var(--brand-primary)] text-[11px] font-mono font-bold tracking-wider mb-5 shadow-2xs">
                  <motion.span
                    aria-hidden="true"
                    animate={{ x: ["-160%", "260%"] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      repeatDelay: 3.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-20 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  />
                  <Zap size={12} className="relative z-10 shrink-0" />
                  <span className="relative z-10 uppercase">
                    Foundational Belief
                  </span>
                </div>

                <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.15]">
                  {content.philosophyTitle}
                </h2>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mt-4">
                  {content.philosophyText}
                </p>
              </div>

              {/* Interactive Pillar Selector Tabs */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                  Inspect Core Tenets
                </span>
                <div className="flex flex-wrap gap-2">
                  {PHILOSOPHY_PILLARS.map((pillar, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={
                          isActive
                            ? "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-mono text-xs font-bold shadow-xs transition-all cursor-pointer"
                            : "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 font-mono text-xs font-semibold transition-all cursor-pointer"
                        }
                      >
                        <span className="opacity-75">{pillar.code}</span>
                        <span>{pillar.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Animated Pillar Detail Console */}
            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-2xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between h-full gap-5"
                  >
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
                          TENET {activePillar.code} {"//"} {activePillar.tag}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-2xs">
                          <ActiveIcon size={17} />
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] tracking-tight">
                        {activePillar.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {activePillar.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)]">
                      {activePillar.guarantees.map((guarantee) => (
                        <div
                          key={guarantee}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)]"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-[var(--brand-primary)] shrink-0"
                          />
                          <span className="text-xs font-semibold text-[var(--text-primary)]">
                            {guarantee}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Metrics Matrix */}
          {content.philosophyStats && content.philosophyStats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-7 border-t border-[var(--border-subtle)]">
              {content.philosophyStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -3 }}
                  className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45 shadow-2xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-[var(--brand-primary)]">
                      0{i + 1}
                    </span>
                    <Layers
                      size={13}
                      className="text-[var(--text-muted)] opacity-70"
                    />
                  </div>

                  <div>
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight block">
                      {stat.value}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono uppercase tracking-wider mt-1.5 block">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}