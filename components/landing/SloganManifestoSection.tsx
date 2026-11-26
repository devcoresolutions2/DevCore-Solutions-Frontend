"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    motion,
    AnimatePresence,
    useInView,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useMotionTemplate,
} from "framer-motion";
import {
    Blocks,
    Bot,
    Gauge,
    Compass,
    ArrowUpRight,
    RotateCcw,
    Terminal,
    Sparkles,
    CheckCircle2,
    XCircle,
    GitCommitHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FULL_SLOGAN = "Building the Digital Core for a Smarter Tomorrow.";

// Character ranges highlighted in liquid gradient:
// "Digital Core" (13..25) and "Smarter Tomorrow." (32..49)
function renderTypedSlogan(visibleCount: number) {
    const chars = FULL_SLOGAN.slice(0, visibleCount).split("");
    return chars.map((ch, idx) => {
        const isHighlight =
            (idx >= 13 && idx < 25) || (idx >= 32 && idx < FULL_SLOGAN.length);
        return (
            <span
                key={idx}
                className={cn(
                    isHighlight ? "text-liquid-gradient" : "text-[var(--text-primary)]"
                )}
            >
                {ch}
            </span>
        );
    });
}

interface EngineeringTenet {
    id: string;
    number: string;
    category: string;
    title: string;
    description: string;
    artifact: string;
    icon: typeof Blocks;
}

const ENGINEERING_TENETS: EngineeringTenet[] = [
    {
        id: "composable",
        number: "01",
        category: "COMPOSABLE ARCHITECTURE",
        title: "Modular Bounded Contexts Over Monolith Lock-In",
        description:
            "We decouple domain logic into clean, contract-first TypeScript & PostgreSQL modules—allowing new product verticals, tenant tiers, and integrations to ship independently.",
        artifact: "Contract-First OpenAPI + Prisma Schema",
        icon: Blocks,
    },
    {
        id: "ai-harness",
        number: "02",
        category: "EVAL-DRIVEN AI HARNESSES",
        title: "AI Woven Into Workflows, Not Bolted On",
        description:
            "Rather than fragile chat wrappers, we engineer deterministic Gemini AI pipelines with schema validation, sandboxed tool execution, and measurable accuracy evals.",
        artifact: "Typed Zod Output Guardrails",
        icon: Bot,
    },
    {
        id: "finops",
        number: "03",
        category: "FINOPS & LEAN COMPUTE",
        title: "High-Efficiency Systems That Respect Cloud Margin",
        description:
            "Every query, edge cache rule, and serverless worker is profiled for predictable unit economics—preventing runaway infrastructure bills as user volume multiplies.",
        artifact: "Zero-Waste Edge & Pooler Tuning",
        icon: Gauge,
    },
    {
        id: "principal",
        number: "04",
        category: "DIRECT PRINCIPAL EXECUTION",
        title: "Architect-to-Founder Collaboration Without Middlemen",
        description:
            "You work directly with the engineers writing your production code—shipping weekly vertical slices with full repository ownership and transparent RFC decisions.",
        artifact: "100% IP & Clean Git History",
        icon: Compass,
    },
];

interface ComparisonRow {
    dimension: string;
    legacy: string;
    devcore: string;
}

const ARCHITECTURE_COMPARISON: ComparisonRow[] = [
    {
        dimension: "System Foundation",
        legacy: "Tightly coupled templates that stall when custom workflows grow",
        devcore: "Composable, strictly-typed modules built for multi-year evolution",
    },
    {
        dimension: "AI Capabilities",
        legacy: "Disconnected chatbot widget with unverified LLM responses",
        devcore: "Schema-enforced AI agents embedded directly in core business logic",
    },
    {
        dimension: "Cloud Economics",
        legacy: "Over-provisioned servers with unmonitored compute drift",
        devcore: "FinOps-tuned serverless & pooled data layers with predictable cost",
    },
    {
        dimension: "Delivery Model",
        legacy: "Layered account managers & black-box monthly handoffs",
        devcore: "Direct principal engineers shipping live weekly staging builds",
    },
];

export function SloganManifestoSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

    const [typedCount, setTypedCount] = useState(0);
    const [replaySeed, setReplaySeed] = useState(0);
    const [activeTenetIdx, setActiveTenetIdx] = useState(0);
    const [viewMode, setViewMode] = useState<"tenets" | "benchmark">("tenets");

    // Typewriter progression (React 19 strict-mode & linter safe)
    useEffect(() => {
        if (!isInView) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
            const immediate = setTimeout(() => {
                setTypedCount(FULL_SLOGAN.length);
            }, 0);
            return () => clearTimeout(immediate);
        }

        let current = 0;
        let timer: ReturnType<typeof setTimeout>;

        const typeNext = () => {
            current += 1;
            setTypedCount(current);
            if (current < FULL_SLOGAN.length) {
                const char = FULL_SLOGAN[current - 1];
                const delay = char === " " ? 50 : char === "." ? 180 : 32;
                timer = setTimeout(typeNext, delay);
            }
        };

        timer = setTimeout(() => {
            setTypedCount(0);
            timer = setTimeout(typeNext, 200);
        }, 0);

        return () => clearTimeout(timer);
    }, [isInView, replaySeed]);

    // Scroll-linked orbital ring motion
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
    const ringCw = useTransform(smoothProgress, [0, 1], [-20, 90]);
    const ringCcw = useTransform(smoothProgress, [0, 1], [15, -70]);

    // Optical cursor spotlight
    const spotX = useMotionValue(520);
    const spotY = useMotionValue(240);
    const spotlightBg = useMotionTemplate`radial-gradient(580px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 72%)`;

    const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect) return;
        spotX.set(e.clientX - rect.left);
        spotY.set(e.clientY - rect.top);
    };

    const isTypingDone = typedCount >= FULL_SLOGAN.length;
    const activeTenet = ENGINEERING_TENETS[activeTenetIdx];

    return (
        <section
            ref={sectionRef}
            id="slogan-manifesto"
            aria-label="DevCore Solutions Engineering Philosophy & Slogan"
            className="relative isolate overflow-hidden py-24 sm:py-36"
        >
            {/* Seamless Atmospheric Backdrop & Orbital Core Rings */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
                style={{
                    maskImage:
                        "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
                }}
            >
                <div
                    className="h-[540px] w-[540px] sm:h-[740px] sm:w-[740px] rounded-full opacity-90"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 14%, transparent) 0%, color-mix(in oklab, var(--success) 6%, transparent) 44%, transparent 72%)",
                        filter: "blur(42px)",
                    }}
                />

                <motion.div
                    style={{ rotate: ringCw }}
                    className="absolute w-[340px] h-[340px] sm:w-[620px] sm:h-[620px] lg:w-[780px] lg:h-[780px] rounded-full border border-dashed border-[var(--brand-primary)]/22"
                >
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--brand-primary)]/50" />
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[var(--success)]/60" />
                </motion.div>

                <motion.div
                    style={{ rotate: ringCcw }}
                    className="absolute w-[230px] h-[230px] sm:w-[430px] sm:h-[430px] lg:w-[550px] lg:h-[550px] rounded-full border border-[var(--border-strong)]/30"
                >
                    <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]/65" />
                    <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]/65" />
                </motion.div>
            </div>

            {/* Main Content Stage */}
            <div
                ref={stageRef}
                onMouseMove={handleStageMouseMove}
                className="relative px-4 sm:px-6 max-w-6xl mx-auto group"
            >
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-12 -inset-y-8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{ background: spotlightBg }}
                />

                {/* Top Editorial Metadata Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center sm:justify-between gap-3 mb-10 sm:mb-14"
                >
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
                        <Terminal size={12} />
                        <span>ENGINEERING MANIFESTO // DEVCORE</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)]">
                            <Sparkles size={12} className="text-[var(--brand-primary)]" />
                            COMPOSABLE · AI-NATIVE · FINOPS-TUNED
                        </span>

                        {isTypingDone && (
                            <button
                                type="button"
                                onClick={() => setReplaySeed((s) => s + 1)}
                                title="Replay typing animation"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full devcore-glass-badge font-mono text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/50 transition-colors cursor-pointer"
                            >
                                <RotateCcw size={11} />
                                <span>Replay</span>
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Centerpiece Typewriter Slogan (Zero Overlap Ghost Spacer) */}
                <div className="text-center max-w-5xl mx-auto">
                    <div className="relative inline-block">
                        <h2
                            aria-label={FULL_SLOGAN}
                            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] tracking-tight leading-[1.08]"
                        >
                            <span
                                aria-hidden="true"
                                className="select-none pointer-events-none"
                                style={{ visibility: "hidden" }}
                            >
                                {FULL_SLOGAN}
                            </span>

                            <span aria-hidden="true" className="absolute inset-0 text-center">
                                {renderTypedSlogan(typedCount)}
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                                    className="inline-block w-[3px] sm:w-[4px] h-[0.82em] ml-1.5 align-middle rounded-full bg-[var(--brand-primary)]"
                                />
                            </span>
                        </h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed font-normal"
                    >
                        Great software isn&apos;t assembled from fragile shortcuts. We architect composable systems, eval-driven AI workflows, and lean cloud foundations built to compound in value.
                    </motion.p>
                </div>

                {/* Interactive Mode Switcher: 4 Engineering Tenets vs. Standard Agency Benchmark */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.35 }}
                    className="mt-12 sm:mt-16"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-muted)]">
                            <GitCommitHorizontal size={15} className="text-[var(--brand-primary)]" />
                            <span>HOW WE TURN THIS SLOGAN INTO PRODUCTION CODE</span>
                        </div>

                        <div
                            role="tablist"
                            aria-label="Engineering manifesto view"
                            className="inline-flex p-1 rounded-xl bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] self-start sm:self-auto"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "tenets"}
                                onClick={() => setViewMode("tenets")}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer",
                                    viewMode === "tenets"
                                        ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                04 Core Tenets
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "benchmark"}
                                onClick={() => setViewMode("benchmark")}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer",
                                    viewMode === "benchmark"
                                        ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                            >
                                DevCore vs. Legacy
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {viewMode === "tenets" ? (
                            <motion.div
                                key="tenets-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.28 }}
                            >
                                {/* 4 Interactive Engineering Tenet Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {ENGINEERING_TENETS.map((tenet, idx) => {
                                        const Icon = tenet.icon;
                                        const selected = idx === activeTenetIdx;
                                        return (
                                            <motion.button
                                                key={tenet.id}
                                                type="button"
                                                onClick={() => setActiveTenetIdx(idx)}
                                                whileHover={{ y: -3 }}
                                                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                                                className={cn(
                                                    "relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between",
                                                    selected
                                                        ? "devcore-glass-card border-[var(--brand-primary)] shadow-lg"
                                                        : "bg-[var(--bg-elevated)]/55 backdrop-blur-md border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45"
                                                )}
                                            >
                                                {selected && (
                                                    <span className="absolute inset-x-0 top-0 h-[2px] bg-[var(--brand-primary)]" />
                                                )}

                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-mono text-[11px] font-bold text-[var(--brand-primary)]">
                                                            {tenet.number}
                                                        </span>
                                                        <div
                                                            className={cn(
                                                                "w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                                                selected
                                                                    ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                                                                    : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                                                            )}
                                                        >
                                                            <Icon size={15} />
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                        {tenet.category}
                                                    </div>

                                                    <h3 className="mt-1.5 font-display font-bold text-base text-[var(--text-primary)] leading-snug">
                                                        {tenet.title}
                                                    </h3>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]/70 font-mono text-[11px] font-semibold text-[var(--success)]">
                                                    {tenet.artifact}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Active Tenet Deep-Dive Bar */}
                                <div className="mt-4 p-4 sm:p-5 rounded-2xl devcore-glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <AnimatePresence mode="wait">
                                            <motion.p
                                                key={activeTenet.id}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.22 }}
                                                className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
                                            >
                                                <span className="font-mono font-bold text-[var(--brand-primary)] mr-2">
                                                    [{activeTenet.number} · {activeTenet.category}]
                                                </span>
                                                {activeTenet.description}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <Link
                                            href="/process"
                                            className="inline-flex items-center justify-center px-4 h-10 rounded-xl border border-[var(--border-strong)]/80 bg-[var(--bg-elevated)]/80 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors"
                                        >
                                            Our Engineering Process
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="btn-liquid-hover inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors"
                                        >
                                            <span>Scope a Build</span>
                                            <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="benchmark-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.28 }}
                                className="devcore-glass-card overflow-hidden"
                            >
                                <div className="divide-y divide-[var(--border-subtle)]/75">
                                    {ARCHITECTURE_COMPARISON.map((row) => (
                                        <div
                                            key={row.dimension}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 p-4 sm:p-5 items-center"
                                        >
                                            <div className="md:col-span-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                                                {row.dimension}
                                            </div>

                                            <div className="md:col-span-4 flex items-start gap-2 text-xs sm:text-sm text-[var(--text-muted)]">
                                                <XCircle
                                                    size={16}
                                                    className="text-[var(--error)]/75 shrink-0 mt-0.5"
                                                />
                                                <span>{row.legacy}</span>
                                            </div>

                                            <div className="md:col-span-5 flex items-start gap-2 text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[var(--success)] shrink-0 mt-0.5"
                                                />
                                                <span>{row.devcore}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}