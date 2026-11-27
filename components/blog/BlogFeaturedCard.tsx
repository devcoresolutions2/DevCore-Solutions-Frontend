"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  Copy,
  Check,
  Clock,
  Calendar,
  ArrowUpRight,
  Code2,
  Sparkles,
  FileCode2,
} from "lucide-react";
import type { BlogArticleItem } from "@/lib/api";

interface BlogFeaturedCardProps {
  article: BlogArticleItem | null;
}

export function BlogFeaturedCard({ article }: BlogFeaturedCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-350);
  const mouseY = useMotionValue(-350);
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 13%, transparent), transparent 75%)`;

  if (!article) return null;

  const snippet = article.codeSnippet || {
    filename: "sync_engine.go",
    language: "go",
    code: `// DeltaSync engine with vector clocks
type StateDelta struct {
    NodeID    string      \`json:"node_id"\`
    Seq       uint64      \`json:"seq"\`
    Clock     VectorClock \`json:"clock"\`
    Operation byte        \`json:"op"\`
    Payload   []byte      \`json:"payload"\`
    Checksum  [32]byte    \`json:"checksum"\`
}`,
    footnote: "Deterministic Replay: 0.18ms • Sync Drift: 0.000%",
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-350);
    mouseY.set(-350);
  };

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Recently Published";

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/45 bg-[var(--bg-elevated)]/95 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
    >
      {/* Top Specular Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/80 to-transparent z-20"
      />

      {/* Interactive Cursor Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-9 items-center">
        {/* Left Column: Editorial Details */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            {/* Eyebrow Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold tracking-wider uppercase bg-[var(--brand-primary)] text-[var(--brand-contrast)] shadow-2xs">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Featured Analysis</span>
              </span>

              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold tracking-wide text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/25 uppercase">
                {article.category.replace("-", " ")}
              </span>

              {article.rfcCode && (
                <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  {article.rfcCode}
                </span>
              )}

              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
                <span>{article.readingMinutes} min read</span>
              </div>
            </div>

            {/* Display Headline */}
            <Link href={`/blog/${article.slug}`} className="block group/title">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-[32px] tracking-tight text-[var(--text-primary)] group-hover/title:text-[var(--brand-primary)] transition-colors mb-3 leading-[1.2]">
                {article.title}
              </h2>
            </Link>

            <p className="text-xs sm:text-sm md:text-[15px] text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-3">
              {article.excerpt}
            </p>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author & CTA Footer */}
          <div className="pt-5 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs">
                {article.authorInitials || "DC"}
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                  {article.authorName}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="truncate max-w-[190px] sm:max-w-none">
                    {article.authorRole}
                  </span>
                  <span className="text-[var(--text-muted)]">&bull;</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10.5px]">
                    <Calendar className="w-3 h-3 text-[var(--brand-primary)] shrink-0" />
                    <span>{formattedDate}</span>
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/blog/${article.slug}`}
              className="btn-liquid-hover inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] font-semibold text-xs shadow-2xs hover:bg-[var(--brand-hover)] transition-all whitespace-nowrap self-start sm:self-auto"
            >
              <span>Read Full Deep Dive</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Right Column: High-Contrast Dark Terminal Code Window (Explicit Inline Colors for Light & Dark Mode) */}
        <div className="lg:col-span-5 min-w-0">
          <div
            style={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              color: "#f8fafc",
            }}
            className="rounded-2xl border overflow-hidden shadow-xl"
          >
            {/* Window Header */}
            <div
              style={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
              }}
              className="flex items-center justify-between px-4 py-2.5 border-b"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5 mr-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <FileCode2
                  style={{ color: "#38bdf8" }}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span
                  style={{ color: "#cbd5e1" }}
                  className="text-[11px] font-mono font-semibold truncate"
                >
                  {snippet.filename}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                style={{
                  backgroundColor: "#0f172a",
                  borderColor: "#475569",
                  color: "#e2e8f0",
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
                title="Copy snippet"
              >
                {copied ? (
                  <>
                    <Check
                      style={{ color: "#34d399" }}
                      className="w-3 h-3"
                    />
                    <span
                      style={{ color: "#34d399" }}
                      className="font-semibold"
                    >
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Viewport */}
            <div className="p-4 sm:p-5 overflow-x-auto text-[11.5px] sm:text-xs font-mono leading-relaxed">
              <pre style={{ color: "#f1f5f9", margin: 0 }}>
                <code style={{ color: "#f1f5f9" }}>{snippet.code}</code>
              </pre>
            </div>

            {/* Terminal Telemetry Footer */}
            <div
              style={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                color: "#94a3b8",
              }}
              className="px-4 py-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono"
            >
              <span className="inline-flex items-center gap-1.5">
                <Code2 style={{ color: "#38bdf8" }} className="w-3 h-3" />
                <span>lang: {snippet.language}</span>
              </span>
              <span
                style={{ color: "#34d399" }}
                className="inline-flex items-center gap-1.5 font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{snippet.footnote || "verified deterministic"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}