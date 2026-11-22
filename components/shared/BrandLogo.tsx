"use client";

import { Cpu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function BrandLogo({ className, size = "md", href = "/" }: BrandLogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  const monoSize = size === "sm" ? "text-[8px]" : "text-[9px]";
  const lucideSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

  const inner = (
    <span className={cn("flex items-center gap-2.5 group select-none", className)}>
      <span
        className={cn(
          iconSize,
          "rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-[var(--brand-contrast)] shadow-sm border border-[var(--border-subtle)]",
          "logo-hover-glint transition-transform duration-300"
        )}
      >
        <Cpu size={lucideSize} className="text-[var(--brand-contrast)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-extrabold tracking-tight text-[var(--text-primary)]",
            textSize
          )}
        >
          DevCore<span className="text-[var(--brand-primary)]">.</span>
        </span>
        <span
          className={cn(
            "font-mono uppercase tracking-wider text-[var(--text-muted)]",
            monoSize
          )}
        >
          Engineering
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="DevCore Solutions — Home">
        {inner}
      </Link>
    );
  }

  return inner;
}
