"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValueEvent,
} from "framer-motion";
import {
    ArrowUpRight,
    Layers,
    Cpu,
    ShieldCheck,
    Sparkles,
    Globe,
    Code2,
    Activity,
    Database,
    Server,
    Lock,
    GitBranch,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── SECTION 1: INTERACTIVE MULTI-REGION CLOUD TOPOLOGY STAGE ────────────────
const EDGE_NODES = [
    { id: "us", code: "US-EAST-01", city: "Virginia", x: 24, y: 38, latency: "8.4ms", load: "99.999%" },
    { id: "eu", code: "EU-WEST-02", city: "Frankfurt", x: 51, y: 31, latency: "9.8ms", load: "99.998%" },
    { id: "me", code: "ME-CENTRAL", city: "Dubai", x: 63, y: 49, latency: "11.1ms", load: "99.998%" },
    { id: "ap", code: "AP-SOUTH-01", city: "Singapore", x: 78, y: 58, latency: "12.4ms", load: "99.997%" },
    { id: "sa", code: "SA-EAST-01", city: "São Paulo", x: 34, y: 72, latency: "13.2ms", load: "99.996%" },
];

function GlobalTopologyStage() {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [selectedNode, setSelectedNode] = useState(EDGE_NODES[0]);

    const { scrollYProgress } = useScroll({
        target: stageRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 28 });
    const stageScale = useTransform(smoothProgress, [0, 0.45, 1], [0.95, 1, 0.98]);
    const parallaxDriftY = useTransform(smoothProgress, [0, 1], [35, -35]);

    return (
        <div ref={stageRef} className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-3 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full devcore-glass-badge font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                        <Sparkles size={12} />
                        VISUAL ARCHITECTURE · 01
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-[1.1]">
                        Engineered to Look as Refined as It Performs.
                    </h2>
                </div>

                <Link
                    href="/projects"
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--brand-primary)] hover:underline underline-offset-4 shrink-0"
                >
                    <span>Explore Full Case Studies</span>
                    <ArrowUpRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </Link>
            </div>

            {/* Main Interactive Visual Viewport */}
            <motion.div
                style={{ scale: stageScale }}
                className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden"
            >
                {/* Top Window Chrome */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/75">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--error)]/75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]/75" />
                        <span className="ml-2 font-mono text-xs font-bold tracking-wide text-[var(--text-primary)]">
                            DEVCORE GLOBAL EDGE TOPOLOGY
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--success)]/12 border border-[var(--success)]/30 font-mono text-[11px] font-bold text-[var(--success)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                            5 REGIONS SYNCHRONIZED
                        </span>
                    </div>
                </div>

                {/* Interactive Visual Canvas Area (Fixed explicit height so it NEVER collapses) */}
                <div className="relative h-[380px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden bg-[var(--bg-canvas)]">
                    {/* Ambient Radial Glow */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 70%)",
                        }}
                    />

                    {/* Scroll-Drifting Architectural SVG Mesh & Animated Data Arcs */}
                    <motion.div
                        style={{ y: parallaxDriftY }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <svg
                            viewBox="0 0 1000 500"
                            fill="none"
                            className="w-full h-full max-w-6xl opacity-90"
                            aria-hidden="true"
                        >
                            {/* Concentric Orbital Rings */}
                            <circle
                                cx="500"
                                cy="250"
                                r="130"
                                stroke="var(--border-subtle)"
                                strokeDasharray="4 6"
                            />
                            <circle
                                cx="500"
                                cy="250"
                                r="225"
                                stroke="var(--border-subtle)"
                                strokeDasharray="6 8"
                            />
                            <circle
                                cx="500"
                                cy="250"
                                r="330"
                                stroke="var(--border-subtle)"
                                strokeOpacity="0.6"
                            />

                            {/* Latitude / Longitude Architectural Curves */}
                            <ellipse
                                cx="500"
                                cy="250"
                                rx="380"
                                ry="125"
                                stroke="var(--brand-primary)"
                                strokeOpacity="0.22"
                                strokeWidth="1.2"
                            />
                            <ellipse
                                cx="500"
                                cy="250"
                                rx="220"
                                ry="210"
                                stroke="var(--brand-primary)"
                                strokeOpacity="0.18"
                                strokeWidth="1.2"
                            />

                            {/* Animated Routing Arcs Between Regions */}
                            <motion.path
                                d="M 240 190 Q 375 95 510 155"
                                stroke="var(--brand-primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0.2, opacity: 0.35 }}
                                animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.35, 0.9, 0.35] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 510 155 Q 580 185 630 245"
                                stroke="var(--success)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0.2, opacity: 0.35 }}
                                animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.35, 0.9, 0.35] }}
                                transition={{ duration: 3.8, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 630 245 Q 710 265 780 290"
                                stroke="var(--brand-primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0.2, opacity: 0.35 }}
                                animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.35, 0.9, 0.35] }}
                                transition={{ duration: 4.2, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 240 190 Q 275 290 340 360"
                                stroke="var(--brand-primary)"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                initial={{ pathLength: 0.2, opacity: 0.3 }}
                                animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.3, 0.85, 0.3] }}
                                transition={{ duration: 5, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 340 360 Q 560 360 780 290"
                                stroke="var(--border-strong)"
                                strokeWidth="1.5"
                                strokeDasharray="5 5"
                            />
                        </svg>
                    </motion.div>

                    {/* Interactive Clickable Edge Node Pins */}
                    {EDGE_NODES.map((node) => {
                        const active = selectedNode.id === node.id;
                        return (
                            <button
                                key={node.id}
                                type="button"
                                onClick={() => setSelectedNode(node)}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer focus:outline-none"
                            >
                                <span className="relative flex items-center justify-center">
                                    {active && (
                                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[var(--brand-primary)] opacity-45" />
                                    )}
                                    <span
                                        className={cn(
                                            "relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-transform duration-200",
                                            active
                                                ? "bg-[var(--brand-primary)] border-[var(--bg-elevated)] scale-125 shadow-md"
                                                : "bg-[var(--bg-elevated)] border-[var(--brand-primary)] group-hover:scale-110"
                                        )}
                                    />
                                </span>
                                <span
                                    className={cn(
                                        "mt-1.5 px-2.5 py-0.5 rounded-md font-mono text-[10px] sm:text-[11px] font-bold border shadow-sm transition-colors whitespace-nowrap",
                                        active
                                            ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)]"
                                            : "bg-[var(--bg-elevated)]/90 text-[var(--text-primary)] border-[var(--border-subtle)]"
                                    )}
                                >
                                    {node.code}
                                </span>
                            </button>
                        );
                    })}

                    {/* Floating Bottom Inspector Bar */}
                    <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-20 rounded-2xl devcore-glass-nav p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/25 flex items-center justify-center text-[var(--brand-primary)] shrink-0">
                                <Globe size={19} />
                            </div>
                            <div>
                                <div className="font-mono text-[11px] font-bold text-[var(--brand-primary)]">
                                    ACTIVE CLUSTER · {selectedNode.code} ({selectedNode.city.toUpperCase()})
                                </div>
                                <div className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                                    Anycast Edge Routing &amp; Active-Active Failover
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
                            <div>
                                <div className="text-[10px] text-[var(--text-muted)]">EDGE LATENCY</div>
                                <div className="font-bold text-sm text-[var(--success)]">{selectedNode.latency}</div>
                            </div>
                            <div className="h-7 w-px bg-[var(--border-subtle)]" />
                            <div>
                                <div className="text-[10px] text-[var(--text-muted)]">AVAILABILITY</div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">{selectedNode.load}</div>
                            </div>
                            <Link
                                href="/services"
                                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-sans font-semibold text-xs hover:bg-[var(--brand-hover)] transition-colors"
                            >
                                <span>Inspect Stack</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── SECTION 2: 3D LAYERED ARCHITECTURE STACK (SCROLL-DRIVEN) ────────────────
