import { Activity, Shield, Cpu } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { type BentoProofItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>> = {
  Activity,
  Shield,
  Cpu,
};

interface BentoProofProps {
  items: BentoProofItem[];
}

export function BentoProof({ items }: BentoProofProps) {
  if (!items || items.length === 0) return null;

  const auditedDate = items[0]?.auditedAsOf ?? "Recently";

  return (
    <section
      aria-labelledby="bento-heading"
      className="py-16 px-4 sm:px-6 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Continuous Telemetry Verification
            </span>
            <h2
              id="bento-heading"
              className="font-display font-bold text-2xl text-[var(--text-primary)] mt-1"
            >
              Operational Reliability Benchmarks
            </h2>
          </div>
          <div className="font-mono text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
            Audited as of:&nbsp;
            <time className="font-semibold text-[var(--text-primary)]">{auditedDate}</time>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Activity;
            const badgeStyle =
              item.badgeColor === "success"
                ? "text-[var(--success)] bg-[var(--success)]/10"
                : item.badgeColor === "warning"
                ? "text-[var(--warning)] bg-[var(--warning)]/10"
                : "text-[var(--brand-primary)] bg-[var(--brand-primary)]/10";

            return (
              <GlassCard key={item.id} className="p-6 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      item.badgeColor === "success"
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                    )}
                  >
                    <Icon size={20} aria-hidden={true} />
                  </div>
                  <span className={cn("font-mono text-[11px] font-semibold px-2 py-0.5 rounded", badgeStyle)}>
                    {item.badge}
                  </span>
                </div>

                <div
                  className="font-mono font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight"
                  aria-label={`${item.value} — ${item.label}`}
                >
                  {item.value}
                </div>
                <div className="font-display font-bold text-base text-[var(--text-primary)] mt-1">
                  {item.label}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                  <span>{item.footnote}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{item.footnoteValue}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
