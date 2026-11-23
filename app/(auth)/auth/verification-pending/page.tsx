"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { AuthLayoutShell } from "@/components/auth/AuthLayoutShell";
import { apiVerifyEmail, apiResendVerification } from "@/lib/api";

function VerificationPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length < 6) {
      setErrorMessage("Please enter the 6-digit security code.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await apiVerifyEmail({
        otp: code.trim(),
        email: email.trim().toLowerCase(),
      });

      if (res.success) {
        router.push("/auth/signin?verified=true");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid or expired security code. Please check and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldownSeconds > 0 || resending) return;
    if (!email) {
      setErrorMessage("Please provide your email address to resend the code.");
      return;
    }

    try {
      setResending(true);
      setErrorMessage("");
      setResendSuccess(false);

      await apiResendVerification(email.trim().toLowerCase());
      setResendSuccess(true);
      setCooldownSeconds(60); // 60s cooldown
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to resend code. Please try again in a few moments."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-[24px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl relative overflow-hidden text-left">
      {/* Specular Highlight Rim */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]" />

      {/* Header Icon */}
      <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] mb-5">
        <Mail className="w-6 h-6" />
      </div>

      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
          Check your email
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
          We sent a verification link and a 6-digit security code to:
        </p>
        <div className="mt-1 font-mono text-xs font-semibold text-[var(--brand-primary)] break-all bg-[var(--bg-canvas)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)]">
          {email || "your email address"}
        </div>
      </div>

      {/* Success banner if resent */}
      {resendSuccess && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start space-x-2.5 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>A fresh verification code and link have been dispatched.</span>
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start space-x-2.5 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Verification Failed</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* 6-Digit Code Verification Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        {!email && (
          <div className="space-y-1.5">
            <label
              htmlFor="emailInput"
              className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
            >
              CONFIRM YOUR EMAIL
            </label>
            <input
              id="emailInput"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all font-sans"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="otpCode"
            className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
          >
            ENTER 6-DIGIT SECURITY CODE
          </label>
          <div className="relative">
            <input
              id="otpCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              autoFocus
              className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold py-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all placeholder:tracking-widest placeholder:text-[var(--text-tertiary)]"
            />
          </div>
          <p className="text-[11px] font-sans text-[var(--text-secondary)]">
            Alternatively, click the verification button directly inside the email.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend Action */}
      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-[var(--text-secondary)] font-sans">
          Didn't receive the email?
        </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldownSeconds > 0 || resending}
          className="font-mono text-[var(--brand-primary)] hover:text-[var(--brand-hover)] font-semibold flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {resending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : cooldownSeconds > 0 ? (
            <span>Resend in {cooldownSeconds}s</span>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend Code</span>
            </>
          )}
        </button>
      </div>

      {/* Back to sign in / sign up */}
      <div className="mt-4 text-center">
        <Link
          href="/auth/signin"
          className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerificationPendingPage() {
  return (
    <AuthLayoutShell>
      <Suspense fallback={<div className="text-xs font-mono">Loading verification...</div>}>
        <VerificationPendingContent />
      </Suspense>
    </AuthLayoutShell>
  );
}
