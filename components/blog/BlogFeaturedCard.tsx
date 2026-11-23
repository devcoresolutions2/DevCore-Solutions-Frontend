"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Clock, Calendar, ArrowRight, Code2 } from "lucide-react";
import type { BlogArticleItem } from "@/lib/api";

interface BlogFeaturedCardProps {
  article: BlogArticleItem | null;
}

export function BlogFeaturedCard({ article }: BlogFeaturedCardProps) {
  const [copied, setCopied] = useState(false);

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

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently Published";

  return (
    <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden mb-12 transition-all hover:border-[var(--brand-primary)]/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Editorial Details */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-[var(--brand-primary)] text-white">
                Featured Analysis
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                {article.category.replace("-", " ").toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readingMinutes} min read</span>
              </div>
            </div>

            <Link href={`/blog/${article.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors mb-3 leading-snug">
                {article.title}
              </h2>
            </Link>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6 font-sans line-clamp-3">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author and Action */}
          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center justify-center font-mono font-bold text-sm">
                {article.authorInitials || "DC"}
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)] font-mono">
                  {article.authorName}
                </div>
                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                  <span>{article.authorRole}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-2 text-sm font-mono font-medium text-[var(--brand-primary)] hover:underline group"
            >
              <span>Read Full Deep Dive</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Technical Code Snippet Preview */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[#0d1117] text-[#c9d1d9] overflow-hidden shadow-md">
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#58a6ff]" />
                <span className="text-xs font-mono text-[#8b949e]">{snippet.filename}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                title="Copy snippet"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code content */}
            <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed">
              <pre className="text-[#e6edf3]">
                <code>{snippet.code}</code>
              </pre>
            </div>

            {/* Terminal footer status */}
            <div className="px-4 py-2 bg-[#161b22]/60 border-t border-[#30363d] flex items-center justify-between text-[11px] font-mono text-[#8b949e]">
              <span>lang: {snippet.language}</span>
              <span className="text-emerald-400">● verified deterministic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
