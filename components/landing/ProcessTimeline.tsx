"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  GitCommit,
  FileCode2,
  Compass,
  Layers,
  Rocket,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { cn } from "@/lib/utils";

interface ProcessStage {
  num: string;
  title: string;
  weeks: string;
  desc: string;
  deliverable: string;
  gateChecklist: string[];
  clientArtifact: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STAGES: ProcessStage[] = [
  {
    num: "01",
    title: "Discovery & PRD",
    weeks: "WEEKS 1-2",
    desc: "Requirements synthesis, technical constraint mapping, non-functional requirements (SLA/QPS), and data model entity definitions.",
    deliverable: "Engineered PRD & Technical Spec",
    gateChecklist: ["Domain Entity Map", "SLA & Latency Targets", "Security Threat Model"],
    clientArtifact: "Signed-off Architectural PRD & Relational Schema Blueprint",
    icon: Compass,
  },
  {
    num: "02",
    title: "Architecture & UI/UX",
    weeks: "WEEKS 3-5",
    desc: "System topology schematics, API contract schemas (OpenAPI/Protobuf), database normalization, and interactive Figma design systems.",
    deliverable: "System RFC & High-Fidelity UI",
    gateChecklist: ["OpenAPI / Zod Contracts", "Prisma DB Normalization", "Interactive Glass UI Kit"],
    clientArtifact: "Clickable Design System + Approved System Topology RFC",
    icon: Layers,
  },
  {
    num: "03",
    title: "Agile Full-Stack Build",
    weeks: "WEEKS 6-12",
    desc: "Two-week sprint cadences, automated CI/CD pipeline tests, code reviews with 90%+ branch coverage, and weekly staging deployments.",
    deliverable: "Staging Builds & Continuous Demo",
    gateChecklist: ["90%+ Test Coverage", "Weekly Live Staging URL", "Automated PR Checks"],
    clientArtifact: "Live Weekly Staging Environment + Clean Git Commit History",
    icon: FileCode2,
  },
  {
    num: "04",
    title: "Deployment & Scale",
    weeks: "ONGOING",
    desc: "Blue/green production cutover, load stress validation, eBPF telemetry hooks, runbook documentation, and 24/7 Tier-3 on-call rotation.",
    deliverable: "Zero-Downtime Live Release & SLA",
    gateChecklist: ["Load Stress Verified", "OpenTelemetry Tracing", "Full IP & Repo Transfer"],
    clientArtifact: "Production Cluster Cutover + Complete Engineering Runbooks",
    icon: Rocket,
  },
];

function StageCard({
  stage,
  index,
  isSelected,
  isCompletedOrActive,
  onSelect,
}: {
  stage: ProcessStage;
  index: number;
  isSelected: boolean;
  isCompletedOrActive: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(150);
  const spotY = useMotionValue(120);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 250,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5.5, 5.5]), {
    stiffness: 250,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(300px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--success) 13%, transparent), transparent 74%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = stage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onClick={onSelect}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          borderColor: isSelected
            ? "color-mix(in oklab, var(--success) 55%, transparent)"
            : "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
        }}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className="group relative h-full p-6 sm:p-7 rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-md border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none"
      >
        {/* Cursor-Tracked Optical Glass Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Luminous Emerald Top Specular Rim (Replaces harsh dark hover outline) */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--success)] to-transparent transition-opacity duration-300",
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />

        <div className="relative z-10">
          {/* Header: Stage Number + Icon + Duration Pill */}
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl border flex items-center justify-center transition-colors duration-300",
                  isCompletedOrActive
                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)]"
                    : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20"
                )}
              >
                <Icon size={17} />
              </div>
              <span className="font-mono font-extrabold text-xl text-[var(--brand-primary)]">
                {stage.num}
              </span>
            </div>

            <span className="font-mono text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
              {stage.weeks}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight">
            {stage.title}
          </h3>

          <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
            {stage.desc}
          </p>

          {/* Stage Gate Micro-Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {stage.gateChecklist.map((gate) => (
              <span
                key={gate}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)]/80 font-mono text-[10px] text-[var(--text-secondary)]"
              >
                <CheckCircle2 size={10} className="text-[var(--success)] shrink-0" />
                <span>{gate}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Deliverable Footer */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-subtle)]/80">
          <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] block uppercase tracking-wider">
            Key Deliverable:
          </span>
          <span className="font-display text-xs sm:text-[13px] font-bold text-[var(--text-primary)] mt-1 flex items-center justify-between gap-2">
            <span>{stage.deliverable}</span>
            <Sparkles
              size={12}
              className={cn(
                "shrink-0 transition-colors",
                isSelected ? "text-[var(--success)]" : "text-[var(--brand-primary)]/60"
              )}
            />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProcessTimeline() {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const selectedStage = STAGES[activeStageIdx] || STAGES[0];

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 px-4 sm:px-6"
    >
      {/* Seamless Atmospheric Aura Matching Page Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        <div
          className="h-[500px] w-[500px] sm:w-[860px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 12%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 flex flex-col items-center"
        >
          <ReleasePill>
            <GitCommit size={13} aria-hidden="true" />
            &nbsp;DISCIPLINED DELIVERY
          </ReleasePill>

          <h2
            id="process-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] mt-4 tracking-tight leading-[1.1]"
          >
            Our 4-Stage{" "}
            <span className="text-liquid-gradient">Engineering Process.</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-3 leading-relaxed">
            Eliminating guesswork through rigorous engineering stages from discovery to planet-scale telemetry.
          </p>
        </motion.div>

        {/* Desktop Interactive Pipeline Progress Track */}
        <div className="hidden lg:block max-w-5xl mx-auto mb-8 px-12">
          <div className="relative flex items-center justify-between">
            {/* Base Track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--border-subtle)] rounded-full" />

            {/* Animated Active Progress Fill */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[var(--brand-primary)] to-[var(--success)] rounded-full"
              initial={false}
              animate={{ width: `${(activeStageIdx / (STAGES.length - 1)) * 100}%` }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            />

            {STAGES.map((stage, idx) => {
              const active = idx <= activeStageIdx;
              const current = idx === activeStageIdx;
              return (
                <button
                  key={stage.num}
                  type="button"
                  onClick={() => setActiveStageIdx(idx)}
                  className={cn(
                    "relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[11px] font-bold transition-all cursor-pointer",
                    current
                      ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)] shadow-md scale-105"
                      : active
                        ? "bg-[var(--bg-elevated)] text-[var(--success)] border-[var(--success)]/45"
                        : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>{stage.num}</span>
                  <span className="hidden xl:inline">· {stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Stage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map((stage, idx) => (
            <StageCard
              key={stage.num}
              stage={stage}
              index={idx}
              isSelected={idx === activeStageIdx}
              isCompletedOrActive={idx <= activeStageIdx}
              onSelect={() => setActiveStageIdx(idx)}
            />
          ))}
        </div>

        {/* Interactive Stage Gate & Client Handoff Bar */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl devcore-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--success)]/12 border border-[var(--success)]/25 text-[var(--success)] flex items-center justify-center shrink-0">
              <ShieldCheck size={17} />
            </div>

            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={selectedStage.num}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
                >
                  <strong className="font-mono text-[var(--brand-primary)] mr-2">
                    [STAGE {selectedStage.num} HANDOFF]
                  </strong>
                  <span className="text-[var(--text-primary)] font-semibold">
                    {selectedStage.clientArtifact}
                  </span>
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <Link
            href="/contact"
            className="btn-liquid-hover inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] shrink-0 transition-colors"
          >
            <span>Start Discovery Sprint</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}