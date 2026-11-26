"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "SaaS", "Enterprise Web", "E-Commerce", "AI Automation", "Mobile", "Other"] as const;

interface LaunchesFilterProps {
  currentCategory?: string;
}

export function LaunchesFilter({ currentCategory }: LaunchesFilterProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(sp.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/launches?${params.toString()}`);
  };

  const active = currentCategory ?? "All";

  return (
    <div className="devcore-glass-card bg-[var(--glass-surface)] p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-2">
      {/* Category chips */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scroll-smooth"
        role="group"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat || (cat === "All" && !currentCategory);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={isActive}
              className={cn(
                "h-10 px-4 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150",
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

      {/* Search (UI only — filtering is handled server-side via searchParams in a real API) */}
      <div className="relative w-full sm:w-72 flex-shrink-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Filter by stack, protocol..."
          className="w-full h-11 pl-9 pr-4 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
          aria-label="Search launches"
        />
      </div>
    </div>
  );
}
