"use client";

import { Award, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface CorePhilosophyProps {
  content: AboutGeneralContent;
}

export function CorePhilosophy({ content }: CorePhilosophyProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] p-6 sm:p-10 md:p-12 backdrop-blur-xl shadow-xs">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)] text-xs font-mono mb-4">
            <Zap size={13} />
            <span>FOUNDATIONAL BELIEF</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] tracking-tight mb-4">
            {content.philosophyTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            {content.philosophyText}
          </p>
        </div>

        {content.philosophyStats && content.philosophyStats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[var(--border-subtle)]/70">
            {content.philosophyStats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[var(--bg-canvas)]/60 border border-[var(--border-subtle)]/60 flex flex-col justify-between"
              >
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)]">
                  {stat.value}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
