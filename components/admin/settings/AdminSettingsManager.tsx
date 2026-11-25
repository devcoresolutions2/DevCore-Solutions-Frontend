"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Clock,
  Globe,
  Share2,
  Activity,
  Image as ImageIcon,
  Save,
  Undo2,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  apiGetAdminSettings,
  apiRunSettingsHealthCheck,
  apiUpdateAdminSettings,
} from "@/lib/api";

type SettingsTab = "hours" | "seo" | "social" | "integrations" | "brand";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const TIMEZONES = [
  "Asia/Dhaka",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
];

export default function AdminSettingsManager() {
  const [tab, setTab] = useState<SettingsTab>("hours");
  const [saved, setSaved] = useState<any>(null);
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [health, setHealth] = useState<{
    checkedAt: string;
    integrations: Array<{
      key: string;
      name: string;
      category: string;
      status: string;
      latencyMs: number | null;
      detail: string;
    }>;
  } | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const res = await apiGetAdminSettings();
      setSaved(res.settings);
      setDraft(structuredClone(res.settings));
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load settings." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const runHealthCheck = async () => {
    setCheckingHealth(true);
    try {
      const res = await apiRunSettingsHealthCheck();
      setHealth(res);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Health check failed." });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    if (tab === "integrations" && !health) {
      void runHealthCheck();
    }
  }, [tab, health]);

  const isDirty = saved && draft && JSON.stringify(saved) !== JSON.stringify(draft);

  const handleSave = async () => {
    setSaving(true);
    setBanner(null);
    try {
      const res = await apiUpdateAdminSettings(draft);
      setSaved(res.settings);
      setDraft(structuredClone(res.settings));
      setBanner({ type: "success", text: "Platform settings saved to PostgreSQL." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
        <div className="h-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
      </div>
    );
  }

  const businessHours = draft.businessHours || {};
  const seo = draft.seoDefaults || {};
  const brand = draft.brandAssets || {};
  const socialLinks: Array<{ platform: string; url: string; isEnabled: boolean }> = Array.isArray(
    draft.socialLinks,
  )
    ? draft.socialLinks
    : [];

  let localClock = "";
  try {
    localClock = new Intl.DateTimeFormat("en-GB", {
      timeZone: draft.timezone || "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    localClock = "--:--";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[var(--text-tertiary)] uppercase mb-1">
            Admin / Administration / Platform & Global Settings
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Platform & Organization Settings
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Configure contact channels, operating hours, SEO defaults, public social URLs, and integration health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!isDirty || saving}
            onClick={() => setDraft(structuredClone(saved))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] disabled:opacity-40"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Discard Changes
          </button>
          <button
            type="button"
            disabled={!isDirty || saving}
            onClick={() => void handleSave()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:opacity-90 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Settings Changes"}
          </button>
        </div>
      </div>

      {banner && (
        <div
          className={`rounded-2xl border p-3.5 text-xs flex items-center justify-between ${
            banner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
          }`}
        >
          <span>{banner.text}</span>
          <button type="button" onClick={() => setBanner(null)} className="underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* 5 Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-x-auto">
        {[
          { id: "hours", label: "Contact & Operating Hours", icon: Clock },
          { id: "seo", label: "SEO & Metadata Defaults", icon: Globe },
          { id: "social", label: "Public Social URLs", icon: Share2 },
          { id: "integrations", label: "Integrations Status", icon: Activity },
          { id: "brand", label: "Brand Assets & Identity", icon: ImageIcon },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as SettingsTab)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* SECTION A: Contact & Hours */}
      {tab === "hours" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                  Weekly Operating Schedule
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <select
                    value={draft.timezone || "Asia/Dhaka"}
                    onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    Local: {localClock}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {DAYS.map((day) => {
                  const row = businessHours[day] || { isOpen: false, start: "09:00", end: "18:00" };
                  return (
                    <div
                      key={day}
                      className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    >
                      <span className="capitalize font-medium w-24 text-[var(--text-primary)]">
                        {day}
                      </span>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(row.isOpen)}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              businessHours: {
                                ...businessHours,
                                [day]: { ...row, isOpen: e.target.checked },
                              },
                            })
                          }
                          className="accent-[var(--brand-primary)]"
                        />
                        <span>{row.isOpen ? "OPEN" : "CLOSED"}</span>
                      </label>
                      {row.isOpen ? (
                        <div className="flex items-center gap-2 font-mono">
                          <input
                            type="time"
                            value={row.start || "09:00"}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                businessHours: {
                                  ...businessHours,
                                  [day]: { ...row, start: e.target.value },
                                },
                              })
                            }
                            className="px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={row.end || "18:00"}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                businessHours: {
                                  ...businessHours,
                                  [day]: { ...row, end: e.target.value },
                                },
                              })
                            }
                            className="px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                          />
                        </div>
                      ) : (
                        <span className="text-[var(--text-tertiary)] italic">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Institutional Contact Channels
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">Public Email</label>
                  <input
                    type="email"
                    value={draft.publicEmail || ""}
                    onChange={(e) => setDraft({ ...draft, publicEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={draft.phone || ""}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={draft.whatsappNumber || ""}
                    onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1">Scheduling / Booking URL</label>
                  <input
                    type="url"
                    value={draft.bookingUrl || ""}
                    onChange={(e) => setDraft({ ...draft, bookingUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              After-Hours Routing Policy
            </h3>
            {[
              {
                id: "ON_CALL_WARNING",
                title: "Show After-Hours Warning",
                desc: "Displays after-hours SLA notice on contact forms when outside operating hours.",
              },
              {
                id: "NEXT_BUSINESS_DAY",
                title: "Standard Next-Business-Day Queue",
                desc: "Queues inbound inquiries for next open business window.",
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer"
              >
                <input
                  type="radio"
                  name="afterHoursPolicy"
                  checked={draft.afterHoursPolicy === opt.id}
                  onChange={() => setDraft({ ...draft, afterHoursPolicy: opt.id })}
                  className="mt-1 accent-[var(--brand-primary)]"
                />
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{opt.title}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SECTION B: SEO */}
      {tab === "seo" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4 text-xs">
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Global SEO & Metadata Defaults
            </h2>
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">Default Title</label>
              <input
                type="text"
                value={seo.defaultTitle || ""}
                onChange={(e) =>
                  setDraft({ ...draft, seoDefaults: { ...seo, defaultTitle: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">Default Meta Description</label>
              <textarea
                rows={3}
                value={seo.defaultDescription || ""}
                onChange={(e) =>
                  setDraft({ ...draft, seoDefaults: { ...seo, defaultDescription: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Canonical Base URL</label>
                <input
                  type="url"
                  value={seo.canonicalBaseUrl || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, seoDefaults: { ...seo, canonicalBaseUrl: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Open Graph Image URL</label>
                <input
                  type="url"
                  value={seo.ogImageUrl || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, seoDefaults: { ...seo, ogImageUrl: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3 text-xs">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">Search Preview</h3>
            <div className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-4 space-y-1.5">
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                {seo.canonicalBaseUrl || "https://devcoresolutions.com"}
              </div>
              <div className="text-sm font-semibold text-[var(--brand-primary)]">
                {seo.defaultTitle || "DevCore Solutions"}
              </div>
              <div className="text-xs text-[var(--text-secondary)] line-clamp-2">
                {seo.defaultDescription || "No default description configured."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: Public Social URLs */}
      {tab === "social" && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Public Website Social Links
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Displayed in public site footer and contact pages (separate from OAuth publishing).
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  socialLinks: [...socialLinks, { platform: "LinkedIn", url: "", isEnabled: true }],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
            >
              <Plus className="w-3.5 h-3.5" /> Add Social URL
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
              No public social links configured yet.
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              {socialLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                >
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => {
                      const next = [...socialLinks];
                      next[idx] = { ...link, platform: e.target.value };
                      setDraft({ ...draft, socialLinks: next });
                    }}
                    placeholder="Platform (e.g. LinkedIn)"
                    className="sm:w-40 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...socialLinks];
                      next[idx] = { ...link, url: e.target.value };
                      setDraft({ ...draft, socialLinks: next });
                    }}
                    placeholder="https://..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 px-2">
                    <input
                      type="checkbox"
                      checked={link.isEnabled !== false}
                      onChange={(e) => {
                        const next = [...socialLinks];
                        next[idx] = { ...link, isEnabled: e.target.checked };
                        setDraft({ ...draft, socialLinks: next });
                      }}
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = socialLinks.filter((_, i) => i !== idx);
                      setDraft({ ...draft, socialLinks: next });
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION D: Integrations Health */}
      {tab === "integrations" && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Live Infrastructure & Integration Health
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {health
                  ? `Last checked at ${new Date(health.checkedAt).toLocaleTimeString()} · Secrets stay server-side`
                  : "Probing backend services..."}
              </p>
            </div>
            <button
              type="button"
              disabled={checkingHealth}
              onClick={() => void runHealthCheck()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? "animate-spin" : ""}`} />
              Run Health Check
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {(health?.integrations || []).map((item) => (
              <div
                key={item.key}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-primary)]">{item.name}</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                      item.status === "HEALTHY" || item.status === "CONNECTED" || item.status === "CONFIGURED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : item.status === "NOT_CONFIGURED" || item.status === "DISCONNECTED"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">{item.detail}</div>
                {item.latencyMs !== null && (
                  <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                    Latency: {item.latencyMs}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION E: Brand Assets */}
      {tab === "brand" && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4 text-xs">
          <h2 className="font-semibold text-sm text-[var(--text-primary)]">
            Brand Identity & Logo URLs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">Organization Name</label>
              <input
                type="text"
                value={draft.organizationName || ""}
                onChange={(e) => setDraft({ ...draft, organizationName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">Logo Alt Text</label>
              <input
                type="text"
                value={brand.logoAlt || ""}
                onChange={(e) =>
                  setDraft({ ...draft, brandAssets: { ...brand, logoAlt: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
            </div>
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">Light Mode Logo URL</label>
              <input
                type="url"
                value={brand.logoLightUrl || ""}
                onChange={(e) =>
                  setDraft({ ...draft, brandAssets: { ...brand, logoLightUrl: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono"
              />
            </div>
            <div>
              <label className="block text-[var(--text-secondary)] mb-1">Dark Mode Logo URL</label>
              <input
                type="url"
                value={brand.logoDarkUrl || ""}
                onChange={(e) =>
                  setDraft({ ...draft, brandAssets: { ...brand, logoDarkUrl: e.target.value } })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
