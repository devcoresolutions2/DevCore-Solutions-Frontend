"use client";

import Link from "next/link";
import { ChevronRight, Terminal } from "lucide-react";
import type { BlogHeroConfig } from "@/lib/api";

interface BlogHeroProps {
  config: BlogHeroConfig;
}

export function BlogHero({ config }: BlogHeroProps) {
  return (
    <section className="relative pt-12 pb-8 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] overflow-hidden">
      {/* Background architectural grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6 font-mono">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            DEVCORE
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-primary)] font-medium">ENGINEERING BLOG</span>
        </nav>

        {/* Badge & Title */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>{config.badge || "ENGINEERING DISPATCH"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-mono leading-tight mb-4">
            {config.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans max-w-2xl">
            {config.description}
          </p>
        </div>
      </div>
    </section>
  );
}
