"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  KeyRound,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  ShieldCheck,
  Server,
  Terminal,
  Link2Off,
  Check,
  Circle,
  LogIn,
} from "lucide-react";
import { apiResetPassword, apiValidateResetToken } from "@/lib/api";

type ResetViewState = "loading" | "form" | "expired" | "success";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL / State Token
  const [token, setToken] = useState("");
  const [viewState, setViewState] = useState<ResetViewState>("loading");

  // Inputs
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timers
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenTtl, setTokenTtl] = useState(900); // 15 minutes default

  // Validate Token on Mount
  useEffect(() => {
    const qToken = searchParams.get("token") || "";
    if (!qToken) {
      setViewState("expired");
      return;
    }

    setToken(qToken);

    // Call backend to validate token
    let isMounted = true;
    apiValidateResetToken(qToken)
      .then((res) => {
        if (!isMounted) return;
        if (res.valid) {
          if (res.expiresInSeconds && res.expiresInSeconds > 0) {
            setTokenTtl(res.expiresInSeconds);
          }
          setViewState("form");
        } else {
          setViewState("expired");
        }
      })
      .catch(() => {
        if (isMounted) setViewState("expired");
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // TTL Countdown Timer
  useEffect(() => {
    if (viewState !== "form" || tokenTtl <= 0) return;

    const timer = setInterval(() => {
      setTokenTtl((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setViewState("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState, tokenTtl]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── Real-Time Password Complexity Evaluation ─────────────────────────────
  const criteria = {
    length: newPassword.length >= 10 && newPassword.length <= 128,
    hasLetter: /[a-zA-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[@$!%*#?&_\W]/.test(newPassword),
  };

  const score = [
    criteria.length,
    criteria.hasLetter,
    criteria.hasNumber,
    criteria.hasSpecial,
  ].filter(Boolean).length;

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Strength Meter Visuals
  const getStrengthMeta = () => {
    if (newPassword.length === 0) {
      return {
        label: "Weak",
        labelClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        bars: ["bg-rose-500", "bg-black/10 dark:bg-white/10", "bg-black/10 dark:bg-white/10", "bg-black/10 dark:bg-white/10"],
      };
    }
    if (score <= 1) {
      return {
        label: "Weak",
        labelClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        bars: ["bg-rose-500", "bg-black/10 dark:bg-white/10", "bg-black/10 dark:bg-white/10", "bg-black/10 dark:bg-white/10"],
      };
    }
    if (score === 2 || score === 3) {
      return {
        label: "Fair",
        labelClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        bars: [
          "bg-amber-500",
          "bg-amber-500",
          score === 3 ? "bg-amber-500" : "bg-black/10 dark:bg-white/10",
          "bg-black/10 dark:bg-white/10",
        ],
      };
    }
    return {
      label: "Strong",
      labelClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      bars: ["bg-emerald-500", "bg-emerald-500", "bg-emerald-500", "bg-emerald-500"],
    };
  };

  const strengthMeta = getStrengthMeta();

  // ─── Submission Handler ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setViewState("expired");
      return;
    }

    if (!criteria.length || !criteria.hasLetter || !criteria.hasNumber || !criteria.hasSpecial) {
      setErrorMessage("Please ensure your password satisfies all complexity criteria.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      const res = await apiResetPassword({
        token,
        password: newPassword,
        confirmPassword,
      });

      if (res.success) {
        setViewState("success");
      } else {
        setErrorMessage(res.message || "Unable to reset password. Please try again.");
      }
    } catch (err: any) {
      if (err.message && (err.message.includes("expired") || err.message.includes("invalid"))) {
        setViewState("expired");
      } else {
        setErrorMessage(err.message || "Failed to update password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-[#F4F6F7] dark:bg-[#06141B] text-[#253745] dark:text-[#CCD0CF] selection:bg-[#253745] selection:text-white dark:selection:bg-[#8FB4C9] dark:selection:text-[#06141B]">
      {/* ─── LEFT PANEL: OBSIDIAN SECURITY & ASSURANCE (45%) ───────────────── */}
      <aside className="w-full lg:w-[45%] bg-[#131619] text-[#FAF8F5] flex flex-col justify-between p-8 sm:p-12 lg:p-14 relative overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Ambient Subsurface Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#253745]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#8FB4C9]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Branding & Platform Stance */}
        <div className="relative z-10 flex flex-col space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-300 shadow-md border border-white/10">
              <Terminal size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-lg tracking-tight font-extrabold text-white">DEVCORE</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-semibold tracking-wider">
                  ENTERPRISE
                </span>
              </div>
              <p className="font-mono text-[11px] text-white/50">Core Infrastructure &amp; Policy Engine</p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>POLICY ENGINE ACTIVE v4.19.2</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Cryptographic identity &amp; credential defense.
            </h1>
            <p className="font-sans text-sm text-white/70 max-w-md leading-relaxed">
              Enforcing authenticated session rotation and deterministic zero-drift entropy policies across all edge clusters.
            </p>
          </div>

          {/* 3 Security Assurance Cards */}
          <div className="space-y-3.5 pt-4">
            {/* Card 1 */}
            <div className="p-4 rounded-xl bg-[#1E2328]/80 border border-white/10 backdrop-blur-md shadow-sm transition hover:bg-[#252B32]/90">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-lg bg-sky-400/10 text-sky-300 shrink-0 border border-sky-400/20">
                  <Lock size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[15px] font-semibold text-white">Encrypted Sessions</h3>
                    <span className="font-mono text-[11px] text-white/60 font-medium">Session Invalidation</span>
                  </div>
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    Recovery sessions are isolated via time-bounded ephemeral keys and auto-revoked upon password synthesis.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-xl bg-[#1E2328]/80 border border-white/10 backdrop-blur-md shadow-sm transition hover:bg-[#252B32]/90">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-lg bg-emerald-400/10 text-emerald-300 shrink-0 border border-emerald-400/20">
                  <ShieldCheck size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[15px] font-semibold text-white">Email Verification</h3>
                    <span className="font-mono text-[11px] text-white/60 font-medium">15-Min Validity</span>
                  </div>
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    Single-use deterministic digest delivery strictly bounded by strict 15-minute validity windows.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-xl bg-[#1E2328]/80 border border-white/10 backdrop-blur-md shadow-sm transition hover:bg-[#252B32]/90">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-lg bg-purple-400/10 text-purple-300 shrink-0 border border-purple-400/20">
                  <Shield size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-[15px] font-semibold text-white">Role Access Preservation</h3>
                    <span className="font-mono text-[11px] text-white/60 font-medium">RBAC Sync</span>
                  </div>
                  <p className="font-sans text-xs text-white/60 leading-relaxed">
                    IAM credentials, fine-grained access policies, and automated service principals remain verified without privilege drift.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Telemetry */}
        <div className="relative z-10 pt-8 mt-6">
          <div className="rounded-xl bg-[#191D22] border border-white/10 p-4 text-white/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-white/60">
                <Server size={14} className="text-emerald-400" />
                <span>NODE TELEMETRY</span>
              </span>
              <span className="text-sky-300">TLS 1.3 // SECURE</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="bg-[#131619] p-2 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50">STATUS</span>
                <span className="text-white font-semibold">Active</span>
              </div>
              <div className="bg-[#131619] p-2 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50">GATEWAY</span>
                <span className="text-white font-semibold">Verified</span>
              </div>
              <div className="bg-[#131619] p-2 rounded-lg border border-white/5">
                <span className="block text-[10px] text-white/50">PROTECTION</span>
                <span className="text-emerald-400 font-semibold">Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── RIGHT PANEL: FROSTED ALABASTER CANVAS (55%) ──────────────────── */}
      <section className="w-full lg:w-[55%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative overflow-y-auto">
        {/* Top Bar: Navigation & Operational Status */}
        <div className="relative z-10 w-full flex items-center justify-between gap-4 pb-6">
          <Link
            href="/auth/signin"
            className="inline-flex items-center space-x-2 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to sign in</span>
          </Link>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>AUTH GATEWAY ACTIVE</span>
          </div>
        </div>

        {/* Central Liquid Glass Card Container */}
        <div className="relative z-10 w-full max-w-[460px] mx-auto my-auto py-6">
          {/* ════════════════════════════════════════════════════════════════════
              LOADING STATE
             ════════════════════════════════════════════════════════════════════ */}
          {viewState === "loading" && (
            <div className="w-full bg-[#EDEDEA]/75 dark:bg-white/[0.04] backdrop-blur-[20px] rounded-2xl p-10 shadow-xl border border-[var(--border-subtle)] text-center space-y-4">
              <Loader2 size={32} className="animate-spin mx-auto text-[var(--brand-primary)]" />
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                Validating cryptographic reset authorization...
              </p>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STATE 1: SET NEW PASSWORD
             ════════════════════════════════════════════════════════════════════ */}
          {viewState === "form" && (
            <div className="w-full bg-[#EDEDEA]/75 dark:bg-white/[0.04] backdrop-blur-[20px] rounded-2xl p-7 sm:p-8 shadow-xl border border-[var(--border-subtle)] transition-all duration-300">
              {/* Security Key Icon Badge & TTL Countdown */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-[var(--brand-primary)] dark:text-sky-300 shadow-sm border border-[var(--border-subtle)]">
                  <KeyRound size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#ede2c5] dark:bg-amber-400/15 text-[#514a35] dark:text-amber-300 font-mono text-xs font-semibold">
                  TOKEN_TTL: {formatTimer(tokenTtl)}
                </span>
              </div>

              {/* Headings */}
              <div className="space-y-1.5 mb-6">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  Create new password
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Your new password must satisfy enterprise zero-drift entropy constraints.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-2.5 text-xs font-mono">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Password Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]" htmlFor="new-password">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      required
                      className="w-full h-11 px-3.5 pr-11 bg-white dark:bg-white/[0.04] text-[var(--text-primary)] font-mono text-sm rounded-xl shadow-inner border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* 4-Segment Password Strength Meter */}
                <div className="space-y-2 pt-1 pb-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                      ENTROPY STRENGTH
                    </span>
                    <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full ${strengthMeta.labelClass}`}>
                      {strengthMeta.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                    {strengthMeta.bars.map((barClass, idx) => (
                      <div key={idx} className={`h-full rounded-full transition-all duration-300 ${barClass}`} />
                    ))}
                  </div>
                </div>

                {/* Live Password Requirements Checklist */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5]/80 dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-2">
                  <span className="block font-mono text-[11px] text-[var(--text-secondary)] font-semibold tracking-wide uppercase">
                    REQUIRED COMPLEXITY CRITERIA:
                  </span>
                  <ul className="space-y-1.5 font-mono text-xs">
                    <li className={`flex items-center space-x-2 transition-colors ${criteria.length ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-[var(--text-muted)]"}`}>
                      {criteria.length ? <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" /> : <Circle size={14} className="opacity-40 shrink-0" />}
                      <span>10 to 128 characters</span>
                    </li>
                    <li className={`flex items-center space-x-2 transition-colors ${criteria.hasLetter ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-[var(--text-muted)]"}`}>
                      {criteria.hasLetter ? <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" /> : <Circle size={14} className="opacity-40 shrink-0" />}
                      <span>At least 1 letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 transition-colors ${criteria.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-[var(--text-muted)]"}`}>
                      {criteria.hasNumber ? <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" /> : <Circle size={14} className="opacity-40 shrink-0" />}
                      <span>At least 1 number</span>
                    </li>
                    <li className={`flex items-center space-x-2 transition-colors ${criteria.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-[var(--text-muted)]"}`}>
                      {criteria.hasSpecial ? <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" /> : <Circle size={14} className="opacity-40 shrink-0" />}
                      <span>At least 1 special character (@$!%*#?&amp;)</span>
                    </li>
                  </ul>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]" htmlFor="confirm-password">
                      Confirm password
                    </label>
                    {passwordsMatch && (
                      <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 size={13} />
                        <span>Passwords match</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      required
                      className="w-full h-11 px-3.5 pr-11 bg-white dark:bg-white/[0.04] text-[var(--text-primary)] font-mono text-sm rounded-xl shadow-inner border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || score < 4 || !passwordsMatch}
                    className="w-full h-11 bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Updating credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset password &amp; sign in</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STATE 2: INVALID / EXPIRED TOKEN STATE
             ════════════════════════════════════════════════════════════════════ */}
          {viewState === "expired" && (
            <div className="w-full bg-[#EDEDEA]/75 dark:bg-white/[0.04] backdrop-blur-[20px] rounded-2xl p-7 sm:p-8 shadow-xl border border-[var(--border-subtle)] transition-all duration-300">
              {/* Warning / Broken Link Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm border border-rose-500/20">
                  <Link2Off size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs font-semibold">
                  ERR_TOKEN_EXPIRED
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-1.5 mb-5">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  Reset link invalid or expired
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  The cryptographic recovery token you supplied cannot be validated by the gateway.
                </p>
              </div>

              {/* Alert Banner */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-start space-x-3 mb-5 shadow-xs text-xs font-mono">
                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  This password recovery authorization token has expired (exceeded 15-minute validity) or has already been consumed.
                </p>
              </div>

              {/* Security Hygiene Guidance */}
              <div className="p-4 rounded-xl bg-[#FAF8F5]/80 dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-[var(--brand-primary)] dark:text-sky-300 font-semibold text-xs font-mono">
                  <Shield size={16} />
                  <span>Security Hygiene Protocol</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  For organizational safety, DevCore invalidates tokens immediately after one usage or 15 minutes post-dispatch. If you made multiple requests, only the latest code is operational.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/auth/forgot-password"
                  className="w-full h-11 bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Request a new code</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/auth/signin"
                  className="w-full h-11 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[var(--text-primary)] font-display font-medium text-sm rounded-xl border border-[var(--border-subtle)] transition-all flex items-center justify-center"
                >
                  <span>Return to sign in</span>
                </Link>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STATE 3: PASSWORD UPDATED SUCCESS
             ════════════════════════════════════════════════════════════════════ */}
          {viewState === "success" && (
            <div className="w-full bg-[#EDEDEA]/75 dark:bg-white/[0.04] backdrop-blur-[20px] rounded-2xl p-7 sm:p-8 shadow-xl border border-[var(--border-subtle)] transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <CheckCircle2 size={26} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-semibold">
                  SYNTHESIS_COMPLETE
                </span>
              </div>

              <div className="space-y-1.5 mb-5">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  Password updated
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Your credentials have been securely updated across all enterprise authentication edge zones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5]/80 dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono">
                  <Lock size={16} />
                  <span>Active Sessions Terminated</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  All legacy refresh tokens and active client cookies have been rotated and cleared in compliance with zero-trust mandates.
                </p>
              </div>

              <Link
                href="/auth/signin"
                className="w-full h-11 bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Sign In</span>
                <LogIn size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Compliance & Ident Footer */}
        <div className="relative z-10 w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[var(--text-muted)] font-mono text-xs border-t border-[var(--border-subtle)]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>ZERO TRUST IDENTITY</span>
            </span>
            <span>•</span>
            <span>ATOMIC REVOCATION</span>
            <span>•</span>
            <span>TLS 1.3</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>GATEWAY:</span>
            <span className="text-[var(--text-primary)] font-semibold">auth_edge-dc-prod</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F6F7] dark:bg-[#06141B]">
          <Loader2 size={32} className="animate-spin text-[#253745] dark:text-[#8FB4C9]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
