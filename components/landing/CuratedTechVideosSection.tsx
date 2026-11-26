"use client";

import { useState, useRef } from "react";
import {
    motion,
    AnimatePresence,
    useInView,
    useMotionValue,
    useMotionTemplate,
} from "framer-motion";
import {
    Play,
    Sparkles,
    Clock,
    Cpu,
    Code2,
    BrainCircuit,
    ArrowUpRight,
    Shuffle,
    Volume2,
    VolumeX,
    CheckCircle2,
    Radio,
    Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

type VideoDomain = "ALL" | "AI_ML" | "WEB_STACK" | "SYSTEMS";

interface CuratedVideoItem {
    id: string;
    youtubeId: string;
    domain: Exclude<VideoDomain, "ALL">;
    domainLabel: string;
    code: string;
    title: string;
    creator: string;
    creatorRole: string;
    duration: string;
    views: string;
    audioNote: string;
    summary: string;
    keyTakeaways: string[];
    featuredBadge?: string;
}

const CURATED_VIDEOS: CuratedVideoItem[] = [
    {
        id: "devcore-ai-brand-film",
        youtubeId: "QIcM3jB9G6g",
        domain: "AI_ML",
        domainLabel: "DEVCORE ORIGINAL · AI & ENGINEERING",
        code: "REEL // 01",
        featuredBadge: "DEVCORE STUDIO FILM",
        title: "AI Brand Film: AI Writes. Engineers Decide.",
        creator: "DevCore Solutions",
        creatorRole: "Official Studio Film · Full-Stack & AI Architecture",
        duration: "02:01",
        views: "Official Release",
        audioNote: "Ambient Studio Score",
        summary:
            "Beyond technology. Beyond limits. Our official studio film showcasing how DevCore Solutions combines AI-accelerated code generation with principal engineering judgment, automated edge-case testing, and strict architectural governance.",
        keyTakeaways: [
            "AI-Assisted Code & Edge-Case Tests",
            "Principal Engineer Architecture Review",
            "Production-Ready Resilient Systems",
        ],
    },
    {
        id: "linear-product-film",
        youtubeId: "lKwyrKUEPS4",
        domain: "WEB_STACK",
        domainLabel: "SOFTWARE PRODUCT CRAFT",
        code: "REEL // 02",
        title: "Linear: From Idea to Execution at High Velocity",
        creator: "Linear",
        creatorRole: "Modern Software Product & Engineering Workflows",
        duration: "00:26",
        views: "480K+ Views",
        audioNote: "Soft Electronic Score",
        summary:
            "Precision UI motion graphics illustrating how elite software teams move from raw product concept to structured roadmaps, clean sprints, and aligned engineering execution.",
        keyTakeaways: [
            "Precision UI Motion Craft",
            "Structured Product Roadmaps",
            "High-Velocity Team Alignment",
        ],
    },
    {
        id: "framer-web-agents",
        youtubeId: "6aioEoCdBJw",
        domain: "WEB_STACK",
        domainLabel: "NEXT-GEN WEB & AI AGENTS",
        code: "REEL // 03",
        title: "Modern Web Architecture with AI Agents & Branching",
        creator: "Framer",
        creatorRole: "Interactive Web Platform & Design Engineering",
        duration: "02:14",
        views: "640K+ Views",
        audioNote: "Ambient Studio Score",
        summary:
            "Inside next-generation web engineering—combining interactive canvas workflows, Git-style visual branching, and embedded AI agents to ship flagship web experiences.",
        keyTakeaways: [
            "Branch-Based Web Workflows",
            "Embedded AI Design Agents",
            "Interactive Glass UI Systems",
        ],
    },
    {
        id: "figma-dev-mode",
        youtubeId: "RnR1Kqkf-zc",
        domain: "SYSTEMS",
        domainLabel: "DESIGN-TO-CODE SYSTEMS",
        code: "REEL // 04",
        title: "Dev Mode: Bridging Design Systems & Production Code",
        creator: "Figma",
        creatorRole: "Collaborative Interface & System Architecture",
        duration: "01:42",
        views: "510K+ Views",
        audioNote: "Upbeat Synth Score",
        summary:
            "How component tokens, CSS variable inspection, and tight IDE integration eliminate handoff friction between product designers and full-stack engineers.",
        keyTakeaways: [
            "Tokenized Design Variables",
            "Zero-Drift Code Inspection",
            "Unified Component Libraries",
        ],
    },
    {
        id: "stripe-minions-agents",
        youtubeId: "Yuo2V3f0ltY",
        domain: "AI_ML",
        domainLabel: "AUTONOMOUS CODING AGENTS",
        code: "REEL // 05",
        title: "How Cloud Coding Agents Ship 9,000+ PRs a Week",
        creator: "Stripe Engineering",
        creatorRole: "Financial Infrastructure & Developer Platform",
        duration: "16:20",
        views: "320K+ Views",
        audioNote: "Engineering Deep Dive",
        summary:
            "Inside Stripe's cloud-sandboxed coding agents ('Minions'), adversarial review agents, and deterministic testing harnesses automating end-to-end software delivery.",
        keyTakeaways: [
            "Cloud-Sandboxed Coding Agents",
            "Automated Adversarial Code Review",
            "Deterministic Test Harnesses",
        ],
    },
    {
        id: "vercel-ai-cloud",
        youtubeId: "lNmO7fDiyuE",
        domain: "SYSTEMS",
        domainLabel: "CLOUD & EDGE INFRASTRUCTURE",
        code: "REEL // 06",
        title: "The AI Cloud: Edge Sandboxes & Microfrontends",
        creator: "Vercel",
        creatorRole: "Frontend Cloud & Next.js Infrastructure",
        duration: "44:10",
        views: "290K+ Views",
        audioNote: "Keynote & Live Demos",
        summary:
            "Architectural tour of AI Gateways, active CPU scaling, isolated execution sandboxes, and zero-downtime rolling releases for global full-stack web platforms.",
        keyTakeaways: [
            "Unified AI Model Gateways",
            "Isolated Cloud Sandboxes",
            "Zero-Downtime Rolling Releases",
        ],
    },
    {
        id: "nvidia-rise-of-ai",
        youtubeId: "d24W8AqeOHM",
        domain: "AI_ML",
        domainLabel: "AI & COMPUTE INFRASTRUCTURE",
        code: "REEL // 07",
        title: "The Rise of AI: Multi-Modal & Physical Intelligence",
        creator: "NVIDIA",
        creatorRole: "Accelerated Computing & Foundation Systems",
        duration: "03:30",
        views: "1.2M+ Views",
        audioNote: "Cinematic Studio Score",
        summary:
            "From GPU-accelerated computing to multi-modal AI systems that perceive, reason, and execute across code, vision, and enterprise workflows.",
        keyTakeaways: [
            "Multi-Modal AI Reasoning",
            "Accelerated Compute Pipelines",
            "Enterprise AI Transformation",
        ],
    },
    {
        id: "fireship-ts",
        youtubeId: "zQnBQ4tB3ZA",
        domain: "WEB_STACK",
        domainLabel: "TYPE-SAFE ENGINEERING",
        code: "REEL // 08",
        title: "TypeScript in 100 Seconds: Enterprise Code Safety",
        creator: "Fireship",
        creatorRole: "High-Velocity Full-Stack Engineering",
        duration: "02:15",
        views: "1.4M+ Views",
        audioNote: "Crisp Studio Narration",
        summary:
            "Why strict static typing, compile-time contract verification, and intelligent IDE refactoring are mandatory for scaling multi-developer full-stack codebases.",
        keyTakeaways: [
            "Compile-Time Type Safety",
            "Zero-Runtime Overhead",
            "End-to-End API Contracts",
        ],
    },
];

const FILTER_TABS: { id: VideoDomain; label: string }[] = [
    { id: "ALL", label: "All Reels" },
    { id: "AI_ML", label: "AI & Automation" },
    { id: "WEB_STACK", label: "Web & Products" },
    { id: "SYSTEMS", label: "CS & Cloud" },
];

function HDThumbnail({
    youtubeId,
    alt,
    className,
}: {
    youtubeId: string;
    alt: string;
    className?: string;
}) {
    const [src, setSrc] = useState(
        `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    );

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => {
                if (src.includes("maxresdefault")) {
                    setSrc(`https://i.ytimg.com/vi/${youtubeId}/sddefault.jpg`);
                } else if (src.includes("sddefault")) {
                    setSrc(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`);
                }
            }}
            className={className}
        />
    );
}

export function CuratedTechVideosSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const [activeDomain, setActiveDomain] = useState<VideoDomain>("ALL");
    const [selectedId, setSelectedId] = useState<string>(CURATED_VIDEOS[0].id);
    const [manualPlay, setManualPlay] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [playerVersion, setPlayerVersion] = useState<number>(0);

    const spotX = useMotionValue(480);
    const spotY = useMotionValue(240);
    const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 14%, transparent), transparent 74%)`;

    const domainOrderedPool =
        activeDomain === "ALL"
            ? CURATED_VIDEOS
            : [
                ...CURATED_VIDEOS.filter((v) => v.domain === activeDomain),
                ...CURATED_VIDEOS.filter((v) => v.domain !== activeDomain),
            ];

    const activeVideo =
        domainOrderedPool.find((v) => v.id === selectedId) || domainOrderedPool[0];

    // Exclude the active stage video so the bottom 3 cards are NEVER duplicated
    const bottomThreeCards = domainOrderedPool
        .filter((v) => v.id !== activeVideo.id)
        .slice(0, 3);

    const shouldPlay = manualPlay || isInView;

    const handleSelectVideo = (video: CuratedVideoItem, unmute = false) => {
        setSelectedId(video.id);
        setManualPlay(true);
        if (unmute) {
            setIsMuted(false);
        }
        setPlayerVersion((v) => v + 1);
    };

    const handleDomainChange = (domain: VideoDomain) => {
        setActiveDomain(domain);
        const nextPool =
            domain === "ALL"
                ? CURATED_VIDEOS
                : [
                    ...CURATED_VIDEOS.filter((v) => v.domain === domain),
                    ...CURATED_VIDEOS.filter((v) => v.domain !== domain),
                ];
        if (nextPool[0]) {
            setSelectedId(nextPool[0].id);
            setManualPlay(true);
            setPlayerVersion((v) => v + 1);
        }
    };

    const handleCycleNext = () => {
        const currentIdx = domainOrderedPool.findIndex((v) => v.id === activeVideo.id);
        const nextVideo = domainOrderedPool[(currentIdx + 1) % domainOrderedPool.length];
        if (nextVideo) {
            handleSelectVideo(nextVideo, false);
        }
    };

    const handleToggleAudio = () => {
        setIsMuted((prev) => !prev);
        setManualPlay(true);
        setPlayerVersion((v) => v + 1);
    };

    const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect) return;
        spotX.set(e.clientX - rect.left);
        spotY.set(e.clientY - rect.top);
    };

    const embedUrl = `https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0
        }&loop=1&playlist=${activeVideo.youtubeId}&rel=0&modestbranding=1&playsinline=1`;

    return (
        <section
            ref={sectionRef}
            id="engineering-theater"
            aria-label="DevCore Solutions Engineering & AI Cinema Showcase"
            className="relative isolate overflow-hidden pt-12 sm:pt-16 pb-24 sm:pb-28 px-4 sm:px-6"
        >
            {/* Ambient Studio Lighting */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                style={{
                    maskImage:
                        "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
                }}
            >
                <div
                    className="mx-auto h-[540px] w-[540px] sm:w-[860px] rounded-full opacity-80"
                    style={{
                        background:
                            "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 14%, transparent) 0%, color-mix(in oklab, var(--success) 6%, transparent) 45%, transparent 72%)",
                        filter: "blur(48px)",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Executive Header & Domain Filter Dock */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full devcore-glass-badge font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">
                            <Radio size={13} className="text-[var(--success)] animate-pulse" />
                            <span>DEVCORE STUDIO REEL · AI &amp; SOFTWARE CRAFT</span>
                        </div>

                        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-[1.08]">
                            Engineering Breakthroughs Shaping{" "}
                            <span className="text-liquid-gradient">Tomorrow&apos;s Software.</span>
                        </h2>

                        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                            Watch our original AI brand film alongside industry-defining software product showcases across intelligent automation, modern web engineering, and cloud systems.
                        </p>
                    </div>

                    {/* Domain Track Selector */}
                    <div
                        role="tablist"
                        aria-label="Filter engineering videos"
                        className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)]/80 backdrop-blur-md border border-[var(--border-subtle)] self-start lg:self-end"
                    >
                        {FILTER_TABS.map((tab) => {
                            const active = tab.id === activeDomain;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => handleDomainChange(tab.id)}
                                    className={cn(
                                        "px-3.5 py-2 rounded-xl font-mono text-[11px] font-semibold transition-all cursor-pointer",
                                        active
                                            ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-xs"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* FLAGSHIP CINEMA THEATER STAGE */}
                <div
                    ref={stageRef}
                    onMouseMove={handleStageMouseMove}
                    className="relative devcore-glass-card p-6 sm:p-8 lg:p-10 overflow-hidden group mb-14 sm:mb-16"
                >
                    {/* Mouse-Tracked Optical Glass Spotlight */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: spotlightBg }}
                    />

                    {/* Top Specular Rim */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/65 to-transparent"
                    />

                    <div
                        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center"
                        style={{ gap: "2.5rem" }}
                    >
                        {/* Left 7 Cols: 16:9 Autoplay Cinema Viewport */}
                        <div className="lg:col-span-7 min-w-0">
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-black shadow-2xl">
                                {shouldPlay ? (
                                    <>
                                        <iframe
                                            key={`${activeVideo.youtubeId}-${playerVersion}`}
                                            src={embedUrl}
                                            title={activeVideo.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            className="absolute inset-0 h-full w-full border-0"
                                        />

                                        {/* Floating Studio Audio Toggle Pill */}
                                        <div className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleToggleAudio}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 font-mono text-[11px] font-semibold text-white shadow-lg transition-all cursor-pointer"
                                            >
                                                {isMuted ? (
                                                    <>
                                                        <VolumeX size={13} className="text-amber-400" />
                                                        <span>Unmute Score</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Volume2 size={13} className="text-emerald-400" />
                                                        <span>Audio Live</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleSelectVideo(activeVideo, true)}
                                        aria-label={`Play ${activeVideo.title}`}
                                        className="group/player relative block h-full w-full text-left cursor-pointer focus:outline-none"
                                    >
                                        <HDThumbnail
                                            youtubeId={activeVideo.youtubeId}
                                            alt={activeVideo.title}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover/player:scale-105"
                                        />

                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(180deg, rgba(6,20,27,0.2) 0%, rgba(6,20,27,0.15) 45%, rgba(6,20,27,0.85) 100%)",
                                            }}
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="relative flex items-center justify-center">
                                                <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-[var(--brand-primary)] opacity-40" />
                                                <span className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-2xl border border-white/25 transition-transform duration-300 group-hover/player:scale-110">
                                                    <Play size={24} className="fill-current ml-0.5" />
                                                </span>
                                            </span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right 5 Cols: Architectural Briefing & Controls (Generous left spacing on desktop) */}
                        <div className="lg:col-span-5 min-w-0 lg:pl-4 flex flex-col justify-between space-y-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeVideo.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.26 }}
                                    className="space-y-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--brand-primary)]">
                                            <Layers size={13} />
                                            <span>
                                                {activeVideo.code} {"//"} {activeVideo.domainLabel}
                                            </span>
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--success)]/12 text-[var(--success)] font-mono text-[10px] font-bold">
                                            <Volume2 size={11} />
                                            {activeVideo.audioNote}
                                        </span>
                                    </div>

                                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight">
                                        {activeVideo.title}
                                    </h3>

                                    <div className="text-xs font-mono text-[var(--text-muted)]">
                                        Produced by{" "}
                                        <strong className="text-[var(--text-primary)] font-semibold">
                                            {activeVideo.creator}
                                        </strong>{" "}
                                        · {activeVideo.creatorRole}
                                    </div>

                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                        {activeVideo.summary}
                                    </p>

                                    {/* Architectural Highlights */}
                                    <div className="pt-1 space-y-2">
                                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                            ARCHITECTURAL TAKEAWAYS
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeVideo.keyTakeaways.map((point) => (
                                                <span
                                                    key={point}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] font-medium text-[var(--text-primary)]"
                                                >
                                                    <CheckCircle2 size={12} className="text-[var(--success)] shrink-0" />
                                                    <span>{point}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Theater Action Bar */}
                            <div className="pt-4 border-t border-[var(--border-subtle)]/80 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleToggleAudio}
                                    className="btn-liquid-hover inline-flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs hover:bg-[var(--brand-hover)] cursor-pointer transition-colors"
                                >
                                    {isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                    <span>{isMuted ? "Enable Studio Sound" : "Mute Studio Sound"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCycleNext}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors"
                                >
                                    <Shuffle size={13} />
                                    <span>Next Reel</span>
                                </button>

                                <a
                                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto inline-flex items-center gap-1 font-mono text-xs font-semibold text-[var(--brand-primary)] hover:underline underline-offset-4"
                                >
                                    <span>Full Screen</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UP NEXT: 3 DISTINCT CURATED REEL CARDS (No black border on hover — luminous glass lift) */}
                <div className="flex items-center justify-between mb-5">
                    <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        UP NEXT IN STUDIO QUEUE ({domainOrderedPool.length - 1} REELS AVAILABLE)
                    </div>
                    <button
                        type="button"
                        onClick={handleCycleNext}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--brand-primary)] hover:opacity-80 cursor-pointer transition-opacity"
                    >
                        <Shuffle size={12} />
                        <span>Rotate Queue</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {bottomThreeCards.map((video) => {
                        const DomainIcon =
                            video.domain === "AI_ML"
                                ? BrainCircuit
                                : video.domain === "WEB_STACK"
                                    ? Code2
                                    : Cpu;

                        return (
                            <motion.div
                                key={video.id}
                                layout
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                                onClick={() => handleSelectVideo(video, true)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleSelectVideo(video, true);
                                    }
                                }}
                                style={{
                                    borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
                                }}
                                className="group/card relative rounded-2xl border bg-[var(--bg-elevated)]/80 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl focus:outline-none"
                            >
                                {/* Soft Luminous Top Glass Rim on Hover (Replaces harsh black border) */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-6 top-0 z-20 h-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-[var(--success)] to-transparent"
                                />

                                <div>
                                    {/* Crisp 16:9 HD Thumbnail Container */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                                        <HDThumbnail
                                            youtubeId={video.youtubeId}
                                            alt={video.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(180deg, rgba(6,20,27,0.14) 0%, rgba(6,20,27,0.08) 45%, rgba(6,20,27,0.78) 100%)",
                                            }}
                                        />

                                        {/* Top Telemetry Badges */}
                                        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] font-bold">
                                                <DomainIcon size={11} className="text-emerald-400" />
                                                <span>{video.featuredBadge || video.code}</span>
                                            </span>

                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-semibold">
                                                <Clock size={10} />
                                                <span>{video.duration}</span>
                                            </span>
                                        </div>

                                        {/* Bottom Creator & Play Badge */}
                                        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                                            <span className="font-mono text-[11px] font-semibold text-white drop-shadow">
                                                {video.creator}
                                            </span>

                                            <span className="w-9 h-9 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/card:scale-110">
                                                <Play size={14} className="fill-current ml-0.5" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Text Body */}
                                    <div className="p-5 sm:p-6">
                                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                                            {video.domainLabel}
                                        </div>
                                        <h4 className="mt-1.5 font-display font-bold text-base sm:text-lg text-[var(--text-primary)] line-clamp-2 transition-colors">
                                            {video.title}
                                        </h4>
                                        <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                            {video.summary}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Footer Status */}
                                <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--border-subtle)]/70 flex items-center justify-between font-mono text-[11px]">
                                    <span className="text-[var(--text-muted)]">{video.views}</span>
                                    <span className="font-bold inline-flex items-center gap-1.5 text-[var(--brand-primary)] group-hover/card:text-[var(--success)] transition-colors">
                                        <Sparkles size={11} />
                                        <span>WATCH IN STAGE</span>
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}