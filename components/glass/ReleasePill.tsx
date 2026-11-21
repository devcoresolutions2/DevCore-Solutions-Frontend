import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ReleasePillProps {
  children: ReactNode;
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function ReleasePill({ children, className, dot, dotColor = "var(--success)" }: ReleasePillProps) {
  return (
    <span
      className={cn(
        "devcore-glass-badge inline-flex items-center gap-1.5",
        "font-mono text-xs rounded-full px-3.5 py-1",
        "text-[var(--accent-ink)]",
        className
      )}
    >
      {dot && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
