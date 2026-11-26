"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlobalLoaderProps {
  /** Use "fullscreen" for route/auth transitions or "inline" for embedded loading states */
  variant?: "fullscreen" | "inline";
  /** Optional label for screen readers and accessible status */
  label?: string;
}

const STATUS_MESSAGES = [
  "Loading DevCore Solutions...",
  "Syncing system architecture...",
  "Preparing workspace...",
];

/**
 * DevCore Solutions geometric "D" + isometric cube mark loader with brand wordmark
 * and subtle status telemetry. Preserves fullscreen overlay coverage and theme tokens.
 */
export function GlobalLoader({
  variant = "fullscreen",
  label = "Loading DevCore Solutions",
}: GlobalLoaderProps) {
  const isFullscreen = variant === "fullscreen";
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[9999] h-screen w-screen flex items-center justify-center bg-[var(--bg-canvas)] overflow-hidden"
    : "min-h-[60vh] w-full flex items-center justify-center relative overflow-hidden";

  return (
    <div className={containerClass} role="status" aria-label={label}>
      {isFullscreen && (
        <div
          aria-hidden="true"
          className="fixed top-0 inset-x-0 h-[2px] z-[10000] overflow-hidden bg-[var(--border-subtle)]/40"
        >
          <div className="h-full w-1/3 bg-[var(--brand-primary)] animate-[devcore-progress_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Subtle ambient aura */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute w-52 h-52 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 24%, transparent) 0%, color-mix(in oklab, var(--success) 8%, transparent) 55%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6">
        {/* Emblem Stage */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Outer track */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/55 to-transparent"
            />
          </div>

          {/* Counter-orbiting outer halo */}
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-[22px] border border-transparent border-b-[var(--brand-primary)]/25 border-l-[var(--brand-primary)]/15 animate-spin"
            style={{ animationDuration: "2.2s", animationDirection: "reverse" }}
          />

          {/* Precision orbiting arc */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-[20px] border-2 border-transparent border-t-[var(--brand-primary)] border-r-[var(--brand-primary)]/30 animate-spin"
            style={{ animationDuration: "0.95s" }}
          />

          {/* DevCore Icon-Only "D" + Isometric Cube Mark */}
          <motion.div
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex items-center justify-center overflow-hidden rounded-xl"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="relative z-10 text-[var(--brand-primary)]"
            >
              {/* Upper D arch & stem */}
              <path
                d="M5 6.5C5 5.4 5.9 4.5 7 4.5H17.5C25.5 4.5 31 9.6 31 18C31 26.4 25.5 31.5 17.5 31.5H7C5.9 31.5 5 30.6 5 29.5V16.2L17.6 9.3L26.2 14.2V21.8L17.6 26.7L11.2 23.1V17.4L17.6 13.8"
                fill="currentColor"
                fillOpacity="0.18"
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

            {/* Subtle periodic light reflection sweep */}
            <motion.span
              aria-hidden="true"
              animate={{ x: ["-160%", "240%"] }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12"
            />
          </motion.div>
        </div>

        {/* Brand Wordmark & Cycling Telemetry Text */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="font-display font-extrabold text-sm tracking-tight text-[var(--text-primary)]">
            DevCore <span className="text-liquid-gradient">Solutions</span>
          </div>

          <div className="h-5 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={STATUS_MESSAGES[msgIndex]}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="font-mono text-[11px] text-[var(--text-muted)] tracking-wide"
              >
                {STATUS_MESSAGES[msgIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalLoader;