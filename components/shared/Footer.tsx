"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  { label: "Custom Web & SaaS", href: "/services" },
  { label: "Cloud & API Architecture", href: "/services" },
  { label: "AI & Workflow Automation", href: "/services" },
  { label: "UI/UX Design Systems", href: "/services" },
  { label: "IT Technical Consultation", href: "/services" },
];

const PRODUCTS = [
  { label: "DineDesk Hospitality SaaS", href: "/projects/dinedesk" },
  { label: "Product Launches", href: "/launches" },
  { label: "Engineering Stack", href: "/#tech-matrix" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Vulnerability Disclosure", href: "/security" },
  { label: "Contact", href: "/contact" },
];

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42a2.5 2.5 0 0 0-1.76 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98L15 12l-5.25 3.02z"/>
    </svg>
  );
}

const SOCIALS = [
  { icon: LinkedInIcon, label: "LinkedIn", href: "https://www.linkedin.com/company/devcoresolutions2" },
  { icon: GitHubIcon, label: "GitHub", href: "https://github.com/devcoresolutions2" },
  { icon: TwitterIcon, label: "X / Twitter", href: "https://x.com/DevCoreSolution" },
  { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/devcoresolutionsofficial" },
  { icon: YouTubeIcon, label: "YouTube", href: "https://www.youtube.com/@DevCoreSolutionsOfficial" },
];

export function Footer() {
  const [publicEmail, setPublicEmail] = useState("solutions@devcoresolutions.com");
  const [socials, setSocials] = useState(SOCIALS);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${base}/api/public/settings`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (typeof data.publicEmail === "string" && data.publicEmail.trim()) {
          setPublicEmail(data.publicEmail.trim());
        }
        if (Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
          const mapped = data.socialLinks
            .filter((l: any) => l && l.url && l.isEnabled !== false)
            .map((l: any) => {
              const key = `${l.platform || ""} ${l.label || ""} ${l.url || ""}`.toLowerCase();
              const icon = key.includes("linkedin")
                ? LinkedInIcon
                : key.includes("github")
                  ? GitHubIcon
                  : key.includes("facebook")
                    ? FacebookIcon
                    : key.includes("youtube")
                      ? YouTubeIcon
                      : TwitterIcon;
              return {
                icon,
                label: l.label || l.platform || "Social",
                href: l.url,
              };
            });
          if (mapped.length > 0) setSocials(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer
      id="footer"
      className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] pt-16 pb-10 px-4 sm:px-6"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--border-subtle)]">
          {/* Brand col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <BrandLogo size="lg" />
            </div>

            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              "Building the Digital Core for a Smarter Tomorrow." Premium software engineering studio focused on
              resilient SaaS platforms, cloud infrastructure, and AI-powered digital products.
            </p>

            <div className="font-mono text-xs text-[var(--text-muted)] space-y-1">
              <div>Dhaka & Chattogram, Bangladesh</div>
              <div>{publicEmail}</div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`DevCore on ${label}`}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 shadow-xs bg-white text-[#4A5C6A] border border-[#CCD0CF] hover:bg-[#253745] hover:text-white hover:border-[#253745] hover:-translate-y-0.5 dark:bg-white/[0.08] dark:text-[#CCD0CF] dark:border-white/15 dark:hover:bg-[#8FB4C9] dark:hover:text-[#06141B] dark:hover:border-[#8FB4C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253745] focus-visible:ring-offset-2"
                >
                  <Icon className="w-4 h-4 shrink-0 fill-current" />
                </a>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <nav aria-label="Capabilities links">
            <div className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Capabilities
            </div>
            <ul className="space-y-2">
              {CAPABILITIES.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Products & Proof */}
          <nav aria-label="Products and proof links">
            <div className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Products & Proof
            </div>
            <ul className="space-y-2">
              {PRODUCTS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <div className="font-display font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] mb-3">
              Legal & Links
            </div>
            <ul className="space-y-2">
              {LEGAL.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span>&copy; {new Date().getFullYear()} DevCore Solutions. All rights reserved.</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--text-muted)]" aria-hidden="true" />
            <span>Liquid Glass Design Standard v3</span>
          </div>
          <div className="font-mono text-[11px] flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[var(--success)]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"
                aria-hidden="true"
              />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
