"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, ArrowUpRight, Sparkles } from "lucide-react";

export function TechnicalSupportHub() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:block fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max max-w-lg"
    >
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className="group relative overflow-hidden flex items-center justify-between gap-5 px-4 py-2.5 rounded-2xl bg-[var(--bg-elevated)]/95 backdrop-blur-2xl border border-[var(--brand-primary)]/35 hover:border-[var(--brand-primary)]/70 shadow-xl hover:shadow-2xl transition-colors duration-300"
      >
        {/* Top Specular Edge Highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/85 to-transparent z-20"
        />

        {/* Ambient Inner Brand Glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-[var(--brand-primary)]/14 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Reflexive Glint Sweep */}
        <motion.span
          aria-hidden="true"
          animate={{ x: ["-180%", "280%"] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-20 bg-gradient-to-r from-transparent via-[var(--brand-primary)]/20 to-transparent"
        />

        {/* Left: Animated Icon Badge + Two-Line Copy */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.45 }}
            className="relative w-9 h-9 rounded-xl bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0 shadow-2xs"
          >
            <Wrench className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-[var(--bg-elevated)]" />
            </span>
          </motion.div>

          <div className="leading-tight">
            <div className="inline-flex items-center gap-1 font-mono text-[9.5px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span>DIRECT FOUNDER ACCESS</span>
            </div>
            <div className="text-[13.5px] font-bold text-[var(--text-primary)] whitespace-nowrap mt-0.5">
              Architecture &amp; Systems Advisory
            </div>
          </div>
        </div>

        {/* Right: Spring-Animated Primary CTA Pill */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 shrink-0"
        >
          <Link
            href="/contact"
            title="Connect with DevCore Founders & Engineers"
            className="btn-liquid-hover group/btn inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)] font-semibold text-xs shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <span>Book Advisory</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 shrink-0" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}