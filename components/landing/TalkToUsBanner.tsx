import Link from "next/link";
import { Check, MessageCircle, Phone, Mail, Calendar } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { type ContactSettings } from "@/lib/api";

interface TalkToUsBannerProps {
  settings: ContactSettings;
}

export function TalkToUsBanner({ settings }: TalkToUsBannerProps) {
  const { whatsappNumber, phone, email } = settings;
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi DevCore, I'd like to start a project.")}`;

  const channels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      sublabel: "Instant Chat",
      href: waHref,
      external: true,
      iconColor: "var(--success)",
      iconBg: "var(--success)",
    },
    {
      icon: Phone,
      label: "Direct Call",
      sublabel: phone,
      href: `tel:${phone}`,
      external: false,
      iconColor: "var(--brand-primary)",
      iconBg: "var(--brand-primary)",
    },
    {
      icon: Mail,
      label: "Email Inquiries",
      sublabel: email.replace("solutions@", "solutions@"),
      href: `mailto:${email}`,
      external: false,
      iconColor: "var(--brand-primary)",
      iconBg: "var(--brand-primary)",
    },
    {
      icon: Calendar,
      label: "Request Callback",
      sublabel: "Pick a Slot",
      href: "/contact",
      external: false,
      iconColor: "var(--brand-contrast)",
      iconBg: "var(--brand-primary)",
      primary: true,
    },
  ];

  return (
    <section aria-labelledby="talkto-heading" className="px-4 sm:px-6 pb-24 max-w-7xl mx-auto w-full">
      <GlassCard className="p-8 lg:p-12 border border-[var(--border-subtle)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="devcore-glass-badge inline-flex items-center font-mono text-xs rounded-full px-3.5 py-1 text-[var(--accent-ink)]">
              DIRECT ARCHITECT ENGAGEMENT
            </div>
            <h2
              id="talkto-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight"
            >
              Ready to Solidify Your Digital Core?
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-xl">
              Talk directly with a Principal Solutions Engineer. We evaluate your system requirements, propose concrete milestones, and formulate execution roadmaps.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[var(--text-muted)]">
              {["Direct NDA signing", "No junior handoffs", "Fixed milestone pricing"].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <Check size={13} className="text-[var(--success)]" aria-hidden="true" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Channel grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const Tag = ch.external ? "a" : Link;
              const extraProps = ch.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <Tag
                  key={ch.label}
                  href={ch.href}
                  {...extraProps}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-3.5 group shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] ${
                    ch.primary
                      ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)]"
                      : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0"
                    style={{
                      backgroundColor: ch.primary ? "rgba(255,255,255,0.2)" : `${ch.iconBg}1A`,
                      color: ch.primary ? "var(--brand-contrast)" : ch.iconColor,
                    }}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{ch.label}</div>
                    <div
                      className="text-[11px] font-mono truncate max-w-[130px]"
                      style={{ opacity: ch.primary ? 0.85 : undefined, color: ch.primary ? undefined : "var(--text-muted)" }}
                    >
                      {ch.sublabel}
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
