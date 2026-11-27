"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogArticleItem, BlogCategoryItem } from "@/lib/api";
import { BlogFeaturedCard } from "./BlogFeaturedCard";
import { BlogFilterBar } from "./BlogFilterBar";
import { BlogCardGrid } from "./BlogCardGrid";

interface BlogClientViewProps {
  initialArticles: BlogArticleItem[];
  categories: BlogCategoryItem[];
  featuredArticle: BlogArticleItem | null;
}

export function BlogClientView({
  initialArticles,
  categories,
  featuredArticle,
}: BlogClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "readingTime"
  >("newest");

  const isDefaultView =
    !searchQuery.trim() && selectedCategory.toLowerCase() === "all";

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    const result = [...initialArticles];

    // Category filter
    const filteredByCategory =
      selectedCategory && selectedCategory.toLowerCase() !== "all"
        ? result.filter((a) => {
          const cat = selectedCategory.toLowerCase();
          return (
            a.category.toLowerCase() === cat ||
            a.categorySlug?.toLowerCase() === cat
          );
        })
        : result;

    // Search query filter
    const q = searchQuery.toLowerCase().trim();
    const filteredByQuery = q
      ? filteredByCategory.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          a.authorName.toLowerCase().includes(q)
      )
      : filteredByCategory;

    // Sort
    if (sortOrder === "oldest") {
      return [...filteredByQuery].sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime()
      );
    }

    if (sortOrder === "readingTime") {
      return [...filteredByQuery].sort(
        (a, b) => a.readingMinutes - b.readingMinutes
      );
    }

    // Newest
    return [...filteredByQuery].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [initialArticles, selectedCategory, searchQuery, sortOrder]);

  return (
    <div className="relative flex flex-col gap-8 sm:gap-10">
      {/* Featured Card (Only show on default state when no search/category filter is active) */}
      <AnimatePresence initial={false}>
        {isDefaultView && featuredArticle && (
          <motion.div
            key="featured-article-wrapper"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <BlogFeaturedCard article={featuredArticle} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar */}
      <BlogFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        totalFiltered={filteredArticles.length}
      />

      {/* Responsive Articles Grid */}
      <BlogCardGrid articles={filteredArticles} />
    </div>
  );
}