"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  { label: "Custom Web & SaaS", href: "/services#web-saas" },
  { label: "Cloud & API Architecture", href: "/services#cloud-api" },
  { label: "AI & Workflow Automation", href: "/services#ai-automation" },
  { label: "UI/UX Design Systems", href: "/services#design-systems" },
  { label: "IT Technical Consultation", href: "/services#consultation" },
];

const PRODUCTS = [
  { label: "DineDesk Hospitality SaaS", href: "/projects/dinedesk", badge: "FLAGSHIP" },
  { label: "Product Launches", href: "/launches" },
  { label: "Engineering Stack", href: "/#tech-matrix" },
  { label: "Scope Simulator", href: "/#scope-simulator" },
];

const COMPANY = [
  { label: "About DevCore", href: "/about" },
  { label: "4-Stage Process", href: "/#process" },
  { label: "Engineering Blog", href: "/blog" },
  { label: "Careers", href: "/careers", badge: "HIRING" },
  { label: "Contact Architects", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Vulnerability Disclosure", href: "/security" },
];

interface SocialItem {
  key: string;
  label: string;
  handle: string;
  href: string;
  iconUrl: string;
  fallbackIconUrl?: string;
}

interface ApiSocialLink {
  platform?: string;
  label?: string;
  handle?: string;
  url?: string;
  isEnabled?: boolean;
}

interface PublicSettingsPayload {
  publicEmail?: string;
  socialLinks?: ApiSocialLink[];
}

function resolveBrandIconUrls(key: string): {
  primary: string;
  fallback?: string;
} {
  const normalized = key.toLowerCase();
  if (normalized.includes("linkedin")) {
    return {
      primary: "https://static.licdn.com/sc/h/1bt1u54cgv5gp7zo5g8167y83",
      fallback: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64",
    };
  }
  if (normalized.includes("github")) {
    return {
      primary: "https://cdn.simpleicons.org/github/181717/ffffff",
      fallback: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    };
  }
  if (normalized.includes("facebook")) {
    return {
      primary: "https://cdn.simpleicons.org/facebook/0866FF",
      fallback: "https://www.google.com/s2/favicons?domain=facebook.com&sz=64",
    };
  }
  if (normalized.includes("instagram")) {
    return {
      primary: "https://cdn.simpleicons.org/instagram/E4405F",
      fallback: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
    };
  }
  if (normalized.includes("youtube")) {
    return {
      primary: "https://cdn.simpleicons.org/youtube/FF0000",
      fallback: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
    };
  }
  if (normalized.includes("reddit")) {
    return {
      primary: "https://cdn.simpleicons.org/reddit/FF4500",
      fallback: "https://www.google.com/s2/favicons?domain=reddit.com&sz=64",
    };
  }
  return {
    primary: "https://cdn.simpleicons.org/x/000000/ffffff",
    fallback: "https://www.google.com/s2/favicons?domain=x.com&sz=64",
  };
}

const DEFAULT_SOCIALS: SocialItem[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "company/devcoresolutions2",
    href: "https://www.linkedin.com/company/devcoresolutions2",
    iconUrl: resolveBrandIconUrls("linkedin").primary,
    fallbackIconUrl: resolveBrandIconUrls("linkedin").fallback,
  },
  {
    key: "github",
    label: "GitHub",
    handle: "@devcoresolutions2",
    href: "https://github.com/devcoresolutions2",
    iconUrl: resolveBrandIconUrls("github").primary,
    fallbackIconUrl: resolveBrandIconUrls("github").fallback,
  },
  {
    key: "twitter",
    label: "X / Twitter",
    handle: "@DevCoreSolution",
    href: "https://x.com/DevCoreSolution",
    iconUrl: resolveBrandIconUrls("x").primary,
    fallbackIconUrl: resolveBrandIconUrls("x").fallback,
  },
  {
    key: "facebook",
    label: "Facebook",
    handle: "devcoresolutionsofficial",
    href: "https://www.facebook.com/devcoresolutionsofficial",
    iconUrl: resolveBrandIconUrls("facebook").primary,
    fallbackIconUrl: resolveBrandIconUrls("facebook").fallback,
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@devcoresolutionsofficial",
    href: "https://www.instagram.com/devcoresolutionsofficial/",
    iconUrl: resolveBrandIconUrls("instagram").primary,
    fallbackIconUrl: resolveBrandIconUrls("instagram").fallback,
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "@DevCoreSolutionsOfficial",
    href: "https://www.youtube.com/@DevCoreSolutionsOfficial",
    iconUrl: resolveBrandIconUrls("youtube").primary,
    fallbackIconUrl: resolveBrandIconUrls("youtube").fallback,
  },
  {
    key: "reddit",
    label: "Reddit",
    handle: "u/DevCoreSolutions2",
    href: "https://www.reddit.com/user/DevCoreSolutions2/",
    iconUrl: resolveBrandIconUrls("reddit").primary,
    fallbackIconUrl: resolveBrandIconUrls("reddit").fallback,
  },
];

function SocialBrandBadge({ item }: { item: SocialItem }) {
  const [src, setSrc] = useState(item.iconUrl);
  const [failedAll, setFailedAll] = useState(false);

  if (failedAll) {
    return (
      <Globe
        size={15}
        className="text-[var(--brand-primary)] shrink-0"
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={src}
      alt={`${item.label} logo`}
      width={16}
      height={16}
      loading="lazy"
      onError={() => {
        if (item.fallbackIconUrl && src !== item.fallbackIconUrl) {
          setSrc(item.fallbackIconUrl);
        } else {
          setFailedAll(true);
        }
      }}
      className="w-4 h-4 object-contain shrink-0 transition-transform duration-200 group-hover/soc:scale-110"
    />
  );
}

export function Footer() {
  const [publicEmail, setPublicEmail] = useState("dev.core.solution2@gmail.com");
  const [socials, setSocials] = useState<SocialItem[]>(DEFAULT_SOCIALS);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${base}/api/public/settings`)
      .then((r) => (r.ok ? (r.json() as Promise<PublicSettingsPayload>) : null))
      .then((data) => {
        if (!data) return;
        if (typeof data.publicEmail === "string" && data.publicEmail.trim()) {
          setPublicEmail(data.publicEmail.trim());
        }
        if (Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
          const apiMapped: SocialItem[] = data.socialLinks
            .filter(
              (l): l is ApiSocialLink & { url: string } =>
                Boolean(
                  l &&
                  typeof l.url === "string" &&
                  l.url.trim() &&
                  l.isEnabled !== false
                )
            )
            .map((l) => {
              const key = `${l.platform || ""} ${l.label || ""} ${l.url}`.toLowerCase();
              const icons = resolveBrandIconUrls(key);
              return {
                key,
                label: l.label || l.platform || "Social",
                handle: l.handle || l.label || "DevCore Solutions",
                href: l.url,
                iconUrl: icons.primary,
                fallbackIconUrl: icons.fallback,
              };
            });

          const merged = [...apiMapped];
          for (const def of DEFAULT_SOCIALS) {
            const exists = merged.some(
              (m) =>
                m.label.toLowerCase() === def.label.toLowerCase() ||
                m.href === def.href
            );
            if (!exists) merged.push(def);
          }
          if (merged.length > 0) setSocials(merged);
        }
      })
      .catch(() => { });
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(publicEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // ignore restricted clipboard environments
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      role="contentinfo"
      aria-label="Site footer"
      style={{
        paddingTop: "4.5rem",
        paddingBottom: "2.5rem",
        borderTop: "1px solid color-mix(in oklab, var(--border-strong) 65%, transparent)",
        backgroundColor: "color-mix(in oklab, var(--bg-elevated) 92%, var(--bg-surface))",
      }}
      className="relative isolate overflow-hidden backdrop-blur-2xl px-4 sm:px-6"
    >
      {/* Crisp Centered Accent Rule Along Top Border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 sm:inset-x-24 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)]/50 to-transparent"
      />

      {/* Subtle Architectural Blueprint Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--brand-primary) 18%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Main 12-Column Footer Grid */}
        <div
          style={{ paddingBottom: "3.25rem" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-[var(--border-subtle)]/85"
        >
          {/* Brand Column with Moving & Reflective Animated Logo (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 pr-0 lg:pr-6">
            <div className="inline-flex items-center">
              <motion.div
                animate={{ y: [0, -3.5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03 }}
                className="relative inline-flex items-center rounded-2xl p-1.5 overflow-hidden"
              >
                <BrandLogo size="lg" />

                {/* Moving Light Reflection Sweep Across Logo */}
                <motion.span
                  aria-hidden="true"
                  animate={{ x: ["-140%", "240%"] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    repeatDelay: 3.5,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 dark:via-teal-300/20 to-transparent skew-x-12"
                />
              </motion.div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              <strong className="text-[var(--text-primary)] font-semibold">
                &ldquo;Building the Digital Core for a Smarter Tomorrow.&rdquo;
              </strong>{" "}
              Full-stack software engineering studio architecting resilient SaaS platforms, cloud infrastructure, and AI-powered digital products.
            </p>

            {/* Studio Location & Copyable Email */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <MapPin size={13} className="text-[var(--brand-primary)] shrink-0" />
                <span>Dhaka &amp; Chattogram, Bangladesh · Global Remote</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[var(--success)] shrink-0" />
                <a
                  href={`mailto:${publicEmail}`}
                  className="text-[var(--text-primary)] font-semibold hover:text-[var(--brand-primary)] transition-colors"
                >
                  {publicEmail}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy official email"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={10} className="text-[var(--success)]" />
                      <span className="text-[var(--success)]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Official Social Links with Real External Brand Icons */}
            <div className="pt-1 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <Sparkles size={11} className="text-[var(--brand-primary)]" />
                <span>OFFICIAL DEVCORE CHANNELS</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`DevCore Solutions on ${item.label} (${item.handle})`}
                    title={`${item.label} · ${item.handle}`}
                    className={cn(
                      "group/soc w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-2xs",
                      "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
                      "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)]/50 hover:-translate-y-0.5 hover:shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                    )}
                  >
                    <SocialBrandBadge item={item} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Columns (7 Cols split into 3 structured columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Column 1: Capabilities */}
            <nav aria-label="Capabilities links">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-4">
                Capabilities
              </div>
              <ul className="space-y-2.5">
                {CAPABILITIES.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group/link inline-flex items-center gap-1 text-xs sm:text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={11}
                        className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-[var(--brand-primary)]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 2: Products & Proof */}
            <nav aria-label="Products and proof links">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-4">
                Products &amp; Proof
              </div>
              <ul className="space-y-2.5">
                {PRODUCTS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group/link inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-[var(--success)]/12 text-[var(--success)] font-mono text-[9px] font-bold">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 3: Company & Legal */}
            <div className="space-y-6">
              <nav aria-label="Company links">
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-4">
                  Company
                </div>
                <ul className="space-y-2.5">
                  {COMPANY.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] font-mono text-[9px] font-bold">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Legal links">
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Legal &amp; Security
                </div>
                <ul className="space-y-2">
                  {LEGAL.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Copyright, Operational Status & Single Back-to-Top Arrow */}
        <div
          style={{ paddingTop: "2rem" }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-xs text-[var(--text-secondary)] font-medium text-center sm:text-left">
            <span>
              &copy; {currentYear}{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                DevCore Solutions
              </strong>
              . All rights reserved.
            </span>
            <span className="hidden sm:inline text-[var(--text-muted)] font-mono text-[11px] ml-2">
              · Engineered in Bangladesh
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/25 font-mono text-[11px] font-semibold text-[var(--success)]">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-[var(--success)]" />
              </span>
              <span>All Systems Operational</span>
            </div>

            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll back to top"
              title="Back to top"
              className="w-9 h-9 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)] flex items-center justify-center shadow-sm transition-colors cursor-pointer"
            >
              <ArrowUp size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}