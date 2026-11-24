"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Share2,
  Send,
  Activity,
  Users,
  ShieldCheck,
  Settings,
  Home,
  LogOut,
  Terminal,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserAvatar } from "@/components/shared/UserAvatar";

interface AdminShellProps {
  children: React.ReactNode;
  requiredRoles?: Array<"SUPER_ADMIN" | "EDITOR">;
}

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Control Center", icon: LayoutDashboard },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    ],
  },
  {
    label: "Growth & Social",
    items: [
      { href: "/admin/leads", label: "Leads Pipeline", icon: Inbox },
      { href: "/admin/social/manage", label: "Social Management", icon: Activity },
      { href: "/admin/social/broadcast", label: "Create Broadcast", icon: Send },
      { href: "/admin/social", label: "Social Connections", icon: Share2 },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/admin/users", label: "Users & IAM", icon: Users },
      { href: "/admin/audit-log", label: "Audit Log", icon: ShieldCheck },
      { href: "/admin/settings", label: "Platform Settings", icon: Settings },
      { href: "/", label: "Public Site", icon: Home },
    ],
  },
];

export default function AdminShell({
  children,
  requiredRoles = ["SUPER_ADMIN", "EDITOR"],
}: AdminShellProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/admin/session-expired?next=${encodeURIComponent(pathname || "/admin/dashboard")}`);
    } else if (!loading && user && !requiredRoles.includes(user.role as any)) {
      router.replace("/admin/403");
    }
  }, [user, loading, router, pathname, requiredRoles]);

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
      <aside className="w-full lg:w-[256px] shrink-0 bg-[var(--bg-surface)]/85 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] p-4 flex flex-col justify-between">
        <div className="space-y-5">
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

          <div className="flex lg:flex-col gap-4 overflow-x-auto">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="flex lg:flex-col gap-1 shrink-0">
                <div className="hidden lg:block px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                        active
                          ? "font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                          : "font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
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
      <main className="flex-1 p-5 sm:p-8 max-w-[1480px] w-full mx-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
