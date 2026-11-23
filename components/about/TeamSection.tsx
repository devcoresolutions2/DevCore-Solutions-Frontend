"use client";

import Image from "next/image";
import { Globe, User } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { TeamMemberItem } from "@/lib/mock/data";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

interface TeamSectionProps {
  members: TeamMemberItem[];
}

export function TeamSection({ members }: TeamSectionProps) {
  if (!members || members.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col gap-2 mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-semibold">
          ARCHITECTURAL AUTHORITY
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)]">
          Meet the People Behind DEVCORE
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          DevCore is governed and engineered by experienced full-stack engineers and distributed systems builders dedicated to deterministic craft.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const initials =
            member.initials ||
            member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 3)
              .toUpperCase();

          return (
            <GlassCard
              key={member.id}
              className="p-6 flex flex-col justify-between hover:border-[var(--brand-primary)]/40 transition-all duration-300 group"
            >
              <div className="flex flex-col gap-4">
                {/* Avatar / Portrait Container */}
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* Elegant Initials Avatar */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg-surface)] to-[var(--bg-canvas)] select-none">
                      <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)]/40 flex items-center justify-center shadow-inner text-[var(--brand-primary)] font-display font-black text-2xl tracking-wider">
                        {initials}
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] mt-2 uppercase tracking-widest">
                        Verified Member
                      </span>
                    </div>
                  )}

                  {member.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-subtle)] shadow-xs">
                      <span className="text-[10px] font-mono font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                        {member.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Identity & Role */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                    {member.name}
                  </h3>
                  <span className="text-xs sm:text-sm font-medium text-[var(--brand-primary)] font-mono">
                    {member.role}
                  </span>
                </div>

                {/* Biography */}
                {member.bio && (
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Social Links Footer */}
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} LinkedIn`}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-white hover:border-[var(--brand-primary)]/40 transition-colors"
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} GitHub`}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-white hover:border-[var(--brand-primary)]/40 transition-colors"
                    >
                      <GitHubIcon />
                    </a>
                  )}
                  {member.portfolioUrl && (
                    <a
                      href={member.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} Portfolio`}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-white hover:border-[var(--brand-primary)]/40 transition-colors"
                    >
                      <Globe size={14} />
                    </a>
                  )}
                </div>

                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {member.isFeatured ? "Leadership" : "Core Guild"}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
