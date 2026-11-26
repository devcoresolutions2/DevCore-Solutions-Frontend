"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  RefreshCw,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import {
  apiDeleteSocialMediaAsset,
  apiSignSocialMediaUpload,
  apiUpdateSocialMediaAsset,
  apiVerifySocialMediaAsset,
  type SocialMediaAssetItem,
} from "@/lib/api";

interface UploadQueueItem {
  localId: string;
  file: File;
  progress: number;
  status: "uploading" | "verifying" | "error";
  error?: string;
}

interface MediaUploaderProps {
  assets: SocialMediaAssetItem[];
  onChange: (assets: SocialMediaAssetItem[]) => void;
  maxAssets?: number;
}

async function validateMagicBytes(file: File): Promise<"image" | "video"> {
  const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isGif = buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
  const isWebp =
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50;

  if (isPng || isJpg || isGif || isWebp) return "image";

  // MP4 / MOV: 'ftyp' at offset 4, or WebM: 0x1A 0x45 0xDF 0xA3
  const isFtyp = buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70;
  const isWebm = buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3;
  if (isFtyp || isWebm) return "video";

  throw new Error(`Unsupported or invalid file signature for "${file.name}".`);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MediaUploader({
  assets,
  onChange,
  maxAssets = 10,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const uploadSingleFile = async (file: File, existingLocalId?: string) => {
    const localId = existingLocalId || `${file.name}-${Date.now()}-${Math.random()}`;
    setQueue((prev) => {
      const filtered = prev.filter((q) => q.localId !== localId);
      return [...filtered, { localId, file, progress: 0, status: "uploading" }];
    });

    try {
      const resourceType = await validateMagicBytes(file);
      const signed = await apiSignSocialMediaUpload(resourceType);

      if (file.size > signed.maxFileSizeBytes) {
        throw new Error(
          `File exceeds ${Math.round(signed.maxFileSizeBytes / (1024 * 1024))} MB limit.`,
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signed.apiKey);
      formData.append("timestamp", String(signed.timestamp));
      formData.append("signature", signed.signature);
      formData.append("folder", signed.folder);
      formData.append("public_id", signed.publicId);
      formData.append("allowed_formats", signed.allowedFormats);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`;

      const cloudPublicId = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setQueue((prev) =>
              prev.map((q) => (q.localId === localId ? { ...q, progress: pct } : q)),
            );
          }
        };
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && json.public_id) {
              resolve(json.public_id);
            } else {
              reject(new Error(json?.error?.message || `Cloudinary HTTP ${xhr.status}`));
            }
          } catch {
            reject(new Error("Invalid Cloudinary upload response."));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during Cloudinary upload."));
        xhr.send(formData);
      });

      setQueue((prev) =>
        prev.map((q) => (q.localId === localId ? { ...q, status: "verifying", progress: 100 } : q)),
      );

      const { asset } = await apiVerifySocialMediaAsset({
        publicId: cloudPublicId,
        resourceType,
        fileName: file.name,
      });

      setQueue((prev) => prev.filter((q) => q.localId !== localId));
      onChange([...assets, asset]);
    } catch (err: any) {
      setQueue((prev) =>
        prev.map((q) =>
          q.localId === localId
            ? { ...q, status: "error", error: err?.message || "Upload failed" }
            : q,
        ),
      );
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const available = maxAssets - assets.length;
    const files = Array.from(fileList).slice(0, Math.max(0, available));
    files.forEach((f) => {
      void uploadSingleFile(f);
    });
  };

  const handleRemove = async (assetId: string) => {
    onChange(assets.filter((a) => a.id !== assetId));
    await apiDeleteSocialMediaAsset(assetId).catch(() => {});
  };

  const handleMove = (idx: number, dir: -1 | 1) => {
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= assets.length) return;
    const copy = [...assets];
    const [moved] = copy.splice(idx, 1);
    if (!moved) return;
    copy.splice(nextIdx, 0, moved);
    onChange(copy);
    copy.forEach((a, order) => {
      void apiUpdateSocialMediaAsset(a.id, { sortOrder: order }).catch(() => {});
    });
  };

  const handleAltChange = (assetId: string, altText: string) => {
    onChange(assets.map((a) => (a.id === assetId ? { ...a, altText } : a)));
  };

  const handleAltBlur = (assetId: string, altText: string) => {
    void apiUpdateSocialMediaAsset(assetId, { altText }).catch(() => {});
  };

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[var(--brand-primary)]" />
          <h2 className="font-semibold text-sm text-[var(--text-primary)]">
            Attached Visual Artifacts
          </h2>
        </div>
        <span className="font-mono text-xs text-[var(--text-tertiary)]">
          {assets.length} / {maxAssets} Assets
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
            : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/60 hover:border-[var(--border-strong)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] mx-auto flex items-center justify-center text-[var(--brand-primary)] mb-2">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div className="text-xs font-medium text-[var(--text-primary)]">
          Drop images, GIFs, or videos here, or click to browse
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] mt-1">
          Signed Cloudinary upload · PNG, JPG, WebP, GIF (max 20MB) · MP4, MOV, WebM (max 50MB)
        </div>
      </div>

      {/* Active Upload Queue */}
      {queue.length > 0 && (
        <div className="space-y-2">
          {queue.map((q) => (
            <div
              key={q.localId}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-[var(--text-primary)] truncate">
                  {q.file.name}
                </span>
                {q.status === "error" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {q.error}
                    </span>
                    <button
                      type="button"
                      onClick={() => void uploadSingleFile(q.file, q.localId)}
                      className="inline-flex items-center gap-1 text-[var(--brand-primary)] font-semibold"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                    {q.status === "verifying" ? "Verifying..." : `${q.progress}%`}
                  </span>
                )}
              </div>
              {q.status !== "error" && (
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--brand-primary)] transition-all"
                    style={{ width: `${q.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Verified Assets */}
      {assets.length > 0 && (
        <div className="space-y-2">
          {assets.map((asset, idx) => (
            <div
              key={asset.id}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
            >
              <div className="w-20 h-14 rounded-lg bg-[var(--bg-surface)] overflow-hidden shrink-0 flex items-center justify-center border border-[var(--border-subtle)]">
                {asset.resourceType === "video" ? (
                  <video src={asset.secureUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img
                    src={asset.secureUrl}
                    alt={asset.altText || asset.fileName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--text-primary)] truncate flex items-center gap-1.5">
                    {asset.resourceType === "video" && <Film className="w-3.5 h-3.5 shrink-0" />}
                    {asset.fileName}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-tertiary)] shrink-0">
                    {asset.format.toUpperCase()} · {formatBytes(asset.bytes)}
                  </span>
                </div>
                <input
                  type="text"
                  value={asset.altText || ""}
                  onChange={(e) => handleAltChange(asset.id, e.target.value)}
                  onBlur={(e) => handleAltBlur(asset.id, e.target.value)}
                  placeholder="Alt text for accessibility..."
                  className="w-full px-2 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === assets.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => void handleRemove(asset.id)}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-rose-500 hover:bg-rose-500/10"
                title="Delete asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
