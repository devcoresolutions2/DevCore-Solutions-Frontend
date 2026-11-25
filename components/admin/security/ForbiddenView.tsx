"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ForbiddenView({ requestedPath }: { requestedPath?: string }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold">
            HTTP 403 · ACCESS DENIED
          </span>
          <span className="text-[var(--text-tertiary)]">RBAC BOUNDARY</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              You don&apos;t have permission to access this resource
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Your account is authenticated, but your current role does not grant access to this administrative section. Contact a Super Admin if you need elevated permissions.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-[var(--text-tertiary)] font-mono text-[10px] uppercase">
              Authenticated Account
            </div>
            <div className="font-medium text-[var(--text-primary)] mt-0.5">
              {user ? `${user.name} (${user.email})` : "Not authenticated"}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-tertiary)] font-mono text-[10px] uppercase">
              Current Role
            </div>
            <div className="font-mono font-semibold text-[var(--brand-primary)] mt-0.5">
              {user?.role || "GUEST"}
            </div>
          </div>
          {requestedPath && (
            <div className="sm:col-span-2">
              <div className="text-[var(--text-tertiary)] font-mono text-[10px] uppercase">
                Requested Resource
              </div>
              <div className="font-mono text-[var(--text-secondary)] mt-0.5 truncate">
                {requestedPath}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            >
              Admin Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
