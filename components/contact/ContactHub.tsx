"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  CheckCircle2,
  ExternalLink,
  Loader2,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ContactSettings, submitLead, beaconContactEvent } from "@/lib/api";
import { useContactHub } from "./ContactHubContext";

interface ContactHubProps {
  settings: ContactSettings;
}

const COOKIE_KEY = "devcore_hub_dismissed";
const PROMPT_DELAY_MS = 20_000;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find((r) => r.startsWith(`${name}=`)) ?? null;
}

function setCookie(name: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=1; expires=${expires}; path=/; SameSite=Lax`;
}

export function ContactHub({ settings }: ContactHubProps) {
  const pathname = usePathname();

  // Context hook or fallback state
  let hubContext: ReturnType<typeof useContactHub> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    hubContext = useContactHub();
  } catch {
    hubContext = null;
  }

  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = hubContext ? hubContext.isOpen : localOpen;
  const setIsOpen = hubContext
    ? (val: boolean) => (val ? hubContext!.openHub() : hubContext!.closeHub())
    : setLocalOpen;

  const [showPrompt, setShowPrompt] = useState(false);
  const [callbackExpanded, setCallbackExpanded] = useState(false);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    whatsappNumber,
    phone,
    email,
    isOpenNow,
    bookingUrl,
    callbackPromise = "We reply within 1 business hour",
  } = settings;

  const isExcludedRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/dev");

  const isContactPage = pathname === "/contact" || pathname?.startsWith("/contact/");

  // Auto-prompt after 20s, skipped on /contact, /auth, /admin
  useEffect(() => {
    if (isExcludedRoute || isContactPage) return;
    if (getCookie(COOKIE_KEY)) return;
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isExcludedRoute, isContactPage]);

  // Trap Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, setIsOpen]);

  // Focus trap inside panel when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])"
      );
      focusable[0]?.focus();
    }
  }, [isOpen]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    setCookie(COOKIE_KEY);
  };

  const handleChannelClick = (type: string) => {
    beaconContactEvent(type, typeof window !== "undefined" ? window.location.href : "/contact");
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
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
      setCallbackSuccess(true);
      toast.success(callbackPromise || "Thanks! We will call you back within 1 business hour.");
    } catch {
      toast.error("Could not schedule callback. Please contact us on WhatsApp.");
    } finally {
      setCallbackSubmitting(false);
    }
  };

  if (isExcludedRoute) return null;

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi DevCore Solutions, I would like to discuss an engineering project."
  )}`;

  return (
    <>
      {/* Soft Modal Scrim (light frosted context) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className="fixed bottom-6 right-6 sm:right-8 z-50 flex flex-col items-end gap-3"
        aria-label="DevCore Contact Hub"
      >
        {/* Proactive 20-second Prompt Bubble */}
        {showPrompt && !isOpen && (
          <div
            role="dialog"
            aria-label="Contact assistance prompt"
            className="devcore-glass-card p-4 w-72 text-xs text-[var(--text-primary)] animate-scaleUp shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-bold text-[var(--text-primary)]">
                Have an engineering question?
              </span>
              <button
                type="button"
                onClick={dismissPrompt}
                aria-label="Dismiss prompt"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded focus-visible:outline-none"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Our systems architects respond promptly during business hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                dismissPrompt();
              }}
              className="mt-2.5 text-xs font-semibold text-[var(--brand-primary)] hover:underline flex items-center gap-1 focus-visible:outline-none"
            >
              <span>Open contact channels</span>
              <ArrowRight size={12} />
            </button>
          </div>
        )}

        {/* Opened Contact Hub Panel */}
        {isOpen && (
          <div
            id="contact-hub-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="DevCore Contact Hub Options"
            className={cn(
              "w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl devcore-glass-card shadow-2xl border border-[var(--border-strong)]",
              "bg-[var(--bg-elevated)] text-xs flex flex-col overflow-hidden animate-scaleUp"
            )}
          >
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
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Contact Hub"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isOpenNow ? "bg-[var(--success)] animate-pulse" : "bg-[var(--warning)]"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "font-mono text-[11px] font-semibold tracking-wide",
                    isOpenNow ? "text-[var(--success)]" : "text-[var(--warning)]"
                  )}
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

            {/* Interactive Channel Rows */}
            <div className="p-3.5 space-y-2 max-h-[380px] overflow-y-auto">
              {/* 1. WhatsApp Direct Dispatch */}
              {whatsappNumber && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleChannelClick("whatsapp")}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                  <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </a>
              )}

              {/* 2. Direct Engineering Line */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  onClick={() => handleChannelClick("phone")}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                  <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </a>
              )}

              {/* 3. Secure Email Ingest */}
              {email && (
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent("Technical Project Inquiry")}`}
                  onClick={() => handleChannelClick("email")}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                  <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </a>
              )}

              {/* 4. Request a Callback (Expands inline form) */}
              <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setCallbackExpanded((prev) => !prev)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-[var(--border-subtle)]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                      <Clock size={17} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[var(--text-primary)] block truncate">
                        Request a Callback
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] truncate block">
                        {callbackSuccess
                          ? "Requested successfully!"
                          : "We call back within 1 business hour"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-[var(--text-muted)] transition-transform duration-200 shrink-0 ml-1",
                      callbackExpanded && "rotate-180"
                    )}
                  />
                </button>

                {callbackExpanded && (
                  <div className="p-3 pt-1 border-t border-[var(--border-subtle)] space-y-2 bg-[var(--bg-elevated)]/60">
                    {callbackSuccess ? (
                      <div className="p-2.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)] flex items-center gap-2 text-xs font-medium">
                        <CheckCircle2 size={16} />
                        <span>Callback queued! We will reach out shortly.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleCallbackSubmit} className="space-y-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={callbackName}
                          onChange={(e) => setCallbackName(e.target.value)}
                          required
                          className="w-full h-8 px-2.5 rounded text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="Phone / WhatsApp"
                            value={callbackPhone}
                            onChange={(e) => setCallbackPhone(e.target.value)}
                            required
                            className="flex-1 h-8 px-2.5 rounded text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                          />
                          <button
                            type="submit"
                            disabled={callbackSubmitting}
                            className="h-8 px-3 rounded bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
                          >
                            {callbackSubmitting ? <Loader2 size={12} className="animate-spin" /> : "Request"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Section */}
            {bookingUrl && (
              <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] space-y-2">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-all shadow-sm font-semibold text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Book 30-min architecture screening</span>
                  </div>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        )}

        {/* 56px Round Floating Hub Trigger Button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (showPrompt) dismissPrompt();
          }}
          aria-label={isOpen ? "Close Contact Hub" : "Open DevCore Contact Hub"}
          aria-expanded={isOpen}
          aria-controls="contact-hub-panel"
          className={cn(
            "relative w-14 h-14 rounded-full shadow-2xl transition-all duration-200",
            "bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] hover:scale-105",
            "flex items-center justify-center border border-[var(--border-strong)]/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          )}
        >
          {isOpen ? (
            <ChevronDown size={24} aria-hidden="true" />
          ) : (
            <MessageCircle size={22} aria-hidden="true" />
          )}

          {/* Online/Warning Status Pip */}
          <span
            className={cn(
              "absolute top-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-elevated)]",
              isOpenNow ? "bg-[var(--success)]" : "bg-[var(--warning)]"
            )}
            aria-hidden="true"
          />
        </button>
      </aside>
    </>
  );
}
