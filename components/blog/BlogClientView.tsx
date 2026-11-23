"use client";

import { useState, useMemo } from "react";
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
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "readingTime">("newest");

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let result = [...initialArticles];

    // Category filter
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
      const cat = selectedCategory.toLowerCase();
      result = result.filter(
        (a) => a.category.toLowerCase() === cat || a.categorySlug?.toLowerCase() === cat
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          a.authorName.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOrder === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime()
      );
    } else if (sortOrder === "readingTime") {
      result.sort((a, b) => a.readingMinutes - b.readingMinutes);
    } else {
      // Newest
      result.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );
    }

    return result;
  }, [initialArticles, selectedCategory, searchQuery, sortOrder]);

  return (
    <div>
      {/* Featured Card (Only show on default state when no search filter active) */}
      {!searchQuery && selectedCategory === "all" && (
        <BlogFeaturedCard article={featuredArticle} />
      )}

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
