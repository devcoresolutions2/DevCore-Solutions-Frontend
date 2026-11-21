"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { quickCallbackSchema, type QuickCallbackInput } from "@/lib/validations/leads";
import { submitLead } from "@/lib/api";
import { cn } from "@/lib/utils";

interface QuickCallbackFormProps {
  initialProject?: string;
  className?: string;
}

export function QuickCallbackForm({ initialProject = "", className }: QuickCallbackFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuickCallbackInput>({
    resolver: zodResolver(quickCallbackSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      project: initialProject,
      message: initialProject ? `Inquiry regarding a similar build to ${initialProject}` : "",
    },
  });

  const onSubmit = async (data: QuickCallbackInput) => {
    setServerError(null);
    try {
      await submitLead({
        name: data.name,
        phone: data.phone,
        message: [data.project ? `[Project: ${data.project}]` : "", data.message]
          .filter(Boolean)
          .join(" - "),
        pageUrl: typeof window !== "undefined" ? window.location.href : "/contact",
        source: "QUICK_CALLBACK",
      });
      setSubmitted(true);
      reset();
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Failed to submit request. Please try again or message via WhatsApp."
      );
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center devcore-glass-card border border-[var(--success)]/40 bg-[var(--bg-elevated)]">
        <div className="w-12 h-12 rounded-full bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
          Request Received
        </h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed mb-6">
          A principal solutions architect will review your inquiry and follow up within one business hour.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4 devcore-glass-card p-6 sm:p-8 bg-[var(--bg-elevated)]", className)}
      noValidate
    >
      <div className="mb-2">
        <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
          Schedule Engineering Scoping Call
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Direct engagement with a technical architect. We respect strict NDAs.
        </p>
      </div>

      {serverError && (
        <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-xs text-[var(--error)] font-medium">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
          Full Name <span className="text-[var(--error)]">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          placeholder="e.g. Elena Lindqvist"
          className={cn(
            "w-full h-11 px-3.5 rounded-lg bg-[var(--bg-canvas)] border text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all",
            errors.name ? "border-[var(--error)]" : "border-[var(--border-subtle)]"
          )}
        />
        {errors.name && (
          <p className="text-[11px] text-[var(--error)] mt-1 font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
          Direct Phone / WhatsApp Number <span className="text-[var(--error)]">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          placeholder="e.g. +1 (555) 019-2834"
          className={cn(
            "w-full h-11 px-3.5 rounded-lg bg-[var(--bg-canvas)] border text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all",
            errors.phone ? "border-[var(--error)]" : "border-[var(--border-subtle)]"
          )}
        />
        {errors.phone && (
          <p className="text-[11px] text-[var(--error)] mt-1 font-medium">{errors.phone.message}</p>
        )}
      </div>

      {/* Email (Optional) */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
          Corporate Email (Optional)
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="e.g. elena@company.com"
          className={cn(
            "w-full h-11 px-3.5 rounded-lg bg-[var(--bg-canvas)] border text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all",
            errors.email ? "border-[var(--error)]" : "border-[var(--border-subtle)]"
          )}
        />
        {errors.email && (
          <p className="text-[11px] text-[var(--error)] mt-1 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Project reference */}
      <div>
        <label htmlFor="project" className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
          Target System or Project Reference
        </label>
        <input
          id="project"
          type="text"
          {...register("project")}
          placeholder="e.g. High-Volume POS / Escrow Ledger / Cloud Infrastructure"
          className="w-full h-11 px-3.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
          Brief Requirements / Architectural Constraints
        </label>
        <textarea
          id="message"
          rows={3}
          {...register("message")}
          placeholder="Describe your current bottlenecks, target SLA, or integration requirements..."
          className="w-full p-3 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all resize-none"
        />
        {errors.message && (
          <p className="text-[11px] text-[var(--error)] mt-1 font-medium">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-liquid-hover w-full h-12 rounded-[10px] bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Transmitting Request...</span>
          </>
        ) : (
          <>
            <Send size={15} />
            <span>Request Technical Callback</span>
          </>
        )}
      </button>

      <div className="pt-2 text-center text-[11px] font-mono text-[var(--text-muted)]">
        Direct engineer response within 1 business hour • Zero junior handoffs
      </div>
    </form>
  );
}
