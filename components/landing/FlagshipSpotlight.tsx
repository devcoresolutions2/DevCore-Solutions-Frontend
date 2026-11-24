import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { TechBadge } from "@/components/shared/TechBadge";
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
            <span className="devcore-glass-badge inline-flex items-center text-xs font-semibold rounded-full px-3.5 py-1 text-[var(--accent-ink)] mb-2">
              Flagship Case Studies
            </span>
            <h2
              id="spotlight-heading"
              className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight mt-2"
            >
              Engineered In-House by DevCore
            </h2>
          </div>
          <span className="hidden sm:block text-xs font-medium text-[var(--text-tertiary)]">Full-Stack Architecture</span>
        </div>

        {/* Banners */}
        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <GlassCard key={item.id} className="p-6 sm:p-8 lg:p-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Text side */}
                <div className={cn("lg:col-span-7 space-y-5", !isEven && "lg:order-last")}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold border border-[var(--border-subtle)]">
                      {item.name}
                    </span>
                    <span className="text-xs font-medium text-[var(--text-tertiary)]">{item.category}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight leading-snug">
                    {item.name}: {item.tagline}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.techStack.map((tech) => (
                      <TechBadge key={tech} tech={tech} size="md" />
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

                {/* Preview / Image / Metrics */}
                <div className={cn("lg:col-span-5 space-y-4", !isEven && "lg:order-first")}>
                  {item.coverImage && (
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-sm">
                      <Image
                        src={item.coverImage}
                        alt={`${item.name} user interface`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="bg-[var(--bg-surface)] rounded-xl p-5 border border-[var(--border-subtle)] shadow-xs text-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--border-subtle)] mb-4">
                      <span className="font-semibold text-[var(--text-primary)]">{item.name} Metrics</span>
                      <span className="text-[var(--success)] flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[var(--success)]" aria-hidden="true" />
                        Live
                      </span>
                    </div>
                    {item.metrics && (
                      <div className="space-y-2.5">
                        {item.metrics.map((m) => (
                          <div key={m.label} className="flex justify-between text-[var(--text-secondary)]">
                            <span>{m.label}</span>
                            <span className="font-semibold text-[var(--text-primary)] tabular-nums">{m.value}</span>
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
