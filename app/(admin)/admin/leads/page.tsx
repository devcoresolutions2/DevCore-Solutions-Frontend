"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Inbox,
  LayoutDashboard,
  Share2,
  Settings,
  Home,
  LogOut,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LeadsManager } from "@/components/admin/leads/LeadsManager";
import { UserAvatar } from "@/components/shared/UserAvatar";

export default function AdminLeadsPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?redirect=/admin/leads");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--bg-canvas)]">
        <Loader2 size={32} className="animate-spin text-[var(--brand-primary)]" />
        <span className="font-mono text-xs text-[var(--text-muted)]">Verifying admin custody...</span>
      </div>
    );
  }

  if (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-[var(--bg-canvas)] text-center">
        <ShieldAlert size={36} className="text-rose-500" />
        <h1 className="font-display font-bold text-xl text-[var(--text-primary)]">
          Access Restricted
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          Lead management requires SUPER_ADMIN or EDITOR role privileges.
        </p>
        <Link
          href="/"
          className="h-10 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold inline-flex items-center"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Shared Admin Sidebar */}
      <aside className="w-full lg:w-[250px] shrink-0 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] flex items-center justify-center">
              <Terminal size={16} />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-none">DevCore</div>
              <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase mt-0.5">
                Control Hub
              </div>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] whitespace-nowrap"
            >
              <LayoutDashboard size={15} />
              <span>Control Center</span>
            </Link>
            <Link
              href="/admin/leads"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] whitespace-nowrap"
            >
              <Inbox size={15} />
              <span>Leads Pipeline</span>
            </Link>
            <Link
              href="/admin/social"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] whitespace-nowrap"
            >
              <Share2 size={15} />
              <span>Social Channels</span>
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] whitespace-nowrap"
            >
              <Settings size={15} />
              <span>Account Settings</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] whitespace-nowrap"
            >
              <Home size={15} />
              <span>Public Site</span>
            </Link>
          </nav>
        </div>

        {/* Authenticated Admin Footer */}
        <div className="hidden lg:flex flex-col gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 px-2">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              size={64}
              className="w-8 h-8"
              textClassName="text-xs"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user.name}</div>
              <div className="font-mono text-[10px] text-[var(--brand-primary)]">{user.role}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/auth/signin");
            }}
            className="h-9 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:text-rose-600 text-xs font-medium inline-flex items-center gap-2"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Leads Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
        <LeadsManager />
      </main>
    </div>
  );
}
