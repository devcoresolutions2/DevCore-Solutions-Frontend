"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, Search, UploadCloud, Check } from "lucide-react";
import {
  apiListMediaLibrary,
  apiSignSocialMediaUpload,
  apiVerifySocialMediaAsset,
  type SocialMediaAssetItem,
} from "@/lib/api";

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: SocialMediaAssetItem) => void;
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const [items, setItems] = useState<SocialMediaAssetItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiListMediaLibrary({
        page: 1,
        limit: 24,
        type: "image",
        search: search.trim() || undefined,
      });
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (open) void loadAssets();
  }, [open, loadAssets]);

  if (!open) return null;

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const signed = await apiSignSocialMediaUpload("image");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", signed.apiKey);
      fd.append("timestamp", String(signed.timestamp));
      fd.append("signature", signed.signature);
      fd.append("folder", signed.folder);
      fd.append("public_id", signed.publicId);
      fd.append("allowed_formats", signed.allowedFormats);

      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
        { method: "POST", body: fd },
      ).then((r) => r.json());
      if (up?.public_id) {
        const { asset } = await apiVerifySocialMediaAsset({
          publicId: up.public_id,
          resourceType: "image",
          fileName: file.name,
        });
        onSelect(asset);
        onClose();
      }
    } finally {
      setUploading(false);
    }
  };

  const chosen = items.find((i) => i.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">
            Select Media Asset
          </h3>
          <button type="button" onClick={onClose}>
            <X className="w-4 h-4 text-[var(--text-tertiary)]" />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Cloudinary media..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs"
            />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload New"}
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
              Loading assets...
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
              No image assets found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((a) => {
                const active = selectedId === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedId(a.id)}
                    className={`rounded-xl border overflow-hidden text-left transition-all ${
                      active
                        ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/30"
                        : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="aspect-video bg-[var(--bg-elevated)] relative">
                      <img
                        src={a.secureUrl}
                        alt={a.altText || a.fileName}
                        className="w-full h-full object-cover"
                      />
                      {active && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="p-2 text-[11px] truncate text-[var(--text-primary)]">
                      {a.fileName}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[var(--border-subtle)] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[var(--text-secondary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!chosen}
            onClick={() => {
              if (chosen) {
                onSelect(chosen);
                onClose();
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-primary)] text-white disabled:opacity-40"
          >
            Use Selected Asset
          </button>
        </div>
      </div>
    </div>
  );
}
