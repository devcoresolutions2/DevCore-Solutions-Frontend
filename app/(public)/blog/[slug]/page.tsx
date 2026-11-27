import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getBlogArticles } from "@/lib/api";
import { ArticleReader } from "./ArticleReader";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { TechnicalSupportHub } from "@/components/blog/TechnicalSupportHub";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found — DevCore Solutions",
      description: "The requested technical dispatch could not be found.",
    };
  }

  return {
    title: article.seoTitle || `${article.title} — DevCore Engineering`,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.authorName ? [article.authorName] : ["DevCore Engineering"],
      tags: article.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getBlogArticles({ status: "PUBLISHED" });
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex !== -1 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="relative z-10">
        <ArticleReader
          article={article}
          prevArticle={prevArticle}
          nextArticle={nextArticle}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 pb-8 sm:pb-12">
          <NewsletterSection />
        </div>
      </div>

      <TechnicalSupportHub />
    </main>
  );
}