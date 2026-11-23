"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { AuthLayoutShell } from "@/components/auth/AuthLayoutShell";
import { apiForgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await apiForgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Unable to send password recovery instructions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayoutShell>
      <div className="w-full max-w-[440px] rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-[24px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl relative overflow-hidden text-left">
        {/* Specular Highlight Rim */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]" />

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] mb-5">
          <KeyRound className="w-6 h-6" />
        </div>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
            Reset password
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
            Enter your work email address to receive password recovery instructions.
          </p>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Recovery Email Transmitted</span>
                <span>
                  If an active account is registered to <strong className="font-mono text-emerald-700 dark:text-emerald-300">{email}</strong>, a secure password recovery link has been dispatched.
                </span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              Please check your spam folder if the email does not appear within two minutes. The recovery link expires in 1 hour.
            </p>

            <div className="pt-2">
              <Link
                href="/auth/signin"
                className="w-full py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
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
                  <span className="font-semibold block">Request Error</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-[var(--border-subtle)] text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayoutShell>
  );
}
