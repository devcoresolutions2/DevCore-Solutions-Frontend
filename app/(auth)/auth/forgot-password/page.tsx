"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Fingerprint,
} from "lucide-react";
import {
  apiForgotPassword,
  apiVerifyResetOtp,
  apiResendResetOtp,
  apiResetPassword,
} from "@/lib/api";

type FlowStep = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // State
  const [step, setStep] = useState<FlowStep>("email");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timers
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expiresInSeconds, setExpiresInSeconds] = useState(600); // 10 minutes
  const [resendsLeft, setResendsLeft] = useState(3);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  // OTP Input refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 10-minute expiry countdown
  useEffect(() => {
    if (step !== "otp") return;
    if (expiresInSeconds <= 0) return;

    const timer = setInterval(() => {
      setExpiresInSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, expiresInSeconds]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Format mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── Step 1: Submit Email ───────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessNotice("");

      const res = await apiForgotPassword(cleanEmail);
      setMaskedEmail(res.maskedEmail || cleanEmail.replace(/(^.{2})(.*)(@.*$)/, "$1****$3"));
      if (typeof res.cooldownSeconds === "number") setCooldownSeconds(res.cooldownSeconds);
      if (typeof res.expiresInSeconds === "number") setExpiresInSeconds(res.expiresInSeconds);
      if (typeof res.resendsLeft === "number") setResendsLeft(res.resendsLeft);

      setStep("otp");
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to process recovery request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Handle OTP Input ──────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "");
    if (!val) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const char = val.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = char;
    setOtp(nextOtp);

    // Auto focus next
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const nextOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      nextOtp[i] = pastedData[i];
    }
    setOtp(nextOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessNotice("");

      const res = await apiVerifyResetOtp(email.trim().toLowerCase(), code);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        router.push(`/auth/reset-password?token=${encodeURIComponent(res.resetToken)}`);
      } else {
        setErrorMessage(res.message || "Invalid verification code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Verification failed. Please check the code.");
      if (typeof err.attemptsLeft === "number") {
        setAttemptsLeft(err.attemptsLeft);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || resendsLeft <= 0 || loading) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessNotice("");

      const res = await apiResendResetOtp(email.trim().toLowerCase());
      setSuccessNotice("A new 6-digit code has been dispatched to your email.");
      setCooldownSeconds(res.cooldownSeconds ?? 60);
      setResendsLeft(res.resendsLeft ?? Math.max(0, resendsLeft - 1));
      setExpiresInSeconds(600);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code. Please wait.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Set New Password ──────────────────────────────────────────────
  const passwordCriteria = {
    length: newPassword.length >= 12,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumOrSymbol: /[\d\W]/.test(newPassword),
    matches: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.hasUpper &&
    passwordCriteria.hasLower &&
    passwordCriteria.hasNumOrSymbol &&
    passwordCriteria.matches;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMessage("Please fulfill all security requirements before proceeding.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await apiResetPassword({
        token: resetToken,
        password: newPassword,
        confirmPassword,
      });

      setStep("success");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password. Token may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F6F7] dark:bg-[#06141B] text-[#253745] dark:text-[#CCD0CF] selection:bg-[#253745] selection:text-white dark:selection:bg-[#8FB4C9] dark:selection:text-[#06141B]">
      {/* ─── LEFT PANEL: DARK DEVCORE BRANDING (45%, desktop only) ───────── */}
      <div className="hidden lg:flex relative w-full lg:w-[45%] bg-[#0B151C] text-white p-8 sm:p-12 lg:p-16 flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Subtle mesh illumination */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#253745]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8FB4C9]/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top: Logo & System Indicator */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center font-display font-black text-white text-lg tracking-wider group-hover:border-sky-400/50 transition-colors">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold tracking-tight text-base text-white">
                DEVCORE<span className="text-sky-400">.</span>
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-white/50 -mt-1">
                ENGINEERING
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ID SYSTEM // v4.2</span>
          </div>
        </div>

        {/* Middle: Brand Pitch & Security Assurance Cards */}
        <div className="relative z-10 my-12 lg:my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-sky-300 font-mono text-[11px] uppercase tracking-wider mb-6">
            <ShieldCheck size={13} />
            <span>Zero-Trust Credential Recovery</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-4">
            Building the Digital Core for a Smarter Tomorrow.
          </h1>

          <p className="text-sm text-white/70 leading-relaxed mb-8">
            High-assurance engineering and deterministic authentication. Our identity recovery pipeline guarantees strict anti-enumeration and encrypted credential rotation.
          </p>

          {/* 3 Security Cards */}
          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-sky-400/10 border border-sky-400/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={16} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xs text-white">
                  CSPRNG One-Time Verification
                </h2>
                <p className="font-sans text-[11px] text-white/60 mt-0.5 leading-normal">
                  6-digit cryptographically secure verification code dispatched directly via official SMTP.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={16} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xs text-white">
                  Email-Verified Integrity
                </h2>
                <p className="font-sans text-[11px] text-white/60 mt-0.5 leading-normal">
                  Tokens are salted and hashed on ingestion. 10-minute expiry with 60-second dispatch cooldowns.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <Fingerprint size={16} />
              </div>
              <div>
                <h2 className="font-display font-semibold text-xs text-white">
                  Atomic Session Revocation
                </h2>
                <p className="font-sans text-[11px] text-white/60 mt-0.5 leading-normal">
                  Upon password rotation, all active sessions and refresh tokens are immediately invalidated across devices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Operational Status */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
          <div className="flex items-center gap-2">
            <Server size={13} className="text-emerald-400" />
            <span>Operational Mesh Active</span>
          </div>
          <span>TLS 1.3 // TLS-GCM-256</span>
        </div>
      </div>

      {/* ─── RIGHT PANEL: RECOVERY INTERACTION (55%) ─────────────────────── */}
      <div className="w-full lg:w-[55%] min-h-screen flex flex-col justify-between p-4 sm:p-12 lg:p-16">
        {/* Top Bar: Back to Sign In */}
        <div className="flex items-center justify-between max-w-xl mx-auto w-full mb-8">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Sign In</span>
          </Link>

          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Step {step === "email" ? "1/3" : step === "otp" ? "2/3" : step === "password" ? "3/3" : "Done"}
          </span>
        </div>

        {/* Center Card Content */}
        <div className="max-w-xl mx-auto w-full my-auto">
          {/* ════════════════════════════════════════════════════════════════════
              PHASE 1: REQUEST VERIFICATION CODE
             ════════════════════════════════════════════════════════════════════ */}
          {step === "email" && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:bg-sky-400/15 dark:text-sky-300 dark:border dark:border-sky-400/30 flex items-center justify-center mb-4">
                  <KeyRound size={24} />
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                  Reset Your Password
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Enter your registered work email. We will dispatch a 6-digit verification code to authenticate your identity.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-2.5 text-xs font-mono">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.chen@devcore.tech"
                      required
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border-subtle)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 outline-none text-sm transition-all font-mono"
                    />
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Transmitting Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              PHASE 2: VERIFY 6-DIGIT OTP
             ════════════════════════════════════════════════════════════════════ */}
          {step === "otp" && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300 dark:border dark:border-sky-400/30 flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                  Check Your Email
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                  We sent a 6-digit verification code to{" "}
                  <strong className="font-mono text-[var(--text-primary)] font-semibold">{maskedEmail}</strong>.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-2.5 text-xs font-mono">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span>{errorMessage}</span>
                    {typeof attemptsLeft === "number" && (
                      <span className="block mt-1 font-semibold">Attempts remaining: {attemptsLeft}</span>
                    )}
                  </div>
                </div>
              )}

              {successNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5 text-xs font-mono">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{successNotice}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 OTP Boxes */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border-subtle)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>

                {/* Code Expiry Counter */}
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] py-1">
                  <span>Code expires in:</span>
                  <span className={expiresInSeconds < 60 ? "text-rose-500 font-bold" : "text-[var(--text-primary)] font-bold"}>
                    {formatTimer(expiresInSeconds)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full h-12 rounded-xl bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Resend & Wrong Address Actions */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp(["", "", "", "", "", ""]);
                    setErrorMessage("");
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline transition-colors text-left"
                >
                  Wrong address? Change email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldownSeconds > 0 || resendsLeft <= 0 || loading}
                  className="inline-flex items-center gap-1.5 text-[var(--brand-primary)] font-semibold disabled:text-[var(--text-muted)] disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  {cooldownSeconds > 0 ? (
                    <span>Resend in {cooldownSeconds}s</span>
                  ) : resendsLeft > 0 ? (
                    <span>Resend code ({resendsLeft} left)</span>
                  ) : (
                    <span>Max resends exceeded</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              PHASE 3: CREATE NEW PASSWORD
             ════════════════════════════════════════════════════════════════════ */}
          {step === "password" && (
            <div className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300 dark:border dark:border-purple-400/30 flex items-center justify-center mb-4">
                  <Lock size={24} />
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                  Create New Password
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Your identity has been verified. Establish a strong enterprise-grade password for your account.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-2.5 text-xs font-mono">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border-subtle)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 outline-none text-sm transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border-subtle)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 outline-none text-sm transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-2 text-xs font-mono">
                  <div className="font-semibold text-[var(--text-primary)] text-[11px] uppercase tracking-wider mb-2">
                    Security Requirements
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
                      <CheckCircle2 size={13} className={passwordCriteria.length ? "text-emerald-500" : "opacity-30"} />
                      <span>At least 12 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasUpper ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
                      <CheckCircle2 size={13} className={passwordCriteria.hasUpper ? "text-emerald-500" : "opacity-30"} />
                      <span>Uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasLower ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
                      <CheckCircle2 size={13} className={passwordCriteria.hasLower ? "text-emerald-500" : "opacity-30"} />
                      <span>Lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumOrSymbol ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
                      <CheckCircle2 size={13} className={passwordCriteria.hasNumOrSymbol ? "text-emerald-500" : "opacity-30"} />
                      <span>Number or symbol</span>
                    </div>
                    <div className={`col-span-full flex items-center gap-1.5 ${passwordCriteria.matches ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-muted)]"}`}>
                      <CheckCircle2 size={13} className={passwordCriteria.matches ? "text-emerald-500" : "opacity-30"} />
                      <span>Passwords match</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isPasswordValid}
                  className="w-full h-12 rounded-xl bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              PHASE 4: SUCCESS
             ════════════════════════════════════════════════════════════════════ */}
          {step === "success" && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                  Password Reset Successfully
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
                  Your new credentials have been safely committed. All active sessions have been invalidated for security. You can now sign in with your updated password.
                </p>
              </div>

              <div className="pt-4 max-w-sm mx-auto">
                <Link
                  href="/auth/signin"
                  className="w-full h-12 rounded-xl bg-[#253745] hover:bg-[#11212D] text-white dark:bg-[#8FB4C9] dark:hover:bg-white dark:text-[#06141B] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Privacy & Terms */}
        <div className="max-w-xl mx-auto w-full pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>&copy; {new Date().getFullYear()} DEVCORE SOLUTIONS</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              Privacy Notice
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              Security Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
