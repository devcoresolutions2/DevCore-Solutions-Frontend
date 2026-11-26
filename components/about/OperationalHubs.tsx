"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  MapPin,
  Clock,
  Radio,
  Globe2,
  Compass,
  Wifi,
  CheckCircle2,
  Zap,
} from "lucide-react";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface OperationalHubsProps {
  content: AboutGeneralContent;
}

const DISPATCH_REGIONS = [
  {
    region: "South Asia & APAC",
    window: "09:00 – 21:00 BST",
    latency: "Real-Time Sync",
  },
  {
    region: "UAE & Middle East (GST)",
    window: "07:00 – 19:00 GST",
    latency: "2h Offset • Live",
  },
  {
    region: "Europe & UK (GMT / CET)",
    window: "08:00 – 16:00 GMT",
    latency: "Daily Overlap",
  },
  {
    region: "North America (EST / PST)",
    window: "08:00 – 13:00 EST",
    latency: "Async + Sprint Sync",
  },
] as const;

export function OperationalHubs({ content }: OperationalHubsProps) {
  const [localTime, setLocalTime] = useState("");
  const [localDate, setLocalDate] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-350);
  const mouseY = useMotionValue(-350);
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(480px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 75%)`;

  useEffect(() => {
    if (!content.locationEnabled) return;

    const tz = content.locationTimezone || "Asia/Dhaka";

    const updateClock = () => {
      try {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

        const dateStr = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          weekday: "short",
          month: "short",
          day: "2-digit",
        }).format(now);

        setLocalTime(timeStr);
        setLocalDate(dateStr);
      } catch {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [content.locationEnabled, content.locationTimezone]);

  if (!content.locationEnabled || !content.locationName) {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-350);
    mouseY.set(-350);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 overflow-x-clip">
      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-14 left-1/3 w-80 h-64 max-w-[85vw] rounded-full bg-[var(--brand-primary)]/10 blur-[120px] -z-10"
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-4 bg-[var(--brand-primary)]/70" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Operational Topology
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.15]">
            Engineering{" "}
            <span className="text-liquid-gradient">Headquarters</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mt-1">
            Primary engineering hub and centralized technical operations
            dispatch—delivering cloud-native systems to partners worldwide.
          </p>
        </div>

        <span
          style={{
            width: "fit-content",
            padding: "4px 10px",
            fontSize: "9.5px",
            lineHeight: 1.15,
          }}
          className="self-start md:self-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] font-mono font-semibold uppercase tracking-wide text-[var(--text-secondary)] shadow-2xs shrink-0 whitespace-nowrap"
        >
          <Wifi size={11} className="text-emerald-500 shrink-0" />
          <span>UTC+6 Base &bull; Global Client Sync</span>
        </span>
      </div>

      {/* Symmetrical 6 / 6 Operational Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* LEFT 6 COLUMNS: Primary Operations Hub Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group relative lg:col-span-6 overflow-hidden rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45 bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between gap-4"
        >
          {/* Top Specular Highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/70 to-transparent z-20"
          />

          {/* Interactive Cursor Spotlight */}
          <motion.div
            aria-hidden="true"
            style={{ background: spotlightBg }}
            className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div className="relative z-10 flex flex-col gap-3.5">
            {/* Compact Top Status Row */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                <MapPin size={12} className="shrink-0" />
                <span>Primary Operations Hub</span>
              </span>

              <span
                style={{
                  width: "fit-content",
                  padding: "2px 8px",
                  fontSize: "9px",
                  lineHeight: 1.15,
                }}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono font-bold uppercase tracking-wider shrink-0 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>ONLINE</span>
              </span>
            </div>

            {/* Hub Title, Clean City/Country & Radar Node */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)] tracking-tight leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                  {content.locationName}
                </h3>

                <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] leading-relaxed mt-1">
                  Chittagong, Bangladesh
                </p>

                <div className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-muted)]">
                  <Compass size={11} className="text-[var(--brand-primary)] shrink-0" />
                  <span>22.3569° N, 91.7832° E &bull; Coastal Tech Corridor</span>
                </div>
              </div>

              {/* Compact Radar Node Graphic */}
              <div className="relative w-12 h-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 overflow-hidden">
                <span className="absolute w-9 h-9 rounded-full border border-[var(--brand-primary)]/20 animate-ping" />
                <span className="absolute w-6 h-6 rounded-full border border-[var(--brand-primary)]/35" />
                <span className="relative w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
              </div>
            </div>
          </div>

          {/* Upgraded Segmented Live Clock & Status Console */}
          <div className="relative z-10 flex flex-col gap-2.5 pt-3.5 border-t border-[var(--border-subtle)]">
            {/* Sleek Digital Clock Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/30 transition-colors flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-2xs shrink-0">
                  <Clock size={15} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--text-muted)] font-semibold whitespace-nowrap">
                    Local Hub Time
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-extrabold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight tabular-nums leading-none">
                      {localTime || "00:00:00"}
                    </span>
                    <span
                      style={{
                        padding: "2px 6px",
                        fontSize: "9px",
                        lineHeight: 1.15,
                      }}
                      className="font-mono font-bold rounded bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 whitespace-nowrap"
                    >
                      BST &bull; UTC+6
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="font-mono text-[10.5px] font-semibold text-[var(--text-secondary)]">
                  {localDate || "Chittagong"}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Radio size={11} className="shrink-0" />
                  <span>{content.locationStatus || "Active Operations"}</span>
                </span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2 min-w-0">
                <CheckCircle2
                  size={12}
                  className="text-[var(--brand-primary)] shrink-0"
                />
                <span className="truncate">
                  Centralized CI/CD, GitHub &amp; cloud deployment control
                </span>
              </span>
              <span
                style={{
                  padding: "1px 6px",
                  fontSize: "9px",
                  lineHeight: 1.2,
                }}
                className="font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0"
              >
                99.9% SLA
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT 6 COLUMNS: Global Client Collaboration & Timezone Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-6 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-md p-5 sm:p-6 flex flex-col justify-between gap-4"
        >
          {/* Top Specular Highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/55 to-transparent"
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand-primary)] font-bold inline-flex items-center gap-1.5">
                <Globe2 size={12} className="shrink-0" />
                <span>Global Sync Matrix</span>
              </span>
              <span
                style={{
                  width: "fit-content",
                  padding: "2px 8px",
                  fontSize: "9px",
                  lineHeight: 1.15,
                }}
                className="font-mono rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-semibold whitespace-nowrap"
              >
                Remote-Ready
              </span>
            </div>

            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)] tracking-tight leading-snug">
              Cross-Timezone Delivery
            </h3>

            <div className="flex flex-col gap-2">
              {DISPATCH_REGIONS.map((item) => (
                <div
                  key={item.region}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {item.region}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {item.window}
                    </span>
                  </div>

                  <span
                    style={{
                      padding: "2px 8px",
                      fontSize: "9.5px",
                      lineHeight: 1.15,
                    }}
                    className="inline-flex items-center gap-1 font-mono font-bold rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 shrink-0 whitespace-nowrap"
                  >
                    <Zap size={9} />
                    <span>{item.latency}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
            <CheckCircle2
              size={12}
              className="text-emerald-500 shrink-0"
            />
            <span>Direct founder communication via Slack, Meet &amp; GitHub</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}