import type { Metadata } from "next";
import { ContactSettings } from "@/lib/api";
import {
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  X,
  ArrowRight,
  ChevronDown,
  Moon,
  Clock,
  ExternalLink,
  Headphones,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Hub Visual QA — DevCore Solutions",
  robots: { index: false, follow: false },
};

const BASE_SETTINGS: ContactSettings = {
  whatsappNumber: "8801700000000",
  phone: "+880 1700 000000",
  email: "solutions@devcoresolutions.com",
  businessHoursStart: 9,
  businessHoursEnd: 18,
  timezone: "Asia/Dhaka",
  callbackPromise: "We reply within 1 business hour",
  bookingUrl: "https://cal.com/devcore-solutions/discovery",
  isOpenNow: true,
};

function StaticHubPanel({ settings }: { settings: ContactSettings }) {
  const { whatsappNumber, phone, email, isOpenNow, bookingUrl } = settings;

  return (
    <div className="w-[360px] rounded-2xl devcore-glass-card shadow-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-xs flex flex-col overflow-hidden">
      {/* Top Specular Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent opacity-80" />

      {/* Header */}
      <div className="p-4 pb-3 border-b border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--brand-primary)] text-[var(--brand-contrast)] flex items-center justify-center">
              <Headphones size={14} />
            </div>
            <h2 className="font-display font-bold text-sm text-[var(--text-primary)]">
              DevCore Contact Hub
            </h2>
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 pt-0.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isOpenNow ? "bg-[var(--success)] animate-pulse" : "bg-[var(--warning)]"
            }`}
          />
          <span
            className={`font-mono text-[11px] font-semibold tracking-wide ${
              isOpenNow ? "text-[var(--success)]" : "text-[var(--warning)]"
            }`}
          >
            {isOpenNow ? "Engineering Staff: Online Now" : "Engineering Staff: After Hours"}
          </span>
        </div>

        {/* After-Hours Notice Banner */}
        {!isOpenNow && (
          <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] font-sans text-[11.5px] leading-relaxed flex items-start gap-2 border border-[var(--border-subtle)]">
            <Moon size={14} className="text-[var(--warning)] shrink-0 mt-0.5" />
            <span>
              Office is currently offline. We reply next business day by <strong>09:00 BST</strong> (guaranteed).
            </span>
          </div>
        )}
      </div>

      {/* 4 Interactive Channel Rows */}
      <div className="p-3.5 space-y-2 max-h-[380px] overflow-y-auto">
        {/* WhatsApp */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center shrink-0">
              <MessageCircle size={17} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[var(--text-primary)] block truncate">
                WhatsApp Direct Dispatch
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono truncate block">
                +{whatsappNumber} &bull; Instant chat
              </span>
            </div>
          </div>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </div>

        {/* Call */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              <Phone size={17} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[var(--text-primary)] block truncate">
                Direct Voice Line
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono truncate block">
                {phone} &bull; Direct triage
              </span>
            </div>
          </div>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </div>

        {/* Email */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              <Mail size={17} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[var(--text-primary)] block truncate">
                Secure Email Ingest
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono truncate block">
                {email}
              </span>
            </div>
          </div>
          <ArrowRight size={14} className="text-[var(--text-muted)]" />
        </div>

        {/* Callback */}
        <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              <Clock size={17} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[var(--text-primary)] block truncate">
                Request a Callback
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate block">
                We call back within 1 business hour
              </span>
            </div>
          </div>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Footer */}
      {bookingUrl && (
        <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
          <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Book 30-min architecture screening</span>
            </div>
            <ExternalLink size={13} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactHubDevPreview() {
  return (
    <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <span className="font-mono text-xs text-[var(--brand-primary)] font-semibold uppercase tracking-wider">
          DEV PREVIEW ONLY
        </span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">
          Contact Hub Panel Variants
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Permanent visual QA test harness for both Online and After-Hours states.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Variant A: Online */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--success)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
            Variant A: Online (Business Hours)
          </h2>
          <StaticHubPanel settings={BASE_SETTINGS} />
        </div>

        {/* Variant B: After Hours */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--warning)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
            Variant B: After Hours (Offline Notice)
          </h2>
          <StaticHubPanel settings={{ ...BASE_SETTINGS, isOpenNow: false }} />
        </div>
      </div>
    </div>
  );
}
