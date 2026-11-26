"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Layers, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "SaaS",
  "Enterprise Web",
  "E-Commerce",
  "AI Automation",
] as const;

const POPULAR_TECHS = [
  "All Tech",
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Stripe",
  "Go / Golang",
  "Redis",
] as const;

interface ProjectsFilterProps {
  currentCategory?: string;
  currentTech?: string;
}

export function ProjectsFilter({
  currentCategory,
  currentTech,
}: ProjectsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (newCategory?: string, newTech?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory !== undefined) {
      if (newCategory === "All") {
        params.delete("category");
      } else {
        params.set("category", newCategory);
      }
    }

    if (newTech !== undefined) {
      if (newTech === "All Tech") {
        params.delete("tech");
      } else {
        params.set("tech", newTech);
      }
    }

    params.delete("cursor");
    const query = params.toString();
    router.push(`/projects${query ? `?${query}` : ""}`);
  };

  const activeCategory = currentCategory || "All";
  const activeTech = currentTech || "All Tech";
  const hasActiveFilters = Boolean(currentCategory || currentTech);

  return (
    <div className="relative w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-sm p-4 sm:p-6 flex flex-col gap-4 mb-8 sm:mb-10">
      {/* Top Specular Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/45 to-transparent"
      />

      {/* Row 1: Domain Category Selection */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 shrink-0">
          <Layers size={14} className="text-[var(--brand-primary)]" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold">
            Domain Category
          </span>
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by domain category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateFilters(cat, undefined)}
                aria-pressed={isActive}
                className={cn(
                  "h-9 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isActive
                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
                    : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]/50"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Tech Stack Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold inline-flex items-center gap-1.5 mr-1">
            <Tag size={12} className="text-[var(--brand-primary)]" />
            <span>Stack:</span>
          </span>

          {POPULAR_TECHS.map((tech) => {
            const isActive = activeTech === tech;
            return (
              <button
                key={tech}
                type="button"
                onClick={() => updateFilters(undefined, tech)}
                aria-pressed={isActive}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-[11px] font-mono transition-all duration-150 whitespace-nowrap cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isActive
                    ? "bg-[var(--brand-primary)]/15 border border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold shadow-2xs"
                    : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]/40"
                )}
              >
                {tech}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="self-start sm:self-auto h-8 px-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/25 text-[11px] font-mono font-semibold text-[var(--error)] hover:bg-[var(--error)]/15 inline-flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          >
            <X size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}