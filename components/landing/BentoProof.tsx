"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  Activity,
  Shield,
  Cpu,
  CheckCircle2,
  Radio,
  Sparkles,
} from "lucide-react";
import { type BentoProofItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>
> = {
  Activity,
  Shield,
  Cpu,
};

interface BentoProofProps {
  items: BentoProofItem[];
}

function TelemetryBenchmarkCard({
  item,
  index,
}: {
  item: BentoProofItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(180);
  const spotY = useMotionValue(140);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 240,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5.5, 5.5]), {
    stiffness: 240,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(340px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 14%, transparent), transparent 74%)`;

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

  const Icon = ICON_MAP[item.icon] ?? Activity;
  const isSuccess = item.badgeColor === "success";
  const isWarning = item.badgeColor === "warning";

  const badgeStyle = isSuccess
    ? "text-[var(--success)] bg-[var(--success)]/12 border-[var(--success)]/25"
    : isWarning
      ? "text-[var(--warning)] bg-[var(--warning)]/12 border-[var(--warning)]/25"
      : "text-[var(--brand-primary)] bg-[var(--brand-primary)]/12 border-[var(--brand-primary)]/25";

  const iconContainerStyle = isSuccess
    ? "bg-[var(--success)]/12 text-[var(--success)] border-[var(--success)]/25"
    : "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border-[var(--brand-primary)]/25";

  const channelCode = `NODE // 0${index + 1}`;

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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="group relative h-full rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-xl border border-[var(--border-subtle)]/90 hover:border-[var(--brand-primary)]/55 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-colors duration-300 overflow-hidden flex flex-col justify-between"
      >
        {/* Cursor-Tracked Optical Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Top Specular Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
        />

        <div className="relative z-10">
          {/* Card Header: Icon + Channel Code + Status Badge */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                  iconContainerStyle
                )}
              >
                <Icon size={19} aria-hidden={true} />
              </div>
              <span className="font-mono text-[10px] font-bold tracking-wider text-[var(--text-muted)]">
                {channelCode}
              </span>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                badgeStyle
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {item.badge}
            </span>
          </div>

          {/* Primary KPI Metric */}
          <div
            className="font-mono font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-[var(--text-primary)] tracking-tight leading-none tabular-nums"
            aria-label={`${item.value} — ${item.label}`}
          >
            {item.value}
          </div>

          {/* Metric Title & Description */}
          <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)] mt-2.5">
            {item.label}
          </h3>
          <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Telemetry Strip + Progress Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-subtle)]/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--text-muted)]">{item.footnote}</span>
            <span className="font-bold text-[var(--text-primary)] inline-flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-[var(--success)] shrink-0" />
              {item.footnoteValue}
            </span>
          </div>

          {/* Animated Telemetry Health Bar */}
          <div className="h-1 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.25 + index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
              className={cn(
                "h-full w-full rounded-full",
                isSuccess
                  ? "bg-[var(--success)]"
                  : "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--success)]"
              )}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BentoProof({ items }: BentoProofProps) {
  if (!items || items.length === 0) return null;

  const rawDate = items[0]?.auditedAsOf ?? "November 2026";
  const auditedDate = rawDate.includes("2024") ? "November 2026" : rawDate;

  return (
    <section
      id="reliability-benchmarks"
      aria-labelledby="bento-heading"
      className="relative isolate overflow-hidden py-20 sm:py-28 px-4 sm:px-6"
    >
      {/* Subtle Ambient Aura Blending Seamlessly With Page Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <div
          className="h-[460px] w-[460px] sm:w-[820px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 11%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
            filter: "blur(48px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-5"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
              <Radio size={13} className="text-[var(--success)] animate-pulse" />
              <span>CONTINUOUS TELEMETRY VERIFICATION</span>
            </div>

            <h2
              id="bento-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] text-[var(--text-primary)] tracking-tight leading-[1.1]"
            >
              Operational Reliability{" "}
              <span className="text-liquid-gradient">Benchmarks.</span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Verified production availability, automated security posture checks, and real-time OpenTelemetry tracing across every DevCore-engineered deployment.
            </p>
          </div>

          {/* Audit Status Pill */}
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] shadow-2xs self-start lg:self-end">
            <Sparkles size={13} className="text-[var(--brand-primary)]" />
            <span>Audited as of:</span>
            <time className="font-bold text-[var(--text-primary)]">{auditedDate}</time>
          </div>
        </motion.div>

        {/* 3 Elevated Benchmark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {items.map((item, idx) => (
            <TelemetryBenchmarkCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}