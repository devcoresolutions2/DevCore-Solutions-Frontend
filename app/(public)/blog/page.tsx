import type { Metadata } from "next";
import {
  getBlogHeroConfig,
  getBlogCategories,
  getBlogArticles,
  getFeaturedArticle,
} from "@/lib/api";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogClientView } from "@/components/blog/BlogClientView";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { TechnicalSupportHub } from "@/components/blog/TechnicalSupportHub";

export const metadata: Metadata = {
  title: "Engineering Blog & Technical Insights — DevCore Solutions",
  description:
    "Deep technical explorations into distributed state, SQLite WAL replication, Linux eBPF telemetry, and deterministic systems architecture from DevCore engineers.",
  openGraph: {
    title: "Engineering Blog & Technical Insights — DevCore Solutions",
    description:
      "Deep technical explorations into distributed state, SQLite WAL replication, Linux eBPF telemetry, and deterministic systems architecture.",
    type: "website",
  },
};

// Revalidate every 60s
export const revalidate = 60;

export default async function BlogPage() {
  const [heroConfig, categories, articles, featuredArticle] = await Promise.all([
    getBlogHeroConfig(),
    getBlogCategories(),
    getBlogArticles({ status: "PUBLISHED" }),
    getFeaturedArticle(),
  ]);

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Editorial Hero */}
      <BlogHero config={heroConfig} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Client Interactive View (Search, Category Filters, Sorting, Featured & Grid) */}
        <BlogClientView
          initialArticles={articles}
          categories={categories}
          featuredArticle={featuredArticle}
        />

        {/* Newsletter Subscription Box */}
        <NewsletterSection />
      </div>

      {/* Floating Technical Support Hub */}
      <TechnicalSupportHub />
    </main>
  );
}
