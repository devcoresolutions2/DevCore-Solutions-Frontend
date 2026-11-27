import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, FolderGit2, ArrowRight } from "lucide-react";
import { getProjectList } from "@/lib/api";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsFilter } from "@/components/projects/ProjectsFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies & Engineering Portfolio",
  description:
    "In-depth case studies and technical teardowns of mission-critical platforms engineered by DevCore Solutions.",
};

interface PageProps {
  searchParams: Promise<{ category?: string; tech?: string; cursor?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { category, tech, cursor } = await searchParams;
  const { items, total, nextCursor } = await getProjectList({
    limit: 6,
    category,
    tech,
    cursor,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:underline">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">Portfolio & Case Studies</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          Proven Architectural Case Studies
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mt-3 max-w-3xl leading-relaxed">
          Deep dives into complex challenges, technical trade-offs, architecture blueprints, and measurable outcomes delivered for our engineering partners.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[var(--accent-warm)] text-[var(--accent-ink)] border border-[var(--border-subtle)]">
            {total} Technical Case Studies
          </span>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            Verified Production Implementations
          </span>
        </div>
      </div>

      {/* Filter panel */}
      <ProjectsFilter currentCategory={category} currentTech={tech} />

      {/* Projects Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center devcore-glass-card p-8">
          <FolderGit2 size={48} className="text-[var(--text-muted)] mb-4" />
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
            No projects found matching the filter criteria
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Try adjusting your category or tech filter settings to view more builds.
          </p>
          <Link
            href="/projects"
            className="mt-4 text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-colors"
          >
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {items.map((project, idx) => (
            <ProjectCard key={project.id} project={project} featured={idx === 0 && items.length > 2} />
          ))}
        </div>
      )}

      {/* Cursor Pagination Load More */}
      {nextCursor && (
        <div className="mt-12 flex justify-center">
          <Link
            href={`/projects?cursor=${nextCursor}${category ? `&category=${category}` : ""}${tech ? `&tech=${tech}` : ""}`}
            className="btn-liquid-hover inline-flex items-center gap-2 text-xs font-semibold px-6 py-3 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm hover:bg-[var(--brand-hover)]"
          >
            <span>Load More Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
