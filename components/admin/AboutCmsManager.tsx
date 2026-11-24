"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Check,
  Eye,
  EyeOff,
  User,
  Image as ImageIcon,
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Globe,
  MapPin,
  Clock,
  Radio,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  type AboutGeneralContent,
  type EngineeringPrincipleItem,
  type TeamMemberItem,
  getAboutContent,
  updateAboutContent,
  getEngineeringPrinciples,
  createEngineeringPrinciple,
  updateEngineeringPrinciple,
  deleteEngineeringPrinciple,
  reorderEngineeringPrinciples,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  uploadAvatar,
} from "@/lib/api";

type CmsSubSection =
  | "general"
  | "vision_mission"
  | "philosophy"
  | "principles"
  | "team"
  | "location"
  | "cta";

export function AboutCmsManager() {
  const [subSection, setSubSection] = useState<CmsSubSection>("team");
  const [loading, setLoading] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);

  // General content form state
  const [content, setContent] = useState<AboutGeneralContent | null>(null);

  // Principles state
  const [principles, setPrinciples] = useState<EngineeringPrincipleItem[]>([]);
  const [editingPrinciple, setEditingPrinciple] =
    useState<EngineeringPrincipleItem | null>(null);
  const [showPrincipleModal, setShowPrincipleModal] = useState(false);

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmations
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState<
    "principle" | "member" | null
  >(null);

  const loadAllCmsData = async () => {
    try {
      setLoading(true);
      const [fetchedContent, fetchedPrinciples, fetchedTeam] = await Promise.all([
        getAboutContent(),
        getEngineeringPrinciples(),
        getTeamMembers(),
      ]);
      setContent(fetchedContent);
      setPrinciples(fetchedPrinciples);
      setTeamMembers(fetchedTeam);
    } catch {
      toast.error("Failed to load About CMS content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCmsData();
  }, []);

  // Save General / Hero / Vision / Mission / Philosophy / Location / CTA
  const handleSaveContent = async () => {
    if (!content) return;
    try {
      setSavingGeneral(true);
      await updateAboutContent(content);
      toast.success("About page content saved successfully!");
    } catch {
      toast.error("Failed to save About page content.");
    } finally {
      setSavingGeneral(false);
    }
  };

  // Principles CRUD
  const handleSavePrinciple = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrinciple || !editingPrinciple.title.trim()) {
      toast.error("Please provide a title.");
      return;
    }

    try {
      if (editingPrinciple.id.startsWith("new-")) {
        const { id, ...payload } = editingPrinciple;
        const created = await createEngineeringPrinciple(payload);
        setPrinciples((prev) => [...prev, created]);
        toast.success(`Principle "${created.title}" added.`);
      } else {
        const updated = await updateEngineeringPrinciple(
          editingPrinciple.id,
          editingPrinciple
        );
        setPrinciples((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success(`Principle "${updated.title}" updated.`);
      }
      setShowPrincipleModal(false);
      setEditingPrinciple(null);
    } catch {
      toast.error("Failed to save principle.");
    }
  };

  const handleTogglePrinciplePublish = async (item: EngineeringPrincipleItem) => {
    const nextStatus = !item.isPublished;
    await updateEngineeringPrinciple(item.id, { isPublished: nextStatus });
    setPrinciples((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isPublished: nextStatus } : p))
    );
    toast.success(
      `Principle marked as ${nextStatus ? "PUBLISHED" : "UNPUBLISHED"}`
    );
  };

  const handleDeletePrinciple = async (id: string) => {
    await deleteEngineeringPrinciple(id);
    setPrinciples((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
    setConfirmDeleteType(null);
    toast.success("Principle deleted successfully.");
  };

  const handleMovePrinciple = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= principles.length) return;

    const copy = [...principles];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    setPrinciples(copy);
    await reorderEngineeringPrinciples(copy.map((p) => p.id));
    toast.success("Principles reordered.");
  };

  // Team CRUD
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name.trim() || !editingMember.role.trim()) {
      toast.error("Please fill in member name and role.");
      return;
    }

    try {
      if (editingMember.id.startsWith("new-")) {
        const { id, ...payload } = editingMember;
        const created = await createTeamMember(payload);
        setTeamMembers((prev) => [...prev, created]);
        toast.success(`Member "${created.name}" added.`);
      } else {
        const updated = await updateTeamMember(editingMember.id, editingMember);
        setTeamMembers((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
        toast.success(`Member "${updated.name}" updated.`);
      }
      setShowMemberModal(false);
      setEditingMember(null);
    } catch {
      toast.error("Failed to save team member.");
    }
  };

  const handleToggleMemberPublish = async (member: TeamMemberItem) => {
    const nextStatus = !member.isPublished;
    await updateTeamMember(member.id, { isPublished: nextStatus });
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isPublished: nextStatus } : m))
    );
    toast.success(
      `Member "${member.name}" marked as ${nextStatus ? "PUBLISHED" : "UNPUBLISHED"}`
    );
  };

  const handleDeleteMember = async (id: string) => {
    await deleteTeamMember(id);
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    setConfirmDeleteId(null);
    setConfirmDeleteType(null);
    toast.success("Team member deleted successfully.");
  };

  const handleMoveMember = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= teamMembers.length) return;

    const copy = [...teamMembers];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);

    setTeamMembers(copy);
    await reorderTeamMembers(copy.map((m) => m.id));
    toast.success("Team members reordered.");
  };

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image file must be under 4MB.");
      return;
    }

    try {
      const url = await uploadAvatar(file);
      if (editingMember) {
        setEditingMember({ ...editingMember, avatarUrl: url });
        toast.success("Photo loaded into preview. Click 'Save Member' to persist.");
      }
    } catch {
      toast.error("Failed to upload photo.");
    }
  };

  if (loading || !content) {
    return (
      <div className="p-12 text-center text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2">
        <RefreshCw size={15} className="animate-spin" />
        <span>Loading About Page content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-3 text-[13px]">
        <button
          type="button"
          onClick={() => setSubSection("team")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "team"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <User size={13} />
          <span>Team Members ({teamMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection("principles")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "principles"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Cpu size={13} />
          <span>Engineering Principles ({principles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection("general")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "general"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Terminal size={13} />
          <span>Hero & Dossier</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection("vision_mission")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "vision_mission"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Eye size={13} />
          <span>Vision & Mission</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection("philosophy")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "philosophy"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <ShieldCheck size={13} />
          <span>Core Philosophy</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection("location")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "location"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <MapPin size={13} />
          <span>Headquarters</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection("cta")}
          className={cn(
            "px-3 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5",
            subSection === "cta"
              ? "bg-[var(--brand-primary)] text-white shadow-xs"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Sparkles size={13} />
          <span>Bottom CTA</span>
        </button>
      </div>

      {/* ─── 1. TEAM MEMBERS MANAGEMENT ─── */}
      {subSection === "team" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Team Members Management
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Manage founders and core engineering fellows. Photo uploads automatically override initials avatars.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingMember({
                  id: `new-${Date.now()}`,
                  name: "",
                  role: "",
                  bio: "",
                  initials: "",
                  badge: "CORE GUILD",
                  isFeatured: false,
                  isPublished: true,
                  displayOrder: teamMembers.length + 1,
                  linkedinUrl: "",
                  githubUrl: "",
                  portfolioUrl: "",
                });
                setShowMemberModal(true);
              }}
              className="px-3.5 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Add Team Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, index) => {
              const initials =
                member.initials ||
                member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 3)
                  .toUpperCase();

              return (
                <div
                  key={member.id}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-4 bg-[var(--bg-surface)] hover:shadow-md",
                    member.isPublished
                      ? "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                      : "border-dashed border-[var(--border-strong)] opacity-65"
                  )}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar Preview */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 shrink-0 flex items-center justify-center">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-[var(--brand-primary)]">
                              {initials}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[15px] text-[var(--text-primary)] truncate">
                            {member.name}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "text-[11px] font-medium px-2 py-0.5 rounded-md border shrink-0",
                          member.isPublished
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border-[var(--border-subtle)]"
                        )}
                      >
                        {member.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {member.badge && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-canvas)] text-[var(--brand-primary)] border border-[var(--border-subtle)]">
                          {member.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-[var(--text-tertiary)]">
                        Display order #{member.displayOrder}
                      </span>
                    </div>

                    {member.bio && (
                      <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveMember(index, "up")}
                        disabled={index === 0}
                        aria-label="Move member up"
                        className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMember(index, "down")}
                        disabled={index === teamMembers.length - 1}
                        aria-label="Move member down"
                        className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleMemberPublish(member)}
                        aria-label="Toggle publish"
                        className={cn(
                          "p-1.5 rounded hover:bg-[var(--bg-elevated)] transition-colors",
                          member.isPublished
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-[var(--text-muted)]"
                        )}
                      >
                        {member.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMember({ ...member });
                          setShowMemberModal(true);
                        }}
                        className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDeleteId(member.id);
                          setConfirmDeleteType("member");
                        }}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-rose-500 hover:text-rose-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 2. ENGINEERING PRINCIPLES MANAGEMENT ─── */}
      {subSection === "principles" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Engineering Principles Management
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Configure deterministic engineering rules, invariants, and supporting code tags.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingPrinciple({
                  id: `new-${Date.now()}`,
                  orderIndex: principles.length + 1,
                  number: String(principles.length + 1).padStart(2, "0"),
                  title: "",
                  description: "",
                  icon: "cpu",
                  supportingLabel: "Invariant:",
                  supportingText: "",
                  isPublished: true,
                });
                setShowPrincipleModal(true);
              }}
              className="px-3.5 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Add Principle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((p, index) => (
              <div
                key={p.id}
                className={cn(
                  "p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3.5 bg-[var(--bg-surface)] hover:shadow-md",
                  p.isPublished
                    ? "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                    : "border-dashed border-[var(--border-strong)] opacity-65"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-[var(--brand-primary)]">
                      {p.number || `0${index + 1}`}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {p.icon}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {(p.supportingLabel || p.supportingText) && (
                  <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-tertiary)]">{p.supportingLabel}</span>
                    <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px]">
                      {p.supportingText}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMovePrinciple(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePrinciple(index, "down")}
                      disabled={index === principles.length - 1}
                      className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePrinciplePublish(p)}
                      className={cn(
                        "p-1.5 rounded hover:bg-[var(--bg-elevated)] transition-colors",
                        p.isPublished
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      {p.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPrinciple({ ...p });
                        setShowPrincipleModal(true);
                      }}
                      className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(p.id);
                        setConfirmDeleteType("principle");
                      }}
                      className="p-1.5 rounded hover:bg-rose-500/10 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. HERO & GENERAL CONTENT ─── */}
      {subSection === "general" && (
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 space-y-4 max-w-3xl">
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
            Hero & Architectural Dossier
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Hero Badge / Label
              </label>
              <input
                type="text"
                value={content.heroBadge}
                onChange={(e) => setContent({ ...content, heroBadge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Founding / Status Tag
              </label>
              <input
                type="text"
                value={content.foundingTag}
                onChange={(e) => setContent({ ...content, foundingTag: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Hero Introduction & Manifesto
            </label>
            <textarea
              rows={4}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)] leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveContent}
            disabled={savingGeneral}
            className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{savingGeneral ? "Saving..." : "Save Hero Content"}</span>
          </button>
        </div>
      )}

      {/* ─── 4. VISION & MISSION ─── */}
      {subSection === "vision_mission" && (
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 space-y-6 max-w-3xl">
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
            Vision & Mission Management
          </h2>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-[var(--brand-primary)]">
              Strategic Vision
            </h3>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Vision Heading
              </label>
              <input
                type="text"
                value={content.visionTitle}
                onChange={(e) => setContent({ ...content, visionTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={content.visionText}
                onChange={(e) => setContent({ ...content, visionText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)] leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
            <h3 className="font-semibold text-sm text-[var(--brand-primary)]">
              Execution Mission
            </h3>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Mission Heading
              </label>
              <input
                type="text"
                value={content.missionTitle}
                onChange={(e) => setContent({ ...content, missionTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={content.missionText}
                onChange={(e) => setContent({ ...content, missionText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)] leading-relaxed"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveContent}
            disabled={savingGeneral}
            className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{savingGeneral ? "Saving..." : "Save Vision & Mission"}</span>
          </button>
        </div>
      )}

      {/* ─── 5. CORE PHILOSOPHY ─── */}
      {subSection === "philosophy" && (
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 space-y-4 max-w-3xl">
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
            Core Philosophy Management
          </h2>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={content.philosophyTitle}
              onChange={(e) =>
                setContent({ ...content, philosophyTitle: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Philosophy Statement
            </label>
            <textarea
              rows={4}
              value={content.philosophyText}
              onChange={(e) =>
                setContent({ ...content, philosophyText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-hidden focus:border-[var(--brand-primary)] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">
              Key Metrics / Supporting Numbers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.philosophyStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2"
                >
                  <input
                    type="text"
                    placeholder="Stat Value (e.g. 100%)"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...content.philosophyStats];
                      updated[idx].value = e.target.value;
                      setContent({ ...content, philosophyStats: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]"
                  />
                  <input
                    type="text"
                    placeholder="Stat Label"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...content.philosophyStats];
                      updated[idx].label = e.target.value;
                      setContent({ ...content, philosophyStats: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveContent}
            disabled={savingGeneral}
            className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{savingGeneral ? "Saving..." : "Save Philosophy"}</span>
          </button>
        </div>
      )}

      {/* ─── 6. OPERATIONAL LOCATION ─── */}
      {subSection === "location" && (
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Operational Location & Topology
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Only verified locations are displayed. Toggle off if no public headquarters are published.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={content.locationEnabled}
                onChange={(e) =>
                  setContent({ ...content, locationEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-[var(--brand-primary)]"
              />
              <span className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                {content.locationEnabled ? "Location Active" : "Location Hidden"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Hub Name
              </label>
              <input
                type="text"
                value={content.locationName}
                onChange={(e) =>
                  setContent({ ...content, locationName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Timezone Identifier
              </label>
              <input
                type="text"
                value={content.locationTimezone}
                onChange={(e) =>
                  setContent({ ...content, locationTimezone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Physical / Operational Address
            </label>
            <input
              type="text"
              value={content.locationAddress}
              onChange={(e) =>
                setContent({ ...content, locationAddress: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Operational Status Pill
            </label>
            <input
              type="text"
              value={content.locationStatus}
              onChange={(e) =>
                setContent({ ...content, locationStatus: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveContent}
            disabled={savingGeneral}
            className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{savingGeneral ? "Saving..." : "Save Location Settings"}</span>
          </button>
        </div>
      )}

      {/* ─── 7. BOTTOM CTA ─── */}
      {subSection === "cta" && (
        <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 space-y-4 max-w-3xl">
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
            Bottom Call to Action Management
          </h2>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              CTA Heading
            </label>
            <input
              type="text"
              value={content.ctaTitle}
              onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              CTA Supporting Copy
            </label>
            <textarea
              rows={3}
              value={content.ctaSubtitle}
              onChange={(e) => setContent({ ...content, ctaSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Primary Button Text
              </label>
              <input
                type="text"
                value={content.ctaPrimaryText}
                onChange={(e) =>
                  setContent({ ...content, ctaPrimaryText: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Primary Button Destination URL
              </label>
              <input
                type="text"
                value={content.ctaPrimaryUrl}
                onChange={(e) =>
                  setContent({ ...content, ctaPrimaryUrl: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={content.ctaSecondaryText}
                onChange={(e) =>
                  setContent({ ...content, ctaSecondaryText: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                Secondary Button Destination URL
              </label>
              <input
                type="text"
                value={content.ctaSecondaryUrl}
                onChange={(e) =>
                  setContent({ ...content, ctaSecondaryUrl: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveContent}
            disabled={savingGeneral}
            className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save size={14} />
            <span>{savingGeneral ? "Saving..." : "Save CTA Settings"}</span>
          </button>
        </div>
      )}

      {/* ─── MODAL: EDIT / CREATE TEAM MEMBER ─── */}
      {showMemberModal && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                {editingMember.id.startsWith("new-")
                  ? "Add New Team Member"
                  : `Edit: ${editingMember.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMember(null);
                }}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* Photo Upload & Avatar Preview */}
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-strong)] flex items-center justify-center shrink-0">
                  {editingMember.avatarUrl ? (
                    <img
                      src={editingMember.avatarUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display font-black text-lg text-[var(--brand-primary)]">
                      {editingMember.initials || "DC"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    Profile Photo / Avatar
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Upload size={12} />
                      <span>{editingMember.avatarUrl ? "Replace Photo" : "Upload Photo"}</span>
                    </button>

                    {editingMember.avatarUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingMember({ ...editingMember, avatarUrl: undefined })
                        }
                        className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-500 hover:text-rose-600 text-[11px] font-medium transition-colors"
                      >
                        Remove (Restore Initials)
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    JPG/PNG/WEBP under 4MB. Reverts to initials avatar when removed.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const initials = name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 3)
                        .toUpperCase();
                      setEditingMember({
                        ...editingMember,
                        name,
                        initials: editingMember.initials || initials,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Initials (Max 3 letters)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={editingMember.initials}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        initials: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Badge Pill (e.g. FOUNDER)
                  </label>
                  <input
                    type="text"
                    value={editingMember.badge || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                  Biography / Technical Focus
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ""}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editingMember.linkedinUrl || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        linkedinUrl: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingMember.githubUrl || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        githubUrl: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Portfolio / Web
                  </label>
                  <input
                    type="url"
                    value={editingMember.portfolioUrl || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        portfolioUrl: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingMember.isPublished}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        isPublished: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[var(--brand-primary)]"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingMember.isFeatured}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[var(--brand-primary)]"
                  />
                  <span>Featured Leadership Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberModal(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-xs hover:bg-[var(--bg-surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] shadow-xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT / CREATE PRINCIPLE ─── */}
      {showPrincipleModal && editingPrinciple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                {editingPrinciple.id.startsWith("new-")
                  ? "Add Engineering Principle"
                  : `Edit: ${editingPrinciple.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowPrincipleModal(false);
                  setEditingPrinciple(null);
                }}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePrinciple} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Principle Number (e.g. 01)
                  </label>
                  <input
                    type="text"
                    value={editingPrinciple.number}
                    onChange={(e) =>
                      setEditingPrinciple({
                        ...editingPrinciple,
                        number: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Icon
                  </label>
                  <select
                    value={editingPrinciple.icon}
                    onChange={(e) =>
                      setEditingPrinciple({
                        ...editingPrinciple,
                        icon: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="cpu">CPU / Deterministic</option>
                    <option value="layers">Layers / Architecture</option>
                    <option value="eye">Eye / Transparency</option>
                    <option value="shield">Shield / Security</option>
                    <option value="terminal">Terminal / CLI</option>
                    <option value="code">Code / Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPrinciple.title}
                  onChange={(e) =>
                    setEditingPrinciple({
                      ...editingPrinciple,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingPrinciple.description}
                  onChange={(e) =>
                    setEditingPrinciple({
                      ...editingPrinciple,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Supporting Label (e.g. Invariant:)
                  </label>
                  <input
                    type="text"
                    value={editingPrinciple.supportingLabel}
                    onChange={(e) =>
                      setEditingPrinciple({
                        ...editingPrinciple,
                        supportingLabel: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Supporting Code Text
                  </label>
                  <input
                    type="text"
                    placeholder="state_t == replay(log)"
                    value={editingPrinciple.supportingText}
                    onChange={(e) =>
                      setEditingPrinciple({
                        ...editingPrinciple,
                        supportingText: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingPrinciple.isPublished}
                    onChange={(e) =>
                      setEditingPrinciple({
                        ...editingPrinciple,
                        isPublished: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[var(--brand-primary)]"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => {
                    setShowPrincipleModal(false);
                    setEditingPrinciple(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-xs hover:bg-[var(--bg-surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-semibold hover:bg-[var(--brand-hover)] shadow-xs"
                >
                  Save Principle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE DIALOG ─── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-2xl space-y-3">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Confirm Deletion
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Are you sure you want to permanently delete this {confirmDeleteType}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDeleteType(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDeleteType === "member") {
                    handleDeleteMember(confirmDeleteId);
                  } else if (confirmDeleteType === "principle") {
                    handleDeletePrinciple(confirmDeleteId);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
