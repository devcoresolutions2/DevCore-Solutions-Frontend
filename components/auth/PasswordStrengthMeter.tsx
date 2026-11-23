"use client";

import React, { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const analysis = useMemo(() => {
    const hasMinLength = password.length >= 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    const score = [hasMinLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

    let label = "Weak";
    let color = "bg-rose-500";
    let textColor = "text-rose-500";

    if (score === 2) {
      label = "Fair";
      color = "bg-amber-500";
      textColor = "text-amber-500";
    } else if (score === 3) {
      label = "Good";
      color = "bg-blue-500";
      textColor = "text-blue-500";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-emerald-500";
      textColor = "text-emerald-500";
    }

    return {
      hasMinLength,
      hasLetter,
      hasNumber,
      hasSpecial,
      score,
      label,
      color,
      textColor,
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2 pt-1 animate-fadeIn">
      {/* 4 Segmented Strength Bars */}
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <span className="text-[var(--text-tertiary)]">Password Strength:</span>
        <span className={`font-semibold ${analysis.textColor}`}>{analysis.label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              analysis.score >= step ? analysis.color : "bg-[var(--border-subtle)]"
            }`}
          />
        ))}
      </div>

      {/* Requirement Checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-1 text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5">
          {analysis.hasMinLength ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <X className="w-3 h-3 text-[var(--text-tertiary)]" />
          )}
          <span className={analysis.hasMinLength ? "text-[var(--text-primary)]" : ""}>
            10+ characters
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasLetter ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <X className="w-3 h-3 text-[var(--text-tertiary)]" />
          )}
          <span className={analysis.hasLetter ? "text-[var(--text-primary)]" : ""}>
            Letters (a-z)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasNumber ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <X className="w-3 h-3 text-[var(--text-tertiary)]" />
          )}
          <span className={analysis.hasNumber ? "text-[var(--text-primary)]" : ""}>
            Numbers (0-9)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {analysis.hasSpecial ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <X className="w-3 h-3 text-[var(--text-tertiary)]" />
          )}
          <span className={analysis.hasSpecial ? "text-[var(--text-primary)]" : ""}>
            Special symbol
          </span>
        </div>
      </div>
    </div>
  );
}
