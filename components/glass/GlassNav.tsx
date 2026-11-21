"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle, ArrowRight, Rocket } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Launches", href: "/launches" },
  { label: "Portfolio", href: "/projects" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

interface GlassNavProps {
  whatsappNumber?: string;
  phone?: string;
}

export function GlassNav({ whatsappNumber = "8801700000000", phone = "+8801700000000" }: GlassNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I'd like to discuss a project with DevCore Solutions.")}`;

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
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70",
                "flex items-center justify-center text-[var(--success)]",
                "hover:bg-[var(--bg-elevated)] transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              )}
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={16} aria-hidden="true" />
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone}`}
              className={cn(
                "w-9 h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70",
                "flex items-center justify-center text-[var(--brand-primary)]",
                "hover:bg-[var(--bg-elevated)] transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
                "hidden sm:flex"
              )}
              aria-label={`Call ${phone}`}
              title="Call us"
            >
              <Phone size={16} aria-hidden="true" />
            </a>

            {/* Sign In */}
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
                "hover:bg-[var(--bg-elevated)] transition-colors duration-150",
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
              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 h-11 rounded-[10px] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                Sign In
              </Link>
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
