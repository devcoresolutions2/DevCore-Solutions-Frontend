"use client";

import Link from "next/link";
import { ChevronRight, Cpu, Sparkles, Terminal } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { ReleasePill } from "@/components/glass/ReleasePill";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface AboutHeroProps {
  content: AboutGeneralContent;
}

export function AboutHero({ content }: AboutHeroProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      {/* Breadcrumbs & Status Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-[var(--text-secondary)] font-medium uppercase">
              {content.foundingTag}
            </span>
          </div>
        )}
      </div>

      {/* Editorial Typography Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <ReleasePill className="w-fit">
            <Cpu size={12} className="text-[var(--brand-primary)]" />
            <span className="font-mono text-[11px] tracking-widest uppercase">
              {content.heroBadge || "ARCHITECTURAL DOSSIER"}
            </span>
          </ReleasePill>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight leading-[1.12]">
            {content.heroTitle}
          </h1>
        </div>
        <div className="lg:col-span-4 flex flex-col justify-end">
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {content.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Telemetry Strip Banner (Honest & Deterministic) */}
      <div className="mt-10 p-4 sm:p-5 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] backdrop-blur-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-xs">
            <Terminal size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Architecture Delivery
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
              Deterministic Contract-First Development
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 md:gap-8">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Engineering Focus
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
              Zero Bloat &bull; Provable Systems
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Code Quality
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
              Strict Types &bull; Continuous CI
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Delivery Protocol
            </span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Direct Senior Execution
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
