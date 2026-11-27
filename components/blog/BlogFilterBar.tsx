"use client";

import { Search, X, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import type { BlogCategoryItem } from "@/lib/api";

interface BlogFilterBarProps {
  categories: BlogCategoryItem[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: "newest" | "oldest" | "readingTime";
  onSortChange: (sort: "newest" | "oldest" | "readingTime") => void;
  totalFiltered: number;
}

export function BlogFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  totalFiltered,
}: BlogFilterBarProps) {
  const hasActiveFilters =
    Boolean(searchQuery.trim()) || selectedCategory.toLowerCase() !== "all";

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 backdrop-blur-xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
      {/* Top Row: Search Input & Sort Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search systems, protocols, SQLite, eBPF, AI..."
            className="w-full h-10 pl-10 pr-9 rounded-xl text-xs sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] font-mono transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Result Count + Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
            <SlidersHorizontal className="w-3 h-3 text-[var(--brand-primary)]" />
            <span>
              <strong className="text-[var(--text-primary)]">
                {totalFiltered}
              </strong>{" "}
              {totalFiltered === 1 ? "Dispatch" : "Dispatches"}
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            <div className="hidden md:flex items-center gap-1 text-xs font-mono text-[var(--text-secondary)]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Sort:</span>
            </div>
            <select
              value={sortOrder}
              onChange={(e) =>
                onSortChange(
                  e.target.value as "newest" | "oldest" | "readingTime"
                )
              }
              aria-label="Sort articles"
              className="h-9 text-xs font-mono font-semibold px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="readingTime">Reading Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]/80">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all border cursor-pointer ${isSelected
                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)] font-bold shadow-2xs"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]/40 font-medium"
                  }`}
              >
                <span>{cat.name}</span>
                {typeof cat.count === "number" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold leading-none ${isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                      }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onSelectCategory("all");
              onSearchChange("");
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}