"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { TechBadge } from "@/components/shared/TechBadge";
import { type ShowcaseItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FlagshipSpotlightProps {
  items: ShowcaseItem[];
}

function formatCleanHostname(url?: string, fallbackName?: string): string {
  if (!url) {
    return `${(fallbackName || "devcore-app").toLowerCase().replace(/\s+/g, "-")}.vercel.app`;
  }
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

function FlagshipCaseCard({
  item,
  index,
}: {
  item: ShowcaseItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isEven = index % 2 === 0;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(360);
  const spotY = useMotionValue(220);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), {
    stiffness: 220,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3.2, 3.2]), {
    stiffness: 220,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 74%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cleanHost = formatCleanHostname(item.liveUrl, item.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative rounded-3xl devcore-glass-card bg-[var(--bg-elevated)]/92 border border-[var(--border-subtle)]/90 hover:border-[var(--brand-primary)]/50 p-6 sm:p-9 lg:p-11 shadow-sm hover:shadow-2xl transition-colors duration-300 overflow-hidden"
      >
        {/* Cursor-Tracked Optical Glass Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Top & Bottom Specular Rim Lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/65 to-transparent opacity-65 group-hover:opacity-100 transition-opacity"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-11 items-center">
          {/* Narrative & Tech Stack Side */}
          <div className={cn("lg:col-span-7 space-y-5", !isEven && "lg:order-last")}>
            {/* Case Number + Product Pill + Category */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-lg bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25">
                CASE // 0{index + 1}
              </span>

              <span className="text-xs px-3 py-1 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold border border-[var(--border-subtle)]">
                {item.name}
              </span>

              <span className="font-mono text-xs font-medium text-[var(--text-muted)]">
                · {item.category}
              </span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[34px] text-[var(--text-primary)] tracking-tight leading-[1.15]">
              {item.name}:{" "}
              <span className="text-[var(--text-primary)]/90">{item.tagline}</span>
            </h3>

            <p className="text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
              {item.description}
            </p>

            {/* Tech Stack Badges */}
            <div className="space-y-2 pt-1">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                PRODUCTION ARCHITECTURE STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} size="md" />
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3.5">
              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-liquid-hover group/live inline-flex items-center gap-2 text-xs font-semibold h-11 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                >
                  <span>Visit {item.name} Live</span>
                  <ExternalLink
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5"
                  />
                </a>
              )}

              {item.caseStudySlug && (
                <Link
                  href={`/projects/${item.caseStudySlug}`}
                  className="group/case inline-flex items-center gap-1.5 text-xs font-semibold h-11 px-4 rounded-xl border border-[var(--border-strong)]/80 bg-[var(--bg-elevated)]/80 text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                >
                  <span>Read Architecture Breakdown</span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="text-[var(--brand-primary)] transition-transform duration-200 group-hover/case:translate-x-0.5 group-hover/case:-translate-y-0.5"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* Interactive Browser Frame Preview & Live Telemetry Card */}
          <div className={cn("lg:col-span-5 space-y-4", !isEven && "lg:order-first")}>
            {item.coverImage && (
              <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 shadow-md">
                {/* Sleek Browser Chrome Top Bar */}
                <div className="px-3.5 py-2.5 border-b border-[var(--border-subtle)]/80 bg-[var(--bg-elevated)]/90 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/75" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/75" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/75" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)] truncate max-w-[210px]">
                    <Globe size={10} className="text-[var(--brand-primary)] shrink-0" />
                    <span className="truncate">{cleanHost}</span>
                  </div>

                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--success)]">
                    HTTPS
                  </span>
                </div>

                {/* UI Preview Viewport */}
                <div className="p-2.5 bg-[var(--bg-surface)]">
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[var(--bg-elevated)]">
                    <Image
                      src={item.coverImage}
                      alt={`${item.name} user interface`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Production Metrics Telemetry Box */}
            <div className="bg-[var(--bg-surface)]/85 backdrop-blur-md rounded-2xl p-5 border border-[var(--border-subtle)] shadow-2xs text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border-subtle)]/80 mb-3.5">
                <span className="inline-flex items-center gap-1.5 font-mono font-bold text-[var(--text-primary)]">
                  <Activity size={13} className="text-[var(--brand-primary)]" />
                  <span>{item.name} Production Metrics</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--success)]/12 text-[var(--success)] font-mono text-[10px] font-bold">
                  <span className="relative flex size-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                    <span className="relative inline-flex rounded-full size-1.5 bg-[var(--success)]" />
                  </span>
                  LIVE
                </span>
              </div>

              {item.metrics && (
                <div className="space-y-2.5">
                  {item.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="flex items-center justify-between gap-3 text-[var(--text-secondary)]"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-[var(--success)] shrink-0" />
                        <span>{m.label}</span>
                      </span>
                      <span className="font-mono font-bold text-[var(--text-primary)] tabular-nums">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FlagshipSpotlight({ items }: FlagshipSpotlightProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!items || items.length === 0) return null;

  const categories = Array.from(
    new Set(items.map((item) => item.category).filter(Boolean))
  );

  const visibleItems =
    selectedCategory === "ALL"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="spotlight"
      aria-labelledby="spotlight-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 px-4 sm:px-6"
    >
      {/* Subtle Ambient Aura Blending Seamlessly With Page Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          className="h-[580px] w-[580px] sm:w-[920px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 12%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
            filter: "blur(52px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14">
        {/* Header + Optional Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
              <Sparkles size={13} />
              <span>FLAGSHIP CASE STUDIES</span>
            </div>

            <h2
              id="spotlight-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-[1.08]"
            >
              Engineered In-House{" "}
              <span className="text-liquid-gradient">by DevCore.</span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Full-stack commercial platforms conceived, architected, and deployed to production by our internal engineering teams.
            </p>
          </div>

          {categories.length > 1 ? (
            <div
              role="tablist"
              aria-label="Filter flagship case studies"
              className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)]/80 backdrop-blur-md border border-[var(--border-subtle)] self-start lg:self-end"
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === "ALL"}
                onClick={() => setSelectedCategory("ALL")}
                className={cn(
                  "px-3.5 py-2 rounded-xl font-mono text-[11px] font-semibold transition-all cursor-pointer",
                  selectedCategory === "ALL"
                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                All Systems ({items.length})
              </button>

              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl font-mono text-[11px] font-semibold transition-all cursor-pointer",
                      active
                        ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] shadow-2xs self-start lg:self-end">
              <Layers size={13} className="text-[var(--brand-primary)]" />
              <span>Full-Stack Production Architecture</span>
            </div>
          )}
        </motion.div>

        {/* Flagship Case Study Banners */}
        <div className="space-y-8 sm:space-y-10">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, idx) => (
              <FlagshipCaseCard key={item.id} item={item} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}