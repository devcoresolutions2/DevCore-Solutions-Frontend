"use client";

import { UseFormReturn } from "react-hook-form";
import { FullEstimatorInput } from "@/lib/validations/leads";
import { PhoneField } from "./PhoneField";
import { cn } from "@/lib/utils";

interface StepContactProps {
  form: UseFormReturn<FullEstimatorInput>;
}

export function StepContact({ form }: StepContactProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const countryCode = watch("countryCode") || "+880";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
          <span className="uppercase tracking-wider font-semibold text-[var(--brand-primary)]">
            Step 1 of 3
          </span>
          <span>Estimated: 2 min</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Primary Contact & Organization
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
          We route engineering inquiries directly to systems architects experienced in distributed runtimes, enterprise APIs, and high-scale SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-semibold text-[var(--text-primary)]">
            Full Name <span className="text-[var(--error)]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Samin Yasar"
            className={cn(
              "w-full h-11 px-3.5 rounded-lg text-sm",
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
              "placeholder:text-[var(--text-muted)] shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all",
              errors.fullName && "border-[var(--error)] focus:ring-[var(--error)]"
            )}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p className="text-xs text-[var(--error)] flex items-center gap-1">
              <span>&bull;</span> {errors.fullName.message}
            </p>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)]">Designated executive or engineering lead.</p>
          )}
        </div>

        {/* Work Email */}
        <div className="space-y-1.5">
          <label htmlFor="workEmail" className="block text-xs font-semibold text-[var(--text-primary)]">
            Work Email <span className="text-[var(--error)]">*</span>
          </label>
          <input
            id="workEmail"
            type="email"
            placeholder="name@company.com"
            className={cn(
              "w-full h-11 px-3.5 rounded-lg text-sm",
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
              "placeholder:text-[var(--text-muted)] shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all",
              errors.workEmail && "border-[var(--error)] focus:ring-[var(--error)]"
            )}
            {...register("workEmail")}
          />
          {errors.workEmail ? (
            <p className="text-xs text-[var(--error)] flex items-center gap-1">
              <span>&bull;</span> {errors.workEmail.message}
            </p>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)]">Detailed scope and review feedback will be sent here.</p>
          )}
        </div>

        {/* Phone / WhatsApp with Country Selector */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs font-semibold text-[var(--text-primary)]">
            Phone / WhatsApp <span className="text-[var(--error)]">*</span>
          </label>
          <PhoneField
            id="phone"
            countryCode={countryCode}
            onCountryCodeChange={(val) => setValue("countryCode", val, { shouldValidate: true })}
            placeholder="1700 000000"
            error={errors.phone?.message}
            helperText="Direct line or WhatsApp for instant notification."
            {...register("phone")}
          />
        </div>

        {/* Company / Organization */}
        <div className="space-y-1.5">
          <label htmlFor="company" className="block text-xs font-semibold text-[var(--text-primary)]">
            Company / Organization <span className="text-[var(--text-muted)] text-[11px] font-normal">(Optional)</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder="e.g. Apex Global Systems"
            className={cn(
              "w-full h-11 px-3.5 rounded-lg text-sm",
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
              "placeholder:text-[var(--text-muted)] shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all",
              errors.company && "border-[var(--error)] focus:ring-[var(--error)]"
            )}
            {...register("company")}
          />
          <p className="text-[11px] text-[var(--text-muted)]">Operating entity or business name.</p>
        </div>

        {/* Job Role / Technical Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="role" className="block text-xs font-semibold text-[var(--text-primary)]">
            Job Role / Title <span className="text-[var(--text-muted)] text-[11px] font-normal">(Optional)</span>
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Founder, CTO, VP of Engineering, Product Lead"
            className={cn(
              "w-full h-11 px-3.5 rounded-lg text-sm",
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
              "placeholder:text-[var(--text-muted)] shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all",
              errors.role && "border-[var(--error)] focus:ring-[var(--error)]"
            )}
            {...register("role")}
          />
          <p className="text-[11px] text-[var(--text-muted)]">
            Helps us assemble the right senior peers for preliminary technical discovery.
          </p>
        </div>
      </div>
    </div>
  );
}
