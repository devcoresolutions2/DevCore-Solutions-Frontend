"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, Radio } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface OperationalHubsProps {
  content: AboutGeneralContent;
}

export function OperationalHubs({ content }: OperationalHubsProps) {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    if (!content.locationEnabled) return;

    const updateClock = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: content.locationTimezone || "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setLocalTime(`${timeStr} BST`);
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

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col gap-2 mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-semibold">
          OPERATIONAL TOPOLOGY
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)]">
          Engineering Headquarters
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Primary engineering hub and centralized technical operations dispatch.
        </p>
      </div>

      <div className="max-w-xl">
        <GlassCard className="p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-[var(--brand-primary)]/40 transition-all duration-300">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--brand-primary)] font-bold flex items-center gap-1.5">
                <MapPin size={14} />
                <span>Primary Operations Hub</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              {content.locationName}
            </h3>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {content.locationAddress}
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)]/70 flex flex-col gap-2 bg-[var(--bg-elevated)]/60 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                <Clock size={13} />
                <span>Local Time:</span>
              </span>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {localTime || "Syncing..."}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                <Radio size={13} />
                <span>Status:</span>
              </span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {content.locationStatus || "Active Operations"}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
