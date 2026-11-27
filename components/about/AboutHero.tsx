"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu,
  Terminal,
  ShieldCheck,
  Layers,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface AboutHeroProps {
  content: AboutGeneralContent;
}

const TELEMETRY_PILLARS = [
  {
    icon: Terminal,
    label: "Architecture Delivery",
    value: "Deterministic Contract-First",
    accent: false,
  },
  {
    icon: Layers,
    label: "Engineering Focus",
    value: "Zero Bloat • Provable Systems",
    accent: false,
  },
  {
    icon: ShieldCheck,
    label: "Code Quality",
    value: "Strict Types • Continuous CI",
    accent: false,
  },
  {
    icon: Zap,
    label: "Delivery Protocol",
    value: "Direct Founder & Core Execution",
    accent: true,
  },
] as const;

export function AboutHero({ content }: AboutHeroProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-14 overflow-x-clip">
      {/* Ambient Radial Mesh Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/4 w-96 h-72 max-w-[85vw] rounded-full bg-[var(--brand-primary)]/12 blur-[130px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-8 w-72 h-64 max-w-[80vw] rounded-full bg-[var(--brand-primary)]/8 blur-[120px] -z-10"
      />

      {/* Breadcrumbs & Founding Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10"
      >
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]"
        >
          <Link
            href="/"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Root
          </Link>
          <span>/</span>
          <span className="text-[var(--text-muted)]">Company</span>
          <span>/</span>
          <span className="text-[var(--text-primary)] font-semibold">About</span>
        </nav>

        {content.foundingTag && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono tracking-wider text-[var(--text-secondary)] font-semibold uppercase">
              {content.foundingTag}
            </span>
          </div>
        )}
      </motion.div>

      {/* Main Split Editorial & Interactive Dossier Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left 7 Columns: Headline & Direct Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col justify-between gap-6"
        >
          <div className="flex flex-col gap-4">
            <ReleasePill className="w-fit">
              <Cpu size={12} className="text-[var(--brand-primary)]" />
              <span className="font-mono text-[11px] tracking-widest uppercase">
                {content.heroBadge || "ARCHITECTURAL DOSSIER"}
              </span>
            </ReleasePill>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-[var(--text-primary)] tracking-tight leading-[1.1]">
              {content.heroTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="#leadership-team"
              className="btn-liquid-hover inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs sm:text-sm shadow-sm hover:bg-[var(--brand-hover)] transition-all"
            >
              <span>Meet Founders &amp; Core Team</span>
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[var(--bg-elevated)]/90 hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45 text-[var(--text-primary)] font-semibold text-xs sm:text-sm transition-all shadow-2xs"
            >
              <span>Explore Production Builds</span>
            </Link>
          </div>
        </motion.div>

        {/* Right 5 Columns: Glassmorphic Architectural Manifesto Card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-md p-6 sm:p-7 flex flex-col justify-between gap-5 overflow-hidden"
        >
          {/* Top Specular Edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/55 to-transparent"
          />

          <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3.5">
            <span className="font-mono text-[10.5px] uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              00 // Core Manifesto
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
              DEVCORE.SYS
            </span>
          </div>

          <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {content.heroSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border-subtle)] font-mono">
            <div className="p-2.5 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">
                Leadership Model
              </span>
              <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">
                Founder-Led Build
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">
                Architecture
              </span>
              <span className="text-xs font-bold text-[var(--brand-primary)] mt-0.5 block">
                Full-Stack &amp; Cloud
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive 4-Column Telemetry Strip (Responsive Across Mobile, Tablet & Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {TELEMETRY_PILLARS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group relative rounded-2xl p-4 sm:p-5 bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 backdrop-blur-xl shadow-xs transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/40 flex items-center justify-center text-[var(--brand-primary)] shadow-2xs shrink-0 transition-colors">
                <Icon size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] truncate">
                  {item.label}
                </span>
                <span
                  className={
                    item.accent
                      ? "text-xs sm:text-[13px] font-bold text-emerald-600 dark:text-emerald-400 truncate mt-0.5"
                      : "text-xs sm:text-[13px] font-bold text-[var(--text-primary)] truncate mt-0.5"
                  }
                >
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}