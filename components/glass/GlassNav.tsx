"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";
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
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  isLive?: boolean;
}

const NAV_LINKS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Launches", href: "/launches", isLive: true },
  { label: "Portfolio", href: "/projects" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface GlassNavProps {
  whatsappNumber?: string;
  phone?: string;
}

export function GlassNav({ whatsappNumber = "", phone = "" }: GlassNavProps) {
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const [userMenuPath, setUserMenuPath] = useState<string | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hashState, setHashState] = useState<{ path: string; hash: string }>({
    path: "",
    hash: "",
  });

  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Derive open states directly from pathname so route changes close menus without useEffect
  const isOpen = openMenuPath === pathname;
  const userMenuOpen = userMenuPath === pathname;
  const activeHash = hashState.path === pathname ? hashState.hash : "";

  const setIsOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    setOpenMenuPath((prev) => {
      const current = prev === pathname;
      const next = typeof value === "function" ? value(current) : value;
      return next ? pathname : null;
    });
  };

  const setUserMenuOpen = (value: boolean | ((prev: boolean) => boolean)) => {
    setUserMenuPath((prev) => {
      const current = prev === pathname;
      const next = typeof value === "function" ? value(current) : value;
      return next ? pathname : null;
    });
  };

  // Smooth scroll progress bar at bottom of navbar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  // Close user dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuPath(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Scroll listener for navbar elevation & #process section tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      if (window.location.pathname === "/") {
        const processEl = document.getElementById("process");
        if (processEl) {
          const rect = processEl.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setHashState({ path: "/", hash: "#process" });
          } else {
            setHashState((prev) =>
              prev.hash === "#process" ? { path: "", hash: "" } : prev
            );
          }
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll & trap Escape key when mobile drawer is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuPath(null);
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen]);

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "EDITOR";

  const isLinkActive = (href: string) => {
    if (href === "/#process") {
      return pathname === "/" && activeHash === "#process";
    }
    if (href === "/") return pathname === "/" && !activeHash;
    const baseHref = href.split("#")[0];
    return baseHref !== "/" && pathname.startsWith(baseHref);
  };

  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
      "Hi, I'd like to discuss a project with DevCore Solutions."
    )}`
    : "";

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--brand-primary)] focus:text-[var(--brand-contrast)] focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 z-50 mx-auto transition-all duration-300 ease-in-out",
          scrolled
            ? "top-2.5 px-2.5 sm:px-4 max-w-[1440px]"
            : "top-4 px-4 sm:px-6 max-w-7xl"
        )}
        role="banner"
      >
        <nav
          className={cn(
            "relative overflow-visible devcore-glass-nav rounded-2xl flex items-center justify-between gap-2",
            "transition-all duration-300 ease-in-out",
            scrolled
              ? "h-14 px-4 sm:px-7 shadow-xl border-[var(--border-strong)]/40"
              : "h-16 px-4 sm:px-6 shadow-md"
          )}
          aria-label="Main navigation"
        >
          {/* Top Specular Highlight Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/40 to-transparent"
          />

          {/* Continuous Moving Brand Logo Stage */}
          <motion.div
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="relative shrink-0 flex items-center group"
          >
            {/* Ambient Breathing Halo Behind Logo */}
            <motion.span
              aria-hidden="true"
              animate={{
                opacity: [0.22, 0.5, 0.22],
                scale: [0.95, 1.08, 0.95],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -inset-2 rounded-xl bg-[var(--brand-primary)]/15 blur-md group-hover:bg-[var(--brand-primary)]/25 transition-colors"
            />

            {/* Continuous Levitation & Gentle Tilt Motion */}
            <motion.div
              animate={{
                y: [0, -2.5, 0],
                rotate: [0, 0.7, 0, -0.7, 0],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative overflow-hidden logo-hover-glint rounded-xl px-1.5 py-1"
            >
              {/* Periodic Automated Light Glint Sweep */}
              <motion.span
                aria-hidden="true"
                animate={{
                  x: ["-160%", "260%"],
                }}
                transition={{
                  duration: 1.35,
                  repeat: Infinity,
                  repeatDelay: 4.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-20 bg-gradient-to-r from-transparent via-[var(--shimmer-highlight)] to-transparent"
              />
              <BrandLogo />
            </motion.div>
          </motion.div>

          {/* Desktop Center Navigation Links (borderless floating layout) */}
          <div
            className="relative isolate hidden lg:flex items-center gap-0.5 xl:gap-1"
            role="menubar"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              const isHovered = hoveredHref === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onClick={() => {
                    if (link.href === "/#process") {
                      setHashState({ path: "/", hash: "#process" });
                    }
                  }}
                  className={cn(
                    "relative px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm transition-colors duration-150 select-none whitespace-nowrap",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                    active
                      ? "text-[var(--brand-contrast)] font-semibold"
                      : "text-[var(--text-primary)] font-medium hover:text-[var(--brand-primary)]"
                  )}
                >
                  {/* Sliding Hover Pill */}
                  {isHovered && !active && (
                    <motion.span
                      layoutId="devcore-nav-hover"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 z-0 rounded-lg bg-[var(--bg-elevated)]/85"
                    />
                  )}

                  {/* Sliding Active Pill */}
                  {active && (
                    <motion.span
                      layoutId="devcore-nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 z-0 rounded-lg bg-[var(--brand-primary)] shadow-md"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2.5 bottom-0.5 h-[1.5px] rounded-full bg-[var(--brand-contrast)]/55"
                      />
                    </motion.span>
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{link.label}</span>
                    {link.isLive && (
                      <span
                        title="New product launches live"
                        className="relative flex size-1.5 shrink-0"
                      >
                        <span
                          className={cn(
                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                            active
                              ? "bg-[var(--brand-contrast)]"
                              : "bg-[var(--success)]"
                          )}
                        />
                        <span
                          className={cn(
                            "relative inline-flex rounded-full size-1.5",
                            active
                              ? "bg-[var(--brand-contrast)]"
                              : "bg-[var(--success)]"
                          )}
                        />
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />

            {/* WhatsApp Quick Button */}
            {whatsappNumber && (
              <motion.a
                whileHover={{ y: -1.5, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/75",
                  "flex items-center justify-center text-[var(--success)]",
                  "hover:bg-[var(--bg-elevated)] hover:border-[var(--success)]/60 hover:shadow-sm transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                )}
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={16} aria-hidden="true" />
              </motion.a>
            )}

            {/* Phone Quick Button */}
            {phone && (
              <motion.a
                whileHover={{ y: -1.5, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                href={`tel:${phone}`}
                className={cn(
                  "w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/75",
                  "hidden md:flex items-center justify-center text-[var(--text-primary)]",
                  "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                )}
                aria-label={`Call ${phone}`}
                title={`Call ${phone}`}
              >
                <Phone size={15} aria-hidden="true" />
              </motion.a>
            )}

            {/* Authenticated User Dropdown or Sign In */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-2 pl-1.5 pr-2.5 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85",
                    "hover:border-[var(--brand-primary)] transition-colors duration-150 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                    userMenuOpen && "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/15"
                  )}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                >
                  <UserAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl}
                    size={96}
                    className="w-6 h-6"
                    textClassName="text-[10px]"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-[var(--text-primary)] max-w-[96px] xl:max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={13}
                    className={cn(
                      "text-[var(--text-muted)] transition-transform duration-200",
                      userMenuOpen && "rotate-180 text-[var(--brand-primary)]"
                    )}
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      role="menu"
                      className="absolute right-0 mt-2.5 w-64 rounded-2xl devcore-glass-nav border border-[var(--border-subtle)] shadow-2xl p-2 z-50 origin-top-right"
                    >
                      <div className="px-3 py-2.5 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)]/60 mb-1.5">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                          {user.email}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] font-mono text-[10px] font-semibold uppercase tracking-wide">
                          <Sparkles size={10} />
                          {user.role}
                        </span>
                      </div>

                      {isAdmin ? (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
                        >
                          <Shield size={14} className="text-[var(--brand-primary)]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          href="/account/settings"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
                        >
                          <Settings size={14} className="text-[var(--brand-primary)]" />
                          <span>Account Settings</span>
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
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors mt-0.5 cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className={cn(
                  "hidden sm:inline-flex items-center h-9 px-3 rounded-xl text-xs font-semibold",
                  "text-[var(--text-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-surface)]/70",
                  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                )}
              >
                Sign In
              </Link>
            )}

            {/* Primary CTA Button */}
            {isAdmin ? (
              <Link
                href="/admin/dashboard"
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold group",
                  "h-9 px-3.5 xl:px-4 rounded-xl",
                  "bg-[var(--brand-primary)] text-[var(--brand-contrast)]",
                  "hover:bg-[var(--brand-hover)] transition-all duration-200",
                  "shadow-sm btn-liquid-hover whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                )}
              >
                <Shield size={13} aria-hidden="true" />
                <span>Admin Dashboard</span>
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            ) : (
              <Link
                href="/contact"
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold group",
                  "h-9 px-3.5 xl:px-4 rounded-xl",
                  "bg-[var(--brand-primary)] text-[var(--brand-contrast)]",
                  "hover:bg-[var(--brand-hover)] transition-all duration-200",
                  "shadow-sm btn-liquid-hover whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                )}
              >
                <Rocket size={13} aria-hidden="true" />
                <span>Start a Project</span>
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "lg:hidden w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/75",
                "flex items-center justify-center text-[var(--text-primary)]",
                "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              )}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-panel"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={18} aria-hidden="true" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={18} aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Hairline Scroll Progress Bar */}
          <motion.div
            style={{ scaleX }}
            aria-hidden="true"
            className="absolute bottom-0 left-4 right-4 h-[2px] origin-left rounded-full bg-[var(--brand-primary)]/75 pointer-events-none"
          />
        </nav>

        {/* Animated Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className={cn(
                "lg:hidden mt-2.5 devcore-glass-nav rounded-2xl p-4 sm:p-5 shadow-2xl",
                "max-h-[calc(100dvh-5.5rem)] overflow-y-auto flex flex-col gap-1"
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {NAV_LINKS.map((link, idx) => {
                  const active = isLinkActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                          active
                            ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold shadow-xs"
                            : "text-[var(--text-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-surface)]/70"
                        )}
                      >
                        <span>{link.label}</span>
                        {link.isLive && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider opacity-85">
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                active
                                  ? "bg-[var(--brand-contrast)]"
                                  : "bg-[var(--success)]"
                              )}
                            />
                            Live
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Quick Contact Row */}
              {(whatsappNumber || phone) && (
                <div className="mt-2 pt-2.5 border-t border-[var(--border-subtle)]/70 grid grid-cols-2 gap-2 md:hidden">
                  {whatsappNumber && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 text-xs font-semibold text-[var(--success)] hover:border-[var(--success)] transition-colors"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className={cn(
                        "flex items-center justify-center gap-2 h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors",
                        !whatsappNumber && "col-span-2"
                      )}
                    >
                      <Phone size={14} />
                      <span>Call Us</span>
                    </a>
                  )}
                </div>
              )}

              {/* Mobile Auth & Primary CTA */}
              <div className="mt-2 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                {user ? (
                  <>
                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors btn-liquid-hover"
                      >
                        <Shield size={15} />
                        <span>Admin Dashboard</span>
                        <ArrowRight size={15} />
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/account/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                        >
                          <Settings size={15} />
                          <span>Account Settings</span>
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors btn-liquid-hover"
                        >
                          <Rocket size={15} aria-hidden="true" />
                          <span>Start a Project</span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        setIsOpen(false);
                        await signOut();
                        router.push("/auth/signin");
                      }}
                      className="flex items-center justify-center gap-2 h-10 rounded-xl border border-rose-500/30 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                    >
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors btn-liquid-hover"
                    >
                      <Rocket size={15} aria-hidden="true" />
                      <span>Start a Project</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}