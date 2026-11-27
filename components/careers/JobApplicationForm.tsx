"use client";

import { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  User,
  Mail,
  Phone,
  Briefcase,
  Globe,
  MapPin,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { JobItem, submitJobApplication, uploadResumeFile } from "@/lib/api";
import { cn } from "@/lib/utils";

interface JobApplicationFormProps {
  jobs: JobItem[];
  selectedJob: JobItem | null;
  onJobSelect: (job: JobItem) => void;
}

export function JobApplicationForm({
  jobs,
  selectedJob,
  onJobSelect,
}: JobApplicationFormProps) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(
    selectedJob?.id || jobs[0]?.id || "general-engineering"
  );
  const [candidateUrl, setCandidateUrl] = useState("");
  const [candidateNote, setCandidateNote] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const [submitStage, setSubmitStage] = useState<"idle" | "uploading" | "submitting">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submissionResult, setSubmissionResult] = useState<{
    id: string;
    roleName: string;
    email: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Sync selectedJob prop with form state
  useEffect(() => {
    if (selectedJob?.id) {
      setSelectedJobId(selectedJob.id);
    } else if (jobs.length > 0 && !jobs.some((j) => j.id === selectedJobId)) {
      setSelectedJobId(jobs[0].id);
    }
  }, [selectedJob, jobs, selectedJobId]);

  const activeRole = jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;
  const isSubmitting = submitStage !== "idle";

  const validateAndSetFile = (file: File | undefined) => {
    setFileError("");
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds 5 MB size limit. Please upload a smaller file.");
      return;
    }

    const validExtensions = [".pdf", ".doc", ".docx"];
    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isExtensionValid) {
      setFileError("Unsupported file format. Please upload a PDF, DOC, or DOCX document.");
      return;
    }

    setResumeFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!candidateName.trim() || !candidateEmail.trim() || !candidatePhone.trim()) {
      setErrorMessage("Please complete all required candidate contact fields.");
      return;
    }

    if (!resumeFile) {
      setFileError("Please attach your resume or CV before submitting.");
      return;
    }

    try {
      setSubmitStage("uploading");
      const uploadedResume = await uploadResumeFile(resumeFile);

      setSubmitStage("submitting");
      const roleTitle = activeRole ? activeRole.title : "General Engineering Candidacy";
      const res = await submitJobApplication({
        jobId: activeRole ? activeRole.id : selectedJobId,
        jobTitle: roleTitle,
        name: candidateName.trim(),
        email: candidateEmail.trim(),
        phone: candidatePhone.trim(),
        resumeFileName: uploadedResume.fileName,
        resumeUrl: uploadedResume.url,
        portfolioUrl: candidateUrl.trim(),
        message: candidateNote.trim(),
      });

      setSubmissionResult({
        id: res.id,
        roleName: roleTitle,
        email: candidateEmail.trim(),
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to submit application. Please check your network and retry.";
      setErrorMessage(msg);
    } finally {
      setSubmitStage("idle");
    }
  };

  const handleReset = () => {
    setCandidateName("");
    setCandidateEmail("");
    setCandidatePhone("");
    setCandidateUrl("");
    setCandidateNote("");
    setResumeFile(null);
    setFileError("");
    setErrorMessage("");
    setSubmissionResult(null);
  };

  return (
    <section
      id="candidacy-form-section"
      ref={formRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12"
    >
      {/* Section Heading */}
      <div className="flex flex-col gap-2 mb-8">
        <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider font-bold">
          04 // Direct Application
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold tracking-tight">
          Submit Your Candidacy
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
          Every application is reviewed directly by our engineering leads—never filtered out by automated keyword bots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selected Role Context & Review Protocol */}
        <aside className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
          <div className="rounded-2xl devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[var(--brand-primary)]">
                Target Position
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--success)]/12 text-[var(--success)] font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                {activeRole ? activeRole.status : "OPEN"}
              </span>
            </div>

            {activeRole ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">
                    {activeRole.department}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mt-0.5 leading-snug">
                    {activeRole.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-[var(--brand-primary)]" />
                    {activeRole.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={13} className="text-[var(--brand-primary)]" />
                    {activeRole.workplaceType} &bull; {activeRole.type}
                  </span>
                </div>

                {activeRole.description && (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {activeRole.description}
                  </p>
                )}

                {activeRole.skills && activeRole.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeRole.skills.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
                  General Engineering Candidacy
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  No specific role selected. Submit your profile for upcoming engineering, product, or architecture openings.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)] block">
                Review Commitment
              </span>
              <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                <li className="flex items-start gap-2.5">
                  <Clock size={14} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <span>Initial engineering review within 48 business hours.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles size={14} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <span>Direct evaluation by principal engineers & hiring leads.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck size={14} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <span>Encrypted resume storage & strict candidate confidentiality.</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Application Card */}
        <div className="lg:col-span-8 devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
          {submissionResult ? (
            /* Submission Success State */
            <div className="py-10 flex flex-col items-center text-center gap-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-[var(--success)]/12 border border-[var(--success)]/30 flex items-center justify-center text-[var(--success)] shadow-sm">
                <CheckCircle2 size={34} strokeWidth={2.2} />
              </div>

              <div className="space-y-2 max-w-lg">
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--brand-primary)] font-bold uppercase tracking-wider">
                  Ref: {submissionResult.id}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-[var(--text-primary)] tracking-tight pt-1">
                  Application Received, {candidateName}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Your candidacy for <strong className="text-[var(--text-primary)]">{submissionResult.roleName}</strong> has been logged in our engineering review queue. We will follow up at <span className="font-mono text-[var(--text-primary)]">{submissionResult.email}</span>.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-10 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-2 shadow-sm btn-liquid-hover"
                >
                  <RotateCcw size={14} />
                  <span>Submit Another Application</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-xs flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 01: CANDIDATE IDENTITY */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h3 className="font-display text-sm font-bold text-[var(--text-primary)] tracking-tight">
                    01. Candidate Identity
                  </h3>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                    Required Fields *
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="candidate-name"
                      className="block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Full Legal Name <span className="text-[var(--error)]">*</span>
                    </label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                      />
                      <input
                        id="candidate-name"
                        type="text"
                        required
                        placeholder="e.g. Tariqul Islam"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="candidate-email"
                      className="block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Email Address <span className="text-[var(--error)]">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                      />
                      <input
                        id="candidate-email"
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="candidate-phone"
                    className="block text-xs font-semibold text-[var(--text-primary)]"
                  >
                    Phone / WhatsApp Number <span className="text-[var(--error)]">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                    />
                    <input
                      id="candidate-phone"
                      type="tel"
                      required
                      placeholder="+880 1XXX-XXXXXX"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 02: ROLE & TECHNICAL FOOTPRINT */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h3 className="font-display text-sm font-bold text-[var(--text-primary)] tracking-tight">
                    02. Role & Technical Footprint
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="candidate-role-select"
                      className="block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Target Role <span className="text-[var(--error)]">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                      />
                      <select
                        id="candidate-role-select"
                        value={selectedJobId}
                        onChange={(e) => {
                          setSelectedJobId(e.target.value);
                          const target = jobs.find((j) => j.id === e.target.value);
                          if (target) onJobSelect(target);
                        }}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] cursor-pointer transition-shadow"
                      >
                        {jobs.length > 0 ? (
                          jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                              {job.title} ({job.department})
                            </option>
                          ))
                        ) : (
                          <option value="general-engineering">
                            General Engineering Candidacy
                          </option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="candidate-url"
                      className="block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      GitHub / Portfolio / LinkedIn{" "}
                      <span className="text-[11px] font-normal text-[var(--text-muted)]">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Globe
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                      />
                      <input
                        id="candidate-url"
                        type="url"
                        placeholder="https://github.com/username"
                        value={candidateUrl}
                        onChange={(e) => setCandidateUrl(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 03: RESUME & ABSTRACT */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
                  <h3 className="font-display text-sm font-bold text-[var(--text-primary)] tracking-tight">
                    03. Resume & Engineering Abstract
                  </h3>
                </div>

                {/* Resume / CV File Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--text-primary)]">
                    Curriculum Vitae / Resume (PDF, DOC, DOCX){" "}
                    <span className="text-[var(--error)]">*</span>
                  </label>

                  {resumeFile ? (
                    <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--brand-primary)]/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-xs font-semibold text-[var(--text-primary)] block truncate">
                            {resumeFile.name}
                          </span>
                          <span className="font-mono text-[11px] text-[var(--text-muted)]">
                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready to upload
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        disabled={isSubmitting}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors shrink-0 disabled:opacity-50"
                        aria-label="Remove resume"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "p-7 rounded-xl bg-[var(--bg-surface)] border-2 border-dashed flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all group",
                        isDragging
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 scale-[1.01]"
                          : fileError
                            ? "border-[var(--error)]"
                            : "border-[var(--border-subtle)] hover:border-[var(--brand-primary)]"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-11 h-11 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--brand-primary)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <UploadCloud size={22} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-[var(--text-primary)] block">
                          Click to browse or drag & drop your resume
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] block">
                          PDF, DOC, or DOCX &bull; Maximum 5 MB
                        </span>
                      </div>
                    </div>
                  )}
                  {fileError && (
                    <p className="text-xs text-[var(--error)] flex items-center gap-1.5 pt-1">
                      <AlertCircle size={13} />
                      <span>{fileError}</span>
                    </p>
                  )}
                </div>

                {/* Candidate Note */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="candidate-note"
                      className="block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Technical Abstract / Cover Note{" "}
                      <span className="text-[11px] font-normal text-[var(--text-muted)]">
                        (Optional)
                      </span>
                    </label>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {candidateNote.length} / 500
                    </span>
                  </div>
                  <textarea
                    id="candidate-note"
                    rows={4}
                    maxLength={500}
                    placeholder="Briefly highlight a system you architected, production challenges you solved, or why you want to build with DevCore..."
                    value={candidateNote}
                    onChange={(e) => setCandidateNote(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit Footer */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                  <ShieldCheck size={15} className="text-[var(--brand-primary)] shrink-0" />
                  <span>Direct encrypted delivery to hiring leads</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-11 px-7 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>
                        {submitStage === "uploading"
                          ? "Uploading Resume..."
                          : "Submitting Candidacy..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Submit Candidacy</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
