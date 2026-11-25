"use client";

import React from "react";

interface GlobalLoaderProps {
  /** Use "fullscreen" for route/auth transitions or "inline" for embedded loading states */
  variant?: "fullscreen" | "inline";
  /** Optional subtle aria-label for screen readers (not rendered as visible text) */
  label?: string;
}

/**
 * Icon-only DevCore geometric "D" mark loader (matches navbar emblem, no text).
 * Features a precision hairline top progress bar + smooth orbiting ring around the D mark.
 */
export function GlobalLoader({
  variant = "fullscreen",
  label = "Loading",
}: GlobalLoaderProps) {
  const containerClass =
    variant === "fullscreen"
      ? "min-h-screen w-full flex items-center justify-center bg-[var(--bg-canvas)]"
      : "min-h-[60vh] w-full flex items-center justify-center";

  return (
    <div className={containerClass} role="status" aria-label={label}>
      {variant === "fullscreen" && (
        <div
          aria-hidden="true"
          className="fixed top-0 inset-x-0 h-[2px] z-[100] overflow-hidden bg-[var(--border-subtle)]/40"
        >
          <div className="h-full w-1/3 bg-[var(--brand-primary)] animate-[devcore-progress_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Subtle outer track */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm"
        />

        {/* Precision orbiting arc */}
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-[20px] border-2 border-transparent border-t-[var(--brand-primary)] border-r-[var(--brand-primary)]/30 animate-spin"
          style={{ animationDuration: "0.95s" }}
        />

        {/* DevCore Icon-Only "D" + Isometric Cube Mark (matches navbar logo, no text) */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="relative z-10 text-[var(--brand-primary)] animate-pulse"
          style={{ animationDuration: "1.8s" }}
        >
          {/* Upper D arch & stem */}
          <path
            d="M5 6.5C5 5.4 5.9 4.5 7 4.5H17.5C25.5 4.5 31 9.6 31 18C31 26.4 25.5 31.5 17.5 31.5H7C5.9 31.5 5 30.6 5 29.5V16.2L17.6 9.3L26.2 14.2V21.8L17.6 26.7L11.2 23.1V17.4L17.6 13.8"
            fill="currentColor"
            fillOpacity="0.16"
          />
          <path
            d="M5 13.2V6.5C5 5.4 5.9 4.5 7 4.5H17.5C24.2 4.5 29.5 8.8 30.7 15.3L26.2 12.7L17.6 7.8L5 14.9V13.2Z"
            fill="currentColor"
          />
          <path
            d="M5 18.2L17.6 11.2L22.2 13.8L12.6 19.2V24.6L17.6 27.4L26.2 22.5V15.5L30.8 18.1C30.8 26.4 25.4 31.5 17.5 31.5H7C5.9 31.5 5 30.6 5 29.5V18.2Z"
            fill="currentColor"
          />
          {/* Inner Isometric Cube */}
          <path
            d="M21.4 14.9L25.2 17.1V21.5L21.4 23.7L17.6 21.5V17.1L21.4 14.9Z"
            fill="currentColor"
          />
          <path
            d="M21.4 14.9L25.2 17.1L21.4 19.3L17.6 17.1L21.4 14.9Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
        </svg>
      </div>
    </div>
  );
}

export default GlobalLoader;
