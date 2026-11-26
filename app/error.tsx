"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import {
    RotateCcw,
    Home,
    AlertTriangle,
    Copy,
    Check,
    Terminal,
    MessageSquare,
    ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const [copiedDigest, setCopiedDigest] = useState(false);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const spotX = useMotionValue(420);
    const spotY = useMotionValue(220);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
        stiffness: 220,
        damping: 26,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
        stiffness: 220,
        damping: 26,
    });

    const spotlightBg = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 15%, transparent), transparent 74%)`;

    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            console.error("App Error Boundary caught:", error);
        }
    }, [error]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        mouseX.set(localX / rect.width - 0.5);
        mouseY.set(localY / rect.height - 0.5);
        spotX.set(localX);
        spotY.set(localY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const errorCode = error?.digest || "RUNTIME_BOUNDARY_FAULT";
    const safeMessage =
        process.env.NODE_ENV === "development" && error?.message
            ? error.message
            : "An unexpected rendering or data-fetch interruption occurred on this route.";

    const handleCopyDiagnostic = async () => {
        const summary = `DevCore Error Boundary | Code: ${errorCode} | Message: ${safeMessage}`;
        try {
            await navigator.clipboard.writeText(summary);
            setCopiedDigest(true);
            setTimeout(() => setCopiedDigest(false), 2000);
        } catch {
            // ignore restricted clipboard environments
        }
    };

    return (
        <main
            aria-labelledby="error-boundary-heading"
            className="relative isolate overflow-hidden min-h-[82vh] flex items-center justify-center px-4 sm:px-6 pt-28 pb-24"
        >
            {/* Ambient Studio Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.06, 0.98, 1],
                        opacity: [0.65, 0.88, 0.65],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="h-[540px] w-[540px] sm:w-[900px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 15%, transparent) 0%, color-mix(in oklab, var(--success) 7%, transparent) 46%, transparent 72%)",
                        filter: "blur(52px)",
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto w-full" style={{ perspective: 1200 }}>
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
                    }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative rounded-3xl devcore-glass-card bg-[var(--bg-elevated)]/88 backdrop-blur-2xl border p-7 sm:p-10 lg:p-12 shadow-xl overflow-hidden"
                >
                    {/* Cursor-Tracked Optical Glass Spotlight */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: spotlightBg }}
                    />

                    {/* Top & Bottom Specular Glass Rims */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/70 to-transparent"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-20 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--success)]/50 to-transparent"
                    />

                    {/* Top Telemetry Header */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-7 mb-8 border-b border-[var(--border-subtle)]/80">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">
                            <AlertTriangle size={13} className="shrink-0" />
                            <span>HTTP 500 // RECOVERABLE BOUNDARY</span>
                        </div>

                        <div className="inline-flex items-center gap-2 font-mono text-xs bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] px-3 py-1.5 rounded-xl">
                            <Terminal size={12} className="text-[var(--brand-primary)] shrink-0" />
                            <span className="text-[var(--text-muted)] hidden sm:inline">TRACE:</span>
                            <code className="text-[var(--text-primary)] font-semibold max-w-[180px] sm:max-w-[240px] truncate">
                                {errorCode}
                            </code>
                            <button
                                type="button"
                                onClick={handleCopyDiagnostic}
                                title="Copy error trace details"
                                className="p-1 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                            >
                                {copiedDigest ? (
                                    <Check size={12} className="text-[var(--success)]" />
                                ) : (
                                    <Copy size={12} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Main Error Content */}
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-3">
                            <BrandLogo size="sm" />
                            <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)]">
                                · DevCore Solutions Fault Isolation
                            </span>
                        </div>

                        <div style={{ gap: "1.25rem" }} className="flex flex-wrap items-baseline select-none">
                            <motion.span
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="font-mono font-extrabold text-6xl sm:text-7xl tracking-tight leading-none text-liquid-gradient"
                            >
                                500
                            </motion.span>

                            <span className="px-3 py-1 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] font-mono font-bold text-sm sm:text-base tracking-widest text-[var(--text-primary)]">
                                SYSTEM FAULT
                            </span>
                        </div>

                        <h1
                            id="error-boundary-heading"
                            className="font-display font-extrabold text-2xl sm:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.12] max-w-2xl"
                        >
                            We hit a temporary{" "}
                            <span className="text-liquid-gradient">execution snag.</span>
                        </h1>

                        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                            {safeMessage}
                        </p>

                        {/* Recovery Actions */}
                        <div className="pt-2 flex flex-wrap items-center gap-3.5">
                            <button
                                type="button"
                                onClick={reset}
                                className="btn-liquid-hover inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-6 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] shadow-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                            >
                                <RotateCcw size={15} />
                                <span>Retry Rendering</span>
                            </button>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                            >
                                <Home size={15} className="text-[var(--brand-primary)]" />
                                <span>Return Home</span>
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                            >
                                <MessageSquare size={15} className="text-[var(--success)]" />
                                <span>Report to Engineering</span>
                            </Link>
                        </div>

                        {/* Bottom Isolation Assurance Strip */}
                        <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]/80 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-[var(--text-muted)]">
                            <span className="inline-flex items-center gap-1.5 text-[var(--success)] font-semibold">
                                <ShieldCheck size={13} />
                                <span>Isolated to this route · Global layout intact</span>
                            </span>
                            <span>dev.core.solution2@gmail.com</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}