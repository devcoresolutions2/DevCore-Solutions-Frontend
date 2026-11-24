"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AuthLayoutShell } from "@/components/auth/AuthLayoutShell";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { apiSignIn } from "@/lib/api";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check URL parameters for verified flags or OAuth errors
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setVerifiedSuccess(true);
    }
    if (searchParams.get("reset") === "true") {
      setResetSuccess(true);
    }
    const qEmail = searchParams.get("email");
    if (qEmail) {
      setEmail(qEmail);
    }
    const err = searchParams.get("error");
    if (err === "oauth_failed") {
      setErrorMessage("Google authentication could not be completed. Please try again.");
    } else if (err === "github_failed") {
      setErrorMessage("GitHub authentication could not be completed. Please try again.");
    }
  }, [searchParams]);

  // Handle countdown for rate-limit cooldown
  useEffect(() => {
    if (rateLimitSeconds === null || rateLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      setRateLimitSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both your work email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setUnverifiedEmail(null);

      const res = await apiSignIn({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (res.success) {
        // Redirect
        router.push(res.redirectUrl || "/");
        router.refresh();
      }
    } catch (err: any) {
      const msg = err.message || "Failed to sign in. Please verify your credentials.";
      if (msg.includes("RATE_LIMITED") || err.retryAfter) {
        setRateLimitSeconds(err.retryAfter || 45);
        setErrorMessage("");
      } else if (msg.includes("not been verified") || err.code === "EMAIL_NOT_VERIFIED") {
        setUnverifiedEmail(email.trim());
        setErrorMessage("Your email address is not verified yet.");
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const isCooldown = rateLimitSeconds !== null && rateLimitSeconds > 0;

  return (
    <div className="w-full max-w-[440px] rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-[24px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Specular Highlight Rim */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]" />

      {/* Header */}
      <div className="space-y-1 mb-6 text-left">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
          Sign in to access your DevCore systems portal.
        </p>
      </div>

      {/* Success Banner if redirected from verification */}
      {verifiedSuccess && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start space-x-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Email Verified</span>
            <span>Your account email is verified. You can now sign in below.</span>
          </div>
        </div>
      )}

      {/* Success Banner if redirected from password reset */}
      {resetSuccess && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start space-x-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Password Updated</span>
            <span>Your password has been changed. Please sign in with your new credentials.</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start space-x-2.5 text-xs font-mono animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-left">
            <span className="font-semibold block">Authentication Failed</span>
            <span>{errorMessage}</span>
            {unverifiedEmail && (
              <div className="mt-2 pt-2 border-t border-rose-500/20">
                <Link
                  href={`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="inline-flex items-center space-x-1.5 font-bold underline hover:opacity-80"
                >
                  <span>Click here to enter your verification code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cooldown Timer Alert */}
      {isCooldown && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center space-x-2.5 text-xs font-mono">
          <Clock className="w-4 h-4 shrink-0" />
          <div>
            Too many attempts. Security cooldown active:{" "}
            <span className="font-bold underline">{rateLimitSeconds}s remaining</span>
          </div>
        </div>
      )}

      {/* Social Authentication */}
      <SocialAuthButtons />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-subtle)]" />
        </div>
        <div className="relative flex justify-center text-[10px] font-mono uppercase">
          <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-tertiary)] tracking-wider">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
          >
            WORK EMAIL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-tertiary)]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isCooldown}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all disabled:opacity-50 font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
          >
            PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-tertiary)]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isCooldown}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all disabled:opacity-50 font-sans"
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
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/20 bg-[var(--bg-canvas)]"
            />
            <span className="text-[var(--text-secondary)] font-sans">Remember for 30 days</span>
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-[var(--brand-primary)] hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || isCooldown}
            className="w-full h-11 px-5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-md group cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : isCooldown ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Cooldown ({rateLimitSeconds}s)</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center text-xs font-mono text-[var(--text-secondary)]">
        New to DevCore?{" "}
        <Link
          href="/auth/signup"
          className="text-[var(--brand-primary)] font-semibold hover:underline ml-1"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthLayoutShell>
      <Suspense fallback={<div className="text-xs font-mono">Loading authentication...</div>}>
        <SignInContent />
      </Suspense>
    </AuthLayoutShell>
  );
}
