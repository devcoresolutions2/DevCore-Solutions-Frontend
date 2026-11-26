"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Users,
  Layers,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  ExternalLink,
  Mail,
  Phone,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
  Home,
  Compass,
  BookOpen,
  LogOut,
  Share2,
  Trash2,
} from "lucide-react";
import {
  JobItem,
  SubmittedApplicationItem,
  ServiceItem,
  AuthUser,
  getJobs,
  getSubmittedApplications,
  getServices,
  updateJobStatus,
  updateApplicationStatus,
  deleteJobApplication,
  apiGetSession,
  apiSignOut,
  apiCreateAdminService,
  apiDeleteAdminService,
} from "@/lib/api";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";
import { AboutCmsManager } from "@/components/admin/AboutCmsManager";
import { BlogCmsManager } from "@/components/admin/BlogCmsManager";
import { LeadsManager } from "@/components/admin/leads/LeadsManager";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AdminShell from "@/components/admin/AdminShell";

type AdminTab = "overview" | "leads" | "about" | "blog" | "jobs" | "applications" | "services";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-canvas)]" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<SubmittedApplicationItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  // New Job Modal state
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [newWorkplace, setNewWorkplace] = useState<"Remote" | "Hybrid" | "On-site">("Remote");
  const [newType, setNewType] = useState("Full-time");
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState("");

  // New Service Modal & Delete state
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [svcTitle, setSvcTitle] = useState("");
  const [svcSummary, setSvcSummary] = useState("");
  const [svcIcon, setSvcIcon] = useState("Layers");
  const [svcDeliverables, setSvcDeliverables] = useState("");
  const [svcSaving, setSvcSaving] = useState(false);
  const [deleteSvcTarget, setDeleteSvcTarget] = useState<ServiceItem | null>(null);
  const [deletingSvc, setDeletingSvc] = useState(false);

  // Application details & delete modal state
  const [selectedApp, setSelectedApp] = useState<SubmittedApplicationItem | null>(null);
  const [deleteAppTarget, setDeleteAppTarget] = useState<SubmittedApplicationItem | null>(null);
  const [deletingApp, setDeletingApp] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedJobs, fetchedApps, fetchedServices, session] = await Promise.all([
        getJobs({ status: "ALL" }),
        getSubmittedApplications(),
        getServices(),
        apiGetSession(),
      ]);
      setJobs(fetchedJobs);
      setApplications(fetchedApps);
      setServices(fetchedServices);
      if (session?.user) {
        setUser(session.user);
      }
    } catch {
      toast.error("Failed to load control center data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const t = searchParams.get("tab") as AdminTab | null;
    if (t && ["leads", "about", "blog", "jobs", "applications", "services"].includes(t)) {
      setActiveTab(t);
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!svcTitle.trim() || !svcSummary.trim()) {
      toast.error("Please enter a service title and summary.");
      return;
    }
    setSvcSaving(true);
    try {
      await apiCreateAdminService({
        title: svcTitle.trim(),
        summary: svcSummary.trim(),
        icon: svcIcon,
        deliverables: svcDeliverables
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      });
      setShowAddServiceModal(false);
      setSvcTitle("");
      setSvcSummary("");
      setSvcDeliverables("");
      await loadData();
      toast.success("Service created and published.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create service.");
    } finally {
      setSvcSaving(false);
    }
  };

  const confirmDeleteService = async () => {
    if (!deleteSvcTarget) return;
    setDeletingSvc(true);
    try {
      await apiDeleteAdminService(deleteSvcTarget.id);
      setDeleteSvcTarget(null);
      await loadData();
      toast.success("Service deleted.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete service.");
    } finally {
      setDeletingSvc(false);
    }
  };

  const confirmDeleteApplication = async () => {
    if (!deleteAppTarget) return;
    setDeletingApp(true);
    try {
      await deleteJobApplication(deleteAppTarget.id);
      setApplications((prev) => prev.filter((a) => a.id !== deleteAppTarget.id));
      if (selectedApp?.id === deleteAppTarget.id) setSelectedApp(null);
      setDeleteAppTarget(null);
      toast.success("Application deleted.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete application.");
    } finally {
      setDeletingApp(false);
    }
  };

  const handleToggleJobStatus = async (job: JobItem) => {
    const nextStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    await updateJobStatus(job.id, nextStatus);
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
    );
    toast.success(`Position "${job.title}" marked as ${nextStatus}`);
  };

  const handleStatusChange = async (appId: string, status: SubmittedApplicationItem["status"]) => {
    await updateApplicationStatus(appId, status);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    toast.success(`Application status updated to ${status}`);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Please fill in title and description.");
      return;
    }

    const created: JobItem = {
      id: `job-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newTitle.trim(),
      department: newDepartment,
      location: "Dhaka / Remote",
      type: newType,
      workplaceType: newWorkplace,
      description: newDescription.trim(),
      skills: newSkills.split(",").map((s) => s.trim()).filter(Boolean),
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => [created, ...prev]);
    setShowAddJobModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewSkills("");
    toast.success(`Job position "${created.title}" published!`);
  };

  return (
    <AdminShell>
      <div className="space-y-6 animate-fadeIn">
        {/* Compact Workspace Heading (Overview only) */}
        {activeTab === "overview" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  Dashboard Overview
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Quick summary of open roles, candidate applications, services, and content.
                </p>
              </div>
              <button
                type="button"
                onClick={loadData}
                aria-label="Refresh data"
                className="h-9 px-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RefreshCw size={13} className={cn(loading && "animate-spin")} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)]">
                  <span>Active Roles</span>
                  <Briefcase size={16} className="text-[var(--brand-primary)]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
                  {jobs.filter((j) => j.status === "OPEN").length}
                </div>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                  {jobs.length} total openings configured
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)]">
                  <span>Applications Inbox</span>
                  <Users size={16} className="text-[var(--brand-primary)]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
                  {applications.length}
                </div>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                  Candidate submissions in review
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)]">
                  <span>Services</span>
                  <Layers size={16} className="text-[var(--brand-primary)]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
                  {services.length}
                </div>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                  Published service offerings
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--text-tertiary)]">
                  <span>About &amp; Principles</span>
                  <Compass size={16} className="text-[var(--brand-primary)]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-2">
                  CMS
                </div>
                <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                  Founders, principles &amp; story
                </span>
              </div>
            </div>

            {/* Quick Section Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Blog Articles", desc: "Write and publish technical articles", href: "/admin/dashboard?tab=blog", icon: BookOpen },
                { label: "Job Postings", desc: "Manage open roles and hiring status", href: "/admin/dashboard?tab=jobs", icon: Briefcase },
                { label: "Applications", desc: "Review incoming candidate submissions", href: "/admin/dashboard?tab=applications", icon: Users },
                { label: "Services", desc: "Add or update core service offerings", href: "/admin/dashboard?tab=services", icon: Layers },
                { label: "Leads", desc: "Follow up on client project inquiries", href: "/admin/leads", icon: Mail },
                { label: "Social Posts", desc: "Schedule and track social broadcasts", href: "/admin/social/manage", icon: Share2 },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] hover:shadow-sm transition-all duration-200 flex items-start gap-3.5"
                  >
                    <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)] shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{card.label}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{card.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

      {/* TAB: LEADS & INQUIRIES */}
      {activeTab === "leads" && (
        <section className="space-y-4">
          <LeadsManager />
        </section>
      )}

      {/* TAB 0: ABOUT PAGE MANAGEMENT */}
      {activeTab === "about" && (
        <section className="space-y-4">
          <AboutCmsManager />
        </section>
      )}

      {/* TAB: BLOG & TECHNICAL CMS */}
      {activeTab === "blog" && (
        <section className="space-y-4">
          <BlogCmsManager />
        </section>
      )}

      {/* TAB 1: JOB POSTINGS */}
      {activeTab === "jobs" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Active & Configured Openings
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Positions configured here automatically populate on the public Careers page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddJobModal(true)}
              className="h-9 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>Create Position</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono uppercase tracking-wider border-b border-[var(--border-subtle)]">
                  <th className="py-3 px-4 font-bold">Role Title</th>
                  <th className="py-3 px-4 font-bold">Department</th>
                  <th className="py-3 px-4 font-bold">Workplace / Type</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[var(--bg-surface)]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[var(--text-primary)] block">
                        {job.title}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono">
                        {job.slug}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--text-secondary)]">
                      {job.department}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[var(--text-secondary)]">
                      {job.workplaceType} &bull; {job.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold",
                          job.status === "OPEN"
                            ? "bg-[var(--success)]/15 text-[var(--success)]"
                            : "bg-[var(--text-muted)]/15 text-[var(--text-muted)]"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            job.status === "OPEN" ? "bg-[var(--success)]" : "bg-[var(--text-muted)]"
                          )}
                        />
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                          job.status === "OPEN"
                            ? "bg-[var(--bg-surface)] hover:bg-[var(--error)]/15 hover:text-[var(--error)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                            : "bg-[var(--success)]/15 text-[var(--success)] hover:bg-[var(--success)]/25"
                        )}
                      >
                        {job.status === "OPEN" ? "Close Role" : "Re-Open Role"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: APPLICATIONS INBOX */}
      {activeTab === "applications" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                Submitted Candidate Applications
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Candidates who submitted their CV and information through the public Careers page.
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-2">
              <Users size={28} className="text-[var(--text-muted)] mx-auto" />
              <h3 className="font-bold text-sm text-[var(--text-primary)]">No applications yet</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                Candidate submissions from the Careers form will immediately appear here for your review.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
              <table className="w-full text-left border-collapse text-xs min-w-[780px]">
                <thead>
                  <tr className="bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono uppercase tracking-wider border-b border-[var(--border-subtle)]">
                    <th className="py-3 px-4 font-bold">Candidate</th>
                    <th className="py-3 px-4 font-bold">Target Position</th>
                    <th className="py-3 px-4 font-bold">Resume / Files</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-right font-bold">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[var(--bg-surface)]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[var(--text-primary)] block">
                          {app.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                          <span>{app.email}</span>
                          {app.phone && <span>&bull; {app.phone}</span>}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[var(--text-primary)] block">
                          {app.jobTitle}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-[var(--brand-primary)] flex items-center gap-1.5">
                          <FileText size={13} />
                          <span>{app.resumeFileName || "resume.pdf"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(
                              app.id,
                              e.target.value as SubmittedApplicationItem["status"]
                            )
                          }
                          className="h-8 px-2.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-[11px] border border-[var(--border-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="INTERVIEW">INTERVIEW</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="HIRED">HIRED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="h-8 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                          >
                            <Eye size={13} />
                            <span>View Info</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteAppTarget(app)}
                            className="h-8 w-8 rounded-lg inline-flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
                            title="Delete Application"
                            aria-label={`Delete application from ${app.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: SERVICES & CAPABILITIES */}
      {activeTab === "services" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                {services.length} Services &amp; Capabilities
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Service offerings displayed on the public Services page.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddServiceModal(true)}
                className="h-9 px-3.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Plus size={14} />
                <span>Add Service</span>
              </button>
              <Link
                href="/services"
                className="h-9 px-3.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View Services Page</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => {
              const deliverables = svc.deliverables || svc.features || [];
              return (
                <div
                  key={svc.id}
                  className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                          <Layers size={17} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wide">
                            {svc.serviceCode || svc.disciplineNumber || "Service"}
                          </div>
                          <div className="text-[11px] text-[var(--text-tertiary)] truncate">
                            {svc.category || "Engineering"}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteSvcTarget(svc)}
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug">
                        {svc.title}
                      </h3>
                      <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mt-1.5">
                        {svc.description}
                      </p>
                    </div>

                    {deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {deliverables.slice(0, 3).map((d, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-subtle)] truncate max-w-[160px]"
                          >
                            {d}
                          </span>
                        ))}
                        {deliverables.length > 3 && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--bg-canvas)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
                            +{deliverables.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)] flex items-center justify-between">
                    <span>{deliverables.length} deliverables</span>
                    <span className="inline-flex items-center gap-1.5 text-[var(--success)] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CREATE JOB MODAL */}
      {showAddJobModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowAddJobModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] p-6 shadow-2xl space-y-5 animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                Create New Job Position
              </h3>
              <button
                type="button"
                onClick={() => setShowAddJobModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold block">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold block">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design & Product">Design & Product</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Security & Audit">Security & Audit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Workplace Type</label>
                  <select
                    value={newWorkplace}
                    onChange={(e) =>
                      setNewWorkplace(e.target.value as "Remote" | "Hybrid" | "On-site")
                    }
                    className="w-full h-10 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Role Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe key responsibilities and expectations..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Required Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Go, Docker, PostgreSQL, Kubernetes"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="h-9 px-4 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors"
                >
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW APPLICATION MODAL */}
      {selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedApp(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] p-6 shadow-2xl space-y-4 animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                  {selectedApp.name}
                </h3>
                <span className="text-xs font-medium text-[var(--brand-primary)]">
                  Applied for {selectedApp.jobTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-secondary)]">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <div>
                  <span className="block text-[var(--text-muted)] text-[10px] font-mono uppercase">
                    Email
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] truncate block">
                    {selectedApp.email}
                  </span>
                </div>
                <div>
                  <span className="block text-[var(--text-muted)] text-[10px] font-mono uppercase">
                    Phone
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] block">
                    {selectedApp.phone || "Not provided"}
                  </span>
                </div>
              </div>

              {selectedApp.portfolioUrl && (
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <span className="block text-[var(--text-muted)] text-[10px] font-mono uppercase mb-0.5">
                    Portfolio / GitHub URL
                  </span>
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-primary)] font-mono text-xs hover:underline flex items-center gap-1"
                  >
                    <span>{selectedApp.portfolioUrl}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {selectedApp.message && (
                <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                  <span className="block text-[var(--text-muted)] text-[10px] font-mono uppercase">
                    Candidate Note
                  </span>
                  <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                    {selectedApp.message}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[var(--text-muted)] text-[10px] font-mono uppercase">
                    Attached Resume
                  </span>
                  <span className="block truncate font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {selectedApp.resumeFileName || "resume.pdf"}
                  </span>
                </div>
                {selectedApp.resumeUrl ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/applications/${encodeURIComponent(selectedApp.id)}/resume`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-mono text-[11px] font-semibold hover:bg-[var(--brand-hover)] transition-colors"
                  >
                    <span>Open PDF</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="shrink-0 font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold">
                    No File URL
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="h-9 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SERVICE MODAL */}
      {showAddServiceModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            if (!svcSaving) setShowAddServiceModal(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] p-6 shadow-2xl space-y-5 animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">
                Add New Service
              </h3>
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold block">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DevSecOps & Cloud Hardening"
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Icon</label>
                <select
                  value={svcIcon}
                  onChange={(e) => setSvcIcon(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
                >
                  <option value="Layers">Layers (Web / Architecture)</option>
                  <option value="Cloud">Cloud (Infrastructure / APIs)</option>
                  <option value="Cpu">CPU (AI / Automation)</option>
                  <option value="Palette">Palette (UI/UX Design)</option>
                  <option value="ShieldCheck">Shield (Consulting / Audits)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what this service delivers for clients..."
                  value={svcSummary}
                  onChange={(e) => setSvcSummary(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block">Deliverables (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Architecture Blueprint, CI/CD Pipeline, Load Testing"
                  value={svcDeliverables}
                  onChange={(e) => setSvcDeliverables(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={svcSaving}
                  onClick={() => setShowAddServiceModal(false)}
                  className="h-9 px-4 rounded-lg border border-[var(--border-subtle)] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={svcSaving}
                  className="h-9 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
                >
                  {svcSaving ? "Publishing..." : "Publish Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteSvcTarget)}
        title="Delete Service"
        description={
          deleteSvcTarget
            ? `Remove "${deleteSvcTarget.title}" from the Services catalog?`
            : ""
        }
        confirmLabel="Delete Service"
        destructive
        loading={deletingSvc}
        onConfirm={() => void confirmDeleteService()}
        onCancel={() => {
          if (!deletingSvc) setDeleteSvcTarget(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteAppTarget)}
        title="Delete Application"
        description={
          deleteAppTarget
            ? `Permanently delete the application from "${deleteAppTarget.name}" (${deleteAppTarget.email})? This will also remove any attached resume.`
            : ""
        }
        confirmLabel="Delete Application"
        destructive
        loading={deletingApp}
        onConfirm={() => void confirmDeleteApplication()}
        onCancel={() => {
          if (!deletingApp) setDeleteAppTarget(null);
        }}
      />
      </div>
    </AdminShell>
  );
}
