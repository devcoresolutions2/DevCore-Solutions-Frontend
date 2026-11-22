"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  whatsappNumber?: string;
  className?: string;
  showText?: boolean;
  message?: string;
}

export function WhatsAppButton({
  whatsappNumber = "8801700000000",
  className,
  showText = false,
  message = "Hi, I'd like to discuss a project with DevCore Solutions.",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border transition-colors duration-150",
        "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 text-[var(--success)]",
        "hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
        showText ? "h-10 px-4 text-xs font-semibold" : "w-9 h-9",
        className
      )}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={16} aria-hidden="true" />
      {showText && <span>WhatsApp</span>}
    </a>
  );
}
