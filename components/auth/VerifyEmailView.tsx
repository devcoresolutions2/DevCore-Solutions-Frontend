"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  MailCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw,
  Edit2,
  Check,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import {
  apiVerifyEmail,
  apiResendVerification,
  apiGetVerificationStatus,
  apiChangePendingEmail,
  type VerificationStatusResponse,
} from "@/lib/api";

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "your authorized email";
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query parameters
  const paramEmail = searchParams.get("email") || "";
  const paramToken = searchParams.get("token") || "";

  // Core state
  const [email, setEmail] = useState(paramEmail);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Rate-limiting, Cooldown & Expiry (Synchronized with backend)
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expiresInSeconds, setExpiresInSeconds] = useState(600); // 10 minutes default
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(5);
  const [resendsLeft, setResendsLeft] = useState<number>(3);
  const [isLocked, setIsLocked] = useState(false);

  // "Use a different email" modal/edit state
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [changeEmailError, setChangeEmailError] = useState("");
  const [isSubmittingNewEmail, setIsSubmittingNewEmail] = useState(false);

  // References to the 6 individual OTP inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Initial status fetch & token-link auto verification
  useEffect(() => {
    if (paramEmail) {
      setEmail(paramEmail);
      apiGetVerificationStatus(paramEmail)
        .then((status) => {
          if (status.emailVerified) {
            setVerifiedSuccess(true);
            setTimeout(() => router.push("/auth/signin?verified=true"), 1800);
            return;
          }
          if (status.expiresInSeconds !== undefined) setExpiresInSeconds(status.expiresInSeconds);
          if (status.cooldownSeconds !== undefined) setCooldownSeconds(status.cooldownSeconds);
          if (status.attemptsLeft !== undefined) setAttemptsLeft(status.attemptsLeft);
          if (status.resendsLeft !== undefined) setResendsLeft(status.resendsLeft);
          if (status.isLocked) setIsLocked(true);
        })
        .catch(() => {
          // fallback to client countdown if offline
        });
    }

    // Direct magic link token verification (?token=...&email=...)
    if (paramToken) {
      setIsVerifying(true);
      apiVerifyEmail({ token: paramToken, email: paramEmail || undefined })
        .then((res) => {
          if (res.success) {
            setVerifiedSuccess(true);
            setTimeout(() => router.push("/auth/signin?verified=true"), 2000);
          } else {
            setErrorMessage(res.message || "Invalid or expired verification link.");
          }
        })
        .catch((err: any) => {
          setErrorMessage(err.message || "Failed to verify security token.");
        })
        .finally(() => setIsVerifying(false));
    }
  }, [paramEmail, paramToken, router]);

  // 2. Countdown timers for Cooldown and Expiry
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setExpiresInSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS for 10-minute expiry
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 3. OTP Input Handling
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const copy = [...otp];
      copy[index] = "";
      setOtp(copy);
      return;
    }

    // Single digit input
    const char = cleaned.slice(-1);
    const copy = [...otp];
    copy[index] = char;
    setOtp(copy);
    setErrorMessage("");

    // Auto-advance to next box if not on the last one
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are populated, auto-trigger verification
    if (index === 5 || copy.every((d) => d !== "")) {
      const fullCode = copy.join("");
      if (fullCode.length === 6) {
        submitOtp(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    if (!digits) return;

    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
    setErrorMessage("");

    // Focus appropriate box
    const nextIdx = Math.min(digits.length, 5);
    inputRefs.current[nextIdx]?.focus();

    if (digits.length === 6) {
      submitOtp(digits);
    }
  };

  // 4. Verify OTP Code
  const submitOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    if (!email) {
      setErrorMessage("No recipient email found. Please provide your email address.");
      return;
    }

    try {
      setIsVerifying(true);
      setErrorMessage("");
      setSuccessNotice("");

      const res = await apiVerifyEmail({
        otp: code,
        email: email.trim().toLowerCase(),
      });

      if (res.success) {
        setVerifiedSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin?verified=true");
        }, 2200);
      } else {
        setErrorMessage(res.message || "Invalid verification code.");
        if (res.attemptsLeft !== undefined) {
          setAttemptsLeft(res.attemptsLeft);
        }
      }
    } catch (err: any) {
      const msg = err.message || "Failed to verify security code.";
      setErrorMessage(msg);
      if (msg.includes("Too many") || msg.includes("locked")) {
        setIsLocked(true);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // 5. Resend Verification Code
  const handleResend = async () => {
    if (cooldownSeconds > 0 || isResending || resendsLeft <= 0 || isLocked) return;

    if (!email) {
      setErrorMessage("No email specified to send verification code.");
      return;
    }

    try {
      setIsResending(true);
      setErrorMessage("");
      setSuccessNotice("");

      const res = await apiResendVerification(email.trim().toLowerCase());
      setSuccessNotice("A fresh 6-digit security code has been transmitted to your inbox.");
      setCooldownSeconds(res.cooldownSeconds || 60);
      setExpiresInSeconds(600); // Reset 10 minutes
      if (res.resendsLeft !== undefined) setResendsLeft(res.resendsLeft);
      // Clear inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to resend code. Please try again shortly.");
    } finally {
      setIsResending(false);
    }
  };

  // 6. Change Pending Email Address
  const handleSaveNewEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newEmailInput.trim().toLowerCase();
    if (!cleaned || !cleaned.includes("@") || !cleaned.includes(".")) {
      setChangeEmailError("Please provide a valid email address.");
      return;
    }
    if (cleaned === email.toLowerCase()) {
      setIsChangingEmail(false);
      return;
    }

    try {
      setIsSubmittingNewEmail(true);
      setChangeEmailError("");

      const res = await apiChangePendingEmail(email, cleaned);
      setEmail(cleaned);
      setNewEmailInput("");
      setIsChangingEmail(false);
      setSuccessNotice(`Verification code sent to ${cleaned}`);
      setCooldownSeconds(60);
      setExpiresInSeconds(600);
      setOtp(["", "", "", "", "", ""]);
      setAttemptsLeft(5);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setChangeEmailError(err.message || "Failed to update pending email address.");
    } finally {
      setIsSubmittingNewEmail(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-64px)]">
      {/* ────────────────────────────────────────────────────────────────────────
          LEFT BRAND PANEL (45% Width on Desktop) — Stitch Exact Specification
         ──────────────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-full lg:w-[45%] bg-[#131619] text-[#FAF8F5] relative overflow-hidden flex-col justify-between p-8 sm:p-12 lg:p-16 select-none border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Subsurface Ambient Radial Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#546571]/25 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#F5E9CC]/10 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-[#546571]/20 blur-[140px] pointer-events-none" />

        {/* Top Brand Header & Metadata */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl tracking-tight font-extrabold text-[#FAF8F5] flex items-center gap-2">
                DEVCORE
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono text-xs">
                v4.8.2-PROD
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5E9CC]/15 border border-[#F5E9CC]/30 text-[#EDE2C5] font-mono text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EDE2C5]" />
              <span>ZERO-DRIFT ARCHITECTURE</span>
            </div>
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#546571]/30 border border-white/10 text-[#D3E5F3] font-mono text-xs mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D3E5F3]" />
              <span>AIR-GAPPED IDENTITY MATRIX</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
              Building the Digital Core for a Smarter Tomorrow.
            </h1>
            <p className="font-sans text-sm text-white/70 mt-3 max-w-xl leading-relaxed">
              Mission-critical enterprise infrastructure engineered with surgical deterministic control.
              Uncompromising resilience, verifiable session custody, and cryptographic guarantees.
            </p>
          </div>
        </div>

        {/* Center Pillar Dark Glass Assurance Cards */}
        <div className="relative z-10 my-10 space-y-3.5">
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#546571]/40 border border-white/10 flex items-center justify-center shrink-0 text-[#FAF8F5]">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm text-white font-semibold">Encrypted Sessions</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/80">ISOLATED ENCLAVE</span>
                </div>
                <p className="font-sans text-xs text-white/60 mt-1">
                  Hardware-backed ephemeral session tokens with isolated cryptographic boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 (Active context) */}
          <div className="p-4 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/25 shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D3E5F3]" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#546571]/60 border border-[#D3E5F3]/30 flex items-center justify-center shrink-0 text-[#D3E5F3]">
                <MailCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm text-white font-semibold">Email Verification</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#EDE2C5]/20 text-[#EDE2C5] border border-[#EDE2C5]/30">ACTIVE CHALLENGE</span>
                </div>
                <p className="font-sans text-xs text-white/80 mt-1">
                  Time-bound cryptographic OTP challenge validating identity authorization before credential grant.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#546571]/40 border border-white/10 flex items-center justify-center shrink-0 text-[#FAF8F5]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm text-white font-semibold">Role-Based Access Control</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/80">RBAC LEAST-PRIVILEGE</span>
                </div>
                <p className="font-sans text-xs text-white/60 mt-1">
                  Deterministic token claims preventing privilege drift and unauthorized service invocation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80">SYSTEM ONLINE</span>
          </div>
          <div>SHA-256 HMAC VERIFICATION ACTIVE</div>
          <div className="text-white/40">© 2026 DEVCORE SOLUTIONS LTD.</div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          RIGHT INTERACTION PANEL (55% Width on Desktop)
         ──────────────────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[55%] min-h-screen bg-[var(--bg-canvas)] flex flex-col justify-between p-4 sm:p-10 lg:p-14 relative">
        {/* Top Operational Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign-in</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AUTHENTICATION GATEWAY // READY</span>
          </div>
        </div>

        {/* Main Verification Interaction Card */}
        <div className="my-auto py-8 max-w-xl mx-auto w-full">
          {verifiedSuccess ? (
            /* ─── SUCCESS STATE ────────────────────────────────────────────────── */
            <div className="p-8 sm:p-10 rounded-2xl bg-[var(--bg-elevated)] border border-emerald-500/30 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  Email Successfully Verified!
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
                  Your identity challenge has succeeded and cryptographic tokens are authorized. Redirecting you to sign in...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full animate-[progress_2s_ease-in-out_forwards]" />
              </div>

              <div className="pt-2">
                <Link
                  href="/auth/signin?verified=true"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] transition-all shadow-md"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* ─── VERIFICATION CHALLENGE STATE ────────────────────────────────── */
            <div className="p-6 sm:p-10 rounded-2xl bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-xl space-y-7 relative overflow-hidden">
              {/* Header */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:text-sky-300 font-mono text-xs font-semibold">
                  <MailCheck className="w-4 h-4" />
                  <span>IDENTITY CHALLENGE</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                  Check your email
                </h2>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  We have dispatched a 6-digit cryptographic verification code to:
                </p>

                {/* Email Masked Badge with Working Change Action */}
                <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                    <span className="font-mono text-sm font-bold text-[var(--text-primary)] truncate">
                      {email ? maskEmail(email) : "Pending account registration"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingEmail(!isChangingEmail);
                      setNewEmailInput(email);
                      setChangeEmailError("");
                    }}
                    className="text-xs font-mono font-semibold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {/* Inline "Change Pending Email" Form */}
                {isChangingEmail && (
                  <form
                    onSubmit={handleSaveNewEmail}
                    className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--brand-primary)]/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                      <span>Update Recipient Email</span>
                      <button
                        type="button"
                        onClick={() => setIsChangingEmail(false)}
                        className="hover:text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmailInput}
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        placeholder="new.email@example.com"
                        className="flex-1 h-10 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingNewEmail}
                        className="h-10 px-4 rounded-lg bg-[var(--brand-primary)] text-white font-mono text-xs font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
                      >
                        {isSubmittingNewEmail ? "Saving..." : "Update & Resend"}
                      </button>
                    </div>

                    {changeEmailError && (
                      <p className="text-[11px] text-rose-500 font-mono">{changeEmailError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Status / Feedback Banners */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{errorMessage}</p>
                    {attemptsLeft !== null && attemptsLeft > 0 && attemptsLeft < 5 && (
                      <p className="mt-1 font-semibold">Remaining attempts: {attemptsLeft}</p>
                    )}
                  </div>
                </div>
              )}

              {successNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-150">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* 6 Individual Numeric OTP Input Boxes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span>Enter 6-Digit Security Code</span>
                  <span className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires: {formatTime(expiresInSeconds)}</span>
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3">
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
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      disabled={isVerifying || isLocked}
                      autoFocus={idx === 0}
                      className="w-full aspect-square text-center font-mono font-bold text-xl sm:text-2xl rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all shadow-inner disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => submitOtp()}
                  disabled={isVerifying || isLocked || otp.some((d) => !d)}
                  className="w-full h-12 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Security Code...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Code</span>
                    </>
                  )}
                </button>

                {/* Resend Cooldown Section */}
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-2">
                  <div className="flex items-center gap-1.5">
                    {cooldownSeconds > 0 ? (
                      <span className="text-[var(--text-secondary)]">
                        Resend available in <strong className="text-[var(--text-primary)]">{cooldownSeconds}s</strong>
                      </span>
                    ) : resendsLeft > 0 ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || isLocked}
                        className="text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1 font-semibold disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                        <span>Resend verification code</span>
                      </button>
                    ) : (
                      <span className="text-rose-500">Resend quota exhausted for this session</span>
                    )}
                  </div>

                  <span className="text-[11px] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                    {resendsLeft} of 3 resends left
                  </span>
                </div>
              </div>

              {/* Security Advisory */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-start gap-2.5 text-[11px] text-[var(--text-muted)] leading-relaxed font-sans">
                <ShieldAlert className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                <p>
                  <strong>Security Advisory:</strong> DevCore Solutions will never contact you via phone or unsolicited messaging to ask for your verification code. Keep this code confidential.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel Footer */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>SECURE IDENTITY GATEWAY</span>
          <Link href="/contact" className="hover:text-[var(--text-primary)] hover:underline">
            Need assistance?
          </Link>
        </div>
      </div>
    </div>
  );
}
