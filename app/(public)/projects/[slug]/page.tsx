import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Home,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Quote,
  Server,
  Layers,
  Cpu,
} from "lucide-react";
import { getProjectBySlug, getProjectList } from "@/lib/api";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { TechBadge } from "@/components/shared/TechBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Case Study Not Found" };
  return {
    title: `${project.name} Case Study — DevCore Solutions`,
    description: project.solution,
    openGraph: {
      title: `${project.name} | Technical Architecture Case Study`,
      description: project.challenge,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Accent Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-warm)] to-transparent opacity-60 mb-8" aria-hidden="true" />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/projects" className="hover:text-[var(--text-primary)] transition-colors text-[var(--brand-primary)]">
          Portfolio
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          {project.slug}
        </span>
      </nav>

      {/* Hero Header */}
      <div className="max-w-4xl mb-12">
        <div className="flex items-center gap-3 mb-4">
          <ReleasePill dot dotColor="var(--success)">
            VERIFIED CASE STUDY • {project.category.toUpperCase()}
          </ReleasePill>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-[var(--text-primary)] tracking-tight leading-[1.08] mb-4">
          {project.name}
        </h1>
        <p className="text-xl font-semibold text-[var(--brand-primary)] mb-4">
          {project.tagline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <Link
            href={`/contact?project=${encodeURIComponent(project.name)}`}
            className="btn-liquid-hover inline-flex items-center gap-2 text-sm font-semibold h-11 px-6 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-md hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <span>Request a similar build</span>
            <ArrowRight size={15} />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium h-11 px-5 rounded-[10px] border border-[var(--border-strong)] bg-[var(--bg-elevated)]/65 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <span>Visit live deployment</span>
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Measurable Impact Numerals */}
      <section aria-labelledby="impact-heading" className="mb-14">
        <h2 id="impact-heading" className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-4">
          Measurable Production Impact:
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {project.impact.map((metric) => (
            <GlassCard key={metric.label} className="p-6 flex flex-col justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {metric.label}
              </span>
              <span className="font-mono font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] mt-3">
                {metric.value}
              </span>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Challenge vs Solution */}
      <section aria-labelledby="challenge-heading" className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Challenge */}
          <GlassCard className="p-8 border-l-4 border-l-[var(--warning)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono font-bold text-sm text-[var(--warning)] px-2 py-0.5 rounded bg-[var(--warning)]/10">
                01 / THE CHALLENGE
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">
              The Problem & System Constraints
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.challenge}
            </p>
          </GlassCard>

          {/* The Solution */}
          <GlassCard className="p-8 border-l-4 border-l-[var(--success)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono font-bold text-sm text-[var(--success)] px-2 py-0.5 rounded bg-[var(--success)]/10">
                02 / THE SOLUTION
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">
              DevCore Engineering Strategy
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.solution}
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Architecture Diagram Visualization */}
      <section aria-labelledby="architecture-heading" className="mb-14">
        <GlassCard className="p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold uppercase block mb-1">
                TOPOLOGY SCHEMATIC
              </span>
              <h2 id="architecture-heading" className="font-display font-bold text-2xl text-[var(--text-primary)]">
                System Architecture Blueprint
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--success)] bg-[var(--success)]/10 px-3 py-1.5 rounded-lg border border-[var(--success)]/20 self-start sm:self-auto">
              Deterministic Invariants Satisfied
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="w-full rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] p-6 relative overflow-hidden flex flex-col items-center justify-center">
            <svg
              className="w-full max-w-4xl h-64 text-[var(--brand-primary)]"
              viewBox="0 0 800 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="System architecture diagram illustrating client nodes connecting to API ingress, queuing in Redis/Kafka, and persisting in distributed database."
            >
              <defs>
                <pattern id="arch-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#arch-grid)" />

              {/* Connecting lines */}
              <path d="M 160 120 L 320 120" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />
              <path d="M 460 120 L 620 120" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />

              {/* Edge Client Layer */}
              <g transform="translate(60, 80)">
                <rect width="120" height="80" rx="10" fill="var(--bg-elevated)" stroke="currentColor" strokeWidth="1.5" />
                <text x="60" y="38" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="700" fontFamily="sans-serif">Edge / POS Nodes</text>
                <text x="60" y="56" textAnchor="middle" fill="var(--brand-primary)" fontSize="10" fontFamily="monospace">SQLite WAL Mode</text>
              </g>

              {/* API Core Layer */}
              <g transform="translate(330, 70)">
                <rect width="140" height="100" rx="12" fill="var(--brand-primary)" />
                <text x="70" y="42" textAnchor="middle" fill="var(--brand-contrast)" fontSize="13" fontWeight="800" fontFamily="sans-serif">DevCore Core</text>
                <text x="70" y="62" textAnchor="middle" fill="var(--brand-contrast)" fontSize="10" fontFamily="monospace">Cluster Ingress</text>
                <text x="70" y="78" textAnchor="middle" fill="var(--accent-warm)" fontSize="9" fontFamily="monospace">&lt; 14ms Wire P99</text>
              </g>

              {/* Persistence Layer */}
              <g transform="translate(620, 80)">
                <rect width="130" height="80" rx="10" fill="var(--bg-elevated)" stroke="currentColor" strokeWidth="1.5" />
                <text x="65" y="38" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="700" fontFamily="sans-serif">Persistence Core</text>
                <text x="65" y="56" textAnchor="middle" fill="var(--success)" fontSize="10" fontWeight="600" fontFamily="monospace">ACID Replicated</text>
              </g>
            </svg>
          </div>
        </GlassCard>
      </section>

      {/* Delivered Features List */}
      <section aria-labelledby="features-heading" className="mb-14">
        <GlassCard className="p-8 sm:p-10">
          <div className="mb-6">
            <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold uppercase block mb-1">
              ENGINEERED CAPABILITIES
            </span>
            <h2 id="features-heading" className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Delivered Architectural Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feature) => (
              <div
                key={feature}
                className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-start gap-3"
              >
                <CheckCircle2 size={18} className="text-[var(--success)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Testimonial Callout */}
      {project.testimonial && (
        <section aria-labelledby="testimonial-heading" className="mb-14">
          <GlassCard className="p-8 sm:p-10 relative overflow-hidden bg-[var(--bg-surface)]">
            <Quote size={40} className="text-[var(--brand-primary)]/20 absolute -top-2 -left-2" aria-hidden="true" />
            <blockquote className="text-lg sm:text-xl font-medium text-[var(--text-primary)] leading-relaxed italic mb-6">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
              <div>
                <cite className="font-display font-bold text-base text-[var(--text-primary)] not-italic block">
                  {project.testimonial.author}
                </cite>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {project.testimonial.role}
                </span>
              </div>
              <span className="font-mono text-xs text-[var(--success)] bg-[var(--success)]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck size={14} /> Verified Client
              </span>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Tech Stack */}
      <section aria-labelledby="stack-heading" className="mb-14">
        <GlassCard className="p-8">
          <div className="mb-4">
            <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold uppercase block mb-1">
              SYSTEM TECHNOLOGIES
            </span>
            <h2 id="stack-heading" className="font-display font-bold text-2xl text-[var(--text-primary)]">
              Full Technology Stack
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {project.techStack.map((tech) => (
              <TechBadge key={tech} tech={tech} size="md" />
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Bottom CTA Banner */}
      <section aria-labelledby="cta-heading">
        <GlassCard className="p-8 sm:p-12 text-center bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-elevated)]">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="devcore-glass-badge inline-flex items-center font-mono text-xs rounded-full px-3.5 py-1 text-[var(--accent-ink)]">
              SOLVE YOUR INFRASTRUCTURE BOTTLENECKS
            </span>
            <h2 id="cta-heading" className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              Ready to engineer a similar resilient platform?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We review your technical specifications, analyze database and concurrency models, and provide a full engineering scope with fixed milestone timelines.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/contact?project=${encodeURIComponent(project.name)}`}
                className="btn-liquid-hover inline-flex items-center gap-2 text-sm font-semibold px-8 h-12 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-md hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span>Request a similar build for {project.name}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
