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

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [heroConfig, categories, articles, featuredArticle] = await Promise.all([
    getBlogHeroConfig(),
    getBlogCategories(),
    getBlogArticles({ status: "PUBLISHED" }),
    getFeaturedArticle(),
  ]);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Editorial Hero (Matches /careers 1:1) */}
      <BlogHero config={heroConfig} />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-10 sm:pb-12">
        {/* Client Interactive View (Search, Category Filters, Sorting, Featured & Grid) */}
        <BlogClientView
          initialArticles={articles}
          categories={categories}
          featuredArticle={featuredArticle}
        />

        {/* Balanced Gap Separating Article Cards from Newsletter Card */}
        <div className="mt-8 sm:mt-10">
          <NewsletterSection />
        </div>
      </div>

      {/* Floating Technical Support Hub */}
      <TechnicalSupportHub />
    </main>
  );
}