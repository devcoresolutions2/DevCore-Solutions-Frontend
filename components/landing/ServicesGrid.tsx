import Link from "next/link";
import { Check, ChevronRight, Code2, CloudCog, Bot, Layout, Terminal, Layers, Boxes } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { type ServiceItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>> = {
  Layers, Boxes, Bot, Layout, Terminal, Code2, CloudCog,
};

function resolveServiceIcon(icon?: string, code?: string, title?: string) {
  if (icon && ICON_MAP[icon]) return ICON_MAP[icon];
  const q = `${icon || ""} ${code || ""} ${title || ""}`.toLowerCase();
  if (q.includes("layer") || q.includes("web") || q.includes("saas")) return Layers;
  if (q.includes("cloud") || q.includes("cld") || q.includes("box") || q.includes("infra")) return Boxes;
  if (q.includes("bot") || q.includes("ai") || q.includes("agent") || q.includes("aut")) return Bot;
  if (q.includes("layout") || q.includes("design") || q.includes("ui") || q.includes("dsn")) return Layout;
  if (q.includes("terminal") || q.includes("dev") || q.includes("ops") || q.includes("api")) return Terminal;
  return Code2;
}

interface ServicesGridProps {
  services: ServiceItem[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  if (!services || services.length === 0) return null;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ReleasePill>
          <Layers size={13} aria-hidden="true" />
          &nbsp;ENGINEERING CAPABILITIES
        </ReleasePill>
        <h2
          id="services-heading"
          className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] mt-4 tracking-tight"
        >
          Specialized Disciplines for Scaled Platforms
        </h2>
        <p className="text-base text-[var(--text-secondary)] mt-3">
          We take complex software challenges and engineer robust, maintainable systems with rigorous technical craftsmanship.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service, idx) => {
          const Icon = resolveServiceIcon(service.icon, service.serviceCode, service.title);
          const isLast = idx === services.length - 1;

          return (
            <GlassCard
              key={service.id}
              className={cn("p-8 flex flex-col justify-between", isLast && "lg:col-span-2")}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] dark:bg-sky-400/15 dark:border-sky-400/30 dark:text-sky-300 dark:shadow-[0_0_20px_rgba(56,189,248,0.22)] flex items-center justify-center shadow-sm mb-6 transition-all duration-300">
                  <Icon size={24} className="stroke-[2.2] shrink-0" aria-hidden={true} />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)] dark:text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] dark:text-slate-300 mt-3 leading-relaxed">
                  {service.description}
                </p>

                {isLast ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {service.features.map((f) => {
                      const [title, ...rest] = f.split(":");
                      return (
                        <div key={f} className="p-4 rounded-xl bg-[var(--bg-elevated)]/70 border border-[var(--border-subtle)] dark:bg-white/[0.04] dark:border-white/10">
                          <span className="font-mono text-xs font-bold text-[var(--text-primary)] dark:text-white block">{title}</span>
                          {rest.length > 0 && (
                            <p className="text-xs text-[var(--text-muted)] dark:text-slate-300 mt-1">{rest.join(":").trim()}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <ul className="mt-6 space-y-2 text-xs text-[var(--text-primary)] dark:text-slate-200 font-medium">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check size={13} className="text-[var(--success)] flex-shrink-0" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--text-muted)] dark:text-slate-300 font-medium">
                  Service ID: {service.serviceCode}
                </span>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] dark:text-sky-300 dark:hover:text-white flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  Inquire <ChevronRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
