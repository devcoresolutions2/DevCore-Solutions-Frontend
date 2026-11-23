"use client";

import { X, Sparkles } from "lucide-react";

interface PrefillChipProps {
  projectTitle: string;
  onRemove: () => void;
}

export function PrefillChip({ projectTitle, onRemove }: PrefillChipProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-xs text-[var(--text-primary)] shadow-sm animate-fadeIn">
      <Sparkles size={14} className="text-[var(--brand-primary)]" />
      <span>
        Scope reference: <strong className="font-semibold text-[var(--brand-primary)]">{projectTitle}</strong>
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)]"
        aria-label="Remove scope reference"
      >
        <X size={14} />
      </button>
    </div>
  );
}
