"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  Check,
  Code2,
  CloudCog,
  Bot,
  Layout,
  Terminal,
  Layers,
  Boxes,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { type ServiceItem } from "@/lib/api";
import { cn } from "@/lib/utils";

type DisciplineFilter = "ALL" | "WEB_SAAS" | "AI_AUTO" | "CLOUD_OPS" | "DESIGN_UI";

const DISCIPLINE_TABS: { id: DisciplineFilter; label: string }[] = [
  { id: "ALL", label: "All Capabilities" },
  { id: "WEB_SAAS", label: "Full-Stack & SaaS" },
  { id: "AI_AUTO", label: "AI & Automation" },
  { id: "CLOUD_OPS", label: "Cloud & DevOps" },
  { id: "DESIGN_UI", label: "Design & UI" },
];

function classifyService(service: ServiceItem): Exclude<DisciplineFilter, "ALL"> {
  const q = `${service.icon || ""} ${service.serviceCode || ""} ${service.title || ""}`.toLowerCase();
  if (q.includes("bot") || q.includes("ai") || q.includes("agent") || q.includes("aut") || q.includes("ml")) {
    return "AI_AUTO";
  }
  if (q.includes("cloud") || q.includes("cld") || q.includes("box") || q.includes("infra") || q.includes("ops") || q.includes("terminal")) {
    return "CLOUD_OPS";
  }
  if (q.includes("layout") || q.includes("design") || q.includes("ui") || q.includes("dsn")) {
    return "DESIGN_UI";
  }
  return "WEB_SAAS";
}

function ServiceDisciplineIcon({
  icon,
  code,
  title,
}: {
  icon?: string;
  code?: string;
  title?: string;
}) {
  const iconProps = {
    size: 23,
    className: "stroke-[2.1] shrink-0",
    "aria-hidden": true as const,
  };

  if (icon === "Layers") return <Layers {...iconProps} />;
  if (icon === "Boxes") return <Boxes {...iconProps} />;
  if (icon === "Bot") return <Bot {...iconProps} />;
  if (icon === "Layout") return <Layout {...iconProps} />;
  if (icon === "Terminal") return <Terminal {...iconProps} />;
  if (icon === "CloudCog") return <CloudCog {...iconProps} />;
  if (icon === "Code2") return <Code2 {...iconProps} />;

  const q = `${icon || ""} ${code || ""} ${title || ""}`.toLowerCase();
  if (q.includes("layer") || q.includes("web") || q.includes("saas")) return <Layers {...iconProps} />;
  if (q.includes("cloud") || q.includes("cld") || q.includes("box") || q.includes("infra")) return <Boxes {...iconProps} />;
  if (q.includes("bot") || q.includes("ai") || q.includes("agent") || q.includes("aut")) return <Bot {...iconProps} />;
  if (q.includes("layout") || q.includes("design") || q.includes("ui") || q.includes("dsn")) return <Layout {...iconProps} />;
  if (q.includes("terminal") || q.includes("dev") || q.includes("ops") || q.includes("api")) return <Terminal {...iconProps} />;
  return <Code2 {...iconProps} />;
}

interface ServicesGridProps {
  services: ServiceItem[];
}

function ServiceCardItem({
  service,
  index,
  isWideFinale,
}: {
  service: ServiceItem;
  index: number;
  isWideFinale: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(220);
  const spotY = useMotionValue(160);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3.5, -3.5]), {
    stiffness: 240,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4.5, 4.5]), {
    stiffness: 240,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(380px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 14%, transparent), transparent 74%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const inquiryHref = `/contact?service=${encodeURIComponent(
    service.title
  )}&code=${encodeURIComponent(service.serviceCode)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1100 }}
      className={cn("h-full", isWideFinale && "lg:col-span-2")}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="group relative h-full rounded-2xl devcore-glass-card border border-[var(--border-subtle)]/90 hover:border-[var(--brand-primary)]/55 p-7 sm:p-8 shadow-sm hover:shadow-xl transition-colors duration-300 overflow-hidden flex flex-col justify-between"
      >
        {/* Cursor-Tracked Optical Glass Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Top Specular Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/65 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
        />

        <div className="relative z-10">
          {/* Card Top Row: Discipline Icon + Index Tag */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/25 text-[var(--brand-primary)] flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:scale-105">
              <ServiceDisciplineIcon
                icon={service.icon}
                code={service.serviceCode}
                title={service.title}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)]/85 border border-[var(--border-subtle)] font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <Sparkles size={11} className="text-[var(--brand-primary)]" />
              <span>DISC // 0{index + 1}</span>
            </div>
          </div>

          <h3 className="font-display font-bold text-xl sm:text-[22px] text-[var(--text-primary)] tracking-tight leading-snug">
            {service.title}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
            {service.description}
          </p>

          {/* Feature Breakdown: Structured Sub-Cards on Wide Finale, Clean Checklist on Standard Cards */}
          {isWideFinale ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              {service.features.map((f) => {
                const [title, ...rest] = f.split(":");
                return (
                  <div
                    key={f}
                    className="p-4 rounded-xl bg-[var(--bg-elevated)]/80 border border-[var(--border-subtle)]/90 hover:border-[var(--brand-primary)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shrink-0" />
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        {title}
                      </span>
                    </div>
                    {rest.length > 0 && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                        {rest.join(":").trim()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <ul className="mt-6 space-y-2.5 text-xs sm:text-[13px] text-[var(--text-primary)] font-medium">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[var(--success)]/12 text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="stroke-[2.6]" aria-hidden="true" />
                  </span>
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Telemetry & Direct Scope CTA */}
        <div className="relative z-10 mt-8 pt-4 border-t border-[var(--border-subtle)]/80 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-[var(--text-muted)] font-semibold">
            ID: <span className="text-[var(--text-primary)]">{service.serviceCode}</span>
          </span>

          <Link
            href={inquiryHref}
            className="group/link inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-primary)]/10 hover:bg-[var(--brand-primary)] text-[var(--brand-primary)] hover:text-[var(--brand-contrast)] font-mono text-[11px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <span>Scope Discipline</span>
            <ArrowUpRight
              size={13}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const [activeFilter, setActiveFilter] = useState<DisciplineFilter>("ALL");

  if (!services || services.length === 0) return null;

  const filteredServices =
    activeFilter === "ALL"
      ? services
      : services.filter((s) => classifyService(s) === activeFilter);

  const visibleServices = filteredServices.length > 0 ? filteredServices : services;

  // Preserve the wide asymmetric 2-column finale whenever the full grid leaves 1 remainder slot on a 3-col desktop grid
  const hasWideFinale =
    visibleServices.length >= 4 && visibleServices.length % 3 === 2;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 px-4 sm:px-6"
    >
      {/* Subtle Ambient Background Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        <div
          className="h-[540px] w-[540px] sm:w-[880px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 12%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Centered Editorial Header + Interactive Discipline Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 flex flex-col items-center"
        >
          <ReleasePill>
            <Layers size={13} aria-hidden="true" />
            &nbsp;ENGINEERING CAPABILITIES
          </ReleasePill>

          <h2
            id="services-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] mt-4 tracking-tight leading-[1.1]"
          >
            Specialized Disciplines for{" "}
            <span className="text-liquid-gradient">Scaled Platforms.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-[17px] text-[var(--text-secondary)] mt-3.5 leading-relaxed">
            We take complex software challenges and engineer robust, maintainable systems with rigorous technical craftsmanship.
          </p>

          {/* Interactive Discipline Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter engineering capabilities"
            className="mt-7 inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)]/80 backdrop-blur-md border border-[var(--border-subtle)]"
          >
            {DISCIPLINE_TABS.map((tab) => {
              const active = tab.id === activeFilter;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl font-mono text-[11px] font-semibold transition-all cursor-pointer",
                    active
                      ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Responsive Asymmetric Glass Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service, idx) => {
              const isWideFinale =
                hasWideFinale && idx === visibleServices.length - 1;

              return (
                <ServiceCardItem
                  key={service.id}
                  service={service}
                  index={idx}
                  isWideFinale={isWideFinale}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}