import { CheckCircle2, MessageSquare, Code2, Award } from "lucide-react";

export function HiringProtocol() {
  const steps = [
    {
      step: "01 // REVIEW",
      title: "Code & Architecture Review",
      description:
        "We review your public GitHub repositories, written architecture documents, or past production projects. No artificial leetcode puzzles.",
      timing: "Within 48 Hours",
      icon: <CheckCircle2 size={18} className="text-[var(--brand-primary)]" />,
    },
    {
      step: "02 // DIALOGUE",
      title: "Technical Discussion",
      description:
        "A focused 60-minute peer-level discussion with a systems architect covering real-world constraints, state handling, and trade-offs.",
      timing: "60 Minutes",
      icon: <MessageSquare size={18} className="text-[var(--brand-primary)]" />,
    },
    {
      step: "03 // PAIRING",
      title: "Hands-on Practical Exercise",
      description:
        "Collaborate with the squad on a realistic, sanitized technical task directly aligned with the role's day-to-day work.",
      timing: "Collaborative Session",
      icon: <Code2 size={18} className="text-[var(--brand-primary)]" />,
    },
    {
      step: "04 // OFFER",
      title: "Formal Offer & Onboarding",
      description:
        "Clear terms, transparent compensation, immediate hardware allocation, and a direct roadmap for your first 30 days.",
      timing: "Deterministic Decision",
      icon: <Award size={18} className="text-[var(--brand-primary)]" />,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider font-bold">
          03 // Hiring Process
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold tracking-tight mt-1">
          Hiring Protocol Timeline
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xl leading-relaxed">
          Transparent, collaborative, and respectful of your time. Direct evaluation with active engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((item) => (
          <div
            key={item.step}
            className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold">
                  {item.step}
                </span>
                {item.icon}
              </div>
              <h4 className="font-display text-base font-bold text-[var(--text-primary)]">
                {item.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--brand-primary)] font-semibold">
              <span>{item.timing}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
