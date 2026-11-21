"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "SaaS", "Enterprise Web", "E-Commerce", "AI Automation"] as const;
const POPULAR_TECHS = ["All Tech", "React Native", "Go / Golang", "PostgreSQL", "Node.js", "CockroachDB", "Redis", "SQLite WAL"];

interface ProjectsFilterProps {
  currentCategory?: string;
  currentTech?: string;
}

export function ProjectsFilter({ currentCategory, currentTech }: ProjectsFilterProps) {
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

    params.delete("cursor"); // Reset pagination on filter change
    const query = params.toString();
    router.push(`/projects${query ? `?${query}` : ""}`);
  };

  const activeCategory = currentCategory || "All";
  const activeTech = currentTech || "All Tech";

  return (
    <div className="devcore-glass-card p-4 sm:p-5 flex flex-col gap-4 mb-8">
      {/* Category selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
          Domain Category:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter by domain category">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateFilters(cat, undefined)}
                aria-pressed={isActive}
                className={cn(
                  "h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isActive
                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
                    : "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tech tag filters */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
        <span className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-1 mr-1">
          <Tag size={12} /> Tech Filter:
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
                "h-7 px-2.5 rounded-md text-[11px] font-mono transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                isActive
                  ? "bg-[var(--brand-hover)] text-[var(--brand-contrast)] font-bold"
                  : "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
              )}
            >
              {tech}
            </button>
          );
        })}
        {(currentCategory || currentTech) && (
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("category");
              params.delete("tech");
              router.push("/projects");
            }}
            className="h-7 px-2.5 rounded-md text-[11px] font-mono text-[var(--error)] hover:bg-[var(--error)]/10 flex items-center gap-1 transition-colors ml-auto"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
