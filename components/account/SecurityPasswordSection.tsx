"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Check,
  Circle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { apiChangePassword } from "@/lib/api";

interface SecurityPasswordSectionProps {
  hasPassword: boolean;
  emailVerified: boolean;
  activeSessionsCount: number;
  onPasswordUpdated: () => void;
}

export function SecurityPasswordSection({
  hasPassword,
  emailVerified,
  activeSessionsCount,
  onPasswordUpdated,
}: SecurityPasswordSectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Unified Password Policy: 10–128 chars, letter, number, special character
  const criteria = {
    length: newPassword.length >= 10 && newPassword.length <= 128,
    hasLetter: /[a-zA-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
  };

  const score = [
    criteria.length,
    criteria.hasLetter,
    criteria.hasNumber,
    criteria.hasSpecial,
  ].filter(Boolean).length;

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const getStrengthMeta = () => {
    if (newPassword.length === 0 || score <= 1) {
      return {
        label: "Weak",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        barColor: "bg-rose-500",
        widthPct: newPassword.length === 0 ? 0 : 25,
      };
    }
    if (score === 2 || score === 3) {
      return {
        label: "Fair",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        barColor: "bg-amber-500",
        widthPct: score === 2 ? 50 : 75,
      };
    }
    return {
      label: "Strong",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      barColor: "bg-emerald-500",
      widthPct: 100,
    };
  };

  const strength = getStrengthMeta();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (hasPassword && !currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (score < 4) {
      setErrorMessage("New password must satisfy all complexity requirements.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiChangePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
        revokeOtherSessions,
      });

      if (res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        const msg =
          res.revokedOthersCount > 0
            ? `${res.message} ${res.revokedOthersCount} other session(s) revoked.`
            : res.message;
        setSuccessMessage(msg);
        toast.success(msg);
        onPasswordUpdated();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="section-security"
      className="devcore-glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 scroll-mt-28"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
            Security &amp; Password
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage your account password and security verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
            <KeyRound size={13} />
            {hasPassword ? "Password Configured" : "OAuth-Only Account"}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)]">
            <ShieldCheck size={13} />
            {emailVerified ? "Email Verified" : "Email Unverified"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!hasPassword && (
            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-mono flex items-start gap-2">
              <Info size={15} className="shrink-0 mt-0.5" />
              <span>
                Your account currently signs in with OAuth. You can set a local password below to enable email/password sign-in as well.
              </span>
            </div>
          )}

          {/* Current Password (only if user has a local password) */}
          {hasPassword && (
            <div className="space-y-1.5">
              <label
                htmlFor="sec-current-pwd"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="sec-current-pwd"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? "Hide current password" : "Show current password"}
                  className="absolute right-3 top-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="sec-new-pwd"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
            >
              {hasPassword ? "New Password" : "Set Local Password"}
            </label>
            <div className="relative">
              <input
                id="sec-new-pwd"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="10+ characters with letters, numbers & symbols"
                required
                className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? "Hide new password" : "Show new password"}
                className="absolute right-3 top-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Strength Meter */}
            <div className="pt-1 space-y-1.5">
              <div className="w-full h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className={`h-full transition-all duration-300 ${strength.barColor}`}
                  style={{ width: `${strength.widthPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-muted)]">Password Strength</span>
                <span className={`px-2 py-0.5 rounded-full font-semibold ${strength.badgeClass}`}>
                  {strength.label}
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="sec-confirm-pwd"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                Confirm New Password
              </label>
              {confirmPassword.length > 0 && (
                <span
                  className={`text-[11px] font-mono font-semibold ${
                    passwordsMatch
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="sec-confirm-pwd"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
                className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                className="absolute right-3 top-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Revoke Other Sessions Toggle */}
          {activeSessionsCount > 1 && (
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={revokeOtherSessions}
                onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                className="mt-0.5 rounded border-[var(--border-strong)]"
              />
              <span className="text-[var(--text-secondary)]">
                Sign out all other active sessions ({activeSessionsCount - 1} other device
                {activeSessionsCount - 1 === 1 ? "" : "s"}) after updating password.
              </span>
            </label>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting || score < 4 || !passwordsMatch}
              className="h-11 px-5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  <span>{hasPassword ? "Update Password" : "Set Password"}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Requirements Spec Column */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Password Policy
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              This policy matches registration and password recovery requirements across DEVCORE.
            </p>
            <ul className="space-y-2 text-xs font-mono pt-1">
              <li
                className={`flex items-center gap-2 ${
                  criteria.length
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {criteria.length ? <Check size={14} /> : <Circle size={14} className="opacity-40" />}
                <span>10 to 128 characters</span>
              </li>
              <li
                className={`flex items-center gap-2 ${
                  criteria.hasLetter
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {criteria.hasLetter ? <Check size={14} /> : <Circle size={14} className="opacity-40" />}
                <span>At least 1 letter (A–Z / a–z)</span>
              </li>
              <li
                className={`flex items-center gap-2 ${
                  criteria.hasNumber
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {criteria.hasNumber ? <Check size={14} /> : <Circle size={14} className="opacity-40" />}
                <span>At least 1 number (0–9)</span>
              </li>
              <li
                className={`flex items-center gap-2 ${
                  criteria.hasSpecial
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {criteria.hasSpecial ? <Check size={14} /> : <Circle size={14} className="opacity-40" />}
                <span>At least 1 special character (@$!%*#?&amp;)</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
            <Info size={14} className="shrink-0 mt-0.5 text-[var(--brand-primary)]" />
            <span>
              Your current session remains active when changing your password. Other sessions can be revoked automatically.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
