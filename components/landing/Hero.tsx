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
  useScroll,
} from "framer-motion";
import {
  Rocket,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Cpu,
  Globe,
  Terminal,
  Sparkles,
  CheckCircle2,
  Pause,
  Play,
} from "lucide-react";
import { type ShowcaseItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HeroProps {
  newestRelease?: ShowcaseItem | null;
}

const ROTATING_DOMAINS = [
  "Mission-Critical SaaS",
  "Distributed Microservices",
  "AI-Enabled Platforms",
  "Zero-Trust Cloud Systems",
];

const PULSE_HIGHLIGHTS = [
  {
    tag: "OPEN FOR Q1",
    text: "Accepting 2 new enterprise architecture builds",
    cta: "Book Discovery",
    href: "/contact",
  },
  {
    tag: "AI & SAAS LAB",
    text: "Full-stack Next.js, PostgreSQL & Gemini AI systems",
    cta: "Explore Stack",
    href: "/services",
  },
  {
    tag: "ZERO-DRIFT SLA",
    text: "99.998% multi-region uptime with < 14ms edge P99",
    cta: "See Architecture",
    href: "/process",
  },
];

interface KernelLog {
  id: string;
  ts: string;
  level: "INFO" | "EVENT" | "METRIC";
  msg: string;
  accent?: boolean;
}

interface ClusterRegion {
  id: string;
  label: string;
  baseGbps: number;
  barPercent: number;
  baseLatency: number;
  pods: number;
  logs: KernelLog[];
  liveStreamPool: Omit<KernelLog, "id" | "ts">[];
}

const CLUSTER_REGIONS: ClusterRegion[] = [
  {
    id: "us-east",
    label: "US-EAST-01A",
    baseGbps: 2.84,
    barPercent: 82,
    baseLatency: 11.2,
    pods: 36,
    logs: [
      { id: "u1", ts: "14:22:04.18", level: "INFO", msg: "k8s_autoscaler: scaled to 36 active pods" },
      { id: "u2", ts: "14:22:06.90", level: "EVENT", msg: "TLS 1.3 cert rotated [zero-downtime]", accent: true },
      { id: "u3", ts: "14:22:09.11", level: "METRIC", msg: "Edge mesh P99 latency: 11.2ms" },
    ],
    liveStreamPool: [
      { level: "INFO", msg: "envoy_ingress: 48.2k req/s balanced [0 errors]" },
      { level: "EVENT", msg: "redis_cluster: snapshotted in 4.1ms", accent: true },
      { level: "METRIC", msg: "Edge mesh P99 latency: 10.9ms" },
    ],
  },
  {
    id: "eu-west",
    label: "EU-WEST-02B",
    baseGbps: 3.41,
    barPercent: 91,
    baseLatency: 9.8,
    pods: 48,
    logs: [
      { id: "e1", ts: "14:22:11.04", level: "INFO", msg: "raft_consensus: leader quorum verified [3/3]" },
      { id: "e2", ts: "14:22:13.47", level: "EVENT", msg: "pg_pooler: 12k conn/s zero lock wait", accent: true },
      { id: "e3", ts: "14:22:15.82", level: "METRIC", msg: "Edge mesh P99 latency: 9.8ms" },
    ],
    liveStreamPool: [
      { level: "INFO", msg: "grpc_gateway: stream multiplexing 99.99% ok" },
      { level: "EVENT", msg: "kms_vault: envelope key rotation verified", accent: true },
      { level: "METRIC", msg: "Edge mesh P99 latency: 9.6ms" },
    ],
  },
  {
    id: "ap-south",
    label: "AP-SOUTH-01C",
    baseGbps: 2.19,
    barPercent: 74,
    baseLatency: 12.6,
    pods: 28,
    logs: [
      { id: "a1", ts: "14:22:18.30", level: "INFO", msg: "ai_inference_router: tensor batching optimal" },
      { id: "a2", ts: "14:22:20.15", level: "EVENT", msg: "waf_ebpf: 0 anomalous packets dropped", accent: true },
      { id: "a3", ts: "14:22:22.64", level: "METRIC", msg: "Edge mesh P99 latency: 12.6ms" },
    ],
    liveStreamPool: [
      { level: "INFO", msg: "vector_index: HNSW query resolved in 3.4ms" },
      { level: "EVENT", msg: "cdn_edge: cache hit ratio 98.7% across 14 PoPs", accent: true },
      { level: "METRIC", msg: "Edge mesh P99 latency: 12.1ms" },
    ],
  },
];

// ─── 18-LAYER RISING BOTTOM-TO-TOP FLAME / AURORA 3D WAVE ────────────────────
function Smoky3DWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0;
    let targetPointerX = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = parent.clientWidth || window.innerWidth;
      height = parent.clientHeight || 780;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const onPointerMove = (e: MouseEvent) => {
      targetPointerX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 0.9;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    const plumeCount = 18;

    const render = (now: number) => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";

      pointerX += (targetPointerX - pointerX) * 0.035;
      const t = prefersReducedMotion ? 1.8 : now * 0.00072;

      ctx.clearRect(0, 0, width, height);

      const baseGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.78,
        20,
        width * 0.5,
        height * 0.56,
        Math.max(width, height) * 0.55
      );
      if (isDark) {
        baseGlow.addColorStop(0, "rgba(79, 181, 138, 0.16)");
        baseGlow.addColorStop(0.5, "rgba(143, 180, 201, 0.08)");
        baseGlow.addColorStop(1, "rgba(6, 20, 27, 0)");
      } else {
        baseGlow.addColorStop(0, "rgba(37, 55, 69, 0.09)");
        baseGlow.addColorStop(0.5, "rgba(84, 101, 113, 0.045)");
        baseGlow.addColorStop(1, "rgba(244, 246, 247, 0)");
      }
      ctx.fillStyle = baseGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < plumeCount; i++) {
        const riseProgress = (t * 0.24 + i / plumeCount) % 1;
        const envelope = Math.pow(Math.sin(riseProgress * Math.PI), 1.15);

        const plumeBaseY = height * (0.94 - riseProgress * 0.64);
        const tongueAmp = (48 + (1 - riseProgress) * 38) * (width < 640 ? 0.65 : 1);
        const flickerAmp = (22 + (1 - riseProgress) * 18) * (width < 640 ? 0.65 : 1);

        const freq1 = 0.0038 + (i % 4) * 0.0012;
        const freq2 = 0.0088 + (i % 5) * 0.0017;
        const freq3 = 0.0155 + (i % 3) * 0.0022;
        const swayPhase = Math.sin(t * 1.1 + i * 1.45) * 0.95 + pointerX * (0.35 + (i % 3) * 0.15);
        const verticalLick = t * 2.3 + i * 1.15;

        ctx.beginPath();
        ctx.moveTo(-40, height + 40);

        const step = width < 640 ? 14 : 9;
        for (let x = -40; x <= width + 40; x += step) {
          const mainTongue =
            Math.sin(x * freq1 + swayPhase + i * 0.95) *
            tongueAmp *
            (0.72 + 0.28 * Math.sin(verticalLick + x * 0.0032));
          const secondaryFlame =
            Math.cos(x * freq2 - swayPhase * 1.25 + verticalLick * 0.65) * flickerAmp;
          const microTongue =
            Math.sin(x * freq3 + verticalLick * 1.5 + i * 1.7) * 9 * (1 - riseProgress * 0.45);

          const y =
            plumeBaseY -
            Math.abs(mainTongue) * 0.6 +
            mainTongue * 0.4 +
            secondaryFlame +
            microTongue;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width + 40, height + 40);
        ctx.closePath();

        const crestY = plumeBaseY - tongueAmp - flickerAmp;
        const grad = ctx.createLinearGradient(0, crestY, 0, height);

        if (isDark) {
          const variant = i % 3;
          const peakAlpha = (envelope * 0.12).toFixed(3);
          const bodyAlpha = (envelope * 0.17).toFixed(3);
          const crestRgb =
            variant === 0
              ? "79, 181, 138"
              : variant === 1
                ? "143, 180, 201"
                : "94, 196, 172";
          const midRgb = variant === 0 ? "22, 66, 60" : "20, 48, 62";

          grad.addColorStop(0, "rgba(6, 20, 27, 0)");
          grad.addColorStop(0.24, `rgba(${crestRgb}, ${peakAlpha})`);
          grad.addColorStop(0.58, `rgba(${midRgb}, ${bodyAlpha})`);
          grad.addColorStop(1, "rgba(6, 20, 27, 0)");
        } else {
          const peakAlpha = (envelope * 0.058).toFixed(3);
          const bodyAlpha = (envelope * 0.078).toFixed(3);

          grad.addColorStop(0, "rgba(244, 246, 247, 0)");
          grad.addColorStop(0.24, `rgba(37, 55, 69, ${peakAlpha})`);
          grad.addColorStop(0.58, `rgba(84, 101, 113, ${bodyAlpha})`);
          grad.addColorStop(1, "rgba(244, 246, 247, 0)");
        }

        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full blur-[16px] sm:blur-[22px] scale-105 will-change-transform"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 70% at 26% 48%, color-mix(in oklab, var(--bg-canvas) 56%, transparent) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

// ─── SUBTLE AMBIENT CONSTELLATION CANVAS ──────────────────────────────────────
function ArchitectureMeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999 };

    interface MeshNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulsePhase: number;
    }

    interface DataPacket {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }

    let nodes: MeshNode[] = [];
    let packets: DataPacket[] = [];

    const initScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nodeCount = width < 640 ? 18 : width < 1024 ? 26 : 36;
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.4 + 1.2,
        pulsePhase: Math.random() * Math.PI * 2,
      }));

      packets = Array.from({ length: width < 640 ? 5 : 9 }, () => ({
        fromIdx: Math.floor(Math.random() * nodeCount),
        toIdx: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.0035 + Math.random() * 0.004,
      }));
    };

    initScene();

    const onResize = () => initScene();
    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave);

    const render = (time: number) => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";

      const nodeRgb = isDark ? "143, 180, 201" : "37, 55, 69";
      const lineRgb = isDark ? "74, 92, 106" : "155, 168, 171";
      const pulseRgb = isDark ? "79, 181, 138" : "46, 125, 91";

      ctx.clearRect(0, 0, width, height);

      const maxDist = width < 640 ? 120 : 165;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const distCursor = Math.hypot(dx, dy);
          if (distCursor < 130 && distCursor > 0.1) {
            const force = (130 - distCursor) / 130;
            n.x += (dx / distCursor) * force * 0.5;
            n.y += (dy / distCursor) * force * 0.5;
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDark ? 0.16 : 0.11);
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        const glow = 0.35 + 0.2 * Math.sin(time * 0.002 + n.pulsePhase);
        ctx.fillStyle = `rgba(${nodeRgb}, ${glow.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        for (const pkt of packets) {
          const a = nodes[pkt.fromIdx];
          const b = nodes[pkt.toIdx];
          if (!a || !b) continue;

          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > maxDist * 1.35 || pkt.progress >= 1) {
            pkt.fromIdx = Math.floor(Math.random() * nodes.length);
            let bestNeighbor = (pkt.fromIdx + 1) % nodes.length;
            for (let k = 0; k < nodes.length; k++) {
              if (k === pkt.fromIdx) continue;
              const d = Math.hypot(
                nodes[pkt.fromIdx].x - nodes[k].x,
                nodes[pkt.fromIdx].y - nodes[k].y
              );
              if (d < maxDist) {
                bestNeighbor = k;
                break;
              }
            }
            pkt.toIdx = bestNeighbor;
            pkt.progress = 0;
            continue;
          }

          pkt.progress += pkt.speed;
          const px = a.x + (b.x - a.x) * pkt.progress;
          const py = a.y + (b.y - a.y) * pkt.progress;

          ctx.fillStyle = `rgba(${pulseRgb}, 0.75)`;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

// ─── ANIMATED KPI COUNTER ─────────────────────────────────────────────────────
function AnimatedMetric({
  prefix = "",
  target,
  decimals = 0,
  suffix = "",
}: {
  prefix?: string;
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(target.toFixed(decimals));

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      return;
    }

    const duration = 1400;
    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = target * eased;
      setDisplay(current.toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, decimals]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function formatNowTimestamp(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
}

// ─── MAIN HERO COMPONENT ──────────────────────────────────────────────────────
export function Hero({ newestRelease }: HeroProps) {
  void newestRelease;

  const [domainIndex, setDomainIndex] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [activeRegionIdx, setActiveRegionIdx] = useState(0);
  const [liveTick, setLiveTick] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [customLogs, setCustomLogs] = useState<Record<string, KernelLog[]>>({});

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const logSeqRef = useRef(0);

  // Scroll-linked subtle parallax depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const cardParallaxY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  // 3D Card Tilt & Cursor Spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(240);
  const spotY = useMotionValue(180);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 220,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 220,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(360px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--brand-primary) 16%, transparent), transparent 75%)`;

  // Magnetic primary CTA subtle pull
  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const springCtaX = useSpring(ctaX, { stiffness: 300, damping: 20 });
  const springCtaY = useSpring(ctaY, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDomainIndex((prev) => (prev + 1) % ROTATING_DOMAINS.length);
    }, 3400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % PULSE_HIGHLIGHTS.length);
    }, 4600);
    return () => clearInterval(pulseTimer);
  }, []);

  // Live telemetry stream tick when ACTIVE (strict-mode safe unique keys)
  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => {
      logSeqRef.current += 1;
      const seq = logSeqRef.current;
      setLiveTick(seq);

      const region = CLUSTER_REGIONS[activeRegionIdx];
      const sample = region.liveStreamPool[seq % region.liveStreamPool.length];
      const newEntry: KernelLog = {
        id: `${region.id}-seq-${seq}`,
        ts: formatNowTimestamp(),
        level: sample.level,
        msg: sample.msg,
        accent: sample.accent,
      };

      setCustomLogs((prevMap) => {
        const currentList = prevMap[region.id] ?? region.logs;
        return {
          ...prevMap,
          [region.id]: [...currentList.slice(-2), newEntry],
        };
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [isStreaming, activeRegionIdx]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    ctaX.set(offsetX);
    ctaY.set(offsetY);
  };

  const handleCtaMouseLeave = () => {
    ctaX.set(0);
    ctaY.set(0);
  };

  const activeRegion = CLUSTER_REGIONS[activeRegionIdx];
  const visibleLogs = customLogs[activeRegion.id] ?? activeRegion.logs;
  const activePulse = PULSE_HIGHLIGHTS[pulseIndex];

  const variance = isStreaming ? ((liveTick % 5) - 2) * 0.02 : 0;
  const liveGbps = (activeRegion.baseGbps + variance).toFixed(2);
  const liveBar = Math.min(
    98,
    Math.max(60, activeRegion.barPercent + (isStreaming ? (liveTick % 3) - 1 : 0))
  );
  const liveLatency = (
    activeRegion.baseLatency - (isStreaming ? (liveTick % 3) * 0.1 : 0)
  ).toFixed(1);

  const whatsappHref = `https://wa.me/${(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801700000000"
  ).replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi DevCore Solutions, I'd like to discuss a software project."
  )}`;

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero section"
      className="relative isolate overflow-hidden -mt-24 pt-36 sm:pt-40 pb-24 sm:pb-32"
    >
      {/* Rising 18-Plume Flame/Aurora Wave + Constellation Mesh with True Alpha Edge Dissolution */}
      <motion.div
        style={{
          y: bgParallaxY,
          maskImage:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 12%, black 26%, black 70%, rgba(0,0,0,0.45) 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 12%, black 26%, black 70%, rgba(0,0,0,0.45) 86%, transparent 100%)",
        }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <Smoky3DWaveCanvas />
        <ArchitectureMeshCanvas />

        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-1/4 h-80 w-80 rounded-full bg-[var(--brand-primary)]/10 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -35, 20, 0],
            y: [0, 20, -20, 0],
            scale: [1, 0.94, 1.06, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 right-1/5 h-96 w-96 rounded-full bg-[var(--border-strong)]/18 blur-[130px]"
        />
      </motion.div>

      {/* Foreground Content Container */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN — Executive Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 min-w-0">
            {/* Interactive Live Engineering Pulse Pill */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 max-w-full p-1.5 pr-2.5 rounded-full devcore-glass-badge transition-all duration-200 hover:border-[var(--brand-primary)]/70 hover:shadow-sm"
            >
              {/* Animated Live Equalizer + Tag (Click to cycle) */}
              <button
                type="button"
                onClick={() => setPulseIndex((prev) => (prev + 1) % PULSE_HIGHLIGHTS.length)}
                title="Cycle studio updates"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-mono text-[10px] font-bold tracking-wider uppercase cursor-pointer shrink-0 transition-transform active:scale-95"
              >
                <span className="flex items-end gap-[2px] h-2.5" aria-hidden="true">
                  <motion.span
                    animate={{ height: ["35%", "100%", "45%"] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[2px] rounded-full bg-[var(--success)]"
                  />
                  <motion.span
                    animate={{ height: ["90%", "30%", "85%"] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[2px] rounded-full bg-[var(--success)]"
                  />
                  <motion.span
                    animate={{ height: ["45%", "95%", "35%"] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[2px] rounded-full bg-[var(--success)]"
                  />
                </span>
                <span>{activePulse.tag}</span>
              </button>

              {/* Animated Rotating Studio Insight */}
              <Link
                href={activePulse.href}
                className="group inline-flex items-center gap-1.5 min-w-0 text-xs font-medium text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activePulse.text}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="truncate max-w-[210px] sm:max-w-[320px]"
                  >
                    {activePulse.text}
                  </motion.span>
                </AnimatePresence>

                <span className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-[var(--brand-primary)] shrink-0">
                  · {activePulse.cta}
                </span>
                <ArrowUpRight
                  size={13}
                  className="shrink-0 text-[var(--brand-primary)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>

            {/* Main Headline with Animated Domain Rotator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2.5"
            >
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] text-[var(--text-primary)] tracking-tight leading-[1.07]">
                Architecting Resilient Platforms for{" "}
                <span className="text-liquid-gradient block sm:inline">
                  High-Scale Enterprise.
                </span>
              </h1>

              {/* Dynamic Engineering Capability Ticker */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-semibold">
                  <Sparkles size={12} />
                  SPECIALIZED IN
                </span>
                <div className="relative h-5 overflow-hidden flex items-center min-w-[210px] sm:min-w-[250px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={ROTATING_DOMAINS[domainIndex]}
                      initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="font-semibold text-[var(--text-primary)]"
                    >
                      {ROTATING_DOMAINS[domainIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg lg:text-[19px] text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl"
            >
              We engineer mission-critical SaaS, cloud infrastructure, distributed microservices, and AI-enabled software — built for zero-drift performance from day one.
            </motion.p>

            {/* Official Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl devcore-glass-inset text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-primary)]/50"
            >
              <ShieldCheck size={16} className="text-[var(--brand-primary)] shrink-0" aria-hidden="true" />
              <span>&ldquo;Building the Digital Core for a Smarter Tomorrow.&rdquo;</span>
            </motion.div>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto"
            >
              <motion.div
                onMouseMove={handleCtaMouseMove}
                onMouseLeave={handleCtaMouseLeave}
                style={{ x: springCtaX, y: springCtaY }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/contact"
                  className="btn-liquid-hover group inline-flex items-center justify-center gap-2.5 text-sm font-semibold px-6 h-12 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-md hover:bg-[var(--brand-hover)] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                >
                  <Rocket
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                  <span>Start a Project</span>
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 text-sm font-semibold px-5 h-12 rounded-xl border border-[var(--border-strong)]/80 bg-[var(--bg-elevated)]/75 backdrop-blur-md text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] shadow-2xs transition-all duration-200 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <MessageSquare
                  size={16}
                  className="text-[var(--success)] transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>

            {/* Animated KPI Metrics Strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 gap-3 sm:gap-5 pt-6 border-t border-[var(--border-subtle)]/80 w-full max-w-xl"
              aria-label="Key performance metrics"
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className="rounded-xl p-2.5 sm:p-3.5 bg-[var(--bg-surface)]/75 backdrop-blur-md border border-[var(--border-subtle)]/70 hover:border-[var(--brand-primary)]/45 shadow-2xs transition-colors"
              >
                <div className="font-mono font-bold text-xl sm:text-2xl lg:text-3xl text-[var(--text-primary)] tabular-nums">
                  <AnimatedMetric target={99.998} decimals={3} suffix="%" />
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-1 font-medium">
                  Core SLA Availability
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className="rounded-xl p-2.5 sm:p-3.5 bg-[var(--bg-surface)]/75 backdrop-blur-md border border-[var(--border-subtle)]/70 hover:border-[var(--brand-primary)]/45 shadow-2xs transition-colors"
              >
                <div className="font-mono font-bold text-xl sm:text-2xl lg:text-3xl text-[var(--text-primary)] tabular-nums">
                  <AnimatedMetric prefix="< " target={14} decimals={0} suffix="ms" />
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-1 font-medium">
                  P99 Edge Latency
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className="rounded-xl p-2.5 sm:p-3.5 bg-[var(--bg-surface)]/75 backdrop-blur-md border border-[var(--border-subtle)]/70 hover:border-[var(--brand-primary)]/45 shadow-2xs transition-colors"
              >
                <div className="font-mono font-bold text-xl sm:text-2xl lg:text-3xl text-[var(--text-primary)] tabular-nums">
                  <AnimatedMetric target={420} decimals={0} suffix="k+" />
                </div>
                <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-1 font-medium">
                  Production IOPS
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Interactive 3D Tilt Live Architecture Console */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
            style={{ perspective: 1100, y: cardParallaxY }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ rotateX, rotateY }}
              className="relative devcore-glass-card p-5 sm:p-6 overflow-hidden group"
              role="region"
              aria-label="Live system telemetry dashboard"
            >
              {/* Cursor-Tracked Glass Spotlight Overlay */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: spotlightBg }}
              />

              {/* Top Specular Edge Highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/60 to-transparent"
              />

              {/* Subtle Animated Scanline Sweep */}
              <motion.div
                aria-hidden="true"
                animate={{ y: ["-100%", "420%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-[var(--brand-primary)]/[0.06] to-transparent"
              />

              {/* Terminal Window Header */}
              <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--error)]/75 border border-[var(--error)] shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/75 border border-[var(--warning)] shrink-0" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]/75 border border-[var(--success)] shrink-0" />
                  <span className="ml-1.5 font-mono text-xs font-semibold text-[var(--brand-primary)] truncate">
                    devcore-kernel-v3.0.4
                  </span>
                </div>

                {/* Interactive Live Stream Toggle Pill */}
                <button
                  type="button"
                  onClick={() => setIsStreaming((prev) => !prev)}
                  title={isStreaming ? "Pause live telemetry stream" : "Resume live telemetry stream"}
                  className={cn(
                    "font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer",
                    isStreaming
                      ? "text-[var(--success)] border-[var(--success)]/30 hover:border-[var(--success)]"
                      : "text-[var(--warning)] border-[var(--warning)]/30 hover:border-[var(--warning)]"
                  )}
                >
                  <span className="relative flex size-1.5">
                    {isStreaming && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                    )}
                    <span
                      className={cn(
                        "relative inline-flex rounded-full size-1.5",
                        isStreaming ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                      )}
                    />
                  </span>
                  <span>{isStreaming ? "ACTIVE" : "PAUSED"}</span>
                  {isStreaming ? (
                    <Pause size={9} className="opacity-70" />
                  ) : (
                    <Play size={9} className="opacity-70" />
                  )}
                </button>
              </div>

              {/* Interactive Region Selector Tabs */}
              <div
                className="relative isolate z-10 mt-3.5 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)]/75 border border-[var(--border-subtle)]/70"
                role="tablist"
                aria-label="Cluster regions"
              >
                {CLUSTER_REGIONS.map((region, idx) => {
                  const selected = idx === activeRegionIdx;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveRegionIdx(idx)}
                      className={cn(
                        "relative py-1.5 px-2 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer",
                        selected
                          ? "text-[var(--brand-contrast)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="hero-cluster-tab"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className="absolute inset-0 z-0 rounded-lg bg-[var(--brand-primary)] shadow-xs"
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        <Globe size={11} />
                        {region.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Telemetry Body */}
              <div className="relative z-10 mt-3.5 space-y-3 font-mono text-xs text-[var(--text-primary)]">
                {/* Throughput & Node Health Card */}
                <div className="p-3.5 bg-[var(--bg-elevated)]/90 rounded-xl border border-[var(--border-subtle)] shadow-xs">
                  <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] pb-1.5 border-b border-[var(--border-subtle)]/50">
                    <span className="flex items-center gap-1.5">
                      <Cpu size={12} className="text-[var(--brand-primary)]" />
                      NODE: {activeRegion.label} ({activeRegion.pods} PODS)
                    </span>
                    <span className="text-[var(--success)] font-bold">HEALTHY</span>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-[var(--brand-primary)] font-semibold flex items-center gap-1.5">
                      <Activity size={13} />
                      Throughput
                    </span>
                    <span className="font-bold text-sm text-[var(--text-primary)] tabular-nums">
                      {liveGbps} Gbps
                    </span>
                  </div>

                  <div
                    className="w-full bg-[var(--bg-surface)] h-2 rounded-full mt-2 overflow-hidden p-0.5 border border-[var(--border-subtle)]/40"
                    role="progressbar"
                    aria-valuenow={liveBar}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Throughput at ${liveBar}%`}
                  >
                    <motion.div
                      initial={false}
                      animate={{ width: `${liveBar}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 24 }}
                      className="bg-[var(--brand-primary)] h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Live Streaming Kernel Logs */}
                <div className="bg-[var(--bg-elevated)]/90 p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)]/50">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Terminal size={11} className="text-[var(--brand-primary)]" />
                      KERNEL STREAM
                    </span>
                    <span className="tabular-nums">P99: {liveLatency}ms</span>
                  </div>

                  <div className="space-y-1.5">
                    <AnimatePresence initial={false} mode="popLayout">
                      {visibleLogs.map((log) => (
                        <motion.div
                          key={log.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]"
                        >
                          <span className="text-[var(--text-muted)] text-[10px] shrink-0 tabular-nums">
                            {log.ts}
                          </span>
                          <span
                            className={cn(
                              "font-bold shrink-0 text-[10px] px-1 rounded",
                              log.accent
                                ? "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)]"
                                : "bg-[var(--success)]/12 text-[var(--success)]"
                            )}
                          >
                            {log.level}
                          </span>
                          <span className="truncate">{log.msg}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Zero-Trust Verification Strip */}
                <div className="devcore-glass-inset p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/25 flex items-center justify-center text-[var(--brand-primary)] shrink-0">
                      <ShieldCheck size={16} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        mTLS Strict Zero-Trust
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">
                        SHA-256 eBPF Packet Filter
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--success)] font-bold shrink-0">
                    <CheckCircle2 size={13} />
                    100% PASS
                  </span>
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="relative z-10 mt-3.5 pt-3 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-block w-1.5 h-1.5 rounded-full transition-opacity duration-300",
                      isStreaming
                        ? liveTick % 2 === 0
                          ? "bg-[var(--success)] opacity-100"
                          : "bg-[var(--success)] opacity-35"
                        : "bg-[var(--warning)] opacity-80"
                    )}
                  />
                  DevCore Telemetry Feed
                </span>
                <span className="tabular-nums">{isStreaming ? "Sync: 500ms" : "Stream Paused"}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}