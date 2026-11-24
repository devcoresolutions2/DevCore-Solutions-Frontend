"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Calendar,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Eye,
  CheckCircle2,
} from "lucide-react";
import type { BlogArticleItem } from "@/lib/api";

interface ArticleReaderProps {
  article: BlogArticleItem;
  prevArticle: BlogArticleItem | null;
  nextArticle: BlogArticleItem | null;
}

export function ArticleReader({ article, prevArticle, nextArticle }: ArticleReaderProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  // Extract sections/headings from markdown-like content
  const sections = article.content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const title = line.replace(/^#{2,3}\s+/, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { level, title, id };
    });

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const handleCopyCode = async (codeText: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedSnippetIdx(idx);
      setTimeout(() => setCopiedSnippetIdx(null), 2000);
    } catch {
      // ignore
    }
  };

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Draft";

  // Render markdown-like sections cleanly with custom styled code blocks and headings
  const renderFormattedContent = () => {
    const rawBlocks = article.content.split("\n\n");
    let codeIndex = 0;

    return rawBlocks.map((block, idx) => {
      // Heading 2
      if (block.startsWith("## ")) {
        const text = block.replace("## ", "");
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return (
          <h2
            key={idx}
            id={id}
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-12 mb-4 scroll-mt-24 border-b border-[var(--border-subtle)] pb-2.5"
          >
            {text}
          </h2>
        );
      }

      // Heading 3
      if (block.startsWith("### ")) {
        const text = block.replace("### ", "");
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return (
          <h3
            key={idx}
            id={id}
            className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)] mt-8 mb-3 scroll-mt-24"
          >
            {text}
          </h3>
        );
      }

      // Code Block
      if (block.startsWith("```")) {
        const currentCodeIdx = codeIndex++;
        const lines = block.split("\n");
        const firstLine = lines[0].replace("```", "").trim();
        const codeContent = lines.slice(1, -1).join("\n");

        return (
          <div
            key={idx}
            className="my-6 rounded-xl border border-[var(--border-subtle)] bg-[#0d1117] text-[#c9d1d9] overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <span className="text-xs font-mono text-[#8b949e]">
                {firstLine ? `language: ${firstLine}` : "code"}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeContent, currentCodeIdx)}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              >
                {copiedSnippetIdx === currentCodeIdx ? (
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
            <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
              <pre className="text-[#e6edf3]">
                <code>{codeContent}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Unordered list / bullet checklist
      if (block.startsWith("- ")) {
        const items = block.split("\n").map((line) => line.replace(/^- \s*/, ""));
        return (
          <ul key={idx} className="my-4 space-y-2 list-none pl-0">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-[var(--text-secondary)]">
                <span className="text-[var(--brand-primary)] font-mono text-sm mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p
          key={idx}
          className="text-base sm:text-lg text-[var(--text-secondary)] font-sans leading-relaxed my-4"
        >
          {block}
        </p>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] mb-8 flex-wrap">
        <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">
          Engineering Blog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <span className="capitalize text-[var(--brand-primary)]">
          {article.category.replace("-", " ")}
        </span>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
            {article.category.replace("-", " ")}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span>{article.readTime || `${article.readingMinutes} min read`}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15] mb-6">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-[var(--text-secondary)] font-sans leading-relaxed border-l-2 border-[var(--brand-primary)] pl-4">
          {article.excerpt}
        </p>
      </header>

      {/* Main Grid: Article Body + Sticky Sidebar (TOC & Author) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Content Column */}
        <article className="lg:col-span-8 prose-invert max-w-none">
          {renderFormattedContent()}

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--text-tertiary)] mr-1">Tags:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Prev / Next Article Navigation */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link
                href={`/blog/${prevArticle.slug}`}
                className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-all group"
              >
                <div className="text-xs font-medium text-[var(--text-tertiary)] flex items-center gap-1 mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Previous Article</span>
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] line-clamp-2">
                  {prevArticle.title}
                </div>
              </Link>
            ) : <div />}

            {nextArticle ? (
              <Link
                href={`/blog/${nextArticle.slug}`}
                className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--brand-primary)] transition-all group sm:text-right"
              >
                <div className="text-xs font-medium text-[var(--text-tertiary)] flex items-center justify-end gap-1 mb-1">
                  <span>Next Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] line-clamp-2">
                  {nextArticle.title}
                </div>
              </Link>
            ) : <div />}
          </div>
        </article>

        {/* Sticky Sidebar: TOC, Author & Share */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-5">
            {/* Author Card */}
            <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                Written By
              </div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center justify-center font-semibold text-sm shrink-0">
                  {article.authorInitials || "DC"}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {article.authorName}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] truncate">
                    {article.authorRole}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)] pt-3 border-t border-[var(--border-subtle)]">
                <a
                  href="https://github.com/devcoresolutions2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/company/devcoresolutions2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Table of Contents */}
            {sections.length > 0 && (
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-xs">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3 flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>On This Page</span>
                </div>
                <nav className="space-y-1.5 text-[13px]">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`block py-1 transition-colors hover:text-[var(--brand-primary)] ${
                        sec.level === 3 ? "pl-3 text-[var(--text-tertiary)]" : "font-medium text-[var(--text-secondary)]"
                      }`}
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Share and Action */}
            <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </span>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>

            {/* Back to Blog */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all engineering articles</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
