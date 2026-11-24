"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import SocialChannelsManager from "@/components/admin/social/SocialChannelsManager";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  LayoutDashboard,
  Inbox,
  Share2,
  Settings,
  LogOut,
  Home,
  Terminal,
} from "lucide-react";

export default function AdminSocialPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/admin/social");
    } else if (!loading && user && user.role !== "SUPER_ADMIN" && user.role !== "EDITOR") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
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
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] whitespace-nowrap"
            >
              <Inbox size={15} />
              <span>Leads Pipeline</span>
            </Link>
            <Link
              href="/admin/social"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] whitespace-nowrap"
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
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 sm:p-8 max-w-[1440px] w-full mx-auto">
        <SocialChannelsManager />
      </main>
    </div>
  );
}
