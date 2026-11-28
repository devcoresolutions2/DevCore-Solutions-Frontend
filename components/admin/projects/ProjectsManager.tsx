"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Rocket,
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe,
  BarChart3,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiListAdminShowcase,
  apiCreateAdminShowcase,
  apiDeleteAdminShowcase,
  apiListAdminProjects,
  apiCreateAdminProject,
  apiDeleteAdminProject,
  apiUploadAdminProjectCoverImage,
} from "@/lib/api";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";
import { cn } from "@/lib/utils";

interface MetricPair {
  label: string;
  value: string;
}

const CATEGORIES = ["SaaS", "Enterprise Web", "E-Commerce", "AI Automation", "Mobile", "Other"];
const BADGES = ["FLAGSHIP", "NEW", "BETA", "UPDATED"];

export function ProjectsManager() {
  const [launches, setLaunches] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"all" | "launches" | "portfolio">("all");
  const [search, setSearch] = useState("");

  // Add Project / Launch Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Publish targets
  const [publishToLaunches, setPublishToLaunches] = useState(true);
  const [publishToPortfolio, setPublishToPortfolio] = useState(true);
  const [featuredOnHome, setFeaturedOnHome] = useState(true);

  // Section 01: Core Identity
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("SaaS");
  const [badge, setBadge] = useState("FLAGSHIP");
  const [launchDate, setLaunchDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [liveUrl, setLiveUrl] = useState("");
  const [coverImage, setCoverImage] = useState("/images/dinedesk-cover.jpg");

  // Section 02: Narrative & Case Study
  const [description, setDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");

  // Section 03: Stack & Features
  const [techStackInput, setTechStackInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");

  // Section 04: Impact Metrics
  const [metrics, setMetrics] = useState<MetricPair[]>([
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ]);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "launch" | "project";
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const [scRes, prRes] = await Promise.all([
        apiListAdminShowcase().catch(() => ({ items: [] })),
        apiListAdminProjects().catch(() => ({ items: [] })),
      ]);
      setLaunches(scRes.items || []);
      setProjects(prRes.items || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load projects and launches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const resetForm = () => {
    setPublishToLaunches(true);
    setPublishToPortfolio(true);
    setFeaturedOnHome(true);
    setName("");
    setTagline("");
    setCategory("SaaS");
    setBadge("FLAGSHIP");
    setLaunchDate(new Date().toISOString().slice(0, 10));
    setLiveUrl("");
    setCoverImage("/images/dinedesk-cover.jpg");
    setDescription("");
    setChallenge("");
    setSolution("");
    setTechStackInput("");
    setFeaturesInput("");
    setMetrics([
      { label: "", value: "" },
      { label: "", value: "" },
      { label: "", value: "" },
    ]);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !tagline.trim()) {
      toast.error("Project name and tagline are required.");
      return;
    }
    if (!publishToLaunches && !publishToPortfolio) {
      toast.error("Select at least one publish destination (Launches or Portfolio).");
      return;
    }

    const baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const techTags = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const featureList = featuresInput
      .split(/\n+/)
      .map((f) => f.trim())
      .filter(Boolean);
    const cleanMetrics = metrics
      .map((m) => ({ label: m.label.trim(), value: m.value.trim() }))
      .filter((m) => m.label && m.value);

    setSaving(true);
    try {
      const tasks: Promise<unknown>[] = [];

      if (publishToPortfolio) {
        tasks.push(
          apiCreateAdminProject({
            title: name.trim(),
            slug: baseSlug,
            summary: tagline.trim(),
            category,
            techStack: techTags,
            challenge: challenge.trim() || description.trim() || tagline.trim(),
            solution: solution.trim() || description.trim() || tagline.trim(),
            features: featureList,
            metrics: cleanMetrics,
            liveUrl: liveUrl.trim() || undefined,
            coverImage: coverImage.trim() || "/images/dinedesk-cover.jpg",
          })
        );
      }

      if (publishToLaunches) {
        tasks.push(
          apiCreateAdminShowcase({
            name: name.trim(),
            slug: baseSlug,
            tagline: tagline.trim(),
            description: description.trim() || tagline.trim(),
            category,
            badge,
            launchDate,
            techStack: techTags,
            metrics: cleanMetrics,
            liveUrl: liveUrl.trim() || undefined,
            coverImage: coverImage.trim() || "/images/dinedesk-cover.jpg",
            caseStudySlug: baseSlug,
            featuredOnHome,
          })
        );
      }

      await Promise.all(tasks);
      setModalOpen(false);
      resetForm();
      await loadAll();
      toast.success(`"${name.trim()}" published to PostgreSQL & live site!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to publish project.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.kind === "launch") {
        await apiDeleteAdminShowcase(deleteTarget.id);
      } else {
        await apiDeleteAdminProject(deleteTarget.id);
      }
      setDeleteTarget(null);
      await loadAll();
      toast.success(`Deleted "${deleteTarget.title}".`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete item.");
    } finally {
      setDeleting(false);
    }
  };

  const q = search.trim().toLowerCase();
  const filteredLaunches = launches.filter(
    (l) =>
      !q ||
      l.name?.toLowerCase().includes(q) ||
      l.tagline?.toLowerCase().includes(q) ||
      l.slug?.toLowerCase().includes(q)
  );
  const filteredProjects = projects.filter(
    (p) =>
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.summary?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand-primary)] font-bold">
            Product Showcase &amp; Case Studies
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-0.5">
            Projects &amp; Launches Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Publish completed projects directly to Home (New Launches), /launches, and /projects (Portfolio).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => void loadAll()}
            className="h-9 px-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium inline-flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={cn(loading && "animate-spin")} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} />
            <span>Add Completed Project</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
              Launches (Home &amp; /launches)
            </span>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {launches.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] flex items-center justify-center">
            <Rocket size={18} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
              Portfolio Case Studies (/projects)
            </span>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {projects.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/12 text-emerald-500 flex items-center justify-center">
            <FolderGit2 size={18} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
              Featured on Home Page
            </span>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
              {launches.filter((l) => l.featuredOnHome).length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/12 text-amber-500 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] w-fit">
          {[
            { id: "all", label: `All (${launches.length + projects.length})` },
            { id: "launches", label: `Launches (${launches.length})` },
            { id: "portfolio", label: `Portfolio (${projects.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveView(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeView === tab.id
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or launches..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
        </div>
      </div>

      {/* Launches Section */}
      {(activeView === "all" || activeView === "launches") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
              <Rocket size={16} className="text-[var(--brand-primary)]" />
              <span>Launches &amp; Home Showcase ({filteredLaunches.length})</span>
            </h2>
            <Link
              href="/launches"
              target="_blank"
              className="text-xs font-mono text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>View /launches</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {filteredLaunches.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]">
              No launches found. Click &ldquo;Add Completed Project&rdquo; to publish one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLaunches.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shrink-0">
                      <img
                        src={item.coverImageUrl || "/images/dinedesk-cover.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] font-mono text-[10px] font-bold">
                          {item.featuredOnHome ? "FLAGSHIP • HOME" : item.badge}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] truncate mt-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(item.techTags) && item.techTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.techTags.slice(0, 5).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/launches/${item.slug}`}
                        target="_blank"
                        className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-primary)] font-medium inline-flex items-center gap-1"
                      >
                        <span>View Launch</span>
                        <ExternalLink size={11} />
                      </Link>
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1"
                        >
                          <Globe size={11} />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ kind: "launch", id: item.id, title: item.name })
                      }
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Launch"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Portfolio Projects Section */}
      {(activeView === "all" || activeView === "portfolio") && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2">
              <FolderGit2 size={16} className="text-emerald-500" />
              <span>Portfolio Case Studies ({filteredProjects.length})</span>
            </h2>
            <Link
              href="/projects"
              target="_blank"
              className="text-xs font-mono text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>View /projects</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]">
              No portfolio case studies found. Click &ldquo;Add Completed Project&rdquo; to publish one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shrink-0">
                      <img
                        src={proj.coverImageUrl || "/images/dinedesk-cover.jpg"}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                        CASE STUDY &bull; {proj.category}
                      </span>
                      <h3 className="font-bold text-sm text-[var(--text-primary)] truncate mt-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
                        {proj.summary}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(proj.techTags) && proj.techTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techTags.slice(0, 5).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-primary)] font-medium inline-flex items-center gap-1"
                    >
                      <span>View Case Study</span>
                      <ExternalLink size={11} />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ kind: "project", id: proj.id, title: proj.title })
                      }
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* DETAILED ADD COMPLETED PROJECT MODAL */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl">
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  Publish Completed Project &amp; Launch
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Add complete project details to display across Home, Launches, and Portfolio.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => void handlePublish(e)} className="p-6 space-y-6 text-xs">
              {/* Publish Destinations */}
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[var(--brand-primary)] block">
                  Publish Destinations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishToLaunches}
                      onChange={(e) => setPublishToLaunches(e.target.checked)}
                    />
                    <span className="font-semibold">Launches (/launches)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publishToPortfolio}
                      onChange={(e) => setPublishToPortfolio(e.target.checked)}
                    />
                    <span className="font-semibold">Portfolio (/projects)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featuredOnHome}
                      onChange={(e) => setFeaturedOnHome(e.target.checked)}
                    />
                    <span className="font-semibold">Feature on Home</span>
                  </label>
                </div>
              </div>

              {/* 01. Core Identity */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
                  <Layers size={14} className="text-[var(--brand-primary)]" />
                  <span>01. Core Identity &amp; Media</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold block">
                      Project Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DineDesk"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">
                      One-Line Tagline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multi-Vendor Restaurant Ordering & Table Reservation SaaS"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold block">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Badge</label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    >
                      {BADGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Launch Date</label>
                    <input
                      type="date"
                      value={launchDate}
                      onChange={(e) => setLaunchDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold block">Live Deployment URL</label>
                    <input
                      type="url"
                      placeholder="https://your-project.vercel.app"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-1.5">
                      <ImageIcon size={12} />
                      <span>Cover Image (Drag &amp; Drop, Upload, or URL)</span>
                    </label>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (!file) return;
                        setUploadingCover(true);
                        try {
                          const url = await apiUploadAdminProjectCoverImage(file);
                          setCoverImage(url);
                          toast.success("Cover image uploaded to Cloudinary!");
                        } catch (err: any) {
                          toast.error(err?.message || "Failed to upload cover image.");
                        } finally {
                          setUploadingCover(false);
                        }
                      }}
                    />

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => !uploadingCover && coverInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && !uploadingCover) {
                          e.preventDefault();
                          coverInputRef.current?.click();
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragActive(false);
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragActive(false);
                        const file = e.dataTransfer?.files?.[0];
                        if (!file) return;
                        setUploadingCover(true);
                        try {
                          const url = await apiUploadAdminProjectCoverImage(file);
                          setCoverImage(url);
                          toast.success("Cover image uploaded to Cloudinary!");
                        } catch (err: any) {
                          toast.error(err?.message || "Failed to upload cover image.");
                        } finally {
                          setUploadingCover(false);
                        }
                      }}
                      className={cn(
                        "rounded-xl border-2 border-dashed p-3 transition-colors cursor-pointer",
                        dragActive
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                          : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)]/60"
                      )}
                    >
                      {uploadingCover ? (
                        <div className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--text-secondary)]">
                          <Loader2 size={15} className="animate-spin text-[var(--brand-primary)]" />
                          <span>Uploading image to Cloudinary...</span>
                        </div>
                      ) : coverImage ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={coverImage}
                            alt="Cover preview"
                            className="w-16 h-11 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0 bg-[var(--bg-surface)]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-[var(--text-primary)] truncate">
                              Cover attached — click or drag a new file to replace
                            </p>
                            <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                              {coverImage}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCoverImage("");
                            }}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10"
                            title="Clear cover image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 py-1 text-xs text-[var(--text-secondary)]">
                          <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                            <UploadCloud size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">
                              Drag &amp; drop image here, or click to browse
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              Supports Chrome downloads drag, PNG/JPG/WebP up to 25 MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste URL: /images/dinedesk-cover.jpg or https://res.cloudinary.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 02. Executive Description & Case Study */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
                  <FolderGit2 size={14} className="text-[var(--brand-primary)]" />
                  <span>02. Technical Narrative &amp; Case Study</span>
                </h4>

                <div className="space-y-1">
                  <label className="font-semibold block">Executive Description (Shown on Launches &amp; Home)</label>
                  <textarea
                    rows={3}
                    placeholder="Full overview of the platform, target users, and business impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold block">Problem / Architectural Challenge</label>
                    <textarea
                      rows={3}
                      placeholder="What bottleneck or pain point did the client face?"
                      value={challenge}
                      onChange={(e) => setChallenge(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Engineered Solution</label>
                    <textarea
                      rows={3}
                      placeholder="How did DevCore architect and solve it?"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 03. Tech Stack & Key Deliverables */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-[var(--brand-primary)]" />
                  <span>03. Tech Stack &amp; Key Features</span>
                </h4>

                <div className="space-y-1">
                  <label className="font-semibold block">Tech Stack (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Next.js, React, Tailwind CSS, Node.js, PostgreSQL, Stripe SDK"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Key Implemented Features (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder={"Real-time order tracking & kitchen console\nStripe 1-click checkout & webhook settlement\nRole-based admin dashboard"}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] resize-none"
                  />
                </div>
              </div>

              {/* 04. Impact Metrics (3-card KPI row) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                  <h4 className="font-display font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <BarChart3 size={14} className="text-[var(--brand-primary)]" />
                    <span>04. Impact Metrics (KPI Cards)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setMetrics((prev) => [...prev, { label: "", value: "" }])}
                    className="text-[11px] font-semibold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Metric
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2 relative"
                    >
                      {metrics.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setMetrics((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-rose-500"
                          aria-label="Remove metric"
                        >
                          <X size={12} />
                        </button>
                      )}
                      <input
                        type="text"
                        placeholder="Label (e.g. Fee Saved)"
                        value={m.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMetrics((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, label: val } : item))
                          );
                        }}
                        className="w-full h-8 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 20–35%)"
                        value={m.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMetrics((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, value: val } : item))
                          );
                        }}
                        className="w-full h-8 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[var(--border-subtle)] font-semibold text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-6 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 size={14} />
                  <span>{saving ? "Publishing..." : "Publish Project & Launch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget?.kind === "launch" ? "Delete Launch" : "Delete Portfolio Project"}
        description={
          deleteTarget
            ? `Remove "${deleteTarget.title}" from the live site and database?`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
