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
  ShieldCheck,
} from "lucide-react";
import { ServiceItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ServicesBentoProps {
  services: ServiceItem[];
}

function getServiceIcon(iconName: string) {
  switch (iconName.toLowerCase()) {
    case "layers":
      return <Layers size={22} />;
    case "boxes":
    case "cloudcog":
      return <Boxes size={22} />;
    case "bot":
      return <Bot size={22} />;
    case "layout":
      return <Layout size={22} />;
    case "terminal":
      return <Terminal size={22} />;
    default:
      return <Code2 size={22} />;
  }
}

export function ServicesBento({ services }: ServicesBentoProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">
              Service Catalogue v4.2
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-extrabold tracking-tight">
            5 Core Engineering Pillars
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
          Each discipline is staffed exclusively by Staff and Principal level engineers. No synthetic junior billings, zero outsourced dependencies.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {services.map((service, index) => {
          const spanClass =
            service.gridSpan === "large"
              ? "lg:col-span-7"
              : service.gridSpan === "medium"
              ? "lg:col-span-5"
              : "lg:col-span-4";

          const deliverables = service.deliverables || service.features || [];
          const techStack = service.techStack || [];
          const disciplineNumber =
            service.disciplineNumber || String(index + 1).padStart(2, "0");
          const category = service.category || "Engineering Discipline";
          const ctaLabel = service.ctaLabel || "Scope Engagement";

          return (
            <div
              key={service.id || service.title}
              className={cn(
                spanClass,
                "flex flex-col justify-between p-6 sm:p-8 rounded-2xl devcore-glass-card shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 relative overflow-hidden group transition-all duration-300 hover:border-[var(--border-strong)]"
              )}
            >
              <div className="flex flex-col gap-5">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] flex items-center justify-center shadow-sm shrink-0">
                      {getServiceIcon(service.icon)}
                    </div>
                    <div>
                      <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
                        Discipline {disciplineNumber} // {category}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl text-[var(--text-primary)] font-bold mt-0.5 tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {service.slaBadge && (
                    <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--border-subtle)] shrink-0 font-semibold">
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
                  <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-inner">
                    <span className="font-mono text-[11px] text-[var(--text-primary)] uppercase tracking-wider block mb-3 font-bold">
                      Engineering Deliverables
                    </span>
                    <div
                      className={cn(
                        "gap-2.5 text-xs text-[var(--text-secondary)]",
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
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bottom Row */}
              <div
                className={cn(
                  "pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4",
                  !service.leadTime && "justify-end"
                )}
              >
                {service.leadTime && (
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {service.leadTime}
                  </span>
                )}
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className={cn(
                    "h-10 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-medium text-xs inline-flex items-center gap-2 hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover whitespace-nowrap",
                    service.gridSpan === "small" && !service.leadTime && "w-full justify-center"
                  )}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
