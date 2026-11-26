"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Terminal,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { TechBadge } from "@/components/shared/TechBadge";
import { type ProjectItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [showAllTech, setShowAllTech] = useState(false);

  // Cursor-tracking radial spotlight
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-300);
    mouseY.set(-300);
  };

  const defaultLimit = featured ? 6 : 4;
  const visibleTech = showAllTech
    ? project.techStack
    : project.techStack.slice(0, defaultLimit);
  const hiddenCount = Math.max(0, project.techStack.length - visibleTech.length);

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-lg overflow-hidden transition-colors duration-300 hover:border-[var(--brand-primary)]/45",
        featured
          ? "col-span-full flex flex-col lg:flex-row items-stretch"
          : "flex flex-col justify-between"
      )}
    >
      {/* Top Specular Rim Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/60 to-transparent z-20"
      />

      {/* Interactive Cursor Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* LEFT / TOP STAGE: Clean Frosted Browser Preview (No Dotted Pattern) */}
      <div
        className={cn(
          "relative bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-surface)]/90 to-[var(--bg-elevated)] p-5 sm:p-7 flex flex-col justify-between gap-4 overflow-hidden",
          featured
            ? "w-full lg:w-[52%] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]"
            : "w-full border-b border-[var(--border-subtle)]"
        )}
      >
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[var(--brand-primary)]/10 blur-3xl"
        />

        {/* Top Meta Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <ReleasePill dot dotColor="var(--success)">
            {project.category}
          </ReleasePill>

          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold px-3 py-1 rounded-xl bg-[var(--bg-elevated)]/90 text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-2xs">
            {featured && (
              <Sparkles size={11} className="text-[var(--brand-primary)]" />
            )}
            <span>{featured ? "Flagship Architecture" : "Case Study"}</span>
          </span>
        </div>

        {/* Framed Glass Browser Mockup */}
        <div className="relative z-10 w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-md overflow-hidden transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          {/* Browser Window Bar */}
          <div className="h-8 px-3.5 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/85" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/85" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/85" />
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)] max-w-[220px] truncate">
              <Globe size={10} className="text-[var(--brand-primary)] shrink-0" />
              <span className="truncate">{project.slug}.devcore.app</span>
            </div>

            <Link
              href={`/projects/${project.slug}`}
              aria-label={`Open ${project.name} case study`}
              className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors shrink-0"
            >
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Screenshot Viewport */}
          <div
            className={cn(
              "relative w-full overflow-hidden bg-[var(--bg-surface)]",
              featured ? "aspect-[16/10]" : "aspect-[16/9]"
            )}
          >
            {project.coverImage ? (
              <>
                <Image
                  src={project.coverImage}
                  alt={project.name}
                  fill
                  priority={featured}
                  sizes={
                    featured
                      ? "(max-width: 1024px) 100vw, 52vw"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-50 group-hover:opacity-15 transition-opacity duration-500" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
                <Terminal size={28} className="text-[var(--brand-primary)]" />
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  System Architecture Blueprint
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Telemetry Strip on Featured Stage */}
        {featured && (
          <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)]/95 border border-[var(--border-subtle)] text-[11px] font-mono shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse shrink-0" />
              <span className="text-[var(--text-primary)] font-semibold truncate">
                Production Verified &bull; Multi-Tenant Architecture
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[var(--brand-primary)] font-bold shrink-0">
              <Layers size={12} />
              <span>{project.techStack.length} Modules</span>
            </span>
          </div>
        )}
      </div>

      {/* RIGHT / BOTTOM CONTENT COLUMN */}
      <div
        className={cn(
          "relative z-10 flex flex-col justify-between",
          featured ? "w-full lg:w-[48%] p-6 sm:p-8 lg:p-9" : "flex-1 p-6 sm:p-7"
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Eyebrow + Title + Tagline */}
          <div>
            {featured && (
              <div className="inline-flex items-center gap-2 mb-1.5">
                <span className="h-px w-4 bg-[var(--brand-primary)]/70" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                  Enterprise Production Build
                </span>
              </div>
            )}
            <h3
              className={cn(
                "font-display font-extrabold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--brand-primary)] transition-colors",
                featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
              )}
            >
              {project.name}
            </h3>
            <p className="font-medium text-xs sm:text-sm text-[var(--brand-primary)] mt-1 leading-snug">
              {project.tagline}
            </p>
          </div>

          {/* Problem / Challenge Summary */}
          <p
            className={cn(
              "text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed",
              featured ? "line-clamp-3" : "line-clamp-2"
            )}
          >
            {project.challenge}
          </p>

          {/* Measurable Impact KPI Cards */}
          {project.impact && project.impact.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[var(--border-subtle)]">
              {project.impact.slice(0, 2).map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/30 transition-colors"
                >
                  <span className="text-[10px] text-[var(--text-muted)] block font-mono uppercase tracking-wider truncate">
                    {item.label}
                  </span>
                  <span className="font-mono font-extrabold text-base sm:text-lg text-[var(--text-primary)] mt-0.5 block">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Key Architectural Deliverables */}
          {project.features && project.features.length > 0 && (
            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              {project.features.slice(0, featured ? 3 : 2).map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-[var(--success)] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Interactive Tech Stack with Reflexive Glint "+Show More" Button */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <AnimatePresence initial={false}>
              {visibleTech.map((tech) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                >
                  <TechBadge tech={tech} size="xs" />
                </motion.div>
              ))}
            </AnimatePresence>

            {hiddenCount > 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowAllTech(true)}
                className="relative overflow-hidden inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-3 py-1 rounded-lg bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/45 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] shadow-xs transition-colors duration-200 cursor-pointer"
              >
                {/* Continuous Reflexive Light Sweep */}
                <motion.span
                  aria-hidden="true"
                  animate={{ x: ["-140%", "240%"] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-20 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                />
                <span className="relative z-10">+{hiddenCount} Show More</span>
                <ChevronDown size={12} className="relative z-10" />
              </motion.button>
            )}

            {showAllTech && project.techStack.length > defaultLimit && (
              <button
                type="button"
                onClick={() => setShowAllTech(false)}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <span>Show Less</span>
                <ChevronUp size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="pt-5 mt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="btn-liquid-hover inline-flex items-center justify-center gap-2 text-xs font-semibold h-10 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] w-full sm:w-auto"
          >
            <span>Read Case Study</span>
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>

          <Link
            href={`/contact?project=${encodeURIComponent(project.name)}`}
            className="inline-flex items-center justify-center sm:justify-end gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            <span>Request similar build</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}