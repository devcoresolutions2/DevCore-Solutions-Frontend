"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  Download,
  Search,
  Grid,
  List,
  Trash2,
  Lock,
  Copy,
  Check,
  Eye,
  X,
  Save,
} from "lucide-react";
import {
  apiDeleteMediaLibraryAsset,
  apiListMediaLibrary,
  apiSignSocialMediaUpload,
  apiUpdateMediaLibraryAsset,
  apiVerifySocialMediaAsset,
  getMediaManifestExportUrl,
  type SocialMediaAssetItem,
} from "@/lib/api";

type MediaRow = SocialMediaAssetItem & {
  tags: string[];
  post?: { id: string; title: string | null; status: string } | null;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MediaLibraryManager() {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalBytes: 0,
    usedAssets: 0,
    unusedAssets: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [usageFilter, setUsageFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaRow | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTags, setEditTags] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadMedia = useCallback(async () => {
    try {
      const res = await apiListMediaLibrary({
        page,
        limit: 12,
        search: search.trim() || undefined,
        type: typeFilter,
        usage: usageFilter,
        sort,
      });
      setItems(res.items);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to load media library." });
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, usageFilter, sort]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setBanner(null);
    let okCount = 0;
    let failCount = 0;

    for (const file of Array.from(fileList)) {
      try {
        const resourceType = file.type.startsWith("video/") ? "video" : "image";
        const signed = await apiSignSocialMediaUpload(resourceType);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", signed.apiKey);
        fd.append("timestamp", String(signed.timestamp));
        fd.append("signature", signed.signature);
        fd.append("folder", signed.folder);
        fd.append("public_id", signed.publicId);
        fd.append("allowed_formats", signed.allowedFormats);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`,
          { method: "POST", body: fd },
        );
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.public_id) {
          throw new Error(uploadJson?.error?.message || "Cloudinary upload failed");
        }
        await apiVerifySocialMediaAsset({
          publicId: uploadJson.public_id,
          resourceType,
          fileName: file.name,
        });
        okCount += 1;
      } catch {
        failCount += 1;
      }
    }

    setUploading(false);
    await loadMedia();
    setBanner({
      type: failCount > 0 ? "error" : "success",
      text: `Uploaded ${okCount} asset(s)${failCount > 0 ? `, ${failCount} failed` : ""}.`,
    });
  };

  const handleDelete = async (asset: MediaRow) => {
    if (asset.postId) return;
    try {
      await apiDeleteMediaLibraryAsset(asset.id);
      if (selected?.id === asset.id) setSelected(null);
      await loadMedia();
      setBanner({ type: "success", text: `Deleted ${asset.fileName} from Cloudinary & DB.` });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Delete failed." });
    }
  };

  const openDrawer = (asset: MediaRow) => {
    setSelected(asset);
    setEditAlt(asset.altText || "");
    setEditTags((asset.tags || []).join(", "));
  };

  const handleSaveMeta = async () => {
    if (!selected) return;
    setSavingMeta(true);
    try {
      const tags = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await apiUpdateMediaLibraryAsset(selected.id, {
        altText: editAlt,
        tags,
      });
      setSelected(res.asset);
      await loadMedia();
      setBanner({ type: "success", text: "Asset metadata & alt text saved." });
    } catch (err: any) {
      setBanner({ type: "error", text: err?.message || "Failed to save metadata." });
    } finally {
      setSavingMeta(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[var(--text-tertiary)] uppercase mb-1">
            Admin / Content / Media Library
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Media Asset Library
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage Cloudinary-hosted images and videos, alt text, tags, and broadcast usage references.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getMediaManifestExportUrl()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Manifest (.json)
          </a>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              void handleUploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90 disabled:opacity-50"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload New Assets"}
          </button>
        </div>
      </div>

      {banner && (
        <div
          className={`rounded-2xl border p-3.5 text-xs flex items-center justify-between ${
            banner.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
          }`}
        >
          <span>{banner.text}</span>
          <button type="button" onClick={() => setBanner(null)} className="underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Real Storage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">Total Assets</div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {stats.totalAssets}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">Stored Volume</div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {formatBytes(stats.totalBytes)}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">In Use (Protected)</div>
          <div className="mt-2 text-2xl font-bold text-emerald-500">{stats.usedAssets}</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
          <div className="text-xs font-mono uppercase text-[var(--text-tertiary)]">Unused Assets</div>
          <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {stats.unusedAssets}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search filename, alt text, or tag..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="svg">SVG</option>
          </select>
          <select
            value={usageFilter}
            onChange={(e) => {
              setUsageFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            <option value="all">All Usage</option>
            <option value="used">In Use (Protected)</option>
            <option value="unused">Unused</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="filename">Filename</option>
            <option value="largest">Largest File</option>
          </select>
          <div className="flex rounded-xl border border-[var(--border-subtle)] overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--bg-elevated)]"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--bg-elevated)]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Assets Grid or List */}
      {loading ? (
        <div className="p-10 text-center text-xs text-[var(--text-secondary)]">
          Loading media assets...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center space-y-2">
          <p className="text-sm font-medium text-[var(--text-primary)]">No media assets found</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Upload images or videos to store them in Cloudinary and PostgreSQL.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  {a.resourceType === "video" ? (
                    <video src={a.secureUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    <img
                      src={a.secureUrl}
                      alt={a.altText || a.fileName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[10px] uppercase">
                    {a.format}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-[var(--text-primary)] truncate">
                      {a.fileName}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
                      {a.width && a.height ? `${a.width}×${a.height} · ` : ""}
                      {formatBytes(a.bytes)}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] shrink-0 ${
                      a.postId
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]"
                    }`}
                  >
                    {a.postId ? "In Use" : "Unused"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openDrawer(a)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(a.secureUrl);
                      setCopiedId(a.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                  >
                    {copiedId === a.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === a.id ? "Copied" : "URL"}
                  </button>
                </div>
                {a.postId ? (
                  <span className="p-1.5 text-[var(--text-tertiary)]" title="Linked to broadcast — cannot delete">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleDelete(a)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                    title="Delete unused asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-elevated)] text-[var(--text-tertiary)] uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium">{a.fileName}</td>
                  <td className="px-4 py-3 font-mono">{a.format.toUpperCase()}</td>
                  <td className="px-4 py-3 font-mono">{formatBytes(a.bytes)}</td>
                  <td className="px-4 py-3">{a.postId ? "In Use" : "Unused"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" onClick={() => openDrawer(a)} className="underline">
                      Inspect
                    </button>
                    {!a.postId && (
                      <button
                        type="button"
                        onClick={() => void handleDelete(a)}
                        className="text-rose-500 underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span>
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} assets)
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Side Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md h-full bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate">
                {selected.fileName}
              </h3>
              <button type="button" onClick={() => setSelected(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selected.secureUrl}
              alt={selected.altText || selected.fileName}
              className="w-full rounded-xl border border-[var(--border-subtle)]"
            />
            <div className="rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-3 font-mono text-[11px] space-y-1">
              <div>Public ID: {selected.publicId}</div>
              <div>Format: {selected.format}</div>
              <div>Size: {formatBytes(selected.bytes)}</div>
              <div>
                Usage: {selected.post ? `Broadcast ${selected.post.id} (${selected.post.status})` : "Unused"}
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Alt Text</label>
                <textarea
                  rows={2}
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                />
              </div>
              <button
                type="button"
                disabled={savingMeta}
                onClick={() => void handleSaveMeta()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                {savingMeta ? "Saving..." : "Save Metadata & Alt Text"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
