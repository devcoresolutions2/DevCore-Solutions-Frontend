"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthBrandingPanel } from "./AuthBrandingPanel";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface AuthLayoutShellProps {
  children: ReactNode;
}

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[var(--bg-canvas)]">
      {/* LEFT PANEL: Enterprise Brand & Cryptographic Engineering Core (45%) */}
      <AuthBrandingPanel />

      {/* RIGHT PANEL: Liquid Glass Interaction & Authentication (55%) */}
      <div className="relative w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-8 lg:p-12 overflow-y-auto">
        {/* Ambient Canvas Refraction Gradients */}
        <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-[#F5E9CC]/25 dark:bg-emerald-950/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-16 right-16 w-80 h-80 rounded-full bg-[#d3e5f3]/25 dark:bg-cyan-950/20 blur-[120px] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(var(--text-primary) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Navigation & System Bar */}
        <div className="relative z-20 flex items-center justify-between w-full max-w-xl mx-auto pb-6">
          <Link
            href="/"
            className="group flex items-center space-x-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to website</span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Latency Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>US-EAST • 12ms</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Centered Liquid Glass Card Container */}
        <div className="relative z-20 my-auto flex flex-col items-center justify-center w-full py-4">
          {children}

          {/* Technical Legal Subtext */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-[var(--text-tertiary)] text-center">
            <span>SECURE AUTHENTICATION</span>
            <span>•</span>
            <span>EMAIL VERIFIED</span>
            <span>•</span>
            <span>ROLE-BASED ACCESS</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[var(--text-primary)] underline">
              PRIVACY NOTICE
            </Link>
          </div>
        </div>

        {/* Bottom Panel Architecture Footnote */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)] w-full max-w-xl mx-auto pt-6 border-t border-[var(--border-subtle)] gap-2">
          <div>
            DevCore Cloud Identity Mesh ID:{" "}
            <span className="text-[var(--text-secondary)]">DC-NODE-092-VA</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Verified TLS 1.3 End-to-End</span>
          </div>
        </div>
      </div>
    </div>
  );
}
