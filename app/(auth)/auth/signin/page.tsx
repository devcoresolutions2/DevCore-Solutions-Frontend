"use client";

import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";

export default function SignInPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <GlassCard className="p-8 border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Lock size={22} />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-[var(--text-primary)]">
            DevCore Portal Sign In
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Access client delivery dashboards and telemetry monitors
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Corporate Email
            </label>
            <input
              type="email"
              placeholder="engineer@company.com"
              className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Password
              </label>
              <a href="#" className="text-[11px] text-[var(--brand-primary)] hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all"
            />
          </div>

          <button
            type="submit"
            className="btn-liquid-hover w-full h-11 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[var(--brand-hover)]"
          >
            <span>Sign In to Portal</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
          Protected by Hardware-Enforced Zero-Trust • FIPS 140-3
        </div>
      </GlassCard>
    </div>
  );
}
