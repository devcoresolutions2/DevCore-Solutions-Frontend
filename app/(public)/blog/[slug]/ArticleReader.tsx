"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
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
  CheckCircle2,
  FileCode2,
  Terminal,
} from "lucide-react";
import type { BlogArticleItem } from "@/lib/api";

interface ArticleReaderProps {
  article: BlogArticleItem;
  prevArticle: BlogArticleItem | null;
  nextArticle: BlogArticleItem | null;
}

export function ArticleReader({
  article,
  prevArticle,
  nextArticle,
}: ArticleReaderProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  const safeContent = article.content || "";
  const safeTags = article.tags || [];
  const safeCategory = (article.category || "systems").replace("-", " ");
  const safeAuthorName = article.authorName || "DevCore Engineering";
  const safeAuthorRole = article.authorRole || "Systems Architect";
  const safeAuthorInitials =
    article.authorInitials ||
    safeAuthorName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "DC";

  // Extract sections/headings from markdown-like content
  const sections = useMemo(
    () =>
      safeContent
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
        }),
    [safeContent]
  );

  // Track active heading in viewport for sticky TOC highlight
  useEffect(() => {
    if (sections.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      let currentId = sections[0]?.id || "";

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentId = sec.id;
        }
      }
      setActiveSection(currentId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

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

  const authorLower = safeAuthorName.toLowerCase();
  const isFourkan = authorLower.includes("fourkan");
  const isSamin =
    authorLower.includes("kazi") || authorLower.includes("samin");

  const authorGithub = isFourkan
    ? "https://github.com/Pinon1345"
    : isSamin
      ? "https://github.com/kazi-Samin"
      : "https://github.com/devcoresolutions2";

  const authorLinkedin = isFourkan
    ? "https://www.linkedin.com/in/fourkan-bin-ilias/"
    : isSamin
      ? "https://www.linkedin.com/in/kazi-mahedi-hasan"
      : "https://www.linkedin.com/company/devcoresolutions2";

  // Render inline bold (**text**) and inline code (`code`) cleanly
  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-[var(--text-primary)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[0.88em] text-[var(--brand-primary)]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Render markdown-like sections cleanly with custom styled code blocks, dividers, lists, and headings
  const renderFormattedContent = () => {
    const rawBlocks = safeContent.split("\n\n");
    let codeIndex = 0;

    return rawBlocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Horizontal Divider
      if (trimmed === "---") {
        return (
          <div
            key={idx}
            aria-hidden="true"
            className="my-8 h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent"
          />
        );
      }

      // Heading 2
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace("## ", "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return (
          <h2
            key={idx}
            id={id}
            className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mt-10 mb-4 scroll-mt-28 border-b border-[var(--border-subtle)] pb-2.5"
          >
            {text}
          </h2>
        );
      }

      // Heading 3
      if (trimmed.startsWith("### ")) {
        const text = trimmed.replace("### ", "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return (
          <h3
            key={idx}
            id={id}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] mt-7 mb-2.5 scroll-mt-28"
          >
            {text}
          </h3>
        );
      }

      // Code Block (Explicit inline colors so syntax is always legible in Light & Dark Mode)
      if (trimmed.startsWith("```")) {
        const currentCodeIdx = codeIndex++;
        const lines = trimmed.split("\n");
        const firstLine = lines[0].replace("```", "").trim();
        const codeContent = lines.slice(1, -1).join("\n");

        return (
          <div
            key={idx}
            style={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              color: "#f8fafc",
            }}
            className="my-6 rounded-2xl border overflow-hidden shadow-lg"
          >
            <div
              style={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
              }}
              className="flex items-center justify-between px-4 py-2.5 border-b"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <FileCode2
                  style={{ color: "#38bdf8" }}
                  className="w-3.5 h-3.5"
                />
                <span
                  style={{ color: "#cbd5e1" }}
                  className="text-[11px] font-mono font-semibold"
                >
                  {firstLine ? `lang: ${firstLine}` : "snippet"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(codeContent, currentCodeIdx)}
                style={{
                  backgroundColor: "#0f172a",
                  borderColor: "#475569",
                  color: "#e2e8f0",
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border hover:opacity-90 transition-opacity cursor-pointer"
              >
                {copiedSnippetIdx === currentCodeIdx ? (
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
            <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-[13px] font-mono leading-relaxed">
              <pre style={{ color: "#f1f5f9", margin: 0 }}>
                <code style={{ color: "#f1f5f9" }}>{codeContent}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s+/, ""));
        return (
          <ol key={idx} className="my-5 space-y-2.5 list-none pl-0">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
              >
                <span className="w-6 h-6 rounded-lg bg-[var(--brand-primary)]/12 border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{renderInlineFormatting(item)}</span>
              </li>
            ))}
          </ol>
        );
      }

      // Unordered list / bullet checklist
      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^-\s+/, ""));
        return (
          <ul key={idx} className="my-5 space-y-2.5 list-none pl-0">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0 mt-2.5" />
                <span>{renderInlineFormatting(item)}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Standard Paragraph
      return (
        <p
          key={idx}
          className="text-sm sm:text-base md:text-[17px] text-[var(--text-secondary)] leading-relaxed my-4"
        >
          {renderInlineFormatting(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="relative">
      {/* Top Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--brand-primary)] origin-left z-50"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10">
        {/* Top Breadcrumb Pill */}
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)]/55 border border-[var(--border-subtle)] backdrop-blur-md text-[11px] font-mono text-[var(--text-secondary)] mb-7 flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-[var(--brand-primary)] font-semibold transition-colors"
          >
            DEVCORE
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <Link
            href="/blog"
            className="hover:text-[var(--brand-primary)] font-semibold transition-colors"
          >
            ENGINEERING BLOG
          </Link>
          <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          <span className="uppercase font-bold text-[var(--brand-primary)]">
            {safeCategory}
          </span>
        </nav>

        {/* Glassmorphic Article Hero Banner */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl p-6 sm:p-9 lg:p-11 shadow-md mb-10 sm:mb-12"
        >
          {/* Top Specular Edge Highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/75 to-transparent"
          />

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30">
                <Terminal className="w-3 h-3 shrink-0" />
                <span>{safeCategory}</span>
              </span>

              {article.rfcCode && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  {article.rfcCode}
                </span>
              )}

              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>
                  {article.readTime || `${article.readingMinutes || 5} min read`}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
                <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15] mb-5">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--brand-primary)] pl-4">
                {article.excerpt}
              </p>
            )}
          </div>
        </motion.header>

        {/* Main Grid: Article Body + Sticky Sidebar (TOC & Author) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Content Column */}
          <article className="lg:col-span-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 backdrop-blur-xl p-6 sm:p-9 lg:p-10 shadow-sm">
            {renderFormattedContent()}

            {/* Tags */}
            {safeTags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[var(--text-muted)] mr-1">
                  Tags:
                </span>
                {safeTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Prev / Next Article Navigation */}
            <div className="mt-10 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 hover:border-[var(--brand-primary)]/50 transition-all group"
                >
                  <div className="text-[11px] font-mono font-semibold text-[var(--text-muted)] flex items-center gap-1.5 mb-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 text-[var(--brand-primary)] transition-transform group-hover:-translate-x-1" />
                    <span>Previous Dispatch</span>
                  </div>
                  <div className="font-display text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] line-clamp-2 transition-colors">
                    {prevArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 hover:border-[var(--brand-primary)]/50 transition-all group sm:text-right"
                >
                  <div className="text-[11px] font-mono font-semibold text-[var(--text-muted)] flex items-center justify-start sm:justify-end gap-1.5 mb-1.5">
                    <span>Next Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--brand-primary)] transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="font-display text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] line-clamp-2 transition-colors">
                    {nextArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </article>

          {/* Sticky Sidebar: Author, TOC & Share */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-5">
              {/* Author Card */}
              <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-sm">
                <div className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-3.5">
                  Authored By
                </div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                    {safeAuthorInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {safeAuthorName}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">
                      {safeAuthorRole}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono font-semibold text-[var(--text-secondary)] pt-3 border-t border-[var(--border-subtle)]">
                  <a
                    href={authorGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--brand-primary)] transition-colors"
                  >
                    GitHub &nearr;
                  </a>
                  <a
                    href={authorLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--brand-primary)] transition-colors"
                  >
                    LinkedIn &nearr;
                  </a>
                </div>
              </div>

              {/* Table of Contents */}
              {sections.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl shadow-sm">
                  <div className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-3 flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>On This Page</span>
                  </div>
                  <nav className="space-y-1 text-xs sm:text-[13px]">
                    {sections.map((sec) => {
                      const isActive = activeSection === sec.id;
                      return (
                        <a
                          key={sec.id}
                          href={`#${sec.id}`}
                          className={`block py-1.5 px-2.5 rounded-lg transition-colors ${sec.level === 3 ? "pl-5" : "font-semibold"
                            } ${isActive
                              ? "bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] font-bold"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                            }`}
                        >
                          {sec.title}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Share Action */}
              <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 backdrop-blur-xl flex items-center justify-between shadow-sm">
                <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Share Dispatch</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors px-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to all engineering dispatches</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}