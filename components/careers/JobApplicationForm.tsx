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
} from "lucide-react";
import { JobItem, submitJobApplication } from "@/lib/api";
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
  const [selectedJobId, setSelectedJobId] = useState(selectedJob?.id || jobs[0]?.id || "");
  const [candidateUrl, setCandidateUrl] = useState("");
  const [candidateNote, setCandidateNote] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submissionResult, setSubmissionResult] = useState<{ id: string; roleName: string } | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Sync selectedJob prop with form state
  useEffect(() => {
    if (selectedJob?.id) {
      setSelectedJobId(selectedJob.id);
    }
  }, [selectedJob]);

  const activeRole = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds 5MB size limit. Please upload a smaller file.");
      return;
    }

    // Validate type
    const validExtensions = [".pdf", ".doc", ".docx"];
    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isExtensionValid) {
      setFileError("Invalid format. Please upload a PDF or DOCX file.");
      return;
    }

    setResumeFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileError("");
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds 5MB size limit.");
      return;
    }

    const validExtensions = [".pdf", ".doc", ".docx"];
    const isExtensionValid = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isExtensionValid) {
      setFileError("Invalid format. Please upload a PDF or Word document.");
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!candidateName.trim() || !candidateEmail.trim() || !candidatePhone.trim()) {
      setErrorMessage("Please fill in all required contact fields.");
      return;
    }

    if (!resumeFile) {
      setFileError("Please attach your resume/CV before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await submitJobApplication({
        jobId: activeRole ? activeRole.id : selectedJobId,
        jobTitle: activeRole ? activeRole.title : "Candidate Application",
        name: candidateName.trim(),
        email: candidateEmail.trim(),
        phone: candidatePhone.trim(),
        resumeFileName: resumeFile.name,
        portfolioUrl: candidateUrl.trim(),
        message: candidateNote.trim(),
      });

      setSubmissionResult({
        id: res.id,
        roleName: activeRole ? activeRole.title : "Candidate Application",
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to submit application. Please check your network and retry."
      );
    } finally {
      setIsSubmitting(false);
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
      <div className="flex flex-col gap-2 mb-8">
        <span className="font-mono text-xs text-[var(--brand-primary)] uppercase tracking-wider font-bold">
          04 // Direct Application
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--text-primary)] font-extrabold tracking-tight">
          Application Workflow
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xl">
          Direct technical routing to engineering leads. Complete the submission below to initiate your review.
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto devcore-glass-card border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden">
        {submissionResult ? (
          /* Submission Success State */
          <div className="py-8 flex flex-col items-center text-center gap-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--success)]/40 flex items-center justify-center text-[var(--success)] shadow-lg">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <div className="space-y-2 max-w-lg">
              <span className="font-mono text-xs text-[var(--brand-primary)] font-bold uppercase tracking-wider">
                Candidacy Transmitted &bull; Ref: {submissionResult.id}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Thank you, {candidateName}!
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Your application for <strong>{submissionResult.roleName}</strong> has been logged into our engineering review queue. Our team reviews submissions and follows up directly via email.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="h-10 px-5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center gap-2 shadow-sm btn-liquid-hover"
              >
                <RotateCcw size={14} />
                <span>Submit Another Application</span>
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <>
            {/* Header of Form Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                  Submit Engineering Candidacy
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Direct routing to principal architects for evaluation.
                </p>
              </div>

              {activeRole && (
                <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--brand-primary)] font-bold self-start sm:self-auto">
                  Targeting: {activeRole.title}
                </span>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-6 p-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="candidate-name" className="block text-xs font-semibold text-[var(--text-primary)]">
                    Full Legal Name <span className="text-[var(--error)]">*</span>
                  </label>
                  <input
                    id="candidate-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="candidate-email" className="block text-xs font-semibold text-[var(--text-primary)]">
                    Email Address <span className="text-[var(--error)]">*</span>
                  </label>
                  <input
                    id="candidate-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm"
                  />
                </div>
              </div>

              {/* Phone & Target Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="candidate-phone" className="block text-xs font-semibold text-[var(--text-primary)]">
                    Phone / WhatsApp <span className="text-[var(--error)]">*</span>
                  </label>
                  <input
                    id="candidate-phone"
                    type="tel"
                    required
                    placeholder="+880 1..."
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="candidate-role-select" className="block text-xs font-semibold text-[var(--text-primary)]">
                    Target Engineering Discipline <span className="text-[var(--error)]">*</span>
                  </label>
                  <select
                    id="candidate-role-select"
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      const target = jobs.find((j) => j.id === e.target.value);
                      if (target) onJobSelect(target);
                    }}
                    className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm cursor-pointer"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Resume / CV File Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Curriculum Vitae / Resume (PDF / DOCX) <span className="text-[var(--error)]">*</span>
                </label>

                {resumeFile ? (
                  <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-semibold text-[var(--text-primary)] block">
                          {resumeFile.name}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                      aria-label="Remove resume"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "p-8 rounded-xl bg-[var(--bg-surface)] border-2 border-dashed flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer hover:border-[var(--brand-primary)] transition-all group",
                      fileError ? "border-[var(--error)]" : "border-[var(--border-subtle)]"
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
                        Drag & drop your PDF/DOCX resume here, or browse files
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        PDF or Word documents up to 5 MB
                      </span>
                    </div>
                  </div>
                )}
                {fileError && <p className="text-xs text-[var(--error)] mt-1">{fileError}</p>}
              </div>

              {/* Portfolio / GitHub URL */}
              <div className="space-y-1.5">
                <label htmlFor="candidate-url" className="block text-xs font-semibold text-[var(--text-primary)]">
                  Portfolio / GitHub / Architecture RFC URL <span className="text-[11px] font-normal text-[var(--text-muted)]">(Optional)</span>
                </label>
                <input
                  id="candidate-url"
                  type="url"
                  placeholder="https://github.com/your-username or portfolio URL"
                  value={candidateUrl}
                  onChange={(e) => setCandidateUrl(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm"
                />
              </div>

              {/* Candidate Note */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="candidate-note" className="block text-xs font-semibold text-[var(--text-primary)]">
                    Technical Abstract / Notes <span className="text-[11px] font-normal text-[var(--text-muted)]">(Optional)</span>
                  </label>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {candidateNote.length} / 500 chars
                  </span>
                </div>
                <textarea
                  id="candidate-note"
                  rows={3}
                  maxLength={500}
                  placeholder="Share a brief overview of relevant architectures or problems you've worked on..."
                  value={candidateNote}
                  onChange={(e) => setCandidateNote(e.target.value)}
                  className="w-full p-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                  <ShieldCheck size={14} className="text-[var(--brand-primary)]" />
                  <span>Confidential engineering submission</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-11 px-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-sm btn-liquid-hover inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Transmitting Candidacy..." : "Submit Candidacy"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
