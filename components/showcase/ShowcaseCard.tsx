import Link from "next/link";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { type ShowcaseItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  item: ShowcaseItem;
  featured?: boolean; // spans 2 cols
  compact?: boolean;
}

export function ShowcaseCard({ item, featured = false, compact = false }: ShowcaseCardProps) {
  const launchDate = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
    new Date(item.launchedAt)
  );

  return (
    <article
      className={cn(
        "devcore-glass-card overflow-hidden flex flex-col justify-between group",
        featured && "lg:col-span-2"
      )}
      aria-label={`${item.name} — ${item.tagline}`}
    >
      {/* Cover */}
      <div
        className={cn(
          "w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] relative overflow-hidden",
          featured ? "aspect-[16/9]" : "aspect-[16/9]"
        )}
      >
        {item.coverImage ? (
          <>
            <Image
              src={item.coverImage}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)]/90 via-black/20 to-black/30 pointer-events-none" />
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

        <div className="absolute inset-0 p-5 flex flex-col justify-start z-10 pointer-events-none">
          {/* Top row */}
          <div className="flex items-center justify-between pointer-events-auto">
            <ReleasePill dot dotColor="var(--brand-primary)">
              {item.badge}&nbsp;•&nbsp;{item.category.toUpperCase()}
            </ReleasePill>
            <span className="font-mono text-[11px] text-[var(--text-muted)] bg-[var(--bg-elevated)]/90 px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              {launchDate}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex-1 flex flex-col", compact ? "p-4" : "p-6 sm:p-7")}>
        <div className="flex items-center gap-3 mb-1">
          <h3 className={cn("font-display font-bold text-[var(--text-primary)]", featured ? "text-2xl" : "text-xl")}>
            {item.name}
          </h3>
          <span className="font-mono text-xs text-[var(--brand-primary)] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            v{item.version}
          </span>
        </div>
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">{item.tagline}</p>
        <p className="text-sm text-[var(--text-primary)]/90 leading-relaxed line-clamp-3">
          {item.description}
        </p>

        {/* Telemetry Metrics inside card body */}
        {item.metrics && item.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-[var(--border-subtle)]">
            {item.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center">
                <span className="text-[10px] text-[var(--text-muted)] block font-mono uppercase truncate">{m.label}</span>
                <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {item.techStack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={cn("flex items-center gap-2 border-t border-[var(--border-subtle)]", compact ? "px-4 py-3" : "px-7 pb-6 pt-4")}>
        {item.liveUrl && (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold h-10 px-4 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            Visit live
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
        {item.caseStudySlug && (
          <Link
            href={`/projects/${item.caseStudySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium h-10 px-4 rounded-[10px] border border-[var(--border-strong)] bg-[var(--bg-elevated)]/65 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <FileText size={13} aria-hidden="true" />
            Case study
          </Link>
        )}
      </div>
    </article>
  );
}
