"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { AuthLayoutShell } from "@/components/auth/AuthLayoutShell";
import { apiVerifyEmail } from "@/lib/api";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [targetEmail, setTargetEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email") || "";
    setTargetEmail(email);

    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was provided in the URL.");
      return;
    }

    let isMounted = true;

    async function executeVerification() {
      try {
        const res = await apiVerifyEmail({
          token: token!,
          email: email || undefined,
        });

        if (isMounted) {
          if (res.success) {
            setStatus("success");
            setTimeout(() => {
              router.push("/auth/signin?verified=true");
            }, 2000);
          } else {
            setStatus("error");
            setErrorMessage(res.message || "Failed to verify email address.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(
            err.message ||
              "The verification token is invalid or has expired. Please request a new verification code."
          );
        }
      }
    }

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-[24px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl relative overflow-hidden text-center">
      {/* Specular Highlight Rim */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]" />

      {status === "loading" && (
        <div className="py-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] mx-auto animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
            Verifying Your Email
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans">
            Validating cryptographic token against security records...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="py-6 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
            Email Verified Successfully!
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
            Your identity has been confirmed. Redirecting you to sign in...
          </p>
          <div className="pt-2">
            <Link
              href="/auth/signin?verified=true"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold uppercase text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md transition-all"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="py-6 space-y-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
            Verification Link Expired
          </h2>
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
            {errorMessage}
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
            Security tokens expire after 24 hours. You can request a fresh code or return to sign in.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={
                targetEmail
                  ? `/auth/verification-pending?email=${encodeURIComponent(targetEmail)}`
                  : "/auth/signin"
              }
              className="w-full sm:w-auto flex-1 text-center py-2.5 px-4 rounded-xl font-mono text-xs font-semibold uppercase text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md transition-all"
            >
              Request New Code
            </Link>
            <Link
              href="/auth/signin"
              className="w-full sm:w-auto text-center py-2.5 px-4 rounded-xl font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayoutShell>
      <Suspense fallback={<div className="text-xs font-mono">Loading verification...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthLayoutShell>
  );
}
