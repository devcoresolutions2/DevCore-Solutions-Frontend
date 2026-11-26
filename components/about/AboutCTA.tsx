"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface AboutCTAProps {
  content: AboutGeneralContent;
}

const ENGAGEMENT_GUARANTEES = [
  {
    icon: Clock,
    label: "< 24h Founder Response",
  },
  {
    icon: ShieldCheck,
    label: "Direct Architecture Scoping",
  },
  {
    icon: CheckCircle2,
    label: "Zero Proxy Handoffs",
  },
] as const;

export function AboutCTA({ content }: AboutCTAProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-350);
  const mouseY = useMotionValue(-350);
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-350);
    mouseY.set(-350);
  };

  const secondaryHref =
    content.ctaSecondaryUrl && content.ctaSecondaryUrl !== "/careers"
      ? content.ctaSecondaryUrl
      : "/projects";

  const secondaryLabel =
    content.ctaSecondaryText &&
      content.ctaSecondaryText !== "View Open Guild Seats"
      ? content.ctaSecondaryText
      : "Explore Production Builds";

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-x-clip">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-3xl border border-[var(--brand-primary)]/40 bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-lg hover:border-[var(--brand-primary)]/70 hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 lg:p-12"
      >
        {/* Top Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/85 to-transparent z-20"
        />

        {/* Ambient Radial Mesh Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-24 w-80 h-80 rounded-full bg-[var(--brand-primary)]/14 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-24 w-72 h-72 rounded-full bg-[var(--brand-primary)]/10 blur-3xl"
        />

        {/* Interactive Cursor Spotlight */}
        <motion.div
          aria-hidden="true"
          style={{ background: spotlightBg }}
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Main Split Layout */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10">
          {/* Left Copy & Guarantees */}
          <div className="flex flex-col gap-4 max-w-2xl">
            {/* Reflexive Shimmer Eyebrow Pill */}
            <span
              style={{
                width: "fit-content",
                padding: "4px 12px",
                fontSize: "10px",
                lineHeight: 1.2,
              }}
              className="relative overflow-hidden inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--brand-primary)]/35 font-mono font-bold uppercase tracking-widest text-[var(--brand-primary)] shadow-2xs"
            >
              <motion.span
                aria-hidden="true"
                animate={{ x: ["-160%", "260%"] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: 3.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-20 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              />
              <Sparkles size={11} className="relative z-10 shrink-0" />
              <span className="relative z-10">Direct Founder Engagement</span>
            </span>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.15]">
              {content.ctaTitle || "Let's Build Something Meaningful"}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              {content.ctaSubtitle}
            </p>

            {/* Compact Assurance Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {ENGAGEMENT_GUARANTEES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] text-[11px] font-mono font-semibold text-[var(--text-primary)]"
                  >
                    <Icon
                      size={12}
                      className="text-[var(--brand-primary)] shrink-0"
                    />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-3 shrink-0 lg:min-w-[235px]">
            <Link
              href={content.ctaPrimaryUrl || "/contact"}
              className="btn-liquid-hover h-11 px-6 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-md whitespace-nowrap"
            >
              <span>{content.ctaPrimaryText || "Start System Scoping"}</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5 shrink-0"
              />
            </Link>

            <Link
              href={secondaryHref}
              className="h-11 px-6 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45 font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-all shadow-2xs whitespace-nowrap"
            >
              <span>{secondaryLabel}</span>
              <ArrowUpRight size={14} className="text-[var(--brand-primary)] shrink-0" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}