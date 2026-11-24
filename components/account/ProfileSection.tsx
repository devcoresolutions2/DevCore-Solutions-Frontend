"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Verified,
  Calendar,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiUpdateProfile,
  apiGetAvatarUploadSignature,
  apiConfirmAvatarUpload,
  apiDeleteAvatar,
  type AccountProfile,
} from "@/lib/api";
import {
  validateAvatarFile,
  uploadAvatarToCloudinary,
  getOptimizedAvatarUrl,
} from "@/lib/cloudinary";
import { UserAvatar } from "@/components/shared/UserAvatar";

interface ProfileSectionProps {
  profile: AccountProfile;
  onProfileUpdated: (updated: AccountProfile) => void;
}

export function ProfileSection({ profile, onProfileUpdated }: ProfileSectionProps) {
  // Profile fields
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Avatar upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const isDirty =
    name.trim() !== profile.name ||
    (username.trim().toLowerCase() || "") !== (profile.username || "");

  const handleCancelEdit = () => {
    setName(profile.name);
    setUsername(profile.username || "");
    setProfileError("");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setProfileError("Full name must be between 2 and 80 characters.");
      return;
    }

    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername && !/^[a-z0-9_.-]{3,30}$/.test(trimmedUsername)) {
      setProfileError(
        "Username must be 3–30 characters (lowercase letters, numbers, dots, underscores, or hyphens)."
      );
      return;
    }

    try {
      setSavingProfile(true);
      const res = await apiUpdateProfile({
        name: trimmedName,
        username: trimmedUsername || null,
      });
      if (res.success && res.user) {
        onProfileUpdated(res.user);
        toast.success("Profile updated and saved.");
      }
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ─── Avatar File Selection & Magic-Byte Validation ─────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setAvatarError("");
    const check = await validateAvatarFile(file);
    if (!check.valid) {
      setAvatarError(check.error);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancelAvatarSelection = () => {
    if (uploadingAvatar && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setUploadingAvatar(false);
    setAvatarError("");
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    setAvatarError("");
    setUploadingAvatar(true);
    setUploadProgress(5);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // 1. Request short-lived Cloudinary signed upload authorization
      const sig = await apiGetAvatarUploadSignature();
      setUploadProgress(15);

      // 2. Upload directly to Cloudinary with real progress tracking
      const uploaded = await uploadAvatarToCloudinary(
        selectedFile,
        sig,
        (pct) => setUploadProgress(Math.max(15, Math.min(90, pct))),
        controller.signal
      );

      // 3. Backend verifies asset ownership/size/format & saves optimized URL
      setUploadProgress(95);
      const confirmed = await apiConfirmAvatarUpload(uploaded.publicId);

      if (confirmed.success) {
        onProfileUpdated({
          ...profile,
          avatarUrl: confirmed.avatarUrl,
          avatarPublicId: confirmed.avatarPublicId,
          avatarVersion: confirmed.avatarVersion,
        });
        toast.success("Profile image uploaded and optimized via Cloudinary.");
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
      }
    } catch (err: any) {
      if (err.message !== "Upload cancelled.") {
        setAvatarError(err.message || "Avatar upload failed.");
      }
    } finally {
      setUploadingAvatar(false);
      abortControllerRef.current = null;
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setRemovingAvatar(true);
      setAvatarError("");
      const res = await apiDeleteAvatar();
      if (res.success) {
        onProfileUpdated({
          ...profile,
          avatarUrl: null,
          avatarPublicId: null,
          avatarVersion: null,
        });
        toast.success("Profile image removed.");
        setConfirmRemoveOpen(false);
      }
    } catch (err: any) {
      setAvatarError(err.message || "Failed to remove profile image.");
    } finally {
      setRemovingAvatar(false);
    }
  };

  const optimizedPreview256 = getOptimizedAvatarUrl(profile.avatarUrl, 256);

  return (
    <section
      id="section-profile"
      className="devcore-glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 scroll-mt-28"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
            Profile &amp; Identity
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Update your display name, username, and profile photo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs font-semibold text-[var(--brand-primary)]">
            <UserCheck size={13} />
            {profile.role}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-semibold ${
              profile.isActive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                profile.isActive ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            {profile.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
      </div>

      {/* Cloudinary Avatar Management */}
      <div className="p-5 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Square Preview Frame */}
          <div className="relative shrink-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected profile preview"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--brand-primary)] shadow-md"
              />
            ) : (
              <UserAvatar
                name={profile.name}
                avatarUrl={optimizedPreview256}
                size={256}
                className="w-24 h-24 rounded-2xl shadow-md"
                textClassName="text-2xl"
              />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3 text-center sm:text-left w-full">
            <div>
              <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
                Profile Picture
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Stored &amp; automatically optimized via Cloudinary (f_auto, q_auto, face-aware crop). Accepts JPEG, PNG, or WebP up to 25 MB.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select profile image file"
            />

            {/* Controls */}
            {!selectedFile ? (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={removingAvatar}
                  className="h-10 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] font-medium text-xs inline-flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50"
                >
                  <Upload size={15} />
                  <span>{profile.avatarUrl ? "Replace Photo" : "Upload Photo"}</span>
                </button>

                {profile.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setConfirmRemoveOpen(true)}
                    disabled={removingAvatar}
                    className="h-10 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-rose-600 hover:border-rose-500/40 font-medium text-xs inline-flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="text-xs font-mono text-[var(--text-secondary)]">
                  Ready to upload: <strong className="text-[var(--text-primary)]">{selectedFile.name}</strong> (
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>

                {uploadingAvatar && (
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden border border-[var(--border-subtle)]">
                      <div
                        className="h-full bg-[var(--brand-primary)] transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-[var(--text-muted)]">
                      Uploading &amp; optimizing... {uploadProgress}%
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={uploadingAvatar}
                    className="h-9 px-4 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Save Avatar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelAvatarSelection}
                    className="h-9 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Remove Avatar Dialog */}
        {confirmRemoveOpen && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-mono text-rose-700 dark:text-rose-300">
              Remove your current profile picture from your account and Cloudinary?
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={removingAvatar}
                className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {removingAvatar && <Loader2 size={12} className="animate-spin" />}
                <span>Confirm Remove</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmRemoveOpen(false)}
                disabled={removingAvatar}
                className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {avatarError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{avatarError}</span>
          </div>
        )}
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSaveProfile} className="space-y-5">
        {profileError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{profileError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="profile-full-name"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
            >
              Full Name
            </label>
            <input
              id="profile-full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] transition-all"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="profile-username"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
            >
              Username <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kazi.samin"
              maxLength={30}
              className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] transition-all"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-email"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Email Address
              </label>
              {profile.emailVerified ? (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Verified size={13} />
                  Verified
                </span>
              ) : (
                <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  Unverified
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="profile-email"
                type="email"
                readOnly
                value={profile.email}
                className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm font-mono text-[var(--text-secondary)] cursor-not-allowed"
              />
              <Lock size={15} className="absolute right-3.5 top-3.5 text-[var(--text-muted)]" />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Verified account emails cannot be changed without re-verification.
            </p>
          </div>

          {/* Account Created Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Member Since
            </label>
            <div className="h-11 px-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)]">
              <Calendar size={15} className="text-[var(--text-muted)]" />
              <span>
                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={savingProfile}
              className="h-10 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel Changes
            </button>
          )}
          <button
            type="submit"
            disabled={savingProfile || !isDirty}
            className="h-10 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingProfile ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Identity Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
