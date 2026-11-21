import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, MessageCircle, Phone, Mail, Clock, MapPin, ShieldCheck } from "lucide-react";
import { getContactSettings } from "@/lib/api";
import { QuickCallbackForm } from "@/components/contact/QuickCallbackForm";
import { GlassCard } from "@/components/glass/GlassCard";

export const metadata: Metadata = {
  title: "Contact & Technical Scoping — DevCore Solutions",
  description: "Direct engagement with DevCore principal software architects. Reach out via WhatsApp, phone, or schedule a technical review.",
};

interface ContactPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { project } = await searchParams;
  const settings = await getContactSettings();

  const waHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    project
      ? `Hello DevCore, I would like to discuss an engineering build similar to ${project}.`
      : "Hello DevCore, I would like to schedule an engineering scoping call."
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">Contact & Scoping</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="devcore-glass-badge inline-flex items-center font-mono text-xs rounded-full px-3.5 py-1 text-[var(--accent-ink)] mb-3">
              DIRECT ARCHITECT ENGAGEMENT
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              Start Your Engineering Engagement
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
              Have a high-scale platform to architect or critical infrastructure bottlenecks to resolve? Talk directly with our senior engineering staff.
            </p>
          </div>

          {/* Quick Channels */}
          <div className="space-y-3">
            {/* WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm bg-[var(--bg-elevated)]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">WhatsApp Direct Line</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">Instant response in business hours</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--success)]">&rarr;</span>
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${settings.phone}`}
              className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm bg-[var(--bg-elevated)]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">Direct Voice Line</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{settings.phone}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--brand-primary)]">&rarr;</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}`}
              className="p-4 rounded-xl devcore-glass-card border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm bg-[var(--bg-elevated)]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">Email Dispatch</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{settings.email}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--brand-primary)]">&rarr;</span>
            </a>
          </div>

          {/* Availability & Location Badge */}
          <GlassCard className="p-5 space-y-3 bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <Clock size={15} className="text-[var(--brand-primary)]" />
              <span>Business Hours: 09:00 — 18:00 ({settings.timezone})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <MapPin size={15} className="text-[var(--brand-primary)]" />
              <span>Dhaka & Chattogram Engineering Hubs, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
              <ShieldCheck size={15} className="text-[var(--success)]" />
              <span>All communications protected by Mutual Non-Disclosure Agreements</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <QuickCallbackForm initialProject={project} />
        </div>
      </div>
    </div>
  );
}
