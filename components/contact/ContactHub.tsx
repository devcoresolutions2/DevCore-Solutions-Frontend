"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle, Phone, Mail, Calendar, X, ArrowRight, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ContactSettings } from "@/lib/api";

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
  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { whatsappNumber, phone, email, isOpenNow } = settings;
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi DevCore, I'd like to discuss a project.")}`;
  const pageTitle = typeof document !== "undefined" ? document.title : "DevCore Solutions";

  // Auto-prompt after 20s, once per session (cookie dismiss)
  useEffect(() => {
    if (getCookie(COOKIE_KEY)) return;
    const timer = setTimeout(() => { setShowPrompt(true); }, PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Focus trap in panel
  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a,button,[tabindex]");
      focusable[0]?.focus();
    }
  }, [open]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    setCookie(COOKIE_KEY);
  };

  return (
    <aside
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      aria-label="Contact Hub"
    >
      {/* Prompt bubble */}
      {showPrompt && !open && (
        <div
          role="dialog"
          aria-label="Contact prompt"
          className={cn(
            "devcore-glass-card p-4 w-64 text-xs text-[var(--text-primary)]",
            "animate-text-reveal"
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="font-semibold text-[var(--text-primary)]">Talk to an engineer?</span>
            <button
              onClick={dismissPrompt}
              aria-label="Dismiss prompt"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Our team responds within minutes during business hours.
          </p>
          <button
            onClick={() => { setOpen(true); dismissPrompt(); }}
            className="mt-2 text-[var(--brand-primary)] font-semibold hover:underline flex items-center gap-1 focus-visible:outline-none"
          >
            Get in touch <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div
          id="contact-hub-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Contact Hub"
          className={cn(
            "devcore-glass-card p-4 w-72 text-xs",
            "animate-text-reveal"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-3">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isOpenNow ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                )}
                aria-hidden="true"
              />
              {isOpenNow ? "We're online" : "We reply next business day"}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close Contact Hub"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] rounded"
            >
              <X size={15} />
            </button>
          </div>

          <p className="text-[var(--text-muted)] leading-relaxed mb-3">
            Reach our engineering team via your preferred channel.
          </p>

          {/* Channels */}
          <div className="space-y-1.5">
            {/* WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl",
                "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
                "hover:border-[var(--brand-primary)] transition-colors",
                "text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)]">
                  <MessageCircle size={16} />
                </span>
                <span>
                  <span className="font-semibold block">WhatsApp</span>
                  <span className="text-[var(--text-muted)]">Instant chat</span>
                </span>
              </span>
              <ArrowRight size={13} className="text-[var(--text-muted)]" />
            </a>

            {/* Call */}
            <a
              href={`tel:${phone}`}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl",
                "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
                "hover:border-[var(--brand-primary)] transition-colors",
                "text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)]">
                  <Phone size={16} />
                </span>
                <span>
                  <span className="font-semibold block">Call</span>
                  <span className="text-[var(--text-muted)] font-mono">{phone}</span>
                </span>
              </span>
              <ArrowRight size={13} className="text-[var(--text-muted)]" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl",
                "bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
                "hover:border-[var(--brand-primary)] transition-colors",
                "text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)]">
                  <Mail size={16} />
                </span>
                <span>
                  <span className="font-semibold block">Email</span>
                  <span className="text-[var(--text-muted)] font-mono truncate max-w-[140px] block">{email}</span>
                </span>
              </span>
              <ArrowRight size={13} className="text-[var(--text-muted)]" />
            </a>

            {/* Request Callback */}
            <a
              href="/contact"
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl",
                "bg-[var(--brand-primary)] border border-[var(--brand-primary)]",
                "hover:bg-[var(--brand-hover)] transition-colors",
                "text-[var(--brand-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar size={16} />
                </span>
                <span>
                  <span className="font-semibold block">Request a Callback</span>
                  <span className="opacity-80">Pick a slot</span>
                </span>
              </span>
              <ArrowRight size={13} className="opacity-70" />
            </a>
          </div>
        </div>
      )}

      {/* FAB trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => { setOpen(!open); if (showPrompt) dismissPrompt(); }}
        aria-label={open ? "Close Contact Hub" : "Open Contact Hub"}
        aria-expanded={open}
        aria-controls="contact-hub-panel"
        className={cn(
          "relative w-14 h-14 rounded-full",
          "bg-[var(--brand-primary)] text-[var(--brand-contrast)]",
          "flex items-center justify-center",
          "shadow-lg hover:bg-[var(--brand-hover)] hover:scale-105",
          "transition-all duration-250",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
          "border border-white/30"
        )}
      >
        {open ? (
          <ChevronDown size={22} aria-hidden="true" />
        ) : (
          <MessageCircle size={22} aria-hidden="true" />
        )}
        {/* Online dot */}
        <span
          className={cn(
            "absolute top-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--brand-contrast)]",
            isOpenNow ? "bg-[var(--success)]" : "bg-[var(--warning)]"
          )}
          aria-hidden="true"
        />
      </button>
    </aside>
  );
}