interface ArchitectureLayer {
    id: string;
    step: string;
    tag: string;
    title: string;
    summary: string;
    metric: string;
    metricLabel: string;
    stackTags: string[];
    icon: typeof Layers;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
    {
        id: "layer-01",
        step: "01",
        tag: "EDGE & CLIENT EXPERIENCE",
        title: "Sub-Second Interfaces & Deterministic State",
        summary:
            "React 19, Next.js App Router, and edge-cached glassmorphic UIs engineered for instant interaction and zero layout shift.",
        metric: "99/100",
        metricLabel: "Core Web Vitals Score",
        stackTags: ["Next.js 16", "TypeScript", "Tailwind v4", "Edge CDN"],
        icon: Code2,
    },
    {
        id: "layer-02",
        step: "02",
        tag: "DISTRIBUTED CORE & AI ENGINE",
        title: "High-Throughput APIs & Autonomous AI Pipelines",
        summary:
            "Horizontally scalable Node.js microservices, typed Zod contracts, Stripe billing webhooks, and Gemini AI orchestration.",
        metric: "420k+",
        metricLabel: "Sustained Production IOPS",
        stackTags: ["Node.js", "PostgreSQL", "Prisma ORM", "Gemini AI"],
        icon: Cpu,
    },
    {
        id: "layer-03",
        step: "03",
        tag: "ZERO-TRUST INFRASTRUCTURE",
        title: "Encrypted Data Mesh & Continuous Telemetry",
        summary:
            "Strict mTLS service isolation, automated multi-region backups, and real-time OpenTelemetry anomaly detection.",
        metric: "100%",
        metricLabel: "Zero-Trust Audit Pass",
        stackTags: ["mTLS", "Docker / K8s", "OAuth 2.1", "OpenTelemetry"],
        icon: ShieldCheck,
    },
];

function LayeredArchitectureSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [activeLayer, setActiveLayer] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end center"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest < 0.35) setActiveLayer(0);
        else if (latest < 0.7) setActiveLayer(1);
        else setActiveLayer(2);
    });

    return (
        <div
            ref={sectionRef}
            className="border-y border-[var(--border-subtle)]/75 bg-[var(--bg-surface)]/45 py-20 sm:py-28 px-4 sm:px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left Column: 3 Connected Stage Cards */}
                    <div className="lg:col-span-6 space-y-5">
                        <div className="space-y-3 mb-8">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full devcore-glass-badge font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                                <Layers size={12} />
                                CONNECTED LIFECYCLE · 02
                            </span>
                            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.12]">
                                Three Synchronized Layers of Every DevCore System.
                            </h2>
                        </div>

                        {ARCHITECTURE_LAYERS.map((layer, idx) => {
                            const Icon = layer.icon;
                            const isActive = idx === activeLayer;
                            return (
                                <motion.div
                                    key={layer.id}
                                    onClick={() => setActiveLayer(idx)}
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                                    className={cn(
                                        "p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer",
                                        isActive
                                            ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] shadow-lg"
                                            : "bg-[var(--bg-elevated)]/45 border-[var(--border-subtle)] opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[var(--brand-primary)]">
                                            <Icon size={15} />
                                            <span>
                                                LAYER {layer.step} · {layer.tag}
                                            </span>
                                        </span>
                                        <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                                            {layer.metric}
                                        </span>
                                    </div>

                                    <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)] mt-2">
                                        {layer.title}
                                    </h3>

                                    <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                                        {layer.summary}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {layer.stackTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] font-medium text-[var(--text-primary)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Column: Interactive 3D Isometric Layer Blueprint Visual */}
                    <div className="lg:col-span-6">
                        <div className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 sm:p-8 shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                                <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">
                                    SYSTEM BLUEPRINT VISUALIZER
                                </span>
                                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                                    ACTIVE: LAYER 0{activeLayer + 1}
                                </span>
                            </div>

                            {/* 3 Stacked Interactive Visual Planes */}
                            <div className="relative py-8 sm:py-10 flex flex-col gap-5">
                                {ARCHITECTURE_LAYERS.map((layer, idx) => {
                                    const Icon = layer.icon;
                                    const isSelected = idx === activeLayer;
                                    return (
                                        <motion.button
                                            key={layer.id}
                                            type="button"
                                            onClick={() => setActiveLayer(idx)}
                                            animate={{
                                                scale: isSelected ? 1.03 : 0.97,
                                                y: isSelected ? -2 : 0,
                                            }}
                                            transition={{ type: "spring", stiffness: 280, damping: 24 }}
                                            className={cn(
                                                "w-full text-left p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                                                isSelected
                                                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)] shadow-xl"
                                                    : "bg-[var(--bg-surface)]/85 text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/50"
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <div
                                                        className={cn(
                                                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                                                            isSelected
                                                                ? "bg-white/15 text-[var(--brand-contrast)]"
                                                                : "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)]"
                                                        )}
                                                    >
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div
                                                            className={cn(
                                                                "font-mono text-[10px] font-bold tracking-wider uppercase",
                                                                isSelected ? "opacity-80" : "text-[var(--brand-primary)]"
                                                            )}
                                                        >
                                                            PLANE 0{idx + 1} {"//"} {layer.tag}
                                                        </div>
                                                        <div className="font-display font-bold text-base sm:text-lg truncate mt-0.5">
                                                            {layer.title}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0 font-mono">
                                                    <div className="font-bold text-base sm:text-lg">{layer.metric}</div>
                                                    <div className={cn("text-[10px]", isSelected ? "opacity-80" : "text-[var(--text-muted)]")}>
                                                        {layer.metricLabel}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
                                <span>Click any plane to inspect architecture</span>
                                <span className="text-[var(--success)] font-bold">ZERO-DRIFT VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── SECTION 3: DUAL-TRACK HORIZONTAL SCROLL-GLIDING SHOWCASE RIBBON ─────────
const TOP_RIBBON_CARDS = [
    {
        code: "MOD // 01",
        title: "DineDesk Multi-Vendor SaaS",
        subtitle: "Real-time POS, QR table ordering & Stripe Connect payouts",
        metric: "99.99% Uptime",
        icon: Server,
    },
    {
        code: "MOD // 02",
        title: "Autonomous AI Workflows",
        subtitle: "Structured Gemini LLM pipelines with deterministic validation",
        metric: "< 180ms Token",
        icon: Cpu,
    },
    {
        code: "MOD // 03",
        title: "High-Throughput PostgreSQL",
        subtitle: "Connection-pooled Neon & Prisma schemas with zero lock contention",
        metric: "12k Query/s",
        icon: Database,
    },
    {
        code: "MOD // 04",
        title: "Zero-Downtime CI/CD Mesh",
        subtitle: "Automated canary releases, preview builds & instant rollbacks",
        metric: "0s Downtime",
        icon: GitBranch,
    },
];

const BOTTOM_RIBBON_CARDS = [
    {
        code: "SEC // 05",
        title: "mTLS & RBAC Access Control",
        subtitle: "HttpOnly JWT rotation, OAuth 2.1 & granular audit logging",
        metric: "SOC2 Ready",
        icon: Lock,
    },
    {
        code: "OPS // 06",
        title: "Live Distributed Telemetry",
        subtitle: "Sub-second anomaly alerting across global edge clusters",
        metric: "11.2ms P99",
        icon: Activity,
    },
    {
        code: "UI // 07",
        title: "Adaptive Glass Design Systems",
        subtitle: "WCAG AA light & dark interfaces engineered for clarity",
        metric: "100 Lighthouse",
        icon: Sparkles,
    },
    {
        code: "API // 08",
        title: "Event-Driven Webhook Bus",
        subtitle: "Idempotent queue processing with automatic dead-letter recovery",
        metric: "420k+ IOPS",
        icon: Zap,
    },
];

function ScrollParallaxShowcaseRibbon() {
    const ribbonRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: ribbonRef,
        offset: ["start end", "end start"],
    });

    const topTrackX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
    const bottomTrackX = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

    return (
        <div ref={ribbonRef} className="relative overflow-hidden py-20 sm:py-28">
            <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2.5 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full devcore-glass-badge font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                        <Cpu size={12} />
                        PRODUCTION MODULES · 03
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight leading-[1.12]">
                        Battle-Tested Building Blocks Across Every Layer.
                    </h2>
                </div>

                <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                    Scroll to glide through the production modules powering DevCore&apos;s enterprise deployments.
                </p>
            </div>

            {/* Track 1 — Glides Right on Scroll */}
            <motion.div
                style={{ x: topTrackX }}
                className="flex gap-5 px-4 sm:px-6 mb-5 w-max will-change-transform"
            >
                {TOP_RIBBON_CARDS.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.code}
                            className="w-[300px] sm:w-[370px] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-md hover:border-[var(--brand-primary)] transition-colors shrink-0"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[11px] font-bold text-[var(--brand-primary)]">
                                    {card.code}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[var(--success)]/12 text-[var(--success)] font-mono text-[10px] font-bold">
                                    {card.metric}
                                </span>
                            </div>

                            <div className="mt-4 flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] shrink-0">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Track 2 — Glides Left on Scroll */}
            <motion.div
                style={{ x: bottomTrackX }}
                className="flex gap-5 px-4 sm:px-6 w-max will-change-transform"
            >
                {BOTTOM_RIBBON_CARDS.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.code}
                            className="w-[300px] sm:w-[370px] rounded-2xl p-5 sm:p-6 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-md hover:border-[var(--brand-primary)] transition-colors shrink-0"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-[11px] font-bold text-[var(--brand-primary)]">
                                    {card.code}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] font-mono text-[10px] font-bold">
                                    {card.metric}
                                </span>
                            </div>

                            <div className="mt-4 flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] shrink-0">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}

// ─── UNIFIED EXPORT: ALL 3 CONNECTED SECTIONS ────────────────────────────────
export function VisualArchitectureStory() {
    return (
        <section
            aria-label="DevCore Visual Architecture Story"
            className="relative isolate overflow-hidden"
        >
            <GlobalTopologyStage />
            <LayeredArchitectureSection />
            <ScrollParallaxShowcaseRibbon />
        </section>
    );
}