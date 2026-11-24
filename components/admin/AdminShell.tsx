"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Search,
  Mail,
  Shield,
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
      { href: "/admin/content", label: "Content Operations", icon: FileText },
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
      { href: "/admin/users", label: "User Directory", icon: Users },
      { href: "/admin/users?tab=invitations", label: "User Invitations", icon: Mail },
      { href: "/admin/users?tab=roles", label: "Roles & Access", icon: Shield },
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

function AdminShellInner({
  children,
  requiredRoles = ["SUPER_ADMIN", "EDITOR"],
}: AdminShellProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "";
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
        className={`fixed inset-y-0 left-0 z-50 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col justify-between transition-all duration-200 lg:translate-x-0 ${
          sidebarCollapsed ? "lg:w-[74px]" : "lg:w-[260px]"
        } w-[260px] ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Brand Header + Collapse Toggle */}
          <div className="h-16 px-4 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2.5 min-w-0">
                <BrandLogo size="sm" href="/admin/dashboard" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="hidden lg:inline-flex p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] mx-auto"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="px-2.5 py-4 space-y-5 flex-1">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                    {group.label}
                  </div>
                )}
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const [baseHref, queryPart] = item.href.split("?");
                    const itemTab = queryPart?.startsWith("tab=") ? queryPart.slice(4) : "";
                    const active = itemTab
                      ? pathname === baseHref && activeTab === itemTab
                      : item.href === "/admin/dashboard" || item.href === "/admin/users"
                        ? pathname === baseHref && !activeTab
                        : pathname === baseHref;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center ${
                          sidebarCollapsed ? "justify-center px-2" : "gap-2.5 px-3"
                        } py-2 rounded-lg text-xs transition-all ${
                          active
                            ? "font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                            : "font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon size={16} className="shrink-0" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Bottom Account & Public Link */}
        <div className="p-2.5 border-t border-[var(--border-subtle)] space-y-2 shrink-0 bg-[var(--bg-surface)]">
          <Link
            href="/"
            title="Public Website"
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center px-2" : "justify-between px-3"
            } py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors`}
          >
            <span className="flex items-center gap-2">
              <Home size={15} />
              {!sidebarCollapsed && "Public Website"}
            </span>
            {!sidebarCollapsed && (
              <span className="font-mono text-[10px] text-[var(--text-tertiary)]">↗</span>
            )}
          </Link>
          <div
            className={`p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between gap-2"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                size={64}
                className="w-7 h-7"
                textClassName="text-[10px]"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">{user.name}</div>
                  <div className="font-mono text-[10px] text-[var(--brand-primary)] truncate">
                    {user.role}
                  </div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => signOut()}
                title="Sign Out"
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                <LogOut size={14} />
              </button>
            )}
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
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-200 ${
          sidebarCollapsed ? "lg:pl-[74px]" : "lg:pl-[260px]"
        }`}
      >
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
            <button
              type="button"
              onClick={() => {
                setCmdQuery("");
                setCmdOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors"
              title="Command Palette (Ctrl+K)"
            >
              <Search size={13} />
              <span>Search...</span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                Ctrl+K
              </kbd>
            </button>
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

      {/* Ctrl+K Command Palette */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border-subtle)]">
              <Search size={16} className="text-[var(--text-tertiary)] shrink-0" />
              <input
                type="text"
                autoFocus
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const allItems = NAV_GROUPS.flatMap((g) =>
                      g.items.map((i) => ({ ...i, group: g.label }))
                    ).filter((i) =>
                      `${i.label} ${i.group}`.toLowerCase().includes(cmdQuery.trim().toLowerCase())
                    );
                    if (allItems[0]) {
                      setCmdOpen(false);
                      router.push(allItems[0].href);
                    }
                  }
                }}
                placeholder="Jump to admin page or section..."
                className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-tertiary)]"
              >
                ESC
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {NAV_GROUPS.flatMap((g) =>
                g.items.map((i) => ({ ...i, group: g.label }))
              )
                .filter((i) =>
                  `${i.label} ${i.group}`.toLowerCase().includes(cmdQuery.trim().toLowerCase())
                )
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => {
                        setCmdOpen(false);
                        router.push(item.href);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <span className="flex items-center gap-2.5 font-medium text-[var(--text-primary)]">
                        <Icon size={15} className="text-[var(--brand-primary)]" />
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                        {item.group}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminShell(props: AdminShellProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)]">
          <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminShellInner {...props} />
    </Suspense>
  );
}
