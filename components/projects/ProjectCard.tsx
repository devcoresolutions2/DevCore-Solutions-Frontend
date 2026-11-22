import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { type ProjectItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <GlassCard
      as="article"
      className={cn(
        "overflow-hidden flex flex-col justify-between group",
        featured ? "lg:col-span-2" : ""
      )}
    >
      <div>
        {/* Cover visual container */}
        <div className="w-full aspect-[16/9] bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] relative overflow-hidden p-6 flex flex-col justify-between">
          {project.coverImage ? (
            <>
              <Image
                src={project.coverImage}
                alt={project.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)]/95 via-black/25 to-black/35 pointer-events-none" />
            </>
          ) : (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
              aria-hidden="true"
            />
          )}

          <div className="relative z-10 flex items-center justify-between">
            <ReleasePill dot dotColor="var(--success)">
              {project.category}
            </ReleasePill>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[var(--bg-elevated)]/90 text-[var(--text-muted)] border border-[var(--border-subtle)]">
              Case Study
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              {project.name}
            </h3>
          </div>
          <p className="font-medium text-sm text-[var(--brand-primary)] mt-1">
            {project.tagline}
          </p>

          <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed line-clamp-2">
            {project.challenge}
          </p>

          {/* Measurable Impact inside card body */}
          {project.impact && project.impact.length > 0 && (
            <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[var(--border-subtle)]">
              {project.impact.slice(0, 2).map((item) => (
                <div key={item.label} className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[10px] text-[var(--text-muted)] block font-mono uppercase truncate">{item.label}</span>
                  <span className="font-mono font-bold text-sm text-[var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Feature Highlights */}
          {project.features && project.features.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-xs text-[var(--text-primary)]">
              {project.features.slice(0, 2).map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[var(--success)] flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 mt-5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="p-6 sm:p-7 pt-0 border-t border-[var(--border-subtle)] mt-2 flex items-center justify-between">
        <Link
          href={`/projects/${project.slug}`}
          className="btn-liquid-hover inline-flex items-center gap-2 text-xs font-semibold h-10 px-5 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        >
          <span>Read Case Study</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
        <Link
          href={`/contact?project=${encodeURIComponent(project.name)}`}
          className="text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:underline"
        >
          Request similar build &rarr;
        </Link>
      </div>
    </GlassCard>
  );
}
