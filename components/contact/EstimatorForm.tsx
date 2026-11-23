"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fullEstimatorSchema,
  estimatorStep1Schema,
  estimatorStep2Schema,
  estimatorStep3Schema,
  FullEstimatorInput,
} from "@/lib/validations/leads";
import { submitLead, ContactSettings, ShowcaseItem } from "@/lib/api";
import { EstimatorStepper } from "./EstimatorStepper";
import { StepContact } from "./StepContact";
import { StepProject } from "./StepProject";
import { StepBrief } from "./StepBrief";
import { ConfirmationView } from "./ConfirmationView";
import { PrefillChip } from "./PrefillChip";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EstimatorFormProps {
  settings: ContactSettings;
  servicesList: { id: string; title: string; description: string }[];
  relatedItems?: ShowcaseItem[];
  initialProject?: string;
  initialService?: string;
}

export function EstimatorForm({
  settings,
  servicesList,
  relatedItems = [],
  initialProject,
  initialService,
}: EstimatorFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachableStep, setMaxReachableStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<
    (Partial<FullEstimatorInput> & { reference?: string }) | null
  >(null);
  const [projectPrefill, setProjectPrefill] = useState<string | null>(initialProject || null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const form = useForm<FullEstimatorInput>({
    resolver: zodResolver(fullEstimatorSchema) as any,
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      workEmail: "",
      countryCode: "+880",
      phone: "",
      company: "",
      role: "",
      services: initialService ? [initialService] : [],
      budgetTier: "",
      timeline: "",
      brief: initialProject
        ? `Inquiring about engineering architecture and implementation scope similar to the ${initialProject} platform build.\n\nKey requirements: `
        : "",
      attachmentNote: "",
      consent: true as any,
      honeypot: "",
    },
  });

  const { trigger, getValues, reset } = form;

  // Countdown timer for 429 rate limit
  useEffect(() => {
    if (!retryAfter || retryAfter <= 0) return;
    const timer = setInterval(() => {
      setRetryAfter((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfter]);

  const handleNextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(["fullName", "workEmail", "phone", "company", "role"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["services", "budgetTier", "timeline"]);
    }

    if (isValid) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next > maxReachableStep) {
        setMaxReachableStep(next);
      }
      // Scroll to form top smoothly
      const el = document.getElementById("estimator-container");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Focus first error field
      const firstError = Object.keys(form.formState.errors)[0];
      if (firstError) {
        const input = document.getElementById(firstError) || document.querySelector(`[name="${firstError}"]`);
        (input as HTMLElement)?.focus();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FullEstimatorInput) => {
    if (retryAfter && retryAfter > 0) {
      toast.error(`Rate limited. Please wait ${retryAfter} seconds before resubmitting.`);
      return;
    }

    // Silent honeypot check
    if (data.honeypot && data.honeypot.length > 0) {
      setSubmissionResult({ ...data, reference: "DC-VERIFIED" });
      return;
    }

    try {
      setIsSubmitting(true);
      const idempotencyKey = crypto.randomUUID();
      const pageUrl = typeof window !== "undefined" ? window.location.href : "/contact";

      // Read UTM params from URL
      const utmParams: Record<string, string> = {};
      if (typeof window !== "undefined") {
        const sp = new URLSearchParams(window.location.search);
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
          const val = sp.get(k);
          if (val) utmParams[k] = val;
        });
      }

      const response = await submitLead({
        name: data.fullName,
        email: data.workEmail,
        phone: `${data.countryCode} ${data.phone}`.trim(),
        company: data.company,
        role: data.role,
        services: data.services,
        budgetTier: data.budgetTier,
        timeline: data.timeline,
        brief: data.brief,
        pageUrl,
        source: "ESTIMATOR",
        utmParams,
        idempotencyKey,
      });

      setSubmissionResult({
        ...data,
        reference: response.reference || `DC-${Date.now().toString().slice(-6)}`,
      });
    } catch (err: any) {
      if (err?.message?.includes("RATE_LIMITED") || err?.status === 429) {
        setRetryAfter(60);
        toast.error("High submission volume. Please wait 60 seconds before trying again.");
      } else {
        toast.error("Could not transmit inquiry. Please try again or reach out on WhatsApp.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <ConfirmationView
        submission={submissionResult}
        settings={settings}
        relatedItems={relatedItems}
        onReset={() => {
          reset();
          setSubmissionResult(null);
          setCurrentStep(1);
          setMaxReachableStep(1);
        }}
      />
    );
  }

  return (
    <div id="estimator-container" className="space-y-4">
      {/* Prefill Notice Chip */}
      {projectPrefill && (
        <div className="flex items-center gap-2">
          <PrefillChip
            projectTitle={projectPrefill}
            onRemove={() => setProjectPrefill(null)}
          />
        </div>
      )}

      {/* Main Glass Card Form Container */}
      <div className="devcore-glass-card rounded-2xl overflow-hidden shadow-xl border border-[var(--border-subtle)] bg-[var(--glass-surface)]">
        {/* Stepper Header */}
        <EstimatorStepper
          currentStep={currentStep}
          maxReachableStep={maxReachableStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Step Form Body */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
          {currentStep === 1 && <StepContact form={form} />}
          {currentStep === 2 && <StepProject form={form} servicesList={servicesList} />}
          {currentStep === 3 && <StepBrief form={form} />}

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Lock size={14} className="text-[var(--brand-primary)] shrink-0" />
              <span>TLS 1.3 encrypted transmission. Zero third-party tracker retention.</span>
            </div>

            <div className="flex items-center gap-3 justify-end">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || (retryAfter !== null && retryAfter > 0)}
                  className="px-6 py-2.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : retryAfter ? (
                    <span>Wait {retryAfter}s</span>
                  ) : (
                    <>
                      <span>Transmit Technical Inquiry</span>
                      <Check size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
