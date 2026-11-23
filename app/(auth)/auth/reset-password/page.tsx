"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { AuthLayoutShell } from "@/components/auth/AuthLayoutShell";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { apiResetPassword } from "@/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const qToken = searchParams.get("token");
    if (qToken) {
      setToken(qToken);
    } else {
      setErrorMessage("No password reset token was found in the link. Please request a new link.");
    }
  }, [searchParams]);

  const isPasswordValid =
    password.length >= 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage("Missing recovery token. Please request a new link.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage(
        "Password must be at least 10 characters and contain both letters and numbers."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await apiResetPassword({
        token,
        password,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin?reset=true");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          "Unable to reset password. The link may have expired or already been used."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-[24px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl relative overflow-hidden text-left">
      {/* Specular Highlight Rim */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]" />

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] mb-5">
        <Lock className="w-6 h-6" />
      </div>

      {/* Header */}
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
          Create new password
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
          Choose a secure, non-reused password for your account.
        </p>
      </div>

      {success ? (
        <div className="py-4 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Password Updated Successfully</span>
              <span>All prior active sessions have been revoked. Redirecting to sign in...</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/auth/signin?reset=true"
              className="w-full py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start space-x-2.5 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Password Reset Error</span>
                <span>{errorMessage}</span>
                {!token && (
                  <div className="mt-2">
                    <Link
                      href="/auth/forgot-password"
                      className="underline font-bold hover:opacity-80"
                    >
                      Request a new password reset link
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
            >
              NEW PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 10 characters with numbers"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
            >
              CONFIRM NEW PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] font-mono text-rose-500">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !token || !isPasswordValid || password !== confirmPassword}
            className="w-full mt-2 py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayoutShell>
      <Suspense fallback={<div className="text-xs font-mono">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayoutShell>
  );
}
