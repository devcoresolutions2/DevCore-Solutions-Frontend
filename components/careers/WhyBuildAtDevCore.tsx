import { GitBranch, Code, Clock, Terminal, Boxes, Zap } from "lucide-react";

export function WhyBuildAtDevCore() {
  const pillars = [
    {
      number: "01",
      icon: <GitBranch size={22} className="text-[var(--brand-primary)]" />,
      title: "Direct Technical Ownership",
      description:
        "Direct architect-to-client collaboration. You own your technical implementations end-to-end without layers of translation, artificial bureaucracy, or diluted requirements.",
      tag: "SPEC_DRIVEN: TRUE",
      footerIcon: <Terminal size={15} />,
    },
    {
      number: "02",
      icon: <Code size={22} className="text-[var(--brand-primary)]" />,
      title: "Modern Engineering Stack",
      description:
        "We build exclusively with contemporary, robust tooling: TypeScript, Next.js, Go, Python, pgvector, and Prisma. We value determinism, performance, and maintainability.",
      tag: "TECH_STACK: MODERN",
      footerIcon: <Boxes size={15} />,
    },
    {
      number: "03",
      icon: <Clock size={22} className="text-[var(--brand-primary)]" />,
      title: "Protected Deep Work",
      description:
        "We prioritize uninterrupted maker time over constant meetings. Asynchronous updates and thorough written documentation ensure you can focus on building.",
      tag: "ASYNC_WORKFLOW: ACTIVE",
      footerIcon: <Zap size={15} />,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider font-bold">
            01 // Architectural Culture
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold tracking-tight mt-1">
            Why Build at DevCore
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
          A high-signal engineering culture focused on craft, clean execution, and zero organizational friction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl devcore-glass-card p-6 sm:p-8 border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 shadow-sm flex flex-col justify-between hover:border-[var(--border-strong)] transition-all group"
          >
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="font-display text-lg text-[var(--text-primary)] font-bold">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[var(--text-muted)] font-mono text-[11px]">
              <span className="font-semibold text-[var(--brand-primary)]">{pillar.tag}</span>
              <span>{pillar.footerIcon}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
