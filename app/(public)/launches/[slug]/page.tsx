import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home, ChevronRight, ExternalLink, FileText } from "lucide-react";
import { getShowcaseBySlug, getShowcaseList } from "@/lib/api";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { ShowcaseCard } from "@/components/showcase/ShowcaseCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getShowcaseBySlug(slug);
  if (!item) return { title: "Launch Not Found" };
  return {
    title: `${item.name} — ${item.tagline}`,
    description: item.description,
    openGraph: {
      title: `${item.name} | DevCore Solutions`,
      description: item.description,
      type: "article",
    },
  };
}

export default async function LaunchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [item, { items: allItems }] = await Promise.all([
    getShowcaseBySlug(slug),
    getShowcaseList({ limit: 6 }),
  ]);

  if (!item) notFound();

  const related = allItems.filter((i) => i.slug !== slug).slice(0, 2);
  const launchDate = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    new Date(item.launchedAt)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Accent line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-warm)] to-transparent opacity-60 mb-8" aria-hidden="true" />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-10">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/launches" className="hover:text-[var(--text-primary)] transition-colors text-[var(--brand-primary)]">
          Launches
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          {slug}
        </span>
      </nav>

      {/* Hero header */}
      <div className="max-w-4xl mb-12">
        {/* Release pill */}
        <div className="flex items-center gap-3 mb-4">
          <ReleasePill dot dotColor="var(--success)">
            NEW • {launchDate} • {item.category} Release v{item.version}
          </ReleasePill>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-[var(--text-primary)] tracking-tight leading-[1.08] mb-4">
          {item.name}
        </h1>
        <p className="text-xl font-semibold text-[var(--brand-primary)] mb-4">{item.tagline}</p>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">{item.description}</p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold h-11 px-6 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              Visit live deployment
              <ExternalLink size={15} />
            </a>
          )}
          {item.caseStudySlug && (
            <Link
              href={`/projects/${item.caseStudySlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium h-11 px-5 rounded-[10px] border border-[var(--border-strong)] bg-[var(--bg-elevated)]/65 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <FileText size={15} />
              Read technical case study
            </Link>
          )}
        </div>
      </div>

      {/* Metrics bento */}
      {item.metrics && item.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {item.metrics.map((m) => (
            <GlassCard key={m.label} className="p-5 flex flex-col justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">{m.label}</span>
              <span
                className="font-mono font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mt-2"
                aria-label={`${m.label}: ${m.value}`}
              >
                {m.value}
              </span>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Two-column layout: description + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Main content */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-6">
              Full Description
            </h2>
            {/* Sanitized description — displayed as plain text since mock is safe */}
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Tech stack */}
          <GlassCard className="p-5">
            <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {item.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* CTA */}
          <GlassCard className="p-5 bg-[var(--bg-surface)]">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">
              Need a similar build?
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
              Our principal engineers work with tech leaders to solve complex engineering problems.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full h-10 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              Schedule Architecture Review
            </Link>
          </GlassCard>
        </div>
      </div>

      {/* Tech section */}
      <section aria-labelledby="tech-heading" className="mb-16">
        <GlassCard className="p-8">
          <div className="mb-6">
            <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold uppercase tracking-wide block mb-1">
              System Dependencies
            </span>
            <h2 id="tech-heading" className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Engineered With
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {item.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Related launches */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold uppercase block mb-1">
                Related Architectural Releases
              </span>
              <h2 id="related-heading" className="font-display font-bold text-2xl text-[var(--text-primary)]">
                Explore Adjacent Deployments
              </h2>
            </div>
            <Link
              href="/launches"
              className="text-sm font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] transition-colors hidden sm:flex items-center gap-1 focus-visible:outline-none focus-visible:underline"
            >
              View all releases <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((r) => (
              <ShowcaseCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
