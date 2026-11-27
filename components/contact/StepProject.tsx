"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FullEstimatorInput } from "@/lib/validations/leads";
import { Check, Plus, X, SlidersHorizontal, Clock } from "lucide-react";
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

const EXTRA_CAPABILITY_SUGGESTIONS = [
  "Mobile App (iOS / Android)",
  "DevOps & CI/CD",
  "Payment & Billing Integration",
  "Data Pipeline & Analytics",
  "Third-Party API Integration",
];

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "BDT", symbol: "৳" },
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

  // Custom Capabilities state
  const [showCustomCapInput, setShowCustomCapInput] = useState(false);
  const [customCapText, setCustomCapText] = useState("");

  // Custom Budget state
  const isPresetBudget = BUDGET_TIERS.some((b) => b.value === selectedBudget);
  const [customBudgetMode, setCustomBudgetMode] = useState(
    Boolean(selectedBudget && !isPresetBudget)
  );
  const [budgetCurrency, setBudgetCurrency] = useState("USD");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Custom Timeline state
  const isPresetTimeline = TIMELINE_OPTIONS.some((t) => t.value === selectedTimeline);
  const [customTimelineMode, setCustomTimelineMode] = useState(
    Boolean(selectedTimeline && !isPresetTimeline)
  );
  const [timelineLength, setTimelineLength] = useState("");
  const [timelineUnit, setTimelineUnit] = useState<"Days" | "Weeks" | "Months">("Weeks");
  const [timelineNote, setTimelineNote] = useState("");

  const presetTitles = new Set(servicesList.map((s) => s.title));
  const customSelectedServices = selectedServices.filter((s) => !presetTitles.has(s));

  const toggleService = (title: string) => {
    const next = selectedServices.includes(title)
      ? selectedServices.filter((s) => s !== title)
      : [...selectedServices, title];
    setValue("services", next, { shouldValidate: true });
  };

  const addCustomCapability = (rawVal?: string) => {
    const val = (rawVal ?? customCapText).trim();
    if (!val) return;
    if (!selectedServices.includes(val)) {
      setValue("services", [...selectedServices, val], { shouldValidate: true });
    }
    if (!rawVal) setCustomCapText("");
  };

  const syncCustomBudget = (curr: string, minVal: string, maxVal: string) => {
    const sym = CURRENCIES.find((c) => c.code === curr)?.symbol || "$";
    const cleanMin = minVal.trim();
    const cleanMax = maxVal.trim();
    if (!cleanMin && !cleanMax) {
      setValue("budgetTier", "", { shouldValidate: true });
      return;
    }
    const formatted =
      cleanMin && cleanMax
        ? `${sym}${cleanMin} - ${sym}${cleanMax} ${curr}`
        : `${sym}${cleanMin || cleanMax} ${curr}`;
    setValue("budgetTier", formatted, { shouldValidate: true });
  };

  const syncCustomTimeline = (len: string, unit: string, note: string) => {
    const cleanLen = len.trim();
    const cleanNote = note.trim();
    if (!cleanLen && !cleanNote) {
      setValue("timeline", "", { shouldValidate: true });
      return;
    }
    const base = cleanLen ? `${cleanLen} ${unit}` : "";
    const formatted = base && cleanNote ? `${base} (${cleanNote})` : base || cleanNote;
    setValue("timeline", formatted, { shouldValidate: true });
  };

  return (
    <div className="space-y-7">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
          <span className="uppercase tracking-wider font-semibold text-[var(--brand-primary)]">
            Step 2 of 3
          </span>
          <span>Scope & Allocation</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Engineering Scope &amp; Budget Tier
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
          Select core technical domains, add custom requirements, and set your exact budget and timeline.
        </p>
      </div>

      {/* 1. Services Multi-Select + Custom Capabilities */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-[var(--text-primary)]">
          Required Capabilities &amp; Domains <span className="text-[var(--error)]">*</span>
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
                <div className="min-w-0">
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

          {/* Other / Custom Capability Trigger Card */}
          <button
            type="button"
            onClick={() => setShowCustomCapInput((v) => !v)}
            aria-expanded={showCustomCapInput}
            className={cn(
              "p-3.5 rounded-xl text-left border border-dashed transition-all duration-150 flex items-start gap-3 shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
              showCustomCapInput || customSelectedServices.length > 0
                ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                : "bg-[var(--bg-surface)]/70 border-[var(--border-strong)] hover:border-[var(--brand-primary)] text-[var(--text-secondary)]"
            )}
          >
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 bg-[var(--brand-primary)]/12 text-[var(--brand-primary)]">
              <Plus size={13} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Other / Custom Capability
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Add mobile, DevOps, integrations, or custom technical scope
              </div>
            </div>
          </button>
        </div>

        {/* Custom Capabilities Input & Quick Chips */}
        {(showCustomCapInput || customSelectedServices.length > 0) && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customCapText}
                onChange={(e) => setCustomCapText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomCapability();
                  }
                }}
                placeholder="Type a custom capability (e.g. Flutter Mobile App, AWS Migration)..."
                className="flex-1 h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <button
                type="button"
                onClick={() => addCustomCapability()}
                className="h-10 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Quick-Add Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] mr-1">
                Quick add:
              </span>
              {EXTRA_CAPABILITY_SUGGESTIONS.map((item) => {
                const active = selectedServices.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleService(item)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] border transition-colors",
                      active
                        ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)] font-semibold"
                        : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
                    )}
                  >
                    {active ? "✓ " : "+ "}
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Added Custom Chips */}
            {customSelectedServices.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                {customSelectedServices.map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/30 text-xs font-semibold text-[var(--brand-primary)]"
                  >
                    <span>{cap}</span>
                    <button
                      type="button"
                      onClick={() => toggleService(cap)}
                      aria-label={`Remove ${cap}`}
                      className="hover:text-[var(--error)] transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {errors.services && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1 mt-1">
            <span>&bull;</span> {errors.services.message}
          </p>
        )}
      </div>

      {/* 2. Target Budget Range + Custom Price Builder */}
      <div className="space-y-3 pt-1">
        <label className="block text-xs font-semibold text-[var(--text-primary)]">
          Target Budget Range <span className="text-[var(--error)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = !customBudgetMode && selectedBudget === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => {
                  setCustomBudgetMode(false);
                  setValue("budgetTier", tier.value, { shouldValidate: true });
                }}
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

          {/* Custom Budget Card */}
          <button
            type="button"
            onClick={() => {
              setCustomBudgetMode(true);
              syncCustomBudget(budgetCurrency, budgetMin, budgetMax);
            }}
            aria-pressed={customBudgetMode}
            className={cn(
              "sm:col-span-2 p-3 rounded-xl text-left border border-dashed transition-all duration-150 shadow-sm flex items-center justify-between gap-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
              customBudgetMode
                ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                : "bg-[var(--bg-surface)]/70 border-[var(--border-strong)] hover:border-[var(--brand-primary)] text-[var(--text-secondary)]"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                <SlidersHorizontal size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Custom Budget / Exact Price Range
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Specify your exact target budget or min–max range in your preferred currency
                </div>
              </div>
            </div>
            {customBudgetMode && selectedBudget && (
              <span className="font-mono text-[11px] font-bold text-[var(--brand-primary)] px-2.5 py-1 rounded-md bg-[var(--brand-primary)]/10 shrink-0">
                {selectedBudget}
              </span>
            )}
          </button>
        </div>

        {customBudgetMode && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)]">
                Currency
              </label>
              <select
                value={budgetCurrency}
                onChange={(e) => {
                  const nextCurr = e.target.value;
                  setBudgetCurrency(nextCurr);
                  syncCustomBudget(nextCurr, budgetMin, budgetMax);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)]">
                Min / Target Price <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 5,000"
                value={budgetMin}
                onChange={(e) => {
                  const val = e.target.value;
                  setBudgetMin(val);
                  syncCustomBudget(budgetCurrency, val, budgetMax);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)]">
                Max Price <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 8,500"
                value={budgetMax}
                onChange={(e) => {
                  const val = e.target.value;
                  setBudgetMax(val);
                  syncCustomBudget(budgetCurrency, budgetMin, val);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
          </div>
        )}

        {errors.budgetTier && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1 mt-1">
            <span>&bull;</span> {errors.budgetTier.message}
          </p>
        )}
      </div>

      {/* 3. Target Timeline + Custom Duration Builder */}
      <div className="space-y-3 pt-1">
        <label className="block text-xs font-semibold text-[var(--text-primary)]">
          Target Deployment Timeline <span className="text-[var(--error)]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIMELINE_OPTIONS.map((opt) => {
            const isSelected = !customTimelineMode && selectedTimeline === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setCustomTimelineMode(false);
                  setValue("timeline", opt.value, { shouldValidate: true });
                }}
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

          {/* Custom Timeline Card */}
          <button
            type="button"
            onClick={() => {
              setCustomTimelineMode(true);
              syncCustomTimeline(timelineLength, timelineUnit, timelineNote);
            }}
            aria-pressed={customTimelineMode}
            className={cn(
              "sm:col-span-2 p-3 rounded-xl text-left border border-dashed transition-all duration-150 shadow-sm flex items-center justify-between gap-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
              customTimelineMode
                ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]"
                : "bg-[var(--bg-surface)]/70 border-[var(--border-strong)] hover:border-[var(--brand-primary)] text-[var(--text-secondary)]"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                <Clock size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Custom Timeline / Exact Project Length
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Set an exact number of days, weeks, or months, plus target launch notes
                </div>
              </div>
            </div>
            {customTimelineMode && selectedTimeline && (
              <span className="font-mono text-[11px] font-bold text-[var(--brand-primary)] px-2.5 py-1 rounded-md bg-[var(--brand-primary)]/10 shrink-0">
                {selectedTimeline}
              </span>
            )}
          </button>
        </div>

        {customTimelineMode && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)]">
                Duration <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 6"
                value={timelineLength}
                onChange={(e) => {
                  const val = e.target.value;
                  setTimelineLength(val);
                  syncCustomTimeline(val, timelineUnit, timelineNote);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)]">
                Unit
              </label>
              <select
                value={timelineUnit}
                onChange={(e) => {
                  const nextUnit = e.target.value as "Days" | "Weeks" | "Months";
                  setTimelineUnit(nextUnit);
                  syncCustomTimeline(timelineLength, nextUnit, timelineNote);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              >
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)]">
                Milestone Note <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MVP by Q2"
                value={timelineNote}
                onChange={(e) => {
                  const val = e.target.value;
                  setTimelineNote(val);
                  syncCustomTimeline(timelineLength, timelineUnit, val);
                }}
                className="w-full h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
            </div>
          </div>
        )}

        {errors.timeline && (
          <p className="text-xs text-[var(--error)] flex items-center gap-1 mt-1">
            <span>&bull;</span> {errors.timeline.message}
          </p>
        )}
      </div>
    </div>
  );
}
