import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, BookOpen, Clock, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { ReleasePill } from "@/components/glass/ReleasePill";

export const metadata: Metadata = {
  title: "Engineering Blog & Technical Insights — DevCore Solutions",
  description: "Architectural whitepapers, benchmark reports, and deep engineering explorations written by DevCore engineers.",
};

const ARTICLES = [
  {
    slug: "offline-first-sqlite-wal-pos",
    title: "Offline-First Data Replication with Embedded SQLite WAL at Restaurant Scale",
    summary: "How we eliminated Friday evening dining slowdowns across 800+ venues using deterministic Lamport clocks and background SQLite WAL synchronizers.",
    category: "Architecture",
    readTime: "7 min read",
    date: "Oct 2024",
  },
  {
    slug: "ebpf-socket-redirection-latency",
    title: "Achieving Sub-Millisecond P99 Edge Latency with Linux eBPF Socket Filters",
    summary: "Bypassing kernel network buffer copies to accelerate high-frequency distributed consensus messaging on standard commodity hardware.",
    category: "Cloud Infrastructure",
    readTime: "11 min read",
    date: "Sep 2024",
  },
  {
    slug: "rag-guardrails-enterprise-docs",
    title: "Zero-Hallucination Retrieval Augmented Generation on Enterprise Contracts",
    summary: "Implementing strict deterministic tool-calling schemas and vector distance thresholds for high-stakes regulatory document review.",
    category: "AI & Automation",
    readTime: "9 min read",
    date: "Aug 2024",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">Technical Blog</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-12">
        <ReleasePill className="mb-3">
          <BookOpen size={13} className="text-[var(--brand-primary)]" />
          &nbsp;ENGINEERING DISPATCHES
        </ReleasePill>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight">
          System Design Records & Architecture Whitepapers
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
          Practical engineering explorations, distributed consensus post-mortems, and performance benchmarks from production codebases.
        </p>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {ARTICLES.map((article) => (
          <GlassCard key={article.slug} className="p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-4">
                <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--border-subtle)]">
                  {article.category}
                </span>
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <Clock size={12} /> {article.readTime}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-[var(--text-primary)] leading-snug mb-3">
                {article.title}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {article.summary}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="font-mono text-[var(--text-muted)]">{article.date}</span>
              <span className="font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] flex items-center gap-1">
                Read Paper <ArrowRight size={12} />
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
