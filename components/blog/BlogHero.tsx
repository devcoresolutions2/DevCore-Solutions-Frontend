"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Cpu, Activity } from "lucide-react";
import type { BlogHeroConfig } from "@/lib/api";

interface BlogHeroProps {
  config: BlogHeroConfig;
}

export function BlogHero({ config }: BlogHeroProps) {
  const rawTitle =
    config.title || "Systems, Distributed State & Determinism";
  const words = rawTitle.trim().split(" ");
  const hasMultipleWords = words.length > 2;
  const leadingTitle = hasMultipleWords
    ? words.slice(0, -2).join(" ")
    : rawTitle;
  const accentTitle = hasMultipleWords ? words.slice(-2).join(" ") : "";

  const metric1Label =
    config.showCustomMetrics && config.metric1Label
      ? config.metric1Label
      : "EDITORIAL STANDARD";
  const metric1Value =
    config.showCustomMetrics && config.metric1Value
      ? config.metric1Value
      : "RFC-Grade";

  const metric2Label =
    config.showCustomMetrics && config.metric2Label
      ? config.metric2Label
      : "FOCUS DOMAINS";
  const metric2Value =
    config.showCustomMetrics && config.metric2Value
      ? config.metric2Value
      : "Systems • AI • Cloud";

  return (
    <section className="relative pt-8 pb-10 sm:pt-12 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--text-primary)] font-semibold transition-colors"
            >
              DEVCORE
            </Link>
            <span className="text-[var(--text-muted)]">/</span>
            <Link
              href="/blog"
              className="hover:text-[var(--text-primary)] font-semibold transition-colors"
            >
              BLOG
            </Link>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-[var(--text-primary)] font-bold">
              {config.breadcrumbLabel || "ENGINEERING DISPATCHES"}
            </span>
          </nav>

          <span
            style={{
              width: "fit-content",
              padding: "4px 12px",
              fontSize: "10px",
              lineHeight: 1.2,
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-surface)]/55 backdrop-blur-md border border-[var(--border-subtle)] font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>PEER-REVIEWED RFCS &bull; ZERO-BLOAT ARCHITECTURE</span>
          </span>
        </div>

        {/* Main Split Row: Left Display Title + Right Terminal Status Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 sm:mb-14">
          {/* Left 8 Columns */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                ENGINEERING DISCIPLINES &bull;{" "}
                {config.badge || "TECHNICAL DISPATCH"}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-[28px] sm:text-4xl md:text-5xl text-[var(--text-primary)] tracking-[-0.025em] leading-[1.12] mb-4">
              <span>{leadingTitle}</span>
              {accentTitle && (
                <>
                  {" "}
                  <span className="text-liquid-gradient">{accentTitle}</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {config.description}
            </p>
          </motion.div>

          {/* Right 4 Columns: Terminal Status Box */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-4"
          >
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/55 backdrop-blur-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)]/80 font-mono text-[10.5px]">
                <span className="font-bold text-[var(--text-primary)]">
                  &gt;_ DISPATCH_STATUS.v26
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  FEED: ACTIVE
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                <div>&gt; Founder-authored systems breakdowns</div>
                <div>&gt; Direct architectural post-mortems</div>
                <div>&gt; Stack: Next.js, Go, eBPF, PostgreSQL, AI</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom 3 Translucent Glass Cards with Clean Top Gap */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between gap-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              <span>{metric1Label}</span>
            </div>
            <div className="font-display font-extrabold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight">
              {metric1Value}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Verified architectural notes &amp; system proofs
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between gap-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
              <Cpu className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              <span>{metric2Label}</span>
            </div>
            <div className="font-display font-extrabold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight truncate">
              {metric2Value}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Full-stack engineering &amp; distributed core
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between gap-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
              <Activity className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              <span>REPRODUCIBILITY</span>
            </div>
            <div className="font-display font-extrabold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight">
              100% Deterministic
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Production-tested code, schemas &amp; benchmarks
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}