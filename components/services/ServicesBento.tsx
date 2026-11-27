import Link from "next/link";
import {
  Layers,
  Boxes,
  Bot,
  Layout,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Code2,
} from "lucide-react";
import { ServiceItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TechBadge } from "@/components/shared/TechBadge";

interface ServicesBentoProps {
  services: ServiceItem[];
}

function getServiceIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "layers":
      return <Layers size={21} />;
    case "boxes":
    case "cloudcog":
      return <Boxes size={21} />;
    case "bot":
      return <Bot size={21} />;
    case "layout":
      return <Layout size={21} />;
    case "terminal":
      return <Terminal size={21} />;
    default:
      return <Code2 size={21} />;
  }
}

export function ServicesBento({ services }: ServicesBentoProps) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-clip">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-1/4 w-80 h-64 max-w-[85vw] bg-[var(--brand-primary)]/8 blur-[120px] -z-10"
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">
              Service Catalogue v4.2
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight leading-[1.15]">
            {services.length > 0 ? `${services.length} ` : ""}Core Engineering{" "}
            <span className="text-liquid-gradient">Pillars</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
          Each discipline is staffed exclusively by Staff and Principal level
          engineers. No synthetic junior billings, zero outsourced dependencies.
        </p>
      </div>

      {/* Responsive Bento Grid: 1 col (mobile) -> 2 col (tablet) -> 12 col Bento (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        {services.map((service, index) => {
          const spanClass =
            service.gridSpan === "large"
              ? "md:col-span-2 lg:col-span-7"
              : service.gridSpan === "medium"
                ? "md:col-span-1 lg:col-span-5"
                : "md:col-span-1 lg:col-span-4";

          const deliverables = service.deliverables || service.features || [];
          const techStack = service.techStack || [];
          const disciplineNumber =
            service.disciplineNumber || String(index + 1).padStart(2, "0");
          const category = service.category || "Engineering Discipline";
          const ctaLabel = service.ctaLabel || "Scope Engagement";

          return (
            <article
              key={service.id || service.title}
              className={cn(
                spanClass,
                "group relative overflow-hidden flex flex-col justify-between p-5 sm:p-7 lg:p-8 rounded-2xl devcore-glass-card shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/45 hover:shadow-md"
              )}
            >
              {/* Top Specular Edge Highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/45 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
              />

              {/* Subtle Hover Corner Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-44 h-44 rounded-full bg-[var(--brand-primary)]/8 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] dark:bg-sky-400/15 dark:text-sky-300 dark:border dark:border-sky-400/30 flex items-center justify-center shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold truncate">
                        Discipline {disciplineNumber} {"//"} {category}
                      </span>
                      <h3 className="font-display text-base sm:text-lg lg:text-xl text-[var(--text-primary)] font-bold mt-0.5 tracking-tight leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {service.slaBadge && (
                    <span className="font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--border-subtle)] shrink-0 font-semibold shadow-2xs">
                      {service.slaBadge}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverables Checklist */}
                {deliverables.length > 0 && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] shadow-inner">
                    <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                      <span className="font-mono text-[10px] sm:text-[11px] text-[var(--text-primary)] uppercase tracking-wider font-bold">
                        Engineering Deliverables
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        {String(deliverables.length).padStart(2, "0")} MODULES
                      </span>
                    </div>

                    <div
                      className={cn(
                        "gap-2 sm:gap-2.5 text-xs text-[var(--text-secondary)]",
                        service.gridSpan === "large"
                          ? "grid grid-cols-1 sm:grid-cols-2"
                          : "flex flex-col"
                      )}
                    >
                      {deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            size={15}
                            className="text-[var(--brand-primary)] mt-0.5 shrink-0"
                          />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stack Tags */}
                {techStack.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {techStack.map((tech) => (
                      <TechBadge key={tech} tech={tech} size="xs" />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bottom Row */}
              <div
                className={cn(
                  "relative z-10 pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                  !service.leadTime && "sm:justify-end"
                )}
              >
                {service.leadTime && (
                  <span className="font-mono text-[11px] sm:text-xs text-[var(--text-muted)]">
                    {service.leadTime}
                  </span>
                )}
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className={cn(
                    "h-10 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover whitespace-nowrap w-full sm:w-auto",
                    service.gridSpan === "small" &&
                    !service.leadTime &&
                    "lg:w-full"
                  )}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}