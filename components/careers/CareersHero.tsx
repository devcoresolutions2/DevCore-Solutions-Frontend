import Link from "next/link";
import {
  Wallet,
  Laptop,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface CareersHeroProps {
  totalJobs: number;
}

export function CareersHero({ totalJobs }: CareersHeroProps) {
  return (
    <header className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Ambient Lighting Gradient */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[42rem] h-[18rem] bg-[var(--brand-primary)]/10 blur-[110px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-8">
        {/* Breadcrumb Bar & Release Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)]"
          >
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
              DEVCORE
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <span>CAREERS</span>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="text-[var(--text-primary)] font-semibold">OPEN ROLES</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            <span className="font-mono text-[11px] text-[var(--text-secondary)] font-semibold tracking-wider uppercase">
              Core Engineering Team &bull; Remote / Hybrid
            </span>
          </div>
        </div>

        {/* Main Headline & Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-1">
          <div className="lg:col-span-8 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand-primary)] font-bold">
              Engineering Disciplines &bull; Recruitment
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight font-extrabold max-w-3xl leading-[1.12]">
              Engineered for Builders: <br />
              <span className="text-[var(--brand-primary)]">Join DevCore Solutions</span>
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              We assemble focused engineering squads of systems practitioners who thrive in autonomous execution, clean specifications, and deterministic architectures.
            </p>
          </div>

          {/* Terminal Status Card */}
          <div className="lg:col-span-4 rounded-xl devcore-glass-card p-4 shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/85">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[var(--brand-primary)]" />
                <span className="font-mono text-xs text-[var(--text-primary)] font-bold">
                  GUILD_STATUS.v26
                </span>
              </div>
              <span className="font-mono text-[11px] text-[var(--success)] font-semibold">
                ACTIVE ROLES: {totalJobs}
              </span>
            </div>
            <div className="font-mono text-xs text-[var(--text-secondary)] space-y-1">
              <div>&gt; Autonomous engineering pods</div>
              <div>&gt; Direct client architect engagement</div>
              <div>&gt; Modern stack: Next.js, Go, Python, AI</div>
            </div>
          </div>
        </div>

        {/* KPI Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {/* 1. Compensation */}
          <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[var(--brand-primary)] mb-0.5">
              <Wallet size={18} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Compensation
              </span>
            </div>
            <span className="font-display text-sm font-bold text-[var(--text-primary)]">
              Competitive Base + Bonus
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              Performance incentives and direct project profit sharing
            </span>
          </div>

          {/* 2. Equipment */}
          <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[var(--brand-primary)] mb-0.5">
              <Laptop size={18} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Tooling & Hardware
              </span>
            </div>
            <span className="font-display text-sm font-bold text-[var(--text-primary)]">
              Modern Lab Setup
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              Top-tier hardware allowance and cloud development credits
            </span>
          </div>

          {/* 3. Autonomy */}
          <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[var(--brand-primary)] mb-0.5">
              <Calendar size={18} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Autonomy
              </span>
            </div>
            <span className="font-display text-sm font-bold text-[var(--text-primary)]">
              Flexible Schedule & PTO
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              Asynchronous workflows with protected deep work hours
            </span>
          </div>

          {/* 4. Leadership */}
          <div className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[var(--brand-primary)] mb-0.5">
              <ShieldCheck size={18} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Engineering Focus
              </span>
            </div>
            <span className="font-display text-sm font-bold text-[var(--text-primary)]">
              Zero Bureaucracy
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              Judged on technical output, clean PRs, and system reliability
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
