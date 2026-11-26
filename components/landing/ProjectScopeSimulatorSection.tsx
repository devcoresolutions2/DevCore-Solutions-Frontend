"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import {
    Layers,
    Bot,
    Globe,
    Cpu,
    CreditCard,
    ShieldCheck,
    BarChart3,
    Sparkles,
    CheckCircle2,
    ArrowUpRight,
    MessageSquare,
    Clock,
    Users,
    Terminal,
    Sliders,
    Copy,
    Check,
    RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductBlueprint {
    id: string;
    label: string;
    tag: string;
    baseWeeks: number;
    team: string;
    coreStack: string[];
    architectureSummary: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PRODUCT_BLUEPRINTS: ProductBlueprint[] = [
    {
        id: "saas",
        label: "Multi-Vendor SaaS",
        tag: "B2B / MARKETPLACE",
        baseWeeks: 5,
        team: "2 Full-Stack Architects + 1 UI/UX Engineer",
        coreStack: ["Next.js 16", "TypeScript", "Node.js / Express", "PostgreSQL + Prisma"],
        architectureSummary:
            "Tenant-isolated relational schema, real-time order/booking state engine, role-based dashboards, and automated transactional notifications.",
        icon: Layers,
    },
    {
        id: "ai-platform",
        label: "AI Agent & Automation",
        tag: "GEMINI / LLM PIPELINE",
        baseWeeks: 4,
        team: "1 AI Systems Engineer + 2 Full-Stack Engineers",
        coreStack: ["Next.js 16", "Google Gemini API", "Zod Guardrails", "Upstash Redis"],
        architectureSummary:
            "Schema-enforced generative pipelines, tool-calling execution sandboxes, vector retrieval, and rate-limited streaming APIs.",
        icon: Bot,
    },
    {
        id: "enterprise-web",
        label: "Enterprise Web Platform",
        tag: "HIGH-SCALE PORTAL",
        baseWeeks: 3,
        team: "2 Full-Stack Engineers + 1 Design Systems Lead",
        coreStack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Framer Motion"],
        architectureSummary:
            "Server-rendered SEO architecture, glassmorphic design system, custom CMS/admin console, and sub-second global edge caching.",
        icon: Globe,
    },
    {
        id: "api-core",
        label: "Custom API & Backend Core",
        tag: "DISTRIBUTED ENGINE",
        baseWeeks: 4,
        team: "2 Backend Systems Engineers + 1 DevOps Architect",
        coreStack: ["Node.js / Express 5", "PostgreSQL", "Better Auth", "Docker / Cloud"],
        architectureSummary:
            "Contract-first REST/webhook infrastructure, idempotent ledger processing, encrypted secrets vault, and automated CI/CD pipelines.",
        icon: Cpu,
    },
];

interface ScaleTier {
    id: string;
    label: string;
    subtitle: string;
    weekMultiplier: number;
    slaTarget: string;
    deploymentTarget: string;
}

const SCALE_TIERS: ScaleTier[] = [
    {
        id: "mvp",
        label: "MVP Launch",
        subtitle: "Core production workflow ready for early customers",
        weekMultiplier: 0,
        slaTarget: "99.9% Uptime",
        deploymentTarget: "Vercel + Neon Serverless",
    },
    {
        id: "growth",
        label: "Growth Scale",
        subtitle: "Multi-tenant workspaces, analytics & automated CI/CD",
        weekMultiplier: 2,
        slaTarget: "99.95% Uptime",
        deploymentTarget: "Edge CDN + Pooled Postgres + Redis",
    },
    {
        id: "enterprise",
        label: "Enterprise Core",
        subtitle: "Zero-trust RBAC, audit logs, webhooks & high concurrency",
        weekMultiplier: 4,
        slaTarget: "99.998% SLA",
        deploymentTarget: "Multi-Region Cluster + Automated Failover",
    },
];

interface ScopeAddon {
    id: string;
    label: string;
    detail: string;
    extraWeeks: number;
    stackChip: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const SCOPE_ADDONS: ScopeAddon[] = [
    {
        id: "payments",
        label: "Global & Local Payments",
        detail: "Stripe Connect, SSLCommerz & idempotent webhooks",
        extraWeeks: 1,
        stackChip: "Stripe + SSLCommerz",
        icon: CreditCard,
    },
    {
        id: "ai-copilot",
        label: "Embedded AI Copilot",
        detail: "Context-aware Gemini AI assistant & workflow automation",
        extraWeeks: 1,
        stackChip: "Google Gemini AI",
        icon: Sparkles,
    },
    {
        id: "zero-trust-auth",
        label: "SSO, OAuth & RBAC Security",
        detail: "Multi-role permissions, session revocation & audit trail",
        extraWeeks: 1,
        stackChip: "Better Auth + OAuth 2.0",
        icon: ShieldCheck,
    },
    {
        id: "admin-suite",
        label: "Executive Admin & Media CDN",
        detail: "Real-time KPI telemetry, Cloudinary pipeline & exports",
        extraWeeks: 1,
        stackChip: "Cloudinary + Telemetry",
        icon: BarChart3,
    },
];

// ─── SMOOTH ANIMATED WEEK RANGE DISPLAY ───────────────────────────────────────
function AnimatedDeliveryRange({ min, max }: { min: number; max: number }) {
    const springMin = useSpring(min, { stiffness: 220, damping: 24 });
    const springMax = useSpring(max, { stiffness: 220, damping: 24 });
    const [display, setDisplay] = useState(`${min}–${max}`);

    useEffect(() => {
        springMin.set(min);
        springMax.set(max);
    }, [min, max, springMin, springMax]);

    useEffect(() => {
        const unsubMin = springMin.on("change", (latestMin) => {
            setDisplay(`${Math.round(latestMin)}–${Math.round(springMax.get())}`);
        });
        const unsubMax = springMax.on("change", (latestMax) => {
            setDisplay(`${Math.round(springMin.get())}–${Math.round(latestMax)}`);
        });
        return () => {
            unsubMin();
            unsubMax();
        };
    }, [springMin, springMax]);

    return <span>{display} Wks</span>;
}

export function ProjectScopeSimulatorSection() {
    const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>("saas");
    const [selectedTierId, setSelectedTierId] = useState<string>("growth");
    const [activeAddons, setActiveAddons] = useState<string[]>([
        "payments",
        "zero-trust-auth",
    ]);
    const [copiedSpec, setCopiedSpec] = useState(false);

    const specCardRef = useRef<HTMLDivElement | null>(null);

    // 3D Tilt & Optical Spotlight for the Live Architecture Spec Card
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const spotX = useMotionValue(240);
    const spotY = useMotionValue(200);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
        stiffness: 240,
        damping: 26,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
        stiffness: 240,
        damping: 26,
    });

    const spotlightBg = useMotionTemplate`radial-gradient(380px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 74%)`;

    // Magnetic Primary CTA pull
    const ctaX = useMotionValue(0);
    const ctaY = useMotionValue(0);
    const springCtaX = useSpring(ctaX, { stiffness: 320, damping: 22 });
    const springCtaY = useSpring(ctaY, { stiffness: 320, damping: 22 });

    const blueprint =
        PRODUCT_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) || PRODUCT_BLUEPRINTS[0];
    const tier = SCALE_TIERS.find((t) => t.id === selectedTierId) || SCALE_TIERS[1];

    const toggleAddon = (id: string) => {
        setActiveAddons((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleReset = () => {
        setSelectedBlueprintId("saas");
        setSelectedTierId("growth");
        setActiveAddons(["payments", "zero-trust-auth"]);
    };

    const addonObjects = SCOPE_ADDONS.filter((a) => activeAddons.includes(a.id));
    const addonWeeks = addonObjects.reduce((sum, item) => sum + item.extraWeeks, 0);
    const minWeeks = blueprint.baseWeeks + tier.weekMultiplier + addonWeeks;
    const maxWeeks = minWeeks + 2;

    const combinedStack = [
        ...blueprint.coreStack,
        ...addonObjects.map((a) => a.stackChip),
    ];

    const scopeSummaryText = `Hi DevCore Solutions, I configured a project scope on your website:\n• System: ${blueprint.label}\n• Scale Tier: ${tier.label}\n• Modules: ${addonObjects.length > 0 ? addonObjects.map((a) => a.label).join(", ") : "Core Foundation"
        }\n• Estimated Timeline: ${minWeeks}–${maxWeeks} Weeks`;

    const handleCopySpec = async () => {
        try {
            await navigator.clipboard.writeText(scopeSummaryText);
            setCopiedSpec(true);
            setTimeout(() => setCopiedSpec(false), 2200);
        } catch {
            // ignore clipboard errors in restricted environments
        }
    };

    const handleSpecMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = specCardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;
        mouseX.set(localX / rect.width - 0.5);
        mouseY.set(localY / rect.height - 0.5);
        spotX.set(localX);
        spotY.set(localY);
    };

    const handleSpecMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.12;
        const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        ctaX.set(offsetX);
        ctaY.set(offsetY);
    };

    const handleCtaMouseLeave = () => {
        ctaX.set(0);
        ctaY.set(0);
    };

    const contactHref = `/contact?system=${encodeURIComponent(
        blueprint.label
    )}&tier=${encodeURIComponent(tier.label)}&weeks=${minWeeks}-${maxWeeks}`;

    const whatsappHref = `https://wa.me/${(
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801766140126"
    ).replace(/\D/g, "")}?text=${encodeURIComponent(scopeSummaryText)}`;

    return (
        <section
            id="scope-simulator"
            aria-label="Interactive Project Scope & Architecture Simulator"
            className="relative isolate overflow-hidden py-20 sm:py-28 px-4 sm:px-6"
        >
            {/* Animated Ambient Studio Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
                style={{
                    maskImage:
                        "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
                }}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.08, 0.96, 1],
                        opacity: [0.65, 0.9, 0.65],
                    }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    className="h-[540px] w-[540px] sm:w-[880px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 14%, transparent) 0%, color-mix(in oklab, var(--success) 6%, transparent) 45%, transparent 72%)",
                        filter: "blur(52px)",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Section Header with Staggered Entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12"
                >
                    <div className="max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
                            <Sliders size={13} />
                            <span>INTERACTIVE ARCHITECTURE PLANNER</span>
                        </div>

                        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-[1.08]">
                            Configure Your{" "}
                            <span className="text-liquid-gradient">Production Blueprint.</span>
                        </h2>

                        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                            Select your platform category, scale tier, and production modules to preview DevCore&apos;s recommended stack, team allocation, and delivery timeline.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-xl devcore-glass-badge font-mono text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/50 transition-colors cursor-pointer self-start md:self-end"
                    >
                        <RotateCcw size={12} />
                        <span>Reset Preset</span>
                    </button>
                </motion.div>

                {/* Main Simulator Grid: Left Controls (7 Cols) + Right Live Blueprint (5 Cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
                    {/* LEFT COLUMN — Interactive Configurator */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Step 01: System Architecture Type */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                            className="devcore-glass-card p-5 sm:p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                                    01 // SELECT SYSTEM ARCHITECTURE
                                </span>
                                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                                    Required
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PRODUCT_BLUEPRINTS.map((item) => {
                                    const Icon = item.icon;
                                    const active = item.id === selectedBlueprintId;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            type="button"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.985 }}
                                            transition={{ type: "spring", stiffness: 360, damping: 24 }}
                                            onClick={() => setSelectedBlueprintId(item.id)}
                                            className={cn(
                                                "relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 overflow-hidden",
                                                active
                                                    ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] shadow-md"
                                                    : "bg-[var(--bg-surface)]/70 border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45"
                                            )}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="scope-blueprint-bar"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    className="absolute inset-x-0 top-0 h-[2.5px] bg-[var(--brand-primary)]"
                                                />
                                            )}

                                            <motion.div
                                                animate={active ? { rotate: [0, -6, 6, 0] } : { rotate: 0 }}
                                                transition={{ duration: 0.45 }}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                                    active
                                                        ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)]"
                                                        : "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
                                                )}
                                            >
                                                <Icon size={18} />
                                            </motion.div>

                                            <div className="min-w-0">
                                                <div className="font-mono text-[10px] font-bold tracking-wider text-[var(--brand-primary)]">
                                                    {item.tag}
                                                </div>
                                                <div className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] mt-0.5">
                                                    {item.label}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Step 02: Operational Scale Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="devcore-glass-card p-5 sm:p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                                    02 // OPERATIONAL SCALE TIER
                                </span>
                                <span className="font-mono text-[11px] text-[var(--success)] font-semibold">
                                    {tier.slaTarget}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {SCALE_TIERS.map((t) => {
                                    const active = t.id === selectedTierId;
                                    return (
                                        <motion.button
                                            key={t.id}
                                            type="button"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.985 }}
                                            transition={{ type: "spring", stiffness: 360, damping: 24 }}
                                            onClick={() => setSelectedTierId(t.id)}
                                            className={cn(
                                                "relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
                                                active
                                                    ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] shadow-md"
                                                    : "bg-[var(--bg-surface)]/70 border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45"
                                            )}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="scope-tier-bar"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    className="absolute inset-x-0 top-0 h-[2.5px] bg-[var(--brand-primary)]"
                                                />
                                            )}

                                            <div className="font-display font-bold text-sm text-[var(--text-primary)]">
                                                {t.label}
                                            </div>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                                                {t.subtitle}
                                            </p>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Step 03: Production Modules & Integrations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="devcore-glass-card p-5 sm:p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                                    03 // PRODUCTION INTEGRATIONS
                                </span>
                                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                                    {activeAddons.length} Selected
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {SCOPE_ADDONS.map((addon) => {
                                    const Icon = addon.icon;
                                    const checked = activeAddons.includes(addon.id);
                                    return (
                                        <motion.button
                                            key={addon.id}
                                            type="button"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.985 }}
                                            transition={{ type: "spring", stiffness: 360, damping: 24 }}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={cn(
                                                "text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3",
                                                checked
                                                    ? "bg-[var(--bg-elevated)] border-[var(--brand-primary)] shadow-sm"
                                                    : "bg-[var(--bg-surface)]/65 border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40"
                                            )}
                                        >
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                                                        checked
                                                            ? "bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]"
                                                            : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                                                    )}
                                                >
                                                    <Icon size={15} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-display font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                                                        {addon.label}
                                                    </div>
                                                    <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                                                        {addon.detail}
                                                    </div>
                                                </div>
                                            </div>

                                            <motion.div
                                                animate={{ scale: checked ? [1, 1.25, 1] : 1 }}
                                                transition={{ duration: 0.25 }}
                                                className="shrink-0 mt-0.5"
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className={cn(
                                                        "transition-colors",
                                                        checked ? "text-[var(--success)]" : "text-[var(--border-strong)]/40"
                                                    )}
                                                />
                                            </motion.div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN — 3D Tilt Live Generated Architecture Spec Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5 lg:sticky lg:top-28"
                        style={{ perspective: 1100 }}
                    >
                        <motion.div
                            ref={specCardRef}
                            onMouseMove={handleSpecMouseMove}
                            onMouseLeave={handleSpecMouseLeave}
                            style={{ rotateX, rotateY }}
                            className="relative devcore-glass-card p-6 sm:p-7 overflow-hidden group"
                        >
                            {/* Cursor-Tracked Optical Glass Spotlight */}
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: spotlightBg }}
                            />

                            {/* Top Specular Rim */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/70 to-transparent"
                            />

                            {/* Subtle Vertical Scanline Sweep */}
                            <motion.div
                                aria-hidden="true"
                                animate={{ y: ["-100%", "450%"] }}
                                transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
                                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-[var(--brand-primary)]/[0.06] to-transparent"
                            />

                            {/* Header */}
                            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--brand-primary)]">
                                    <Terminal size={14} />
                                    <span>LIVE ARCHITECTURE SPEC</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCopySpec}
                                        title="Copy blueprint summary"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/60 font-mono text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                                    >
                                        {copiedSpec ? (
                                            <>
                                                <Check size={11} className="text-[var(--success)]" />
                                                <span className="text-[var(--success)]">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={11} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>

                                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[var(--success)]/12 text-[var(--success)] font-mono text-[10px] font-bold">
                                        100% IP
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Timeline & Squad Summary */}
                            <div className="relative z-10 mt-5 space-y-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)]">
                                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)]">
                                            <Clock size={12} className="text-[var(--brand-primary)]" />
                                            <span>ESTIMATED DELIVERY</span>
                                        </div>
                                        <div className="font-mono font-extrabold text-xl sm:text-2xl text-[var(--text-primary)] mt-1 tabular-nums">
                                            <AnimatedDeliveryRange min={minWeeks} max={maxWeeks} />
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)]">
                                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-muted)]">
                                            <ShieldCheck size={12} className="text-[var(--success)]" />
                                            <span>TARGET RELIABILITY</span>
                                        </div>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={tier.slaTarget}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.2 }}
                                                className="font-mono font-extrabold text-lg sm:text-xl text-[var(--success)] mt-1"
                                            >
                                                {tier.slaTarget}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Architecture Description */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${blueprint.id}-${tier.id}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.24 }}
                                        className="space-y-3"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="font-display font-bold text-base text-[var(--text-primary)]">
                                                {blueprint.label} · {tier.label}
                                            </div>
                                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                                                {blueprint.architectureSummary}
                                            </p>
                                        </div>

                                        {/* Squad & Infra Metadata */}
                                        <div className="devcore-glass-inset p-3.5 space-y-2 font-mono text-xs">
                                            <div className="flex items-center gap-2 text-[var(--text-primary)]">
                                                <Users size={13} className="text-[var(--brand-primary)] shrink-0" />
                                                <span className="truncate">{blueprint.team}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                <Cpu size={13} className="text-[var(--success)] shrink-0" />
                                                <span className="truncate">{tier.deploymentTarget}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Animated Recommended Stack Chips */}
                                <div className="space-y-2">
                                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                        RECOMMENDED STACK BLUEPRINT
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <AnimatePresence initial={false}>
                                            {combinedStack.map((tech) => (
                                                <motion.span
                                                    key={tech}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.85 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                                                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] font-medium text-[var(--text-primary)]"
                                                >
                                                    {tech}
                                                </motion.span>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons with Magnetic Primary CTA */}
                            <div className="relative z-10 mt-6 pt-5 border-t border-[var(--border-subtle)] space-y-2.5">
                                <motion.div
                                    onMouseMove={handleCtaMouseMove}
                                    onMouseLeave={handleCtaMouseLeave}
                                    style={{ x: springCtaX, y: springCtaY }}
                                >
                                    <Link
                                        href={contactHref}
                                        className="btn-liquid-hover group/cta w-full inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-sm hover:bg-[var(--brand-hover)] shadow-md transition-colors"
                                    >
                                        <span>Lock This Scope &amp; Get Proposal</span>
                                        <ArrowUpRight
                                            size={16}
                                            className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                                        />
                                    </Link>
                                </motion.div>

                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/wa w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-[var(--border-strong)]/80 bg-[var(--bg-elevated)]/80 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors"
                                >
                                    <MessageSquare
                                        size={15}
                                        className="text-[var(--success)] transition-transform duration-200 group-hover/wa:scale-110"
                                    />
                                    <span>Send Blueprint via WhatsApp</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}