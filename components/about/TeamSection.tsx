"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Code2,
  CheckCircle2,
  ArrowUpRight,
  Terminal,
  Sparkles,
} from "lucide-react";
import type { TeamMemberItem } from "@/lib/mock/data";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-3.5 h-3.5 shrink-0"}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-3.5 h-3.5 shrink-0"}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function SocialLinks({
  member,
  hideGlobe = false,
}: {
  member: TeamMemberItem;
  hideGlobe?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {member.linkedinUrl && (
        <motion.a
          whileHover={{ y: -2, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} LinkedIn`}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-2xs bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] hover:border-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        >
          <LinkedInIcon className="w-3.5 h-3.5 shrink-0 fill-current" />
        </motion.a>
      )}
      {member.githubUrl && (
        <motion.a
          whileHover={{ y: -2, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          href={member.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} GitHub`}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-2xs bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] hover:border-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        >
          <GitHubIcon className="w-3.5 h-3.5 shrink-0 fill-current" />
        </motion.a>
      )}
      {!hideGlobe && member.portfolioUrl && (
        <motion.a
          whileHover={{ y: -2, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          href={member.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} Portfolio`}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-2xs bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] hover:border-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        >
          <Globe size={14} className="shrink-0" />
        </motion.a>
      )}
    </div>
  );
}

interface FounderHighlight {
  firstNamePart: string;
  highlightedLastPart: string;
  titleRank: "Founder & CEO" | "Co-Founder & CEO";
  subtitleTag: string;
  coreFocus: string[];
  avatarSrc: string;
  hideGlobe?: boolean;
}

function FounderSpotlightCard({
  member,
  highlight,
  delay = 0,
}: {
  member: TeamMemberItem;
  highlight: FounderHighlight;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 35 });
  const rotateX = useSpring(useTransform(normY, [-0.5, 0.5], [1.4, -1.4]), {
    stiffness: 260,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(normX, [-0.5, 0.5], [-1.8, 1.8]), {
    stiffness: 260,
    damping: 30,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    mouseX.set(relX);
    mouseY.set(relY);
    normX.set(relX / rect.width - 0.5);
    normY.set(relY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(-300);
    mouseY.set(-300);
    normX.set(0);
    normY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full overflow-hidden rounded-3xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/55 bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-md hover:shadow-2xl transition-[border-color,box-shadow] duration-300 p-4 sm:p-5 lg:p-6"
    >
      {/* Top Specular Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/85 to-transparent z-20"
      />

      {/* Interactive Cursor Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Left-Image / Right-Content Flex Wrapper */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: "1.5rem",
        }}
        className="relative z-10 w-full"
      >
        {/* LEFT SIDE: Framed Portrait with Sleek Micro Status Badge at Top-Right */}
        <div
          style={{
            flex: "0 0 230px",
            width: "230px",
            maxWidth: "100%",
            height: "295px",
          }}
          className="relative rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/45 shadow-sm overflow-hidden mx-auto sm:mx-0 transition-colors duration-300"
        >
          <img
            src={highlight.avatarSrc}
            alt={member.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* Subtle Inner Edge Ring & Bottom Studio Vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl bg-gradient-to-t from-black/25 via-transparent to-black/15"
          />

          {/* Sleek Micro Status Badge at Top-Right of Image */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "fit-content",
              padding: "3px 9px",
              fontSize: "9px",
              lineHeight: 1.1,
              letterSpacing: "0.08em",
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 text-white font-mono font-bold uppercase shadow-sm whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>{highlight.titleRank}</span>
          </span>
        </div>

        {/* RIGHT SIDE: Executive Dossier & Engineering Specs */}
        <div
          style={{
            flex: "1 1 320px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="gap-3.5"
        >
          <div className="flex flex-col gap-2.5 min-w-0">
            {/* Top Row: Eyebrow on Left + Compact "DevCore Executive Board" Status Pill on Top-Right */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-4 bg-[var(--brand-primary)] shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--brand-primary)] font-bold">
                  {highlight.subtitleTag}
                </span>
              </div>

              <span
                style={{
                  width: "fit-content",
                  padding: "3px 10px",
                  fontSize: "9.5px",
                  lineHeight: 1.15,
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--brand-primary)]/35 font-mono font-bold tracking-wide text-[var(--text-primary)] shadow-2xs shrink-0 whitespace-nowrap"
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>DevCore Executive Board</span>
              </span>
            </div>

            {/* High-Contrast Executive Name Typography & Specular Accent Line */}
            <div className="min-w-0">
              <div className="relative inline-block max-w-full">
                <h3 className="font-display font-black text-2xl sm:text-[28px] lg:text-[31px] text-[var(--text-primary)] tracking-[-0.025em] leading-[1.15]">
                  <span>{highlight.firstNamePart} </span>
                  <span className="text-liquid-gradient">
                    {highlight.highlightedLastPart}
                  </span>
                </h3>
                <span
                  aria-hidden="true"
                  className="block h-[2px] w-14 group-hover:w-full rounded-full bg-[var(--brand-primary)] mt-1 transition-all duration-500 ease-out"
                />
              </div>

              {/* Shimmering Engineering Role Badge */}
              <div className="relative overflow-hidden mt-2.5 flex w-fit max-w-full items-center gap-2 px-3 py-1 rounded-lg bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/35">
                <motion.span
                  aria-hidden="true"
                  animate={{ x: ["-160%", "260%"] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatDelay: 3.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-20 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                />
                <Code2
                  size={13}
                  className="relative z-10 text-[var(--brand-primary)] shrink-0"
                />
                <span className="relative z-10 text-xs font-bold text-[var(--text-primary)]">
                  Junior Software Engineer &amp; Full Stack Developer
                </span>
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <p className="text-xs sm:text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
                {member.bio}
              </p>
            )}

            {/* Core Engineering Focus Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {highlight.coreFocus.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: delay + idx * 0.05 }}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/30 transition-colors min-w-0"
                >
                  <CheckCircle2
                    size={12}
                    className="text-[var(--brand-primary)] shrink-0"
                  />
                  <span className="text-[11.5px] font-semibold text-[var(--text-primary)] truncate">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <SocialLinks member={member} hideGlobe={highlight.hideGlobe} />
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                <Sparkles size={11} className="text-[var(--brand-primary)]" />
                <span>Direct Founder Access</span>
              </span>
            </div>

            {member.portfolioUrl && member.portfolioUrl !== "#" ? (
              <a
                href={member.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-liquid-hover inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs shadow-2xs hover:bg-[var(--brand-hover)] transition-all whitespace-nowrap"
              >
                <span>Developer Portfolio</span>
                <ArrowUpRight size={13} />
              </a>
            ) : (
              <a
                href="https://www.linkedin.com/company/devcoresolutions2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-primary)] text-[var(--text-primary)] hover:text-[var(--brand-contrast)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] font-semibold text-xs transition-all whitespace-nowrap"
              >
                <span>Company LinkedIn</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface TeamSectionProps {
  members: TeamMemberItem[];
}

export function TeamSection({ members }: TeamSectionProps) {
  const safeMembers = members || [];
  const templateBase = safeMembers[0];

  const createMember = (
    existing: TeamMemberItem | undefined,
    overrides: Partial<TeamMemberItem> &
      Pick<TeamMemberItem, "id" | "name" | "role">
  ): TeamMemberItem => {
    const computedInitials =
      overrides.initials ||
      overrides.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();

    return {
      ...(templateBase ?? {}),
      initials: computedInitials,
      badge: "",
      bio: "",
      avatarUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      order: 0,
      published: true,
      isFeatured: true,
      ...(existing ?? {}),
      ...overrides,
    } as TeamMemberItem;
  };

  const existingFourkan = safeMembers.find((m) =>
    m.name.toLowerCase().includes("fourkan")
  );
  const existingSamin = safeMembers.find(
    (m) =>
      m.name.toLowerCase().includes("kazi") ||
      m.name.toLowerCase().includes("mehedi") ||
      m.name.toLowerCase().includes("samin")
  );

  const fourkanProfile = createMember(existingFourkan, {
    id: existingFourkan?.id || "founder-fourkan",
    name: "Fourkan Bin Ilias",
    initials: "FI",
    role: "Founder & CEO • Junior Software Engineer & Full Stack Developer",
    badge: "FOUNDER & CEO",
    bio: "Founder & CEO leading end-to-end full-stack architecture, TypeScript & Next.js product systems, PostgreSQL database design, and direct client delivery at DevCore Solutions.",
    avatarUrl: "/images/team/fourkan-bin-ilias.jpg",
    linkedinUrl:
      existingFourkan?.linkedinUrl ||
      "https://www.linkedin.com/in/fourkan-bin-ilias/",
    githubUrl: existingFourkan?.githubUrl || "https://github.com/Pinon1345",
    portfolioUrl:
      existingFourkan?.portfolioUrl && existingFourkan.portfolioUrl !== "#"
        ? existingFourkan.portfolioUrl
        : "https://fourkan-bin-ilias-portfolio-dev.vercel.app/",
  });

  const saminProfile = createMember(existingSamin, {
    id: existingSamin?.id || "cofounder-samin",
    name: "Kazi Mehedi Hasan Samin",
    initials: "KM",
    role: "Co-Founder & CEO • Junior Software Engineer & Full Stack Developer",
    badge: "CO-FOUNDER & CEO",
    bio: "Co-Founder & CEO driving scalable full-stack web platforms, React & Node.js engineering workflows, API infrastructure, and collaborative product execution across DevCore Solutions.",
    avatarUrl: "/images/team/kazi-mehedi-hasan-samin.jpg",
    linkedinUrl:
      existingSamin?.linkedinUrl ||
      "https://www.linkedin.com/in/kazi-mahedi-hasan",
    githubUrl:
      existingSamin?.githubUrl || "https://github.com/kazi-Samin",
    portfolioUrl:
      existingSamin?.portfolioUrl && existingSamin.portfolioUrl !== "#"
        ? existingSamin.portfolioUrl
        : "https://kazi-mahedi-hasan-portfolio.vercel.app/",
  });

  return (
    <section
      id="leadership-team"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-x-clip"
    >
      {/* Ambient Section Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-1/4 w-96 h-72 max-w-[85vw] rounded-full bg-[var(--brand-primary)]/10 blur-[130px] -z-10"
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-4 bg-[var(--brand-primary)]/70" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Founders &amp; Core Builders
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.15]">
            Meet the People Behind{" "}
            <span className="text-liquid-gradient">DevCore</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mt-1">
            DevCore is built and operated directly by its two co-founders—you
            collaborate straight with the engineers architecting and shipping
            your product.
          </p>
        </div>

        <div className="self-start md:self-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] shadow-2xs shrink-0">
          <ShieldCheck size={13} className="text-[var(--brand-primary)]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Zero Outsourcing &bull; 100% Founder-Built
          </span>
        </div>
      </div>

      {/* Stacked Founder Cards: Fourkan First, Kazi Mehedi Hasan Samin Directly Below */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <FounderSpotlightCard
          member={fourkanProfile}
          highlight={{
            firstNamePart: "Fourkan Bin",
            highlightedLastPart: "Ilias",
            titleRank: "Founder & CEO",
            subtitleTag: "01 // Executive Leadership",
            avatarSrc: "/images/team/fourkan-bin-ilias.jpg",
            hideGlobe: true,
            coreFocus: [
              "Full-Stack System Architecture",
              "Next.js, React & TypeScript",
              "PostgreSQL & Prisma Modeling",
              "Product Strategy & Client Delivery",
            ],
          }}
          delay={0.04}
        />

        <FounderSpotlightCard
          member={saminProfile}
          highlight={{
            firstNamePart: "Kazi Mehedi Hasan",
            highlightedLastPart: "Samin",
            titleRank: "Co-Founder & CEO",
            subtitleTag: "02 // Executive Leadership",
            avatarSrc: "/images/team/kazi-mehedi-hasan-samin.jpg",
            hideGlobe: true,
            coreFocus: [
              "Scalable Web Platform Engineering",
              "Node.js, Express & REST APIs",
              "Cloud Deployment & CI/CD",
              "Cross-Functional Product Execution",
            ],
          }}
          delay={0.1}
        />
      </div>

      {/* Compact Founder-Led Studio Assurance Strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="mt-5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shrink-0">
            <Terminal size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-[13px] font-bold text-[var(--text-primary)]">
              Lean Two-Founder Engineering Studio
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              No account managers or layers of delegation—every architecture
              decision, commit, and deployment is handled directly by us.
            </p>
          </div>
        </div>
        <span
          style={{
            width: "fit-content",
            padding: "3px 10px",
            fontSize: "9.5px",
            lineHeight: 1.15,
          }}
          className="self-start sm:self-center inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider rounded-full bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 shrink-0 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>2 Active Builders</span>
        </span>
      </motion.div>
    </section>
  );
}