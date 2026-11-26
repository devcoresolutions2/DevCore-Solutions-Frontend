"use client";

import React, { useState } from "react";
import { X, Copy, Check, ShieldAlert, Webhook } from "lucide-react";
import type { WebhookEndpointItem } from "@/lib/api";

interface WebhookModalProps {
  open: boolean;
  editing: WebhookEndpointItem | null;
  supportedEvents: string[];
  revealedSecret: string | null;
  onClose: () => void;
  onSubmit: (payload: { name: string; url: string; events: string[] }) => Promise<void>;
}

export default function WebhookModal({
  open,
  editing,
  supportedEvents,
  revealedSecret,
  onClose,
  onSubmit,
}: WebhookModalProps) {
  const [name, setName] = useState(editing?.name || "");
  const [url, setUrl] = useState(editing?.url || "");
  const [events, setEvents] = useState<string[]>(
    editing?.events || ["lead.created", "post.published"],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const toggleEvent = (ev: string) => {
    setEvents((prev) => (prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]));
  };

  const handleCopy = async () => {
    if (!revealedSecret) return;
    await navigator.clipboard.writeText(revealedSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), url: url.trim(), events });
    } catch (err: any) {
      setError(err?.message || "Failed to save webhook endpoint.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
              <Webhook className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                {revealedSecret
                  ? "Signing Secret Generated"
                  : editing
                    ? "Edit Webhook Endpoint"
                    : "Register Webhook Endpoint"}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                HMAC-SHA256 signed outbound deliveries with SSRF protection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {revealedSecret ? (
          <div className="p-5 space-y-4">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Copy this signing secret now. For security, it is encrypted with AES-256-GCM in
                the database and will never be shown again.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] break-all">
                {revealedSecret}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 space-y-4">
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Endpoint Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CRM Lead Sync or Slack Notifier"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Target HTTPS URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://hooks.example.com/devcore"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
              <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                Localhost, private IPs, and internal hosts are blocked by SSRF protection.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Subscribed Events
              </label>
              <div className="grid grid-cols-2 gap-2">
                {supportedEvents.map((ev) => {
                  const active = events.includes(ev);
                  return (
                    <button
                      key={ev}
                      type="button"
                      onClick={() => toggleEvent(ev)}
                      className={`px-2.5 py-2 rounded-xl border text-left font-mono text-[11px] transition-all ${
                        active
                          ? "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold"
                          : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {ev}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || events.length === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Endpoint"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
