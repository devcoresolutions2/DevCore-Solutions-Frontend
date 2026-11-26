"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { AuthLayoutShell } from "@/components/auth/AuthLayoutShell";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { apiSignUp } from "@/lib/api";

function SignUpFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite")?.trim() || "";
  const invitedEmail = searchParams.get("email")?.trim() || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState(invitedEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (invitedEmail && !email) {
      setEmail(invitedEmail);
    }
  }, [invitedEmail, email]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailConflict, setEmailConflict] = useState(false);

  // Validate password rules: min 10 chars, at least 1 letter, at least 1 number
  const isPasswordValid =
    password.length >= 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setEmailConflict(false);

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid work email address.");
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

    if (!agreedToTerms) {
      setErrorMessage("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await apiSignUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        termsAccepted: agreedToTerms,
        ...(inviteToken ? { inviteToken } : {}),
      });

      if (res.success) {
        if (res.inviteAccepted || inviteToken) {
          router.push(
            `/auth/signin?email=${encodeURIComponent(
              email.trim().toLowerCase()
            )}&invited=1`
          );
        } else {
          router.push(
            `/auth/verification-pending?email=${encodeURIComponent(
              email.trim().toLowerCase()
            )}`
          );
        }
      }
    } catch (err: any) {
      const msg = err.message || "Failed to create account. Please try again.";
      if (err.code === "EMAIL_EXISTS" || msg.toLowerCase().includes("already registered")) {
        setEmailConflict(true);
        setErrorMessage(
          "An account with this email address already exists in the system."
        );
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayoutShell>
      {/* The Liquid Glass Card */}
      <div className="w-full max-w-[460px] rounded-2xl bg-[var(--bg-surface)]/85 backdrop-blur-[24px] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Specular Highlight Rim */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]" />

        {/* Header */}
        <div className="space-y-1 mb-6 text-left">
          <h2 className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
            Create an account
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
            Provision your developer workspace and access credentials.
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start space-x-2.5 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-left flex-1">
              <span className="font-semibold block">Registration Error</span>
              <span>{errorMessage}</span>
              {emailConflict && (
                <div className="mt-2 pt-2 border-t border-rose-500/20">
                  <Link
                    href={`/auth/signin?email=${encodeURIComponent(email)}`}
                    className="inline-flex items-center space-x-1 font-bold underline hover:opacity-80"
                  >
                    <span>Sign in to your existing account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Authentication */}
        <SocialAuthButtons />

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-tertiary)] tracking-wider">
              Or register with email
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
            >
              FULL NAME
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all font-sans"
              />
            </div>
          </div>

          {/* Work Email */}
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

          {/* Password */}
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

            {/* Live Password Strength Meter */}
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-mono font-medium text-[var(--text-secondary)]"
            >
              CONFIRM PASSWORD
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
                placeholder="Re-enter password"
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

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[var(--border-subtle)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/20 bg-[var(--bg-canvas)]"
              />
              <span className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-[var(--brand-primary)] hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-[var(--brand-primary)] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !agreedToTerms || !isPasswordValid}
            className="w-full mt-2 py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Developer Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Sign In */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-secondary)] font-sans">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-mono font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayoutShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] text-[#50616c] font-mono text-xs">
          Loading signup...
        </div>
      }
    >
      <SignUpFormContent />
    </Suspense>
  );
}
