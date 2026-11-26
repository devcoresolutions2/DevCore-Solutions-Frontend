"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2,
    Cpu,
    Database,
    Cloud,
    CreditCard,
    Sparkles,
    Layers,
    ShieldCheck,
    Terminal,
    Boxes,
    Globe,
    Workflow,
    Image as ImageIcon,
    Rocket,
    Server,
    Bot,
    Pause,
    Play,
    ArrowLeftRight,
    Lock,
    Activity,
    Zap,
    Webhook,
    FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemNode {
    name: string;
    tag: string;
    accent: "brand" | "emerald" | "sky" | "amber";
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STREAM_ONE_STACK: EcosystemNode[] = [
    { name: "Next.js 16", tag: "App Router · SSR", accent: "brand", icon: Layers },
    { name: "React 19", tag: "Concurrent UI", accent: "sky", icon: Code2 },
    { name: "TypeScript 5", tag: "Strict Type-Safe", accent: "brand", icon: Terminal },
    { name: "Node.js", tag: "Event Runtime", accent: "emerald", icon: Server },
    { name: "Express.js", tag: "REST & Microservices", accent: "brand", icon: Webhook },
    { name: "PostgreSQL", tag: "Relational Core", accent: "sky", icon: Database },
    { name: "Prisma ORM", tag: "Typed Migrations", accent: "emerald", icon: Boxes },
    { name: "Neon Serverless", tag: "Branching Postgres", accent: "emerald", icon: Zap },
    { name: "MongoDB", tag: "Document Store", accent: "emerald", icon: Database },
    { name: "Upstash Redis", tag: "Edge Rate-Limiting", accent: "amber", icon: Activity },
    { name: "Tailwind CSS v4", tag: "Design Tokens", accent: "sky", icon: Sparkles },
    { name: "Framer Motion", tag: "60fps Choreography", accent: "brand", icon: Workflow },
];

const STREAM_TWO_AI_CLOUD: EcosystemNode[] = [
    { name: "Google Gemini AI", tag: "Multimodal & Reasoning", accent: "sky", icon: Sparkles },
    { name: "Vertex AI", tag: "Enterprise MLOps", accent: "brand", icon: Cpu },
    { name: "AI Agent Harnesses", tag: "Tool-Use & Evals", accent: "emerald", icon: Bot },
    { name: "LangGraph & RAG", tag: "Vector Retrieval", accent: "sky", icon: Workflow },
    { name: "PyTorch", tag: "Deep Learning", accent: "amber", icon: Cpu },
    { name: "Vercel Edge", tag: "Global CDN & Compute", accent: "brand", icon: Globe },
    { name: "AWS Cloud", tag: "VPC & ECS Clusters", accent: "amber", icon: Cloud },
    { name: "Docker", tag: "Immutable Containers", accent: "sky", icon: Boxes },
    { name: "Kubernetes", tag: "Auto-Scaling Mesh", accent: "brand", icon: Server },
    { name: "Cloudflare Workers", tag: "Zero-Cold-Start Edge", accent: "amber", icon: Zap },
    { name: "GitHub Actions", tag: "Zero-Drift CI/CD", accent: "emerald", icon: FolderGit2 },
    { name: "Zod Validation", tag: "Runtime Contracts", accent: "brand", icon: ShieldCheck },
];

const STREAM_THREE_PAYMENTS_MEDIA: EcosystemNode[] = [
    { name: "Stripe Connect", tag: "Global SaaS Billing", accent: "brand", icon: CreditCard },
    { name: "SSLCommerz", tag: "BD Payment Gateway", accent: "emerald", icon: CreditCard },
    { name: "PayPal Enterprise", tag: "Cross-Border Checkout", accent: "sky", icon: Globe },
    { name: "Cloudinary Media", tag: "CDN & Asset Pipeline", accent: "sky", icon: ImageIcon },
    { name: "Better Auth", tag: "RBAC & Multi-Session", accent: "emerald", icon: Lock },
    { name: "OAuth 2.0 / JWT", tag: "Zero-Trust Identity", accent: "brand", icon: ShieldCheck },
    { name: "Nodemailer & SMTP", tag: "Transactional Dispatch", accent: "amber", icon: Webhook },
    { name: "DineDesk SaaS", tag: "Multi-Vendor Hospitality", accent: "emerald", icon: Rocket },
    { name: "LegalEase Platform", tag: "LegalTech Marketplace", accent: "brand", icon: Layers },
    { name: "HireLoop ATS", tag: "Talent & Recruiter Core", accent: "sky", icon: Workflow },
    { name: "GameVault API", tag: "Express 5 Commerce", accent: "amber", icon: Cpu },
    { name: "OpenTelemetry", tag: "Live Kernel Metrics", accent: "emerald", icon: Activity },
];

const ROTATING_STACK_TITLES = [
    "Modern Software Stack.",
    "AI & Agentic Pipelines.",
    "Global Cloud Infrastructure.",
    "Enterprise SaaS Ecosystem.",
];

const TITLE_LEAD_WORDS = ["Engineered", "Across", "the"];

const ACCENT_STYLES: Record<EcosystemNode["accent"], string> = {
    brand: "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border-[var(--brand-primary)]/25",
    emerald: "bg-[var(--success)]/12 text-[var(--success)] border-[var(--success)]/25",
    sky: "bg-sky-500/12 text-sky-600 dark:text-sky-300 border-sky-500/25",
    amber: "bg-amber-500/12 text-amber-600 dark:text-amber-300 border-amber-500/25",
};

interface MarqueeTrackProps {
    items: EcosystemNode[];
    direction: "left" | "right";
    durationSec: number;
    isPaused: boolean;
    label: string;
}

function MarqueeTrack({
    items,
    direction,
    durationSec,
    isPaused,
    label,
}: MarqueeTrackProps) {
    const [hovered, setHovered] = useState(false);
    const paused = isPaused || hovered;

    const loopItems = [...items, ...items];

    return (
        <div
            aria-label={label}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-full overflow-hidden py-1.5"
        >
            <div
                className="flex w-max items-center gap-4"
                style={{
                    animationName:
                        direction === "left" ? "devcoreMarqueeLeft" : "devcoreMarqueeRight",
                    animationDuration: `${durationSec}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationPlayState: paused ? "paused" : "running",
                    willChange: "transform",
                }}
            >
                {loopItems.map((node, index) => {
                    const Icon = node.icon;
                    return (
                        <div
                            key={`${node.name}-${index}`}
                            className="group/pill inline-flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-md border border-[var(--border-subtle)]/85 hover:border-[var(--brand-primary)]/65 shadow-2xs hover:shadow-md transition-all duration-300 select-none"
                        >
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/pill:scale-110",
                                    ACCENT_STYLES[node.accent]
                                )}
                            >
                                <Icon size={16} />
                            </div>

                            <div className="pr-1">
                                <div className="font-display font-bold text-sm text-[var(--text-primary)] leading-tight whitespace-nowrap">
                                    {node.name}
                                </div>
                                <div className="font-mono text-[10px] font-medium text-[var(--text-muted)] mt-0.5 whitespace-nowrap">
                                    {node.tag}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function EcosystemMarqueeSection() {
    const [isPaused, setIsPaused] = useState(false);
    const [invertDirection, setInvertDirection] = useState(false);
    const [titleIndex, setTitleIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTitleIndex((prev) => (prev + 1) % ROTATING_STACK_TITLES.length);
        }, 3600);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            id="tech-ecosystem-marquee"
            aria-label="DevCore Solutions Technology, AI, Cloud & Payments Ecosystem"
            className="relative isolate overflow-hidden py-20 sm:py-28"
        >
            {/* Build-Safe Keyframes for Seamless Hardware-Accelerated Infinite Marquee */}
            <style>{`
        @keyframes devcoreMarqueeLeft {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes devcoreMarqueeRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #tech-ecosystem-marquee [style*="devcoreMarquee"] {
            animation-play-state: paused !important;
          }
        }
      `}</style>

            {/* Ambient Atmospheric Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
            >
                <div
                    className="h-[440px] w-[440px] sm:w-[820px] rounded-full opacity-75"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 12%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
                        filter: "blur(46px)",
                    }}
                />
            </div>

            {/* Centered Editorial Header + Kinetic Title Motion + Stream Controls */}
            <div className="px-4 sm:px-6 max-w-4xl mx-auto mb-12 sm:mb-14 text-center flex flex-col items-center">
                {/* Eyebrow Pill */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-5"
                >
                    <span className="relative flex size-2">
                        {!isPaused && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                        )}
                        <span
                            className={cn(
                                "relative inline-flex rounded-full size-2",
                                isPaused ? "bg-amber-400" : "bg-[var(--success)]"
                            )}
                        />
                    </span>
                    <span>PRODUCTION ECOSYSTEM · 36+ INTEGRATED TECHNOLOGIES</span>
                </motion.div>

                {/* Staggered Kinetic Headline + Rotating Gradient Accent */}
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[54px] text-[var(--text-primary)] tracking-tight leading-[1.12]">
                    <span className="inline-flex flex-wrap justify-center gap-x-3">
                        {TITLE_LEAD_WORDS.map((word, i) => (
                            <motion.span
                                key={word}
                                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.55,
                                    delay: i * 0.08,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </span>

                    <span className="block mt-1.5 min-h-[1.2em] overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={ROTATING_STACK_TITLES[titleIndex]}
                                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -22, filter: "blur(6px)" }}
                                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                className="inline-block text-liquid-gradient"
                            >
                                {ROTATING_STACK_TITLES[titleIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </h2>

                {/* Centered Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-4 text-sm sm:text-base lg:text-[17px] text-[var(--text-secondary)] max-w-2xl leading-relaxed"
                >
                    From type-safe full-stack frameworks and Gemini AI pipelines to global cloud orchestration, media CDNs, and international payment gateways—hover any lane to inspect.
                </motion.p>

                {/* Centered Interactive Stream Control Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
                >
                    <button
                        type="button"
                        onClick={() => setInvertDirection((prev) => !prev)}
                        className="inline-flex items-center gap-2 px-4 h-10 rounded-xl devcore-glass-badge font-mono text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)]/60 transition-colors cursor-pointer"
                    >
                        <ArrowLeftRight size={13} className="text-[var(--brand-primary)]" />
                        <span>Reverse Flow</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsPaused((prev) => !prev)}
                        className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-mono text-xs font-semibold hover:bg-[var(--brand-hover)] shadow-xs transition-colors cursor-pointer"
                    >
                        {isPaused ? <Play size={13} /> : <Pause size={13} />}
                        <span>{isPaused ? "Resume Streams" : "Pause Streams"}</span>
                    </button>
                </motion.div>
            </div>

            {/* FULL-BLEED MULTI-LANE MARQUEE STAGE WITH SOFT ALPHA EDGE DISSOLUTION */}
            <div
                className="relative w-full space-y-4"
                style={{
                    maskImage:
                        "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)",
                }}
            >
                {/* Lane 1: Full-Stack Frameworks & Databases */}
                <MarqueeTrack
                    items={STREAM_ONE_STACK}
                    direction={invertDirection ? "right" : "left"}
                    durationSec={42}
                    isPaused={isPaused}
                    label="Core Full-Stack & Database Ecosystem"
                />

                {/* Lane 2: AI / ML Intelligence & Cloud Deployment (Counter-Flowing) */}
                <MarqueeTrack
                    items={STREAM_TWO_AI_CLOUD}
                    direction={invertDirection ? "left" : "right"}
                    durationSec={46}
                    isPaused={isPaused}
                    label="AI, Machine Learning & Cloud Deployment Platforms"
                />

                {/* Lane 3: International Payments, Media, Auth & DevCore Products */}
                <MarqueeTrack
                    items={STREAM_THREE_PAYMENTS_MEDIA}
                    direction={invertDirection ? "right" : "left"}
                    durationSec={44}
                    isPaused={isPaused}
                    label="International Payments, Media Pipelines & Production Platforms"
                />
            </div>

            {/* Bottom Ecosystem Summary Strip */}
            <div className="px-4 sm:px-6 max-w-7xl mx-auto mt-10">
                <div className="devcore-glass-inset px-5 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-[var(--text-muted)]">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                        <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                            Full-Stack &amp; Data
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-sky-500" />
                            AI / ML &amp; Cloud Ops
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                            Payments, Media &amp; SaaS Productions
                        </span>
                    </div>

                    <span className="text-[var(--brand-primary)] font-semibold">
                        Hover any lane to pause &amp; inspect
                    </span>
                </div>
            </div>
        </section>
    );
}