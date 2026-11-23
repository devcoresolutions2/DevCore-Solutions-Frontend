"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const COUNTRY_CODES = [
  { code: "+880", label: "BD +880", country: "Bangladesh" },
  { code: "+1", label: "US/CA +1", country: "United States / Canada" },
  { code: "+44", label: "UK +44", country: "United Kingdom" },
  { code: "+49", label: "DE +49", country: "Germany" },
  { code: "+65", label: "SG +65", country: "Singapore" },
  { code: "+971", label: "AE +971", country: "United Arab Emirates" },
  { code: "+91", label: "IN +91", country: "India" },
  { code: "+61", label: "AU +61", country: "Australia" },
  { code: "+81", label: "JP +81", country: "Japan" },
  { code: "+41", label: "CH +41", country: "Switzerland" },
];

interface PhoneFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  helperText?: string;
}

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      countryCode,
      onCountryCodeChange,
      className,
      error,
      helperText,
      id = "phone-input",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1.5">
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            aria-label="Country Dial Code"
            className={cn(
              "h-11 px-3 rounded-lg font-mono text-xs",
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent",
              "transition-all cursor-pointer shadow-sm select-none"
            )}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            ref={ref}
            id={id}
            type="tel"
            className={cn(
              "flex-1 h-11 px-3.5 rounded-lg text-sm",
              "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]",
              "placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent",
              "transition-all shadow-sm",
              error && "border-[var(--error)] focus:ring-[var(--error)]",
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-xs text-[var(--error)] flex items-center gap-1">
            <span>&bull;</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

PhoneField.displayName = "PhoneField";
