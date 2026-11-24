import Link from "next/link";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { TechBadge } from "@/components/shared/TechBadge";
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
        "devcore-glass-card rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden group hover:border-[var(--border-strong)] hover:shadow-lg transition-all duration-200",
        featured ? "md:col-span-2 lg:col-span-3 grid grid-cols-1 lg:grid-cols-12" : "flex flex-col justify-between"
      )}
      aria-label={`${item.name} — ${item.tagline}`}
    >
      {/* Cover */}
      <div
        className={cn(
          "w-full bg-[var(--bg-elevated)] relative overflow-hidden flex items-center justify-center",
          featured
            ? "lg:col-span-6 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]"
            : "p-3 border-b border-[var(--border-subtle)]"
        )}
      >
        {item.coverImage ? (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-sm bg-[var(--bg-canvas)]">
            <Image
              src={item.coverImage}
              alt={item.name}
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
              className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[16/10] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Right / Body Column */}
      <div className={cn("flex flex-col justify-between", featured && "lg:col-span-6")}>
        {/* Content */}
        <div className={cn("flex-1 flex flex-col", compact ? "p-4" : "p-6 sm:p-7")}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <ReleasePill dot dotColor="var(--brand-primary)">
              {item.badge}&nbsp;•&nbsp;{item.category}
            </ReleasePill>
            <span className="text-[11px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-elevated)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)]">
              {launchDate}
            </span>
          </div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h3 className={cn("font-display font-bold tracking-tight text-[var(--text-primary)]", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
              {item.name}
            </h3>
            <span className="text-xs font-medium text-[var(--brand-primary)] px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              v{item.version}
            </span>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">{item.tagline}</p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {item.description}
          </p>

          {/* Telemetry Metrics inside card body */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 my-5 pt-4 border-t border-[var(--border-subtle)]">
              {item.metrics.slice(0, 3).map((m) => (
                <div key={m.label} className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-center">
                  <span className="text-[11px] font-medium text-[var(--text-tertiary)] block truncate">{m.label}</span>
                  <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] mt-0.5 block">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {item.techStack.map((tech) => (
              <TechBadge key={tech} tech={tech} size="sm" />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={cn("flex flex-wrap items-center gap-2.5 border-t border-[var(--border-subtle)]", compact ? "px-4 py-3" : "px-6 sm:px-7 py-4")}>
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold h-10 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              Visit live
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          )}
          {item.caseStudySlug && (
            <Link
              href={`/projects/${item.caseStudySlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium h-10 px-4 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
            >
              <FileText size={13} aria-hidden="true" />
              Case study
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
