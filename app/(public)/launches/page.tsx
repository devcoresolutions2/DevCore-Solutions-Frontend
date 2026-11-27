import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Package2 } from "lucide-react";
import { getShowcaseList } from "@/lib/api";
import { ShowcaseCard } from "@/components/showcase/ShowcaseCard";
import { LaunchesFilter } from "@/components/showcase/LaunchesFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Launches & Architecture Releases",
  description: "Explore mission-critical enterprise systems engineered and scaled by DevCore Solutions.",
};

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function LaunchesPage({ searchParams }: PageProps) {
  const { category, q } = await searchParams;
  const { items, total } = await getShowcaseList({ limit: 24, category });

  const [newest, ...rest] = items;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:underline">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">Launches</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Production Deployments & Architecture Releases
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mt-3 max-w-3xl">
          Explore mission-critical enterprise systems engineered, load-tested, and scaled by DevCore engineering squads under deterministic zero-drift guarantees.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--accent-warm)] text-[var(--accent-ink)] border border-[var(--border-subtle)]">
            {total} Total Releases
          </span>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            99.998% SLA Guarantee
          </span>
        </div>
      </div>

      {/* Client-side filter row */}
      <LaunchesFilter currentCategory={category} />

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package2 size={48} className="text-[var(--text-muted)] mb-4" />
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">No launches yet in this category</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Check back soon or browse all launches.</p>
          <Link href="/launches" className="mt-4 text-sm font-semibold text-[var(--brand-primary)] hover:underline">
            View all launches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {newest && <ShowcaseCard item={newest} featured />}
          {rest.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
