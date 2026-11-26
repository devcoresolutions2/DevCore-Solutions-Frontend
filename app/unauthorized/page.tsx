"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import {
    ShieldAlert,
    Lock,
    LogIn,
    Home,
    Copy,
    Check,
    Terminal,
    MessageSquare,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

interface RecoveryAction {
    title: string;
    subtitle: string;
    code: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const RECOVERY_ACTIONS: RecoveryAction[] = [
    {
        title: "Authenticate Session",
        subtitle: "Sign in with an authorized DevCore account",
        code: "01 // AUTH",
        href: "/login",
        icon: LogIn,
    },
    {
        title: "Public Command Center",
        subtitle: "Return to the main DevCore Solutions overview",
        code: "02 // HOME",
        href: "/",
        icon: Home,
    },
    {
        title: "Request Access or Support",
        subtitle: "Reach our team for role or workspace permissions",
        code: "03 // ACCESS",
        href: "/contact",
        icon: MessageSquare,
    },
];

export default function UnauthorizedPage() {
    const pathname = usePathname();
    const [copiedCode, setCopiedCode] = useState(false);

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

    const requestedPath = pathname || "/unauthorized";

    const handleCopyDiagnostic = async () => {
        const payload = `DevCore Access Guard | Status: 401/403 Unauthorized | Path: ${requestedPath}`;
        try {
            await navigator.clipboard.writeText(payload);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch {
            // ignore restricted clipboard environments
        }
    };

    return (
        <main
            aria-labelledby="unauthorized-heading"
            className="relative isolate overflow-hidden min-h-[82vh] flex items-center justify-center px-4 sm:px-6 pt-28 pb-24"
        >
            {/* Ambient Studio Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.07, 0.97, 1],
                        opacity: [0.65, 0.88, 0.65],
                    }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
                    className="h-[540px] w-[540px] sm:w-[920px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 15%, transparent) 0%, color-mix(in oklab, var(--success) 7%, transparent) 46%, transparent 72%)",
                        filter: "blur(52px)",
                    }}
                />
            </div>

            <div className="max-w-5xl mx-auto w-full" style={{ perspective: 1200 }}>
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

                    {/* Top Telemetry Bar */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-7 mb-8 border-b border-[var(--border-subtle)]/80">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">
                            <ShieldAlert size={13} className="shrink-0" />
                            <span>HTTP 401 / 403 // ACCESS RESTRICTED</span>
                        </div>

                        <div className="inline-flex items-center gap-2 font-mono text-xs bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] px-3 py-1.5 rounded-xl">
                            <Terminal size={12} className="text-[var(--brand-primary)] shrink-0" />
                            <span className="text-[var(--text-muted)] hidden sm:inline">ROUTE:</span>
                            <code className="text-[var(--text-primary)] font-semibold max-w-[180px] sm:max-w-[260px] truncate">
                                {requestedPath}
                            </code>
                            <button
                                type="button"
                                onClick={handleCopyDiagnostic}
                                title="Copy access diagnostic"
                                className="p-1 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                            >
                                {copiedCode ? (
                                    <Check size={12} className="text-[var(--success)]" />
                                ) : (
                                    <Copy size={12} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Main Split Layout */}
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        {/* Left 7 Cols */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-3">
                                <BrandLogo size="sm" />
                                <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)]">
                                    · DevCore Solutions Identity &amp; Role Guard
                                </span>
                            </div>

                            <div style={{ gap: "1.25rem" }} className="flex flex-wrap items-baseline select-none">
                                <motion.span
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    className="font-mono font-extrabold text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-liquid-gradient"
                                >
                                    401
                                </motion.span>

                                <motion.span
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] font-mono font-bold text-sm sm:text-base tracking-widest text-[var(--text-primary)]"
                                >
                                    <Lock size={14} className="text-[var(--brand-primary)]" />
                                    <span>UNAUTHORIZED</span>
                                </motion.span>
                            </div>

                            <h1
                                id="unauthorized-heading"
                                className="font-display font-extrabold text-2xl sm:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.12]"
                            >
                                You don&apos;t have permission for{" "}
                                <span className="text-liquid-gradient">this workspace.</span>
                            </h1>

                            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
                                This resource requires an authenticated session or a higher privilege level. Sign in with an authorized account, return to the home view, or contact our team if you need access.
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-3.5">
                                <Link
                                    href="/login"
                                    className="btn-liquid-hover inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-6 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                                >
                                    <LogIn size={15} />
                                    <span>Sign In to Continue</span>
                                </Link>

                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold h-11 px-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                                >
                                    <Home size={15} className="text-[var(--brand-primary)]" />
                                    <span>Return Home</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right 5 Cols: Recovery Action Cards */}
                        <div className="lg:col-span-5 space-y-3.5">
                            <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
                                <span className="inline-flex items-center gap-1.5">
                                    <Sparkles size={11} className="text-[var(--brand-primary)]" />
                                    <span>AUTHORIZED NEXT STEPS</span>
                                </span>
                                <span>3 OPTIONS</span>
                            </div>

                            {RECOVERY_ACTIONS.map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                    <motion.div
                                        key={action.href}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.45,
                                            delay: 0.12 + idx * 0.08,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        whileHover={{ y: -3 }}
                                    >
                                        <Link
                                            href={action.href}
                                            style={{
                                                borderColor:
                                                    "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
                                            }}
                                            className="group/item relative block p-4 rounded-2xl bg-[var(--bg-surface)]/90 hover:bg-[var(--bg-elevated)] border shadow-2xs hover:shadow-lg transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-x-5 top-0 h-[2px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-[var(--success)] to-transparent"
                                            />

                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                                                        <Icon size={18} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-mono text-[9px] font-bold tracking-wider text-[var(--brand-primary)]">
                                                            {action.code}
                                                        </div>
                                                        <div className="font-display font-bold text-sm text-[var(--text-primary)] truncate">
                                                            {action.title}
                                                        </div>
                                                        <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                                                            {action.subtitle}
                                                        </div>
                                                    </div>
                                                </div>

                                                <ArrowUpRight
                                                    size={15}
                                                    className="text-[var(--text-muted)] group-hover/item:text-[var(--success)] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all shrink-0"
                                                />
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}