import Link from "next/link";
import { Check, ChevronRight, Code2, CloudCog, Bot, Layout, Terminal, Layers } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { type ServiceItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>> = {
  Code2, CloudCog, Bot, Layout, Terminal,
};

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
          const Icon = ICON_MAP[service.icon] ?? Code2;
          const isLast = idx === services.length - 1;

          return (
            <GlassCard
              key={service.id}
              className={cn("p-8 flex flex-col justify-between", isLast && "lg:col-span-2")}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-sm mb-6">
                  <Icon size={24} aria-hidden={true} />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
                  {service.description}
                </p>

                {isLast ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {service.features.map((f) => {
                      const [title, ...rest] = f.split(":");
                      return (
                        <div key={f} className="p-4 rounded-xl bg-[var(--bg-elevated)]/70 border border-[var(--border-subtle)]">
                          <span className="font-mono text-xs font-bold text-[var(--text-primary)] block">{title}</span>
                          {rest.length > 0 && (
                            <p className="text-xs text-[var(--text-muted)] mt-1">{rest.join(":").trim()}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <ul className="mt-6 space-y-2 text-xs text-[var(--text-primary)] font-medium">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check size={13} className="text-[var(--success)] flex-shrink-0" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Service ID: {service.serviceCode}
                </span>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:underline"
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
