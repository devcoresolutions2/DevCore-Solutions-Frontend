"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  apiGetSession,
  apiSignOut,
} from "@/lib/api";
import { AboutCmsManager } from "@/components/admin/AboutCmsManager";
import { BlogCmsManager } from "@/components/admin/BlogCmsManager";
import { LeadsManager } from "@/components/admin/leads/LeadsManager";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AdminTab = "leads" | "about" | "blog" | "jobs" | "applications" | "services";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("jobs");
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

  // Application details modal state
  const [selectedApp, setSelectedApp] = useState<SubmittedApplicationItem | null>(null);

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
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BrandLogo size="md" href="/admin/dashboard" />
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] uppercase">
              Mission Control
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Manage careers, candidate applications, and service capabilities directly without accessing backend raw database terminals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user && (
            <Link
              href="/account/settings"
              title="Open Account Settings"
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-lg bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] border border-[var(--border-subtle)] text-xs font-mono transition-colors"
            >
              <UserAvatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                size={64}
                className="w-6 h-6"
                textClassName="text-[10px]"
              />
              <span className="text-[var(--text-secondary)]">{user.email}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold">
                {user.role}
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={loadData}
            aria-label="Refresh data"
            className="h-9 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} className={cn(loading && "animate-spin")} />
            <span>Refresh</span>
          </button>

          <Link
            href="/"
            className="h-9 px-3.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Home size={13} />
            <span>Public Site</span>
          </Link>

          <button
            type="button"
            onClick={async () => {
              await apiSignOut();
              window.location.href = "/auth/signin";
            }}
            aria-label="Sign out"
            className="h-9 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-rose-500/10 hover:text-rose-600 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>ACTIVE ROLES</span>
            <Briefcase size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            {jobs.filter((j) => j.status === "OPEN").length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            {jobs.length} total openings configured
          </span>
        </div>

        <div className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>APPLICATIONS INBOX</span>
            <Users size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            {applications.length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            Candidate submissions in review queue
          </span>
        </div>

        <div className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>ENGINEERING DISCIPLINES</span>
            <Layers size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            {services.length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            Published core capability pillars
          </span>
        </div>

        <div className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
            <span>ABOUT & PRINCIPLES</span>
            <Compass size={16} className="text-[var(--brand-primary)]" />
          </div>
          <div className="font-display text-3xl font-extrabold text-[var(--text-primary)] mt-2">
            CMS
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            Founders, principles & manifesto
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2",
            activeTab === "about"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Compass size={14} />
          <span>About Page Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("blog")}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2",
            activeTab === "blog"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <BookOpen size={14} />
          <span>Blog & Technical CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2",
            activeTab === "jobs"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Briefcase size={14} />
          <span>Job Postings ({jobs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2",
            activeTab === "applications"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Users size={14} />
          <span>Applications Inbox ({applications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2",
            activeTab === "services"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Layers size={14} />
          <span>Services & Capabilities ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={cn(
            "px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2",
            activeTab === "leads"
              ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
          )}
        >
          <Mail size={14} />
          <span>Leads & Inquiries</span>
        </button>
      </div>

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
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="h-8 px-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-contrast)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={13} />
                          <span>View Info</span>
                        </button>
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
                5 Core Engineering Capabilities
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Configured architectural disciplines displayed on the public Services page.
              </p>
            </div>

            <Link
              href="/services"
              className="h-9 px-3.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Services Page</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-5 rounded-xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)] space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <span className="font-mono text-[10px] font-bold text-[var(--brand-primary)] uppercase">
                    {svc.serviceCode || svc.disciplineNumber || "CAPABILITY"}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {svc.category || "Engineering"}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  {svc.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {svc.description}
                </p>

                <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                  <span>{(svc.deliverables || svc.features || []).length} Deliverables</span>
                  <span className="text-[var(--success)] font-semibold">Active</span>
                </div>
              </div>
            ))}
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
            className="w-full max-w-lg rounded-2xl devcore-glass-card border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] p-6 shadow-2xl space-y-5 animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
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
            className="w-full max-w-lg rounded-2xl devcore-glass-card border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] p-6 shadow-2xl space-y-4 animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                  {selectedApp.name}
                </h3>
                <span className="font-mono text-xs text-[var(--brand-primary)]">
                  Applied for: {selectedApp.jobTitle}
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

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="block text-[var(--text-muted)] text-[10px] font-mono uppercase">
                    Attached Resume
                  </span>
                  <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                    {selectedApp.resumeFileName || "resume.pdf"}
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] font-bold">
                  Uploaded
                </span>
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
    </div>
  );
}
