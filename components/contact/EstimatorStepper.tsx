"use client";

import { UserCheck, Layers, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface EstimatorStepperProps {
  currentStep: number; // 1, 2, 3
  onStepClick?: (step: number) => void;
  maxReachableStep?: number;
}

const STEPS = [
  { step: 1, label: "01 Contact", sub: "Identity & Organization", icon: UserCheck },
  { step: 2, label: "02 Project", sub: "Scope & Budget", icon: Layers },
  { step: 3, label: "03 Brief", sub: "Requirements & Specs", icon: FileCode },
];

export function EstimatorStepper({
  currentStep,
  onStepClick,
  maxReachableStep = 1,
}: EstimatorStepperProps) {
  return (
    <div className="px-6 sm:px-8 pt-8 pb-6 bg-[var(--bg-surface)]/70 border-b border-[var(--border-subtle)]">
      <div className="relative flex items-center justify-between">
        {/* Track Line */}
        <div
          className="absolute left-6 right-6 top-5 h-0.5 bg-[var(--border-subtle)] -z-0"
          aria-hidden="true"
        />
        {/* Active Progress Line */}
        <div
          className="absolute left-6 top-5 h-0.5 bg-[var(--brand-primary)] transition-all duration-300 -z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "calc(100% - 3rem)",
          }}
          aria-hidden="true"
        />

        {STEPS.map(({ step, label, sub, icon: Icon }) => {
          const isActive = currentStep === step;
          const isDone = currentStep > step;
          const isReachable = step <= maxReachableStep;

          return (
            <div
              key={step}
              className={cn(
                "relative z-10 flex flex-col gap-1",
                step === 1 ? "items-start" : step === 2 ? "items-center" : "items-end"
              )}
            >
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => isReachable && onStepClick?.(step)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isActive
                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] scale-105"
                    : isDone
                    ? "bg-[var(--bg-elevated)] border border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10"
                    : "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-80 cursor-not-allowed"
                )}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </button>
              <span className="text-[11px] font-mono text-[var(--text-muted)] px-1 hidden sm:inline-block">
                {sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
