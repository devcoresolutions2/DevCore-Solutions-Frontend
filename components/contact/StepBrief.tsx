"use client";

import { UseFormReturn } from "react-hook-form";
import { FullEstimatorInput } from "@/lib/validations/leads";
import { Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepBriefProps {
  form: UseFormReturn<FullEstimatorInput>;
}

export function StepBrief({ form }: StepBriefProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const briefLength = (watch("brief") || "").length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
          <span className="uppercase tracking-wider font-semibold text-[var(--brand-primary)]">
            Step 3 of 3
          </span>
          <span>Specifications & Scoping</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Project Brief & Technical Specifications
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
          Describe the business objectives, core architectural requirements, key integrations, or performance constraints.
        </p>
      </div>

      {/* Hidden honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Leave this empty</label>
        <input
          id="website_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      {/* Project Brief Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="brief" className="block text-xs font-semibold text-[var(--text-primary)]">
            Project Overview & Goals <span className="text-[var(--error)]">*</span>
          </label>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            {briefLength} / 3000 chars (min 20)
          </span>
        </div>
        <textarea
          id="brief"
          rows={5}
          placeholder="Detail your system architecture, expected user traffic, database models, API integrations, or existing stack hurdles..."
          className={cn(
            "w-full p-3.5 rounded-lg text-sm leading-relaxed resize-y",
            "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
            "placeholder:text-[var(--text-muted)] shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all",
            errors.brief && "border-[var(--error)] focus:ring-[var(--error)]"
          )}
          {...register("brief")}
        />
        {errors.brief ? (
          <p className="text-xs text-[var(--error)] flex items-center gap-1">
            <span>&bull;</span> {errors.brief.message}
          </p>
        ) : (
          <p className="text-[11px] text-[var(--text-muted)]">
            Include technical context, scale expectations, or specific technologies if known.
          </p>
        )}
      </div>

      {/* Optional Repository / Documentation Links */}
      <div className="space-y-1.5">
        <label htmlFor="attachmentNote" className="block text-xs font-semibold text-[var(--text-primary)]">
          Repository, Figma, or Document Link <span className="text-[var(--text-muted)] text-[11px] font-normal">(Optional)</span>
        </label>
        <input
          id="attachmentNote"
          type="text"
          placeholder="e.g. https://github.com/org/repo or https://figma.com/file/..."
          className={cn(
            "w-full h-11 px-3.5 rounded-lg text-sm",
            "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
            "placeholder:text-[var(--text-muted)] shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all"
          )}
          {...register("attachmentNote")}
        />
        <p className="text-[11px] text-[var(--text-muted)]">
          Public or password-protected spec URL. We can exchange keys or NDAs prior to accessing private resources.
        </p>
      </div>

      {/* Consent Checkbox */}
      <div className="pt-2">
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded accent-[var(--brand-primary)] text-[var(--brand-primary)] cursor-pointer shrink-0"
              {...register("consent")}
            />
            <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
              I agree to the confidential transmission of this inquiry and authorize DevCore Solutions to evaluate our technical specifications under strict professional confidentiality.
            </span>
          </label>

          {errors.consent && (
            <p className="text-xs text-[var(--error)] flex items-center gap-1 pl-7">
              <span>&bull;</span> {errors.consent.message}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] font-mono">
            <Shield size={13} className="text-[var(--brand-primary)] shrink-0" />
            <span>Bilateral NDA available upon request prior to technical deep dives.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
