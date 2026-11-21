import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { type ShowcaseItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FlagshipSpotlightProps {
  items: ShowcaseItem[];
}

export function FlagshipSpotlight({ items }: FlagshipSpotlightProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id="spotlight"
      aria-labelledby="spotlight-heading"
      className="py-20 px-4 sm:px-6 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="devcore-glass-badge inline-flex items-center font-mono text-xs rounded-full px-3.5 py-1 text-[var(--accent-ink)] mb-2">
              FLAGSHIP CASE STUDIES
            </span>
            <h2
              id="spotlight-heading"
              className="font-display font-extrabold text-3xl text-[var(--text-primary)] mt-2"
            >
              Engineered In-House by DevCore
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-xs text-[var(--text-muted)]">Full-Stack Provenance</span>
        </div>

        {/* Banners */}
        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <GlassCard key={item.id} className="p-8 lg:p-10 border border-[var(--border-subtle)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text side */}
                <div className={cn("lg:col-span-7 space-y-5", !isEven && "lg:order-last")}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--accent-warm)] text-[var(--text-primary)] font-semibold border border-[var(--border-subtle)]">
                      {item.name}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{item.category}</span>
                  </div>

                  <h3 className="font-display font-extrabold text-3xl text-[var(--text-primary)] tracking-tight">
                    {item.name}: {item.tagline}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs px-3 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    {item.liveUrl && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold h-11 px-5 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                      >
                        Visit {item.name} Live
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    )}
                    {item.caseStudySlug && (
                      <Link
                        href={`/projects/${item.caseStudySlug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium h-11 px-4 rounded-[10px] border border-[var(--border-strong)] bg-[var(--bg-elevated)]/65 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                      >
                        Read Architecture Breakdown
                      </Link>
                    )}
                  </div>
                </div>

                {/* Metrics card */}
                <div className={cn("lg:col-span-5", !isEven && "lg:order-first")}>
                  <div className="bg-[var(--bg-elevated)] rounded-xl p-5 border border-[var(--border-subtle)] shadow-sm font-mono text-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--bg-surface)] mb-4">
                      <span className="font-bold text-[var(--text-primary)] uppercase">{item.name} Telemetry</span>
                      <span className="text-[var(--success)] flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[var(--success)]" aria-hidden="true" />
                        Live
                      </span>
                    </div>
                    {item.metrics && (
                      <div className="space-y-3">
                        {item.metrics.map((m) => (
                          <div key={m.label} className="flex justify-between text-[var(--text-muted)]">
                            <span>{m.label}:</span>
                            <span className="font-bold text-[var(--text-primary)]">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
