"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Download,
  Plus,
  BookOpen,
  MessageSquareQuote,
  Briefcase,
  Users,
  CheckCircle2,
  Trash2,
  X,
} from "lucide-react";
import {
  apiCreateAdminTestimonial,
  apiDeleteAdminTestimonial,
  apiGetContentOverview,
  apiListAdminTestimonials,
  apiUpdateAdminTestimonial,
  getContentCatalogExportUrl,
  type AdminTestimonialItem,
} from "@/lib/api";

export default function ContentManagementHub() {
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof apiGetContentOverview>> | null>(null);
  const [testimonials, setTestimonials] = useState<AdminTestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [ov, ts] = await Promise.all([
        apiGetContentOverview(),
        apiListAdminTestimonials(),
      ]);
      setOverview(ov);
      setTestimonials(ts.items);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load content overview." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiCreateAdminTestimonial({
        authorName: authorName.trim(),
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        quote: quote.trim(),
        status: "PENDING",
      });
      setModalOpen(false);
      setAuthorName("");
      setCompany("");
      setRole("");
      setQuote("");
      await loadAll();
      setBanner({ type: "success", text: "Testimonial saved to PostgreSQL." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to create testimonial." });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
          ))}
        </div>
        <div className="h-72 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]" />
      </div>
    );
  }

  const stats = overview?.stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Content & Editorial Operations
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage blog publications, client testimonials, job requisitions, and inbound applicants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getContentCatalogExportUrl()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Catalog (.json)
          </a>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Testimonial
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

      {/* 4 Real Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/dashboard?tab=blog"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[var(--border-strong)] transition-all"
          >
            <div className="flex justify-between text-xs font-mono uppercase text-[var(--text-tertiary)]">
              <span>Published Articles</span>
              <BookOpen className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.publishedArticles}</div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              {stats.draftArticles} in draft
            </div>
          </Link>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="flex justify-between text-xs font-mono uppercase text-[var(--text-tertiary)]">
              <span>Approved Testimonials</span>
              <MessageSquareQuote className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.approvedTestimonials}</div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
              {stats.pendingTestimonials} pending review
            </div>
          </div>
          <Link
            href="/admin/dashboard?tab=jobs"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[var(--border-strong)] transition-all"
          >
            <div className="flex justify-between text-xs font-mono uppercase text-[var(--text-tertiary)]">
              <span>Open Requisitions</span>
              <Briefcase className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.openJobs}</div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">Active on Careers</div>
          </Link>
          <Link
            href="/admin/dashboard?tab=applications"
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[var(--border-strong)] transition-all"
          >
            <div className="flex justify-between text-xs font-mono uppercase text-[var(--text-tertiary)]">
              <span>Pending Applicants</span>
              <Users className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div className="mt-2 text-2xl font-bold">{stats.pendingApplications}</div>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">Awaiting review</div>
          </Link>
        </div>
      )}

      {/* Testimonials Management + Right-Side Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Client Testimonials ({testimonials.length})
            </h2>
            <Link
              href="/admin/dashboard?tab=blog"
              className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
            >
              Open Blog CMS →
            </Link>
          </div>
          {testimonials.length === 0 ? (
            <div className="p-10 text-center text-xs text-[var(--text-secondary)]">
              No testimonials recorded yet. Click &quot;Add Testimonial&quot; to create one.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {t.authorName}
                      </span>
                      {t.company && (
                        <span className="text-[var(--text-tertiary)]">· {t.company}</span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                          t.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : t.status === "REJECTED"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {t.status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await apiUpdateAdminTestimonial(t.id, { status: "APPROVED" });
                          await loadAll();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        await apiDeleteAdminTestimonial(t.id);
                        await loadAll();
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Open Jobs & Recent Applicants */}
        <div className="xl:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">Open Requisitions</h3>
              <Link href="/admin/dashboard?tab=jobs" className="text-xs text-[var(--brand-primary)] hover:underline">
                Manage →
              </Link>
            </div>
            {(overview?.recentJobs || []).length === 0 ? (
              <div className="text-xs text-[var(--text-secondary)]">No open jobs.</div>
            ) : (
              <div className="space-y-2 text-xs">
                {overview!.recentJobs.slice(0, 4).map((j) => (
                  <div key={j.id} className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{j.title}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)]">{j.location}</div>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--brand-primary)] shrink-0">
                      {j._count.applications} apps
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">Candidate Pipeline</h3>
              <Link href="/admin/dashboard?tab=applications" className="text-xs text-[var(--brand-primary)] hover:underline">
                Inbox →
              </Link>
            </div>
            {(overview?.recentApplications || []).length === 0 ? (
              <div className="text-xs text-[var(--text-secondary)]">No applications submitted yet.</div>
            ) : (
              <div className="space-y-2 text-xs">
                {overview!.recentApplications.slice(0, 4).map((a) => (
                  <div key={a.id} className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-[11px] text-[var(--text-tertiary)]">
                      {a.job.title} · {a.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add Client Testimonial</h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={(e) => void handleCreateTestimonial(e)} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Client Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
              <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
              <input
                type="text"
                placeholder="Role / Title"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
              <textarea
                required
                rows={3}
                placeholder="Client Quote..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white font-semibold"
                >
                  {saving ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
