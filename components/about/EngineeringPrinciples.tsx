"use client";

import { Cpu, Layers, Eye, ShieldCheck, Terminal, Code2, LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { EngineeringPrincipleItem } from "@/lib/mock/data";

interface EngineeringPrinciplesProps {
  principles: EngineeringPrincipleItem[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  layers: Layers,
  eye: Eye,
  shield: ShieldCheck,
  terminal: Terminal,
  code: Code2,
};

export function EngineeringPrinciples({ principles }: EngineeringPrinciplesProps) {
  if (!principles || principles.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col gap-2 mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-semibold">
          SYSTEM FOUNDATIONS
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)]">
          Engineering Principles
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Every layer of our software and architecture adheres to deterministic standards designed to resist failure and maintain continuous state integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {principles.map((item, idx) => {
          const IconComp = ICON_MAP[item.icon] || Cpu;
          const displayNum = item.number || String(idx + 1).padStart(2, "0");

          return (
            <GlassCard
              key={item.id}
              className="group p-6 flex flex-col justify-between hover:border-[var(--brand-primary)]/40 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[var(--brand-primary)]">
                    {displayNum}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors">
                    <IconComp size={16} />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {(item.supportingLabel || item.supportingText) && (
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/70 flex flex-col gap-1.5">
                  {item.supportingLabel && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      {item.supportingLabel}
                    </span>
                  )}
                  {item.supportingText && (
                    <code className="text-[11px] font-mono text-[var(--text-primary)] bg-[var(--bg-elevated)] px-2 py-1 rounded-md border border-[var(--border-subtle)] truncate">
                      {item.supportingText}
                    </code>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
