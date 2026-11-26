"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  Check,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  ArrowUpRight,
  Copy,
  ShieldCheck,
  Clock,
  Globe,
  Compass,
  Play,
  Sliders,
  Binary,
  GitCommit,
  FolderKanban,
} from "lucide-react";
import { type ContactSettings } from "@/lib/api";

interface TalkToUsBannerProps {
  settings: ContactSettings;
}

interface ArchitectureQuickLink {
  label: string;
  tag: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const ARCHITECTURE_DOCK_LINKS: ArchitectureQuickLink[] = [
  {
    label: "Studio Film & Reels",
    tag: "CINEMA",
    href: "#engineering-theater",
    icon: Play,
  },
  {
    label: "Scope Simulator",
    tag: "PLANNER",
    href: "#scope-simulator",
    icon: Sliders,
  },
  {
    label: "Tech Matrix",
    tag: "STACK",
    href: "#tech-matrix",
    icon: Binary,
  },
  {
    label: "4-Stage Process",
    tag: "DELIVERY",
    href: "#process",
    icon: GitCommit,
  },
  {
    label: "Full Case Studies",
    tag: "ARCHIVE",
    href: "/projects",
    icon: FolderKanban,
  },
];

export function TalkToUsBanner({ settings }: TalkToUsBannerProps) {
  const { whatsappNumber, phone, email } = settings;
  const cleanWa = whatsappNumber.replace(/\D/g, "");
  const waHref = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    "Hi DevCore Solutions, I'd like to discuss a software project."
  )}`;

  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(460);
  const spotY = useMotionValue(220);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2.5, -2.5]), {
    stiffness: 220,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3.5, 3.5]), {
    stiffness: 220,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 15%, transparent), transparent 74%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCopy = async (
    e: React.MouseEvent,
    field: "phone" | "email",
    value: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore restricted clipboard environments
    }
  };

  return (
    <section
      id="talk-to-us"
      aria-labelledby="talkto-heading"
      style={{ paddingTop: "4rem", paddingBottom: "7.5rem" }}
      className="relative isolate overflow-hidden px-4 sm:px-6"
    >
      {/* Atmospheric Core Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 15%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 15%, black 88%, transparent 100%)",
        }}
      >
        <div
          className="h-[540px] w-[540px] sm:w-[920px] rounded-full opacity-85"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 15%, transparent) 0%, color-mix(in oklab, var(--success) 7%, transparent) 46%, transparent 72%)",
            filter: "blur(52px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full" style={{ perspective: 1200 }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="group relative rounded-3xl devcore-glass-card bg-[var(--bg-elevated)]/88 backdrop-blur-2xl border p-7 sm:p-10 lg:p-14 shadow-xl overflow-hidden"
        >
          {/* Cursor-Tracked Optical Spotlight */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: spotlightBg }}
          />

          {/* Top & Bottom Luminous Specular Rims */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-20 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--success)]/55 to-transparent"
          />

          {/* Subtle Shimmer Sweep */}
          <motion.div
            aria-hidden="true"
            animate={{ x: ["-130%", "230%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--brand-primary)]/[0.05] to-transparent skew-x-12"
          />

          {/* Top Studio Status & Availability Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-8 mb-8 border-b border-[var(--border-subtle)]/80">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-[var(--success)]" />
              </span>
              <span>DIRECT ARCHITECT ENGAGEMENT</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Globe size={12} className="text-[var(--brand-primary)]" />
                <span>Chattogram HQ · Global Remote</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--success)] font-semibold">
                <Clock size={12} />
                <span>Avg. Response &lt; 2 Hours</span>
              </span>
            </div>
          </div>

          {/* Main Split Grid: Executive Copy (7 Cols) + Interactive Contact Matrix (5 Cols) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-9 lg:gap-12 items-center">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <h2
                id="talkto-heading"
                className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[46px] text-[var(--text-primary)] tracking-tight leading-[1.08]"
              >
                Ready to Solidify Your{" "}
                <span className="text-liquid-gradient">Digital Core?</span>
              </h2>

              <p className="text-sm sm:text-base lg:text-[17px] text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Talk directly with a Principal Solutions Engineer. We evaluate your system requirements, propose concrete milestones, and formulate execution roadmaps—zero sales middlemen.
              </p>

              {/* Guarantee Pills */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {[
                  "Direct NDA signing",
                  "No junior handoffs",
                  "Fixed milestone pricing",
                  "100% source IP ownership",
                ].map((guarantee) => (
                  <span
                    key={guarantee}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)]/85 border border-[var(--border-subtle)] font-mono text-[11px] font-semibold text-[var(--text-primary)]"
                  >
                    <Check size={12} className="text-[var(--success)] shrink-0" aria-hidden="true" />
                    <span>{guarantee}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: 2x2 Tactile Engagement Channels */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. WhatsApp Instant Chat */}
              <motion.a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                style={{
                  borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
                }}
                className="group/ch relative p-4 rounded-2xl bg-[var(--bg-surface)]/90 border hover:shadow-lg transition-all flex items-center gap-3.5 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-0 h-[2px] opacity-0 group-hover/ch:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-[var(--success)] to-transparent"
                />
                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/14 text-[var(--success)] border border-[var(--success)]/25 flex items-center justify-center shrink-0 group-hover/ch:scale-105 transition-transform">
                  <MessageCircle size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display text-xs font-bold text-[var(--text-primary)]">
                      WhatsApp
                    </span>
                    <ArrowUpRight size={12} className="text-[var(--success)] shrink-0" />
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                    Instant Architect Chat
                  </div>
                </div>
              </motion.a>

              {/* 2. Direct Call + Quick Copy */}
              <motion.a
                href={`tel:${phone}`}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                style={{
                  borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
                }}
                className="group/ch relative p-4 rounded-2xl bg-[var(--bg-surface)]/90 border hover:shadow-lg transition-all flex items-center gap-3.5 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-0 h-[2px] opacity-0 group-hover/ch:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent"
                />
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 flex items-center justify-center shrink-0 group-hover/ch:scale-105 transition-transform">
                  <Phone size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display text-xs font-bold text-[var(--text-primary)]">
                      Direct Call
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, "phone", phone)}
                      title="Copy phone number"
                      className="p-1 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                    >
                      {copiedField === "phone" ? (
                        <Check size={11} className="text-[var(--success)]" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                    {phone}
                  </div>
                </div>
              </motion.a>

              {/* 3. Email Inquiries + Quick Copy */}
              <motion.a
                href={`mailto:${email}`}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                style={{
                  borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
                }}
                className="group/ch relative p-4 rounded-2xl bg-[var(--bg-surface)]/90 border hover:shadow-lg transition-all flex items-center gap-3.5 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-0 h-[2px] opacity-0 group-hover/ch:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent"
                />
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 flex items-center justify-center shrink-0 group-hover/ch:scale-105 transition-transform">
                  <Mail size={18} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-display text-xs font-bold text-[var(--text-primary)]">
                      Email Desk
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, "email", email)}
                      title="Copy email address"
                      className="p-1 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                    >
                      {copiedField === "email" ? (
                        <Check size={11} className="text-[var(--success)]" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] truncate mt-0.5">
                    {email}
                  </div>
                </div>
              </motion.a>

              {/* 4. Primary Flagship CTA: Request Callback / Scope */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                className="h-full"
              >
                <Link
                  href="/contact"
                  className="btn-liquid-hover group/cta h-full p-4 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)] shadow-md hover:shadow-xl transition-all flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover/cta:scale-105 transition-transform">
                    <Calendar size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display text-xs font-bold">
                        Start a Project
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                      />
                    </div>
                    <div className="text-[11px] font-mono opacity-85 truncate mt-0.5">
                      Book Discovery Call
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Bottom Architecture Quick-Jump Command Dock (Complements Footer Socials Without Duplication) */}
          <div className="relative z-10 mt-10 pt-6 border-t border-[var(--border-subtle)]/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0">
              <Compass size={13} className="text-[var(--brand-primary)]" />
              <span>ARCHITECTURE QUICK-JUMP</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ARCHITECTURE_DOCK_LINKS.map((item) => {
                const Icon = item.icon;
                const isAnchor = item.href.startsWith("#");

                if (isAnchor) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group/dock inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)]/80 hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] transition-all"
                    >
                      <Icon
                        size={12}
                        className="text-[var(--brand-primary)] group-hover/dock:text-[var(--success)] transition-colors"
                      />
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.label}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                        {item.tag}
                      </span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group/dock inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)]/80 hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] transition-all"
                  >
                    <Icon
                      size={12}
                      className="text-[var(--brand-primary)] group-hover/dock:text-[var(--success)] transition-colors"
                    />
                    <span className="font-semibold text-[var(--text-primary)]">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--brand-primary)]/12 text-[var(--brand-primary)]">
                      {item.tag}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Subtle Compliance Note */}
          <div className="relative z-10 mt-4 flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-[var(--success)]" />
              <span>SOC2-Ready Engineering Practices · Strict Confidentiality</span>
            </span>
            <span className="hidden sm:inline">dev.core.solution2@gmail.com</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}