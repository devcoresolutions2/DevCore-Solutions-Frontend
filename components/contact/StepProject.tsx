"use client";

import { UseFormReturn } from "react-hook-form";
import { FullEstimatorInput } from "@/lib/validations/leads";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProjectProps {
  form: UseFormReturn<FullEstimatorInput>;
  servicesList: { id: string; title: string; description: string }[];
}

export const BUDGET_TIERS = [
  { value: "< $10,000", label: "Seed / Discovery (< $10k)", desc: "Proof-of-concept, MVP sprint, or audit" },
  { value: "$10,000 - $25,000", label: "Growth Tier ($10k - $25k)", desc: "Production release, microservice rebuild" },
  { value: "$25,000 - $50,000", label: "Enterprise Build ($25k - $50k)", desc: "Full-stack SaaS platform, multi-tenant cloud" },
  { value: "$50,000+", label: "Scale-Up / Mission-Critical ($50k+)", desc: "High-throughput infrastructure, continuous retainer" },
];

export const TIMELINE_OPTIONS = [
  { value: "Immediate (< 1 month)", label: "Immediate (< 1 Month)", desc: "Critical path or urgent architecture triage" },
  { value: "1 - 3 months", label: "1 to 3 Months", desc: "Targeted release cycle or next quarter roadmap" },
  { value: "3 - 6 months", label: "3 to 6 Months", desc: "Comprehensive product design & engineering" },
  { value: "Flexible", label: "Flexible / R&D", desc: "Long-term partnership or continuous advisory" },
];

export function StepProject({ form, servicesList }: StepProjectProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedServices = watch("services") || [];
  const selectedBudget = watch("budgetTier") || "";
  const selectedTimeline = watch("timeline") || "";

  const toggleService = (title: string) => {
    const next = selectedServices.includes(title)
      ? selectedServices.filter((s) => s !== title)
      : [...selectedServices, title];
    setValue("services", next, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
          <span className="uppercase tracking-wider font-semibold text-[var(--brand-primary)]">
            Step 2 of 3
          </span>
          <span>Scope & Allocation</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Engineering Scope & Budget Tier
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
          Select the core technical domains and resource boundaries for your platform build.
        </p>
      </div>

      {/* Services Multi-Select */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[var(--text-primary)]">
          Required Capabilities & Domains <span className="text-[var(--error)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Required Services">
          {servicesList.map((service) => {
            const isSelected = selectedServices.includes(service.title);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.title)}
                aria-pressed={isSelected}
                className={cn(
                  "p-3.5 rounded-xl text-left border transition-all duration-150 flex items-start gap-3 shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isSelected
                    ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-secondary)]"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-colors",
                    isSelected
                      ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-[var(--brand-contrast)]"
                      : "border-[var(--border-strong)] bg-transparent text-transparent"
                  )}
                  aria-hidden="true"
                >
                  <Check size={13} strokeWidth={3} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    {service.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                    {service.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.services && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1 mt-1">
            <span>&bull;</span> {errors.services.message}
          </p>
        )}
      </div>

      {/* Budget Tier */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-semibold text-[var(--text-primary)]">
          Target Budget Range <span className="text-[var(--error)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = selectedBudget === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => setValue("budgetTier", tier.value, { shouldValidate: true })}
                aria-pressed={isSelected}
                className={cn(
                  "p-3 rounded-xl text-left border transition-all duration-150 shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isSelected
                    ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-secondary)]"
                )}
              >
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {tier.label}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {tier.desc}
                </div>
              </button>
            );
          })}
        </div>
        {errors.budgetTier && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1 mt-1">
            <span>&bull;</span> {errors.budgetTier.message}
          </p>
        )}
      </div>

      {/* Target Timeline */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-semibold text-[var(--text-primary)]">
          Target Deployment Timeline <span className="text-[var(--error)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIMELINE_OPTIONS.map((opt) => {
            const isSelected = selectedTimeline === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("timeline", opt.value, { shouldValidate: true })}
                aria-pressed={isSelected}
                className={cn(
                  "p-3 rounded-xl text-left border transition-all duration-150 shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isSelected
                    ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-[var(--text-secondary)]"
                )}
              >
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {opt.label}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
        {errors.timeline && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1 mt-1">
            <span>&bull;</span> {errors.timeline.message}
          </p>
        )}
      </div>
    </div>
  );
}
