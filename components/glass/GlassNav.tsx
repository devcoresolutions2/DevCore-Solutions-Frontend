"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  ArrowRight,
  Rocket,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Launches", href: "/launches" },
  { label: "Portfolio", href: "/projects" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface GlassNavProps {
  whatsappNumber?: string;
  phone?: string;
}

export function GlassNav({ whatsappNumber = "", phone = "" }: GlassNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // trap Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'd like to discuss a project with DevCore Solutions.")}`
    : "";

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--brand-primary)] focus:text-[var(--brand-contrast)] focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed top-4 inset-x-0 z-50 px-4 sm:px-6 max-w-7xl mx-auto",
          "transition-all duration-300"
        )}
        role="banner"
      >
        <nav
          className={cn(
            "devcore-glass-nav rounded-2xl h-16 px-5 flex items-center justify-between",
            "transition-all duration-300",
            scrolled && "shadow-lg"
          )}
          aria-label="Main navigation"
        >
          {/* Brand */}
          <BrandLogo />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6" role="menubar">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("#")[0]) && link.href.split("#")[0] !== "/";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={cn(
                    "text-sm font-medium transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-1 rounded",
                    isActive
                      ? "text-[var(--brand-primary)] font-semibold"
                      : "text-[var(--text-primary)] hover:text-[var(--brand-primary)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action area */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* WhatsApp */}
            {whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70",
                  "flex items-center justify-center text-[var(--success)]",
                  "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                )}
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={16} aria-hidden="true" />
              </a>
            )}

            {/* Phone */}
            {phone && (
              <a
                href={`tel:${phone}`}
                className={cn(
                  "w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70",
                  "flex items-center justify-center text-[var(--text-primary)]",
                  "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
                  "hidden sm:flex"
                )}
                aria-label={`Call ${phone}`}
                title="Call us"
              >
                <Phone size={16} aria-hidden="true" />
              </a>
            )}

            {/* Authenticated User Dropdown or Sign In */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80",
                    "hover:border-[var(--brand-primary)] transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                  )}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                >
                  <UserAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    size={96}
                    className="w-7 h-7"
                    textClassName="text-[11px]"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-[var(--text-primary)] max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={13} className="text-[var(--text-muted)]" />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 rounded-2xl devcore-glass-nav border border-[var(--border-subtle)] shadow-xl p-2 z-50"
                  >
                    <div className="px-3 py-2.5 border-b border-[var(--border-subtle)] mb-1">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono text-[10px] font-semibold uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/account/settings"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                    >
                      <Settings size={14} />
                      <span>Account Settings</span>
                    </Link>

                    {(user.role === "SUPER_ADMIN" || user.role === "EDITOR") && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                      >
                        <Shield size={14} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      role="menuitem"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOut();
                        router.push("/auth/signin");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className={cn(
                  "hidden sm:inline-flex text-xs font-semibold px-3 py-2",
                  "text-[var(--text-primary)] hover:text-[var(--brand-primary)]",
                  "transition-colors duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                )}
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              href="/contact"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold",
                "h-10 px-4 rounded-[10px]",
                "bg-[var(--brand-primary)] text-[var(--brand-contrast)]",
                "hover:bg-[var(--brand-hover)] transition-colors duration-150",
                "shadow-sm btn-liquid-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              )}
            >
              <Rocket size={13} aria-hidden="true" />
              Start a Project
              <ArrowRight size={13} aria-hidden="true" />
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "lg:hidden w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70",
                "flex items-center justify-center text-[var(--text-primary)]",
                "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              )}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-panel"
            >
              {isOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {/* Mobile sheet menu */}
        {isOpen && (
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className={cn(
              "lg:hidden mt-2 devcore-glass-nav rounded-2xl p-5",
              "flex flex-col gap-1"
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium",
                  "text-[var(--text-primary)] hover:text-[var(--brand-primary)]",
                  "hover:bg-[var(--bg-surface)]/60 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/account/settings"
                    className="flex items-center justify-center gap-2 h-11 rounded-[10px] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                  >
                    <Settings size={15} />
                    Account Settings
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsOpen(false);
                      await signOut();
                      router.push("/auth/signin");
                    }}
                    className="flex items-center justify-center gap-2 h-11 rounded-[10px] border border-rose-500/30 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center gap-2 h-11 rounded-[10px] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 h-11 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
              >
                <Rocket size={15} aria-hidden="true" />
                Start a Project
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
