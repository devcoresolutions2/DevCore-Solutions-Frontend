"use client";

import { useState } from "react";
import { MessageCircle, Phone, Mail, Calendar, ArrowRight, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ContactSettings, submitLead, beaconContactEvent } from "@/lib/api";
import { BookingDialog } from "./BookingDialog";
import { cn } from "@/lib/utils";

interface QuickChannelsPanelProps {
  settings: ContactSettings;
  pageTitle?: string;
}

export function QuickChannelsPanel({ settings, pageTitle = "DevCore Solutions" }: QuickChannelsPanelProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  const {
    whatsappNumber,
    phone,
    email,
    isOpenNow,
    callbackPromise = "We reply within 1 business hour",
    bookingUrl,
    businessHoursStart = 9,
    businessHoursEnd = 18,
    timezone = "Asia/Dhaka",
  } = settings;

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi DevCore Solutions, I am inquiring regarding a software engineering project from ${pageTitle}.`
  )}`;

  const handleWhatsAppClick = () => {
    beaconContactEvent("whatsapp", typeof window !== "undefined" ? window.location.href : "/contact");
  };

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    beaconContactEvent("phone", typeof window !== "undefined" ? window.location.href : "/contact");
    // On desktop, copy to clipboard for convenience
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone);
        toast.success(`Phone number ${phone} copied to clipboard!`);
      }
    }
  };

  const handleEmailClick = () => {
    beaconContactEvent("email", typeof window !== "undefined" ? window.location.href : "/contact");
  };

  const handleQuickCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim()) {
      toast.error("Please enter both your name and phone number.");
      return;
    }

    try {
      setCallbackSubmitting(true);
      await submitLead({
        name: callbackName.trim(),
        phone: callbackPhone.trim(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "/contact",
        source: "QUICK_CALLBACK",
      });
      setCallbackSubmitted(true);
      toast.success(callbackPromise || "Thanks! We will call you back within 1 business hour.");
    } catch {
      toast.error("Could not schedule callback. Please reach out directly on WhatsApp.");
    } finally {
      setCallbackSubmitting(false);
    }
  };

  return (
    <aside className="space-y-6" aria-label="Direct channels and fast dispatch">
      <div className="devcore-glass-card rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Availability Header */}
        <div className="space-y-2 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Direct Engineering Vectors
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold",
                isOpenNow
                  ? "bg-[var(--success)]/15 text-[var(--success)]"
                  : "bg-[var(--warning)]/15 text-[var(--warning)]"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isOpenNow ? "bg-[var(--success)] animate-pulse" : "bg-[var(--warning)]"
                )}
                aria-hidden="true"
              />
              {isOpenNow ? "ONLINE NOW" : "AFTER HOURS"}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {isOpenNow
              ? "Principal engineers on standby during operational hours."
              : "Engineering office is offline. We reply next business day by 09:00 BST."}
          </p>
        </div>

        {/* Direct Channel Cards (only rendered when provided) */}
        {(whatsappNumber || phone || email) && (
          <div className="space-y-3">
            {/* WhatsApp */}
            {whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      WhatsApp Direct Line
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                      +{whatsappNumber}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </a>
            )}

            {/* Voice Phone */}
            {phone && (
              <a
                href={`tel:${phone}`}
                onClick={handlePhoneClick}
                className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      Direct Voice Line
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                      {phone}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </a>
            )}

            {/* Email */}
            {email && (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Project inquiry from devcore site")}`}
                onClick={handleEmailClick}
                className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      Engineering Ingest Email
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                      {email}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </a>
            )}
          </div>
        )}

        {/* Quick Callback Mini Form */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Urgent Callback Request
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--brand-primary)] font-semibold">
              Fast Track
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Enter your details; a systems engineer will establish a direct phone or WhatsApp call.
          </p>

          {callbackSubmitted ? (
            <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--success)]/40 flex items-center gap-2 text-xs text-[var(--success)] font-medium">
              <CheckCircle2 size={16} />
              <span>Callback requested. Our team will reach out shortly!</span>
            </div>
          ) : (
            <form onSubmit={handleQuickCallback} className="space-y-2">
              <input
                type="text"
                placeholder="Your Name"
                value={callbackName}
                onChange={(e) => setCallbackName(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-lg text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Your Phone / WhatsApp"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  required
                  className="flex-1 h-9 px-3 rounded-lg text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
                <button
                  type="submit"
                  disabled={callbackSubmitting}
                  className="h-9 px-3.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {callbackSubmitting ? "Queueing..." : "Request Call"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 30-Minute Architecture Screening / Calendly */}
        {bookingUrl && (
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--brand-primary)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  30-Min Architecture Screening
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded font-semibold">
                Live Slots
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Reserve a dedicated discovery block directly with our platform architects.
            </p>
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="w-full py-2.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={13} />
              <span>Open Dedicated Scheduler</span>
            </button>
          </div>
        )}

        {/* Operating Hours Note */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>Mon–Fri {businessHoursStart}:00 – {businessHoursEnd}:00 ({timezone})</span>
          </span>
          <span className="flex items-center gap-1 text-[var(--brand-primary)]">
            <ShieldCheck size={12} />
            <span>Direct Eng</span>
          </span>
        </div>
      </div>

      <BookingDialog
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        bookingUrl={bookingUrl}
      />
    </aside>
  );
}
