"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  Image as ImageIcon,
  ChevronRight,
  Plus,
  ChevronDown,
  Sun,
  Moon,
  BookOpen,
  Briefcase,
  Layers,
  Compass,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { BrandLogo } from "@/components/shared/BrandLogo";

interface AdminShellProps {
  children: React.ReactNode;
  requiredRoles?: Array<"SUPER_ADMIN" | "EDITOR">;
}

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Executive Overview", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content & CMS",
    items: [
      { href: "/admin/dashboard?tab=blog", label: "Blog & Technical CMS", icon: BookOpen },
      { href: "/admin/dashboard?tab=jobs", label: "Job Postings", icon: Briefcase },
      { href: "/admin/dashboard?tab=applications", label: "Applications Inbox", icon: Users },
      { href: "/admin/dashboard?tab=services", label: "Services & Capabilities", icon: Layers },
      { href: "/admin/dashboard?tab=about", label: "About Page CMS", icon: Compass },
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
    ],
  },
];

function getBreadcrumbLabel(pathname: string | null): { section: string; page: string } {
  if (!pathname) return { section: "Overview", page: "Executive Overview" };
  if (pathname.startsWith("/admin/social/broadcast"))
    return { section: "Growth & Social", page: "Create Social Broadcast" };
  if (pathname.startsWith("/admin/social/manage"))
    return { section: "Growth & Social", page: "Social Management" };
  if (pathname.startsWith("/admin/social"))
    return { section: "Growth & Social", page: "Social Connections" };
  if (pathname.startsWith("/admin/leads"))
    return { section: "Growth & Social", page: "Leads Pipeline" };
  if (pathname.startsWith("/admin/users"))
    return { section: "Administration", page: "Users & IAM" };
  if (pathname.startsWith("/admin/audit-log"))
    return { section: "Administration", page: "Audit Log" };
  if (pathname.startsWith("/admin/settings"))
    return { section: "Administration", page: "Platform Settings" };
  if (pathname.startsWith("/admin/media"))
    return { section: "Content & CMS", page: "Media Library" };
  return { section: "Overview", page: "Executive Control Hub" };
}

export default function AdminShell({
  children,
  requiredRoles = ["SUPER_ADMIN", "EDITOR"],
}: AdminShellProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/admin/session-expired?next=${encodeURIComponent(pathname || "/admin/dashboard")}`,
      );
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

  const breadcrumb = getBreadcrumbLabel(pathname);

  return (
    <div className="min-h-screen flex bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[var(--bg-surface)]/95 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Brand Header */}
          <div className="h-16 px-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="sm" href="/admin/dashboard" />
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="px-3 py-4 space-y-5 flex-1">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                  {group.label}
                </div>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const baseHref = item.href.split("?")[0];
                    const active =
                      item.href === "/admin/dashboard"
                        ? pathname === "/admin/dashboard"
                        : pathname === baseHref && !item.href.includes("?tab=");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                          active
                            ? "font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                            : "font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon size={15} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Bottom Account & Public Link */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-2 shrink-0 bg-[var(--bg-surface)]">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Home size={14} />
              Public Website
            </span>
            <span className="font-mono text-[10px] text-[var(--text-tertiary)]">↗</span>
          </Link>
          <div className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                size={64}
                className="w-7 h-7"
                textClassName="text-[10px]"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{user.name}</div>
                <div className="font-mono text-[10px] text-[var(--brand-primary)] truncate">
                  {user.role}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Main Column (Top Navbar + Content + Footer) */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-h-screen min-w-0">
        {/* Top Fixed/Sticky Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--bg-surface)]/85 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <nav className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] truncate">
              <span className="font-medium text-[var(--text-primary)]">Admin</span>
              <ChevronRight size={14} className="text-[var(--text-tertiary)] shrink-0" />
              <span className="hidden sm:inline truncate">{breadcrumb.section}</span>
              <ChevronRight size={14} className="hidden sm:inline text-[var(--text-tertiary)] shrink-0" />
              <span className="font-semibold text-[var(--brand-primary)] truncate">
                {breadcrumb.page}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick + New Action Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNewMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90 transition-all"
              >
                <Plus size={14} />
                <span>New</span>
                <ChevronDown size={13} />
              </button>
              {newMenuOpen && (
                <div
                  onMouseLeave={() => setNewMenuOpen(false)}
                  className="absolute right-0 mt-1.5 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl p-1.5 z-40 text-xs space-y-0.5"
                >
                  <Link
                    href="/admin/social/broadcast"
                    onClick={() => setNewMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  >
                    <Send size={13} /> New Social Broadcast
                  </Link>
                  <Link
                    href="/admin/dashboard?tab=blog"
                    onClick={() => setNewMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  >
                    <BookOpen size={13} /> New Blog Article
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setNewMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  >
                    <Users size={13} /> Manage / Invite Users
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                title="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            <Link
              href="/account/settings"
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
            >
              <UserAvatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                size={64}
                className="w-6 h-6"
                textClassName="text-[10px]"
              />
              <span className="text-xs font-medium text-[var(--text-primary)] max-w-[120px] truncate">
                {user.name}
              </span>
            </Link>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-5 sm:p-8 max-w-[1440px] w-full mx-auto min-w-0">
          {children}
        </main>

        {/* Enterprise Admin Footer */}
        <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 px-6 py-4 text-xs text-[var(--text-tertiary)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono">
            DevCore Solutions · Control Hub
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/audit-log" className="hover:text-[var(--text-primary)]">
              Audit Log
            </Link>
            <Link href="/admin/settings" className="hover:text-[var(--text-primary)]">
              Platform Settings
            </Link>
            <Link href="/account/settings" className="hover:text-[var(--text-primary)]">
              Account Settings
            </Link>
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Public Site
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
