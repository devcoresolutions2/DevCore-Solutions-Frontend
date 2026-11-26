"use client";

import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface CallButtonProps {
  phone?: string;
  className?: string;
  showText?: boolean;
}

export function CallButton({
  phone,
  className,
  showText = false,
}: CallButtonProps) {
  if (!phone) return null;

  return (
    <a
      href={`tel:${phone}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border transition-colors duration-150",
        "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 text-[var(--text-primary)]",
        "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
        showText ? "h-10 px-4 text-xs font-semibold" : "w-9 h-9",
        className
      )}
      aria-label={`Call ${phone}`}
      title={`Call ${phone}`}
    >
      <Phone size={16} aria-hidden="true" />
      {showText && <span>Call Us</span>}
    </a>
  );
}
