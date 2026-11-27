"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  ArrowUpRight,
  FileSearch,
  Terminal,
} from "lucide-react";
import type { BlogArticleItem } from "@/lib/api";

interface BlogCardGridProps {
  articles: BlogArticleItem[];
}

export function BlogCardGrid({ articles }: BlogCardGridProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--border-subtle)] p-10 sm:p-14 text-center bg-[var(--bg-elevated)]/80 backdrop-blur-xl flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shadow-2xs">
          <FileSearch className="w-5 h-5" />
        </div>
        <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
          No Dispatches Matched Criteria
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Try clearing your search query or selecting another technical domain
          from the filter bar above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
      {articles.map((article, idx) => {
        const formattedDate = article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "Draft";

        return (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 0.45,
              delay: Math.min(idx * 0.05, 0.25),
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/50 bg-[var(--bg-elevated)]/95 backdrop-blur-xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Top Specular Edge Highlight on Hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            <div>
              {/* Card Metadata Row */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/25 truncate">
                  <Terminal className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {article.category.replace("-", " ")}
                  </span>
                </span>

                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                  <Clock className="w-3 h-3 text-[var(--brand-primary)] shrink-0" />
                  <span>{article.readingMinutes} min</span>
                </div>
              </div>

              {/* Optional RFC Code Subtitle */}
              {article.rfcCode && (
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
                  {article.rfcCode}
                </div>
              )}

              {/* Article Headline */}
              <Link href={`/blog/${article.slug}`} className="block">
                <h3 className="font-display font-bold text-lg sm:text-[19px] tracking-tight text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors mb-2.5 leading-[1.3] line-clamp-2">
                  {article.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-xs sm:text-[13.5px] text-[var(--text-secondary)] leading-relaxed mb-5 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10.5px] font-mono font-medium px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author & Read Action Footer */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/12 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {article.authorInitials || "DC"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {article.authorName}
                  </div>
                  <div className="text-[10.5px] font-mono text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <Calendar className="w-2.5 h-2.5 text-[var(--brand-primary)] shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/blog/${article.slug}`}
                className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] group-hover:bg-[var(--brand-primary)] text-[var(--text-secondary)] group-hover:text-[var(--brand-contrast)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)] flex items-center justify-center transition-all shrink-0"
                aria-label={`Read ${article.title}`}
              >
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}