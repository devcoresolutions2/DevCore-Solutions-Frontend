"use client";

import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { BlogArticleItem } from "@/lib/api";

interface BlogCardGridProps {
  articles: BlogArticleItem[];
}

export function BlogCardGrid({ articles }: BlogCardGridProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-12 text-center bg-[var(--bg-surface)]">
        <div className="font-mono text-sm text-[var(--text-secondary)] mb-2">
          NO DISPATCHES MATCHED CRITERIA
        </div>
        <p className="text-xs text-[var(--text-tertiary)] max-w-sm mx-auto">
          Try clearing your search query or selecting another technical category from above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {articles.map((article) => {
        const formattedDate = article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Draft";

        return (
          <article
            key={article.id}
            className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-200 hover:border-[var(--brand-primary)]/40 hover:shadow-sm group"
          >
            <div>
              {/* Card Meta */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20">
                  {article.category.replace("-", " ")}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-tertiary)]">
                  <Clock className="w-3 h-3" />
                  <span>{article.readingMinutes} min</span>
                </div>
              </div>

              {/* Title */}
              <Link href={`/blog/${article.slug}`}>
                <h3 className="text-lg font-bold font-mono tracking-tight text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors mb-2.5 leading-snug">
                  {article.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author & Footer Link */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center justify-center font-mono font-bold text-xs">
                  {article.authorInitials || "DC"}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-[var(--text-primary)] font-mono line-clamp-1">
                    {article.authorName}
                  </div>
                  <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {formattedDate}
                  </div>
                </div>
              </div>

              <Link
                href={`/blog/${article.slug}`}
                className="text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors p-1"
                aria-label={`Read ${article.title}`}
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
