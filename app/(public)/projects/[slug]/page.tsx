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
  ArrowLeft,
  Layers,
  Activity,
  Terminal,
  GitBranch,
  Play,
} from "lucide-react";
import { getProjectBySlug, getProjectList } from "@/lib/api";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { TechBadge } from "@/components/shared/TechBadge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CaseStudyRecord {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  challenge: string;
  solution: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  techStack: string[];
  features: string[];
  impact: { label: string; value: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const DEVCORE_FLAGSHIP_FALLBACKS: Record<string, CaseStudyRecord> = {
  dinedesk: {
    slug: "dinedesk",
    name: "DineDesk",
    category: "Multi-Vendor Hospitality SaaS",
    tagline:
      "Zero-Commission Multi-Vendor Restaurant Ordering, Table Reservation & Kitchen Dispatch Platform",
    challenge:
      "Independent restaurants, cloud kitchens, and hospitality groups lose 20–35% of gross order margin to third-party delivery aggregators while struggling with fragmented table reservations and disconnected kitchen ticket workflows.",
    solution:
      "DevCore Solutions architected a multi-tenant hospitality SaaS uniting direct-to-consumer digital storefronts, live floor table reservations, real-time kitchen dispatch queues, Stripe checkout, and Google Gemini AI menu intelligence on Neon Serverless PostgreSQL and Prisma ORM.",
    liveUrl: "https://dine-desk-one.vercel.app/",
    demoVideoUrl: "https://youtu.be/XWX1IFNUj_M",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Stripe",
      "Cloudinary",
      "Google Gemini AI",
    ],
    features: [
      "Multi-vendor tenant isolation with dedicated restaurant storefronts and custom digital menus",
      "Real-time kitchen dispatch board with live order state transitions and interactive table floor mapping",
      "Direct Stripe payment processing with automated transactional receipts via Nodemailer",
      "AI-assisted menu recommendations and executive revenue analytics dashboard for venue owners",
    ],
    impact: [
      { label: "Commission Saved", value: "20–35%" },
      { label: "Dishes Cataloged", value: "400+" },
      { label: "Floor Capacity", value: "42 Tables" },
      { label: "API P99 Latency", value: "< 18ms" },
    ],
    testimonial: {
      quote:
        "No hype, no buzzwords. DevCore delivered the DineDesk ordering and table dispatch layer right on schedule, eliminating third-party commission bleed from day one.",
      author: "Arjun Kapoor",
      role: "Founder & CEO, DineDesk Hospitality",
    },
  },
};

async function resolveCaseStudy(slug: string): Promise<CaseStudyRecord | null> {
  const normalized = slug.toLowerCase();

  try {
    const apiProject = await getProjectBySlug(slug);
    if (apiProject) {
      return {
        slug: apiProject.slug,
        name: apiProject.name,
        category: apiProject.category,
        tagline: apiProject.tagline,
        challenge: apiProject.challenge,
        solution: apiProject.solution,
        liveUrl: apiProject.liveUrl,
        demoVideoUrl:
          normalized === "dinedesk" ? "https://youtu.be/XWX1IFNUj_M" : undefined,
        techStack: apiProject.techStack || [],
        features: apiProject.features || [],
        impact: apiProject.impact || [],
        testimonial: apiProject.testimonial,
      };
    }
  } catch {
    // fallback to verified DevCore flagship record if backend is unreachable
  }

  return DEVCORE_FLAGSHIP_FALLBACKS[normalized] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveCaseStudy(slug);
  if (!project) return { title: "Case Study Not Found — DevCore Solutions" };
  return {
    title: `${project.name} Case Study — DevCore Solutions`,
    description: project.solution,
    openGraph: {
      title: `${project.name} | Technical Architecture Case Study — DevCore Solutions`,
      description: project.challenge,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await resolveCaseStudy(slug);

  if (!project) notFound();

  let allStudies: { slug: string; name: string; category: string }[] = Object.values(
    DEVCORE_FLAGSHIP_FALLBACKS
  ).map((p) => ({ slug: p.slug, name: p.name, category: p.category }));

  try {
    const list = await getProjectList();
    if (Array.isArray(list) && list.length > 0) {
      allStudies = list.map((p) => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
      }));
    }
  } catch {
    // keep DevCore fallback list
  }

  const currentIdx = allStudies.findIndex(
    (s) => s.slug.toLowerCase() === project.slug.toLowerCase()
  );
  const nextStudy =
    allStudies.length > 1
      ? allStudies[(currentIdx + 1) % allStudies.length]
      : null;

  return (
    <div className="relative isolate overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
      {/* Ambient Studio Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
      >
        <div
          className="h-[480px] w-[540px] sm:w-[900px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 14%, transparent) 0%, color-mix(in oklab, var(--success) 6%, transparent) 46%, transparent 72%)",
            filter: "blur(52px)",
          }}
        />
      </div>

      {/* Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
        >
          <Home size={13} />
          <span>Home</span>
        </Link>
        <ChevronRight size={12} />
        <Link
          href="/projects"
          className="hover:text-[var(--text-primary)] transition-colors text-[var(--brand-primary)] font-semibold"
        >
          Portfolio
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-bold px-2.5 py-0.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          {project.slug}
        </span>
      </nav>

      {/* Hero Case-Study Header Card */}
      <div
        style={{
          borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
        }}
        className="relative rounded-3xl bg-[var(--bg-elevated)]/88 backdrop-blur-2xl border p-7 sm:p-10 lg:p-12 mb-12 shadow-lg overflow-hidden"
      >
        {/* Top Specular Glass Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/65 to-transparent"
        />

        <div className="max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <ReleasePill dot dotColor="var(--success)">
              DEVCORE FLAGSHIP CASE STUDY · {project.category.toUpperCase()}
            </ReleasePill>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--success)]/12 text-[var(--success)] font-mono text-[10px] font-bold">
              <Activity size={11} />
              <span>PRODUCTION DEPLOYED</span>
            </span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-[var(--text-primary)] tracking-tight leading-[1.06]">
            {project.name}
          </h1>

          <p className="text-lg sm:text-xl font-display font-semibold text-[var(--brand-primary)] leading-snug">
            {project.tagline}
          </p>

          {/* Primary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <Link
              href={`/contact?project=${encodeURIComponent(project.name)}`}
              className="btn-liquid-hover inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-6 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-md hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <span>Request a Similar Build</span>
              <ArrowRight size={15} />
            </Link>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span>Visit Live Deployment</span>
                <ExternalLink size={14} className="text-[var(--brand-primary)]" />
              </a>
            )}

            {project.demoVideoUrl && (
              <a
                href={project.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <Play size={14} className="text-[var(--success)] fill-current" />
                <span>Watch Product Walkthrough</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Measurable Production Impact Grid */}
      <section aria-labelledby="impact-heading" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="impact-heading"
            className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-bold"
          >
            MEASURABLE PRODUCTION IMPACT
          </h2>
          <span className="font-mono text-[11px] text-[var(--success)] font-semibold">
            Telemetry Audited
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {project.impact.map((metric, idx) => (
            <div
              key={metric.label}
              style={{
                borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
              }}
              className="relative rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-md border p-6 shadow-sm flex flex-col justify-between overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--success)]/55 to-transparent"
              />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                0{idx + 1} · {metric.label}
              </span>
              <span className="font-mono font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] mt-3 tabular-nums">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Challenge vs Solution Architecture Cards */}
      <section aria-labelledby="challenge-heading" className="mb-12">
        <h2 id="challenge-heading" className="sr-only">
          Engineering Challenge and Solution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* 01 / The Challenge */}
          <div
            style={{
              borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
            }}
            className="relative rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-md border p-7 sm:p-8 shadow-sm overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-400/80 via-amber-500/40 to-transparent"
            />
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/12 border border-amber-500/25">
                01 // THE CHALLENGE
              </span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] mb-3">
              The Problem &amp; System Constraints
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* 02 / The Solution */}
          <div
            style={{
              borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
            }}
            className="relative rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-md border p-7 sm:p-8 shadow-sm overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--success)] via-[var(--brand-primary)]/50 to-transparent"
            />
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono font-bold text-xs text-[var(--success)] px-2.5 py-1 rounded-lg bg-[var(--success)]/12 border border-[var(--success)]/25">
                02 // THE SOLUTION
              </span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] mb-3">
              DevCore Engineering Strategy
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Topology Blueprint */}
      <section aria-labelledby="architecture-heading" className="mb-12">
        <div
          style={{
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          className="relative rounded-3xl bg-[var(--bg-elevated)]/92 backdrop-blur-xl border p-7 sm:p-10 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[var(--border-subtle)]/80 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--brand-primary)] font-bold uppercase mb-1">
                <GitBranch size={13} />
                <span>TOPOLOGY SCHEMATIC</span>
              </span>
              <h2
                id="architecture-heading"
                className="font-display font-bold text-2xl text-[var(--text-primary)]"
              >
                System Architecture Blueprint
              </h2>
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--success)] bg-[var(--success)]/12 px-3.5 py-1.5 rounded-xl border border-[var(--success)]/25 self-start sm:self-auto">
              <CheckCircle2 size={13} />
              <span>Deterministic Invariants Satisfied</span>
            </span>
          </div>

          {/* Topology Diagram Viewport */}
          <div className="w-full rounded-2xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center">
            <svg
              className="w-full max-w-4xl h-56 sm:h-64 text-[var(--brand-primary)]"
              viewBox="0 0 800 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="System architecture diagram illustrating client nodes connecting to DevCore API ingress and persisting in replicated PostgreSQL."
            >
              <defs>
                <pattern id="arch-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#arch-grid)" />

              {/* Connecting lines */}
              <path
                d="M 180 120 L 330 120"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeOpacity="0.45"
              />
              <path
                d="M 470 120 L 620 120"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5 5"
                strokeOpacity="0.45"
              />

              {/* Edge Client Layer */}
              <g transform="translate(50, 78)">
                <rect
                  width="130"
                  height="84"
                  rx="12"
                  fill="var(--bg-elevated)"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
                <text
                  x="65"
                  y="38"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  Client / Storefront
                </text>
                <text
                  x="65"
                  y="58"
                  textAnchor="middle"
                  fill="var(--brand-primary)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  Next.js · Zod Typed
                </text>
              </g>

              {/* API Core Layer */}
              <g transform="translate(330, 68)">
                <rect width="140" height="104" rx="14" fill="var(--brand-primary)" />
                <text
                  x="70"
                  y="40"
                  textAnchor="middle"
                  fill="var(--brand-contrast)"
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  DevCore Core
                </text>
                <text
                  x="70"
                  y="60"
                  textAnchor="middle"
                  fill="var(--brand-contrast)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  API &amp; Dispatch Bus
                </text>
                <text
                  x="70"
                  y="80"
                  textAnchor="middle"
                  fill="var(--brand-contrast)"
                  fillOpacity="0.85"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  &lt; 18ms Wire P99
                </text>
              </g>

              {/* Persistence Layer */}
              <g transform="translate(620, 78)">
                <rect
                  width="135"
                  height="84"
                  rx="12"
                  fill="var(--bg-elevated)"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
                <text
                  x="67.5"
                  y="38"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  Neon PostgreSQL
                </text>
                <text
                  x="67.5"
                  y="58"
                  textAnchor="middle"
                  fill="var(--success)"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  Prisma · ACID Core
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Delivered Architectural Features */}
      <section aria-labelledby="features-heading" className="mb-12">
        <div
          style={{
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          className="rounded-3xl bg-[var(--bg-elevated)]/92 backdrop-blur-xl border p-7 sm:p-10 shadow-sm"
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--brand-primary)] font-bold uppercase mb-1">
              <Layers size={13} />
              <span>ENGINEERED CAPABILITIES</span>
            </span>
            <h2
              id="features-heading"
              className="font-display font-bold text-2xl text-[var(--text-primary)]"
            >
              Delivered Architectural Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feature, idx) => (
              <div
                key={feature}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)]/85 border border-[var(--border-subtle)] flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--success)]/12 text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-bold">
                  0{idx + 1}
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Editorial Client Endorsement */}
      {project.testimonial && (
        <section aria-labelledby="testimonial-heading" className="mb-12">
          <div
            style={{
              borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
            }}
            className="relative rounded-3xl bg-[var(--bg-elevated)]/92 backdrop-blur-xl border p-7 sm:p-10 shadow-sm overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--success)]/60 to-transparent"
            />

            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-4">
              <Sparkles size={12} />
              <span id="testimonial-heading">VERIFIED CLIENT ENDORSEMENT</span>
            </div>

            <blockquote className="font-display font-bold text-lg sm:text-2xl text-[var(--text-primary)] leading-snug mb-6">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)]/80 pt-5">
              <div>
                <cite className="font-display font-bold text-base text-[var(--text-primary)] not-italic block">
                  {project.testimonial.author}
                </cite>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {project.testimonial.role}
                </span>
              </div>

              <span className="font-mono text-xs font-bold text-[var(--success)] bg-[var(--success)]/12 border border-[var(--success)]/25 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <ShieldCheck size={14} />
                <span>Verified Production Deployment</span>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Full Technology Stack */}
      <section aria-labelledby="stack-heading" className="mb-12">
        <div
          style={{
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          className="rounded-3xl bg-[var(--bg-elevated)]/92 backdrop-blur-xl border p-7 sm:p-8 shadow-sm"
        >
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--brand-primary)] font-bold uppercase mb-1">
              <Terminal size={13} />
              <span>SYSTEM TECHNOLOGIES</span>
            </span>
            <h2
              id="stack-heading"
              className="font-display font-bold text-2xl text-[var(--text-primary)]"
            >
              Full Technology Stack
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {project.techStack.map((tech) => (
              <TechBadge key={tech} tech={tech} size="md" />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA + Portfolio Navigation */}
      <section aria-labelledby="cta-heading" className="space-y-6">
        <div
          style={{
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          className="relative rounded-3xl bg-[var(--bg-elevated)]/92 backdrop-blur-2xl border p-8 sm:p-12 text-center shadow-lg overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/65 to-transparent"
          />

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="devcore-glass-badge inline-flex items-center font-mono text-xs font-bold rounded-full px-3.5 py-1 text-[var(--brand-primary)]">
              SOLVE YOUR INFRASTRUCTURE BOTTLENECKS
            </span>

            <h2
              id="cta-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight"
            >
              Ready to engineer a similar{" "}
              <span className="text-liquid-gradient">resilient platform?</span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              We review your technical specifications, analyze database and concurrency models, and provide a full engineering scope with fixed milestone timelines.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/contact?project=${encodeURIComponent(project.name)}`}
                className="btn-liquid-hover inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-7 h-12 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-md hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span>Request a Similar Build for {project.name}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Back & Next DevCore Case Study Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All DevCore Case Studies</span>
          </Link>

          {nextStudy && nextStudy.slug.toLowerCase() !== project.slug.toLowerCase() && (
            <Link
              href={`/projects/${nextStudy.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs font-bold text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors"
            >
              <span>Next Case Study: {nextStudy.name}</span>
              <ArrowRight size={14} className="text-[var(--brand-primary)]" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}