"use client";

import { Eye, ShieldCheck, Target, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface VisionMissionProps {
  content: AboutGeneralContent;
}

export function VisionMission({ content }: VisionMissionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Glass: Vision */}
        <GlassCard className="relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
                Strategic Intent
              </span>
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)]">
                <Eye size={18} />
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              {content.visionTitle}
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {content.visionText}
            </p>
          </div>

          <div className="mt-8 pt-4 bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]/70 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[var(--text-primary)]">
              <span className="text-xs font-medium">Predictable Execution Standard</span>
              <span className="text-xs font-mono text-[var(--brand-primary)] font-semibold">
                Continuous Invariance
              </span>
            </div>
            {/* Elegant SVG Sparkline */}
            <div className="w-full h-8 flex items-end">
              <svg className="w-full h-8 text-[var(--brand-primary)]" fill="none" viewBox="0 0 200 40">
                <path
                  d="M0 32 L25 28 L50 30 L75 22 L100 24 L125 15 L150 17 L175 9 L200 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="200" cy="6" r="3" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Verified through automated integration pipelines and contract testing
            </span>
          </div>
        </GlassCard>

        {/* Right Glass: Mission */}
        <GlassCard className="relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
                Execution Rigor
              </span>
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)]">
                <Target size={18} />
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              {content.missionTitle}
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {content.missionText}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]/70 flex flex-col">
              <span className="font-display font-extrabold text-2xl text-[var(--text-primary)]">
                100%
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1">
                Direct Engineering Lead
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)]/70 flex flex-col">
              <span className="font-display font-extrabold text-2xl text-[var(--text-primary)]">
                Zero
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1">
                Proxy Handover Friction
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
