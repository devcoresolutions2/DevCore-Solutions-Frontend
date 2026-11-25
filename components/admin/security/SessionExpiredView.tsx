"use client";

import React from "react";
import Link from "next/link";
import { LockKeyhole, LogIn, Home } from "lucide-react";

export default function SessionExpiredView({ nextPath }: { nextPath?: string }) {
  const safeNext =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/admin/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)] p-6">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
            HTTP 401 · SESSION ENDED
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Your session has expired
            </h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              For your security, your administrative session has ended or been revoked. Sign in again to continue to your workspace.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href={`/auth/signin?next=${encodeURIComponent(safeNext)}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90"
          >
            <LogIn className="w-4 h-4" />
            Sign In Again
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Home className="w-4 h-4" />
            Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
