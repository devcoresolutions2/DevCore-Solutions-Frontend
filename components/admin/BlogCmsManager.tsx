"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
  Star,
  Users,
  FolderTree,
  Mail,
  Sliders,
  Search,
  ExternalLink,
  RefreshCw,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  type BlogArticleItem,
  type BlogCategoryItem,
  type BlogAuthorItem,
  type NewsletterSubscriberItem,
  type BlogHeroConfig,
  getBlogArticles,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogAuthors,
  createBlogAuthor,
  updateBlogAuthor,
  deleteBlogAuthor,
  getNewsletterSubscribers,
  updateNewsletterSubscriberStatus,
  deleteNewsletterSubscriber,
  getBlogHeroConfig,
  updateBlogHeroConfig,
  getBlogStats,
} from "@/lib/api";

type BlogSubTab = "articles" | "categories" | "authors" | "subscribers" | "hero";

export function BlogCmsManager() {
  const [activeTab, setActiveTab] = useState<BlogSubTab>("articles");
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalSubscribers: 0,
    totalReads: 0,
  });

  // Data states
  const [articles, setArticles] = useState<BlogArticleItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [authors, setAuthors] = useState<BlogAuthorItem[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberItem[]>([]);
  const [heroConfig, setHeroConfig] = useState<BlogHeroConfig>({
    badge: "ENGINEERING DISPATCH",
    title: "",
    description: "",
    breadcrumbLabel: "Architectural Dispatches",
    showCustomMetrics: false,
  });

  // Article Modal State
  const [editingArticle, setEditingArticle] = useState<Partial<BlogArticleItem> | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleSearch, setArticleSearch] = useState("");

  // Category Modal State
  const [editingCategory, setEditingCategory] = useState<Partial<BlogCategoryItem> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Author Modal State
  const [editingAuthor, setEditingAuthor] = useState<Partial<BlogAuthorItem> | null>(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  // Subscriber search
  const [subscriberSearch, setSubscriberSearch] = useState("");

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [artData, catData, authData, subData, heroData, statData] = await Promise.all([
        getBlogArticles({ status: "ALL" }),
        getBlogCategories(),
        getBlogAuthors(),
        getNewsletterSubscribers(),
        getBlogHeroConfig(),
        getBlogStats(),
      ]);
      setArticles(artData);
      setCategories(catData);
      setAuthors(authData);
      setSubscribers(subData);
      setHeroConfig(heroData);
      setStats(statData);
    } catch {
      toast.error("Failed to load blog CMS data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── ARTICLE ACTIONS ────────────────────────────────────────────────────────
  const handleOpenArticleModal = (article?: BlogArticleItem) => {
    if (article) {
      setEditingArticle({ ...article });
    } else {
      const defaultAuthor = authors[0] || {
        id: "auth-1",
        name: "DevCore Engineer",
        role: "Systems Engineer",
        bio: "",
        initials: "DC",
      };
      setEditingArticle({
        title: "",
        slug: "",
        excerpt: "",
        content: `## Section Header\n\nDetailed technical analysis goes here.\n\n\`\`\`go\n// Code snippet\nfunc Execute() error {\n    return nil\n}\n\`\`\``,
        category: categories[1]?.name || "Distributed Systems",
        categorySlug: categories[1]?.slug || "distributed-systems",
        tags: ["Distributed Systems", "Go"],
        authorId: defaultAuthor.id,
        authorName: defaultAuthor.name,
        authorRole: defaultAuthor.role,
        authorInitials: defaultAuthor.initials,
        readingMinutes: 5,
        readTime: "5 min read",
        status: "DRAFT",
        isFeatured: false,
        publishedAt: new Date().toISOString(),
        seoTitle: "",
        seoDescription: "",
      });
    }
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const autoSlug =
        editingArticle.slug ||
        editingArticle.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const readingMins = Number(editingArticle.readingMinutes) || 5;
      const payload: any = {
        ...editingArticle,
        slug: autoSlug,
        readingMinutes: readingMins,
        readTime: editingArticle.readTime || `${readingMins} min read`,
        categorySlug: editingArticle.categorySlug || "distributed-systems",
        publishedAt: editingArticle.publishedAt || new Date().toISOString(),
        isFeatured: !!editingArticle.isFeatured,
      };

      if (editingArticle.id) {
        await updateBlogArticle(editingArticle.id, payload);
        toast.success("Article updated successfully");
      } else {
        await createBlogArticle(payload);
        toast.success("Article created successfully");
      }
      setIsArticleModalOpen(false);
      setEditingArticle(null);
      await loadData();
    } catch {
      toast.error("Failed to save article");
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteBlogArticle(id);
      toast.success("Article deleted");
      await loadData();
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const handleTogglePublish = async (article: BlogArticleItem) => {
    const nextStatus = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await updateBlogArticle(article.id, { status: nextStatus });
      toast.success(nextStatus === "PUBLISHED" ? "Article published" : "Article unpublished");
      await loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (article: BlogArticleItem) => {
    try {
      await updateBlogArticle(article.id, { isFeatured: !article.isFeatured });
      toast.success(article.isFeatured ? "Featured status removed" : "Marked as featured article");
      await loadData();
    } catch {
      toast.error("Failed to update featured flag");
    }
  };

  // ─── CATEGORY ACTIONS ───────────────────────────────────────────────────────
  const handleOpenCategoryModal = (cat?: BlogCategoryItem) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      setEditingCategory({ slug: "", name: "", description: "" });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    try {
      const slug =
        editingCategory.slug ||
        editingCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      if (editingCategory.id) {
        await updateBlogCategory(editingCategory.id, { ...editingCategory, slug, isActive: true });
        toast.success("Category updated");
      } else {
        await createBlogCategory({
          name: editingCategory.name,
          slug,
          description: editingCategory.description || "",
          isActive: true,
        });
        toast.success("Category created");
      }
      setIsCategoryModalOpen(false);
      await loadData();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteBlogCategory(id);
      toast.success("Category deleted");
      await loadData();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // ─── AUTHOR ACTIONS ────────────────────────────────────────────────────────
  const handleOpenAuthorModal = (auth?: BlogAuthorItem) => {
    if (auth) {
      setEditingAuthor({ ...auth });
    } else {
      setEditingAuthor({
        name: "",
        role: "Systems Engineer",
        bio: "",
        initials: "DC",
        githubUrl: "",
        linkedinUrl: "",
        isActive: true,
      });
    }
    setIsAuthorModalOpen(true);
  };

  const handleSaveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor?.name) return;
    try {
      const initials =
        editingAuthor.initials ||
        editingAuthor.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 3)
          .toUpperCase();

      if (editingAuthor.id) {
        await updateBlogAuthor(editingAuthor.id, { ...editingAuthor, initials });
        toast.success("Author profile updated");
      } else {
        await createBlogAuthor({
          name: editingAuthor.name,
          role: editingAuthor.role || "Systems Engineer",
          bio: editingAuthor.bio || "",
          initials,
          githubUrl: editingAuthor.githubUrl || "",
          linkedinUrl: editingAuthor.linkedinUrl || "",
          isActive: editingAuthor.isActive !== undefined ? editingAuthor.isActive : true,
        });
        toast.success("Author profile created");
      }
      setIsAuthorModalOpen(false);
      await loadData();
    } catch {
      toast.error("Failed to save author");
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!window.confirm("Delete this author?")) return;
    try {
      await deleteBlogAuthor(id);
      toast.success("Author deleted");
      await loadData();
    } catch {
      toast.error("Failed to delete author");
    }
  };

  // ─── SUBSCRIBER ACTIONS ─────────────────────────────────────────────────────
  const handleToggleSubscriber = async (sub: NewsletterSubscriberItem) => {
    const nextStatus = sub.status === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE";
    try {
      await updateNewsletterSubscriberStatus(sub.id, nextStatus);
      toast.success(`Subscriber set to ${nextStatus}`);
      await loadData();
    } catch {
      toast.error("Failed to update subscriber");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("Delete this newsletter subscriber?")) return;
    try {
      await deleteNewsletterSubscriber(id);
      toast.success("Subscriber removed");
      await loadData();
    } catch {
      toast.error("Failed to remove subscriber");
    }
  };

  // ─── HERO CONFIG ACTIONS ────────────────────────────────────────────────────
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlogHeroConfig(heroConfig);
      toast.success("Blog hero configuration updated");
    } catch {
      toast.error("Failed to update hero configuration");
    }
  };

  // Filtered articles & subscribers
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.authorName.toLowerCase().includes(articleSearch.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase">Articles</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {stats.totalArticles}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-xs font-mono text-emerald-500 uppercase">Published</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {stats.publishedArticles}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-xs font-mono text-amber-500 uppercase">Drafts</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {stats.draftArticles}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase">Categories</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {stats.totalCategories}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-xs font-mono text-[var(--brand-primary)] uppercase">Subscribers</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {stats.totalSubscribers}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase">Total Reads</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1">
            {stats.totalReads}
          </div>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("articles")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
              activeTab === "articles"
                ? "bg-[var(--brand-primary)] text-white font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Articles ({articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
              activeTab === "categories"
                ? "bg-[var(--brand-primary)] text-white font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("authors")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
              activeTab === "authors"
                ? "bg-[var(--brand-primary)] text-white font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Authors ({authors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("subscribers")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
              activeTab === "subscribers"
                ? "bg-[var(--brand-primary)] text-white font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Subscribers ({subscribers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
              activeTab === "hero"
                ? "bg-[var(--brand-primary)] text-white font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hero Header</span>
          </button>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 rounded border border-[var(--border-subtle)]"
          title="Refresh data"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          <span>Sync</span>
        </button>
      </div>

      {/* ─── TAB: ARTICLES ────────────────────────────────────────────────────── */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder="Search articles by title, tag, author..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </div>

            <button
              type="button"
              onClick={() => handleOpenArticleModal()}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Article</span>
            </button>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                <tr>
                  <th className="px-4 py-3">Article Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                      No engineering articles found.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-[var(--bg-canvas)]/50 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-[var(--text-primary)] line-clamp-1">
                          {art.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                          <span>/{art.slug}</span>
                          <span>•</span>
                          <span>{art.readingMinutes}m read</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--brand-primary)]">
                          {art.category.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-[10px] flex items-center justify-center font-bold">
                            {art.authorInitials || "DC"}
                          </span>
                          <span className="truncate max-w-[120px]">{art.authorName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(art)}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-medium uppercase transition-colors cursor-pointer",
                            art.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          )}
                          title="Click to toggle publish status"
                        >
                          {art.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(art)}
                          className={cn(
                            "p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors",
                            art.isFeatured ? "text-amber-400" : "text-[var(--text-tertiary)]"
                          )}
                          title="Toggle featured status"
                        >
                          <Star className="w-4 h-4" fill={art.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/blog/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                            title="Preview article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenArticleModal(art)}
                            className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-elevated)]"
                            title="Edit article"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art.id, art.title)}
                            className="p-1 rounded text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-[var(--bg-elevated)]"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: CATEGORIES ──────────────────────────────────────────────────── */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
              Blog Categories ({categories.length})
            </h4>
            <button
              type="button"
              onClick={() => handleOpenCategoryModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id || cat.slug}
                className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-canvas)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
                      {cat.count || 0} articles
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[var(--brand-primary)] mb-2">
                    slug: {cat.slug}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-[var(--text-secondary)] font-sans">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => handleOpenCategoryModal(cat)}
                    className="p-1 rounded text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {cat.slug !== "all" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 rounded text-xs font-mono text-[var(--text-secondary)] hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: AUTHORS ─────────────────────────────────────────────────────── */}
      {activeTab === "authors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
              Engineering Authors & Credentials ({authors.length})
            </h4>
            <button
              type="button"
              onClick={() => handleOpenAuthorModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Author</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map((auth) => (
              <div
                key={auth.id}
                className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center justify-center font-mono font-bold text-sm">
                      {auth.initials || "DC"}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-[var(--text-primary)]">
                        {auth.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">{auth.role}</div>
                    </div>
                  </div>
                  {auth.bio && (
                    <p className="text-xs text-[var(--text-secondary)] font-sans line-clamp-3 mb-3">
                      {auth.bio}
                    </p>
                  )}
                  <div className="text-[11px] font-mono text-[var(--text-tertiary)] flex gap-2">
                    {auth.githubUrl && <span>GitHub: Yes</span>}
                    {auth.linkedinUrl && <span>LinkedIn: Yes</span>}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => handleOpenAuthorModal(auth)}
                    className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAuthor(auth.id)}
                    className="p-1 rounded text-[var(--text-secondary)] hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: SUBSCRIBERS ─────────────────────────────────────────────────── */}
      {activeTab === "subscribers" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                placeholder="Search subscriber by email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div className="text-xs font-mono text-[var(--text-secondary)]">
              Total Active:{" "}
              <span className="font-bold text-[var(--brand-primary)]">
                {subscribers.filter((s) => s.status === "ACTIVE").length}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                <tr>
                  <th className="px-4 py-3">Subscriber Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Subscribed Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-tertiary)]">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[var(--bg-canvas)]/50">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                        {sub.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-semibold uppercase",
                            sub.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                          )}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{(sub as any).source || "WEB"}</td>
                      <td className="px-4 py-3 text-[var(--text-tertiary)]">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSubscriber(sub)}
                            className="text-[10px] text-[var(--brand-primary)] hover:underline"
                          >
                            {sub.status === "ACTIVE" ? "Unsubscribe" : "Reactivate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubscriber(sub.id)}
                            className="p-1 text-[var(--text-tertiary)] hover:text-rose-500"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: HERO SETTINGS ───────────────────────────────────────────────── */}
      {activeTab === "hero" && (
        <form
          onSubmit={handleSaveHero}
          className="max-w-2xl p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4"
        >
          <h4 className="text-sm font-mono font-semibold text-[var(--text-primary)]">
            Configure Public Blog Hero Header
          </h4>

          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={heroConfig.badge}
              onChange={(e) => setHeroConfig({ ...heroConfig, badge: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={heroConfig.title}
              onChange={(e) => setHeroConfig({ ...heroConfig, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
              Editorial Description
            </label>
            <textarea
              rows={3}
              value={heroConfig.description}
              onChange={(e) => setHeroConfig({ ...heroConfig, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-xs font-sans bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium hover:opacity-90"
            >
              Save Hero Settings
            </button>
          </div>
        </form>
      )}

      {/* ─── ARTICLE CREATE / EDIT MODAL ──────────────────────────────────────── */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] shrink-0">
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                {editingArticle.id ? "Edit Article" : "New Blog Article"}
              </h3>
              <button
                type="button"
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, title: e.target.value })
                    }
                    placeholder="e.g. Offline-First SQLite WAL Replication"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingArticle.slug || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: e.target.value })
                    }
                    placeholder="e.g. offline-first-sqlite-wal"
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Excerpt / Abstract
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  placeholder="Concise technical summary..."
                  className="w-full px-3 py-2 rounded-lg text-xs font-sans bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Category
                  </label>
                  <select
                    value={editingArticle.category || ""}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        category: e.target.value,
                        categorySlug: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    {categories
                      .filter((c) => c.slug !== "all")
                      .map((cat) => (
                        <option key={cat.id || cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Author
                  </label>
                  <select
                    value={editingArticle.authorId || ""}
                    onChange={(e) => {
                      const selected = authors.find((a) => a.id === e.target.value);
                      if (selected) {
                        setEditingArticle({
                          ...editingArticle,
                          authorId: selected.id,
                          authorName: selected.name,
                          authorRole: selected.role,
                          authorInitials: selected.initials,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    {authors.map((auth) => (
                      <option key={auth.id} value={auth.id}>
                        {auth.name} ({auth.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Reading Time (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingArticle.readingMinutes || 5}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        readingMinutes: parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingArticle.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Distributed Systems, SQLite, CRDT, Go"
                  className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Article Body (Markdown & Code snippets) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={editingArticle.content || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  placeholder="Write in markdown format: ## Heading, ```go code blocks..."
                  className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingArticle.status || "DRAFT"}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        status: e.target.value as "PUBLISHED" | "DRAFT",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    <option value="DRAFT">Draft (Hidden publicly)</option>
                    <option value="PUBLISHED">Published (Live on /blog)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={editingArticle.isFeatured || false}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, isFeatured: e.target.checked })
                    }
                    className="rounded border-[var(--border-subtle)] text-[var(--brand-primary)]"
                  />
                  <label htmlFor="featured-check" className="text-xs font-mono text-[var(--text-primary)]">
                    Pin as Featured Top Analysis
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium hover:opacity-90"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CATEGORY MODAL ──────────────────────────────────────────────────── */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4">
            <h3 className="text-base font-bold font-mono text-[var(--text-primary)]">
              {editingCategory.id ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-sans bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── AUTHOR MODAL ────────────────────────────────────────────────────── */}
      {isAuthorModalOpen && editingAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4">
            <h3 className="text-base font-bold font-mono text-[var(--text-primary)]">
              {editingAuthor.id ? "Edit Author Profile" : "Add Author Profile"}
            </h3>
            <form onSubmit={handleSaveAuthor} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingAuthor.name || ""}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={editingAuthor.role || ""}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, role: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    Initials (Avatar)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={editingAuthor.initials || ""}
                    onChange={(e) =>
                      setEditingAuthor({ ...editingAuthor, initials: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  Bio / Focus Area
                </label>
                <textarea
                  rows={2}
                  value={editingAuthor.bio || ""}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-sans bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingAuthor.githubUrl || ""}
                    onChange={(e) =>
                      setEditingAuthor({ ...editingAuthor, githubUrl: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editingAuthor.linkedinUrl || ""}
                    onChange={(e) =>
                      setEditingAuthor({ ...editingAuthor, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAuthorModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
