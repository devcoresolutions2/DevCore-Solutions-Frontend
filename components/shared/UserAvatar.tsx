"use client";

import React, { useState } from "react";
import { getOptimizedAvatarUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: 64 | 96 | 256 | 512;
  className?: string;
  textClassName?: string;
}

export function UserAvatar({
  name,
  avatarUrl,
  size = 96,
  className,
  textClassName,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = (name || "U")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const optimizedUrl = getOptimizedAvatarUrl(avatarUrl, size);

  if (optimizedUrl && !imgError) {
    return (
      <img
        src={optimizedUrl}
        alt={name ? `${name} profile picture` : "User avatar"}
        onError={() => setImgError(true)}
        className={cn(
          "object-cover rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] shrink-0",
          className
        )}
      />
    );
  }

  return (
    <div
      aria-label={name ? `${name} initials` : "User initials"}
      className={cn(
        "rounded-full bg-[var(--brand-primary)] text-[var(--brand-contrast)] flex items-center justify-center font-display font-bold select-none shrink-0",
        className
      )}
    >
      <span className={cn("leading-none", textClassName)}>{initials}</span>
    </div>
  );
}
