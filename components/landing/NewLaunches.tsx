import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { ShowcaseCard } from "@/components/showcase/ShowcaseCard";
import { type ShowcaseItem } from "@/lib/api";

interface NewLaunchesProps {
  items: ShowcaseItem[];
}

export function NewLaunches({ items }: NewLaunchesProps) {
  if (!items || items.length === 0) return null;

  const [newest, ...rest] = items;

  return (
    <section
      id="launches"
      aria-labelledby="launches-heading"
      className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <ReleasePill className="mb-3">
            <Sparkles size={13} aria-hidden="true" />
            &nbsp;PRODUCTION SHIPMENTS
          </ReleasePill>
          <h2
            id="launches-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight mt-3"
          >
            New Launches & Architecture Releases
          </h2>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 mt-3 sm:mt-0">
          <p className="text-sm text-[var(--text-secondary)] max-w-md font-normal">
            Recent enterprise platforms deployed by DevCore Solutions engineering teams.
          </p>
          <Link
            href="/launches"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            View all launches <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {newest && <ShowcaseCard item={newest} featured />}
        {rest.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
