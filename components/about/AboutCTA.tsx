"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { AboutGeneralContent } from "@/lib/mock/data";

interface AboutCTAProps {
  content: AboutGeneralContent;
}

export function AboutCTA({ content }: AboutCTAProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--brand-primary)] text-white p-8 sm:p-12 md:p-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Subtle decorative glow */}
        <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-4 z-10 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 w-fit backdrop-blur-md text-xs font-mono tracking-wider">
            <Sparkles size={13} className="text-emerald-300" />
            <span>DIRECT ARCHITECT ENGAGEMENT</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
            {content.ctaTitle}
          </h2>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            {content.ctaSubtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full sm:w-auto">
          <Link
            href={content.ctaPrimaryUrl || "/contact"}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white text-[var(--brand-primary)] font-semibold text-xs sm:text-sm inline-flex items-center justify-center hover:bg-neutral-100 transition-all shadow-md group"
          >
            <span>{content.ctaPrimaryText || "Start System Scoping"}</span>
            <ArrowRight
              size={15}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            href={content.ctaSecondaryUrl || "/careers"}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all backdrop-blur-md border border-white/20"
          >
            <span>{content.ctaSecondaryText || "View Open Guild Seats"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
