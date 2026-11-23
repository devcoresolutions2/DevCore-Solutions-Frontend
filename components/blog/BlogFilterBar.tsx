"use client";

import { Search, X, ArrowUpDown } from "lucide-react";
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
  return (
    <div className="space-y-4 mb-8">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search systems, protocols, algorithms..."
            className="w-full pl-10 pr-9 py-2 rounded-lg text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] font-mono transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="text-xs font-mono py-1.5 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="readingTime">Reading Time</option>
          </select>
        </div>
      </div>

      {/* Category Pills with Counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors border ${
                isSelected
                  ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
              }`}
            >
              <span>{cat.name}</span>
              {typeof cat.count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[var(--bg-canvas)] text-[var(--text-tertiary)]"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Match indicator */}
      {searchQuery && (
        <div className="text-xs font-mono text-[var(--text-secondary)] pt-1">
          Found <span className="font-semibold text-[var(--text-primary)]">{totalFiltered}</span>{" "}
          article{totalFiltered === 1 ? "" : "s"} matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
