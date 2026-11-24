"use client";

import React, { useState } from "react";
import { Link2, Link2Off, KeyRound, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  apiDisconnectProvider,
  getOAuthLinkUrl,
  type ConnectedProviderItem,
} from "@/lib/api";

interface ConnectedProvidersSectionProps {
  email: string;
  hasPassword: boolean;
  providers: ConnectedProviderItem[];
  oauthConfigured: { google: boolean; github: boolean };
  onProvidersChanged: () => void;
}

export function ConnectedProvidersSection({
  email,
  hasPassword,
  providers,
  oauthConfigured,
  onProvidersChanged,
}: ConnectedProvidersSectionProps) {
  const [confirmProvider, setConfirmProvider] = useState<"google" | "github" | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const googleAccount = providers.find((p) => p.provider.toLowerCase() === "google");
  const githubAccount = providers.find((p) => p.provider.toLowerCase() === "github");

  const totalMethodsCount =
    (hasPassword ? 1 : 0) + (googleAccount ? 1 : 0) + (githubAccount ? 1 : 0);

  const handleDisconnect = async (provider: "google" | "github") => {
    try {
      setDisconnecting(true);
      setErrorMsg("");
      const res = await apiDisconnectProvider(provider);
      if (res.success) {
        toast.success(res.message);
        setConfirmProvider(null);
        onProvidersChanged();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to disconnect provider.");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <section
      id="section-providers"
      className="devcore-glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 scroll-mt-28"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
            <span>Section 03</span>
            <span>•</span>
            <span>Authentication Methods</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] mt-1">
            Connected Login Providers
          </h2>
        </div>

        <span className="font-mono text-xs text-[var(--text-muted)]">
          {totalMethodsCount} active sign-in method{totalMethodsCount === 1 ? "" : "s"}
        </span>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Email & Password Row */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--brand-primary)] shrink-0">
              <KeyRound size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-semibold text-sm text-[var(--text-primary)]">
                  Email &amp; Password
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                    hasPassword
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  }`}
                >
                  {hasPassword ? "CONFIGURED" : "NOT SET"}
                </span>
              </div>
              <p className="font-mono text-xs text-[var(--text-secondary)] mt-0.5">{email}</p>
            </div>
          </div>

          <a
            href="#section-security"
            className="h-9 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--brand-primary)] inline-flex items-center justify-center transition-colors self-start sm:self-auto"
          >
            {hasPassword ? "Change Password" : "Set Password"}
          </a>
        </div>

        {/* Google OAuth Row */}
        {oauthConfigured.google && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[var(--text-primary)]">
                      Google
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        googleAccount
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      }`}
                    >
                      {googleAccount ? "CONNECTED" : "DISCONNECTED"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--text-secondary)] mt-0.5">
                    {googleAccount
                      ? `Connected on ${new Date(googleAccount.connectedAt).toLocaleDateString()}`
                      : "Link your Google account for one-click OAuth sign-in"}
                  </p>
                </div>
              </div>

              {googleAccount ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setConfirmProvider("google");
                  }}
                  disabled={totalMethodsCount <= 1}
                  title={
                    totalMethodsCount <= 1
                      ? "Cannot disconnect your only sign-in method"
                      : "Disconnect Google"
                  }
                  className="h-9 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-rose-600 hover:border-rose-500/40 inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-start sm:self-auto"
                >
                  <Link2Off size={14} />
                  <span>Disconnect</span>
                </button>
              ) : (
                <a
                  href={getOAuthLinkUrl("google")}
                  className="h-9 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Link2 size={14} />
                  <span>Connect Google</span>
                </a>
              )}
            </div>

            {confirmProvider === "google" && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono text-rose-700 dark:text-rose-300">
                  Disconnect Google OAuth from your account? You will still be able to sign in with your other configured method(s).
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDisconnect("google")}
                    disabled={disconnecting}
                    className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {disconnecting && <Loader2 size={12} className="animate-spin" />}
                    <span>Confirm Disconnect</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmProvider(null)}
                    disabled={disconnecting}
                    className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GitHub OAuth Row (only shown if GitHub OAuth credentials are configured on backend) */}
        {oauthConfigured.github && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)]/70 border border-[var(--border-subtle)] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[var(--text-primary)]">
                      GitHub
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                        githubAccount
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      }`}
                    >
                      {githubAccount ? "CONNECTED" : "DISCONNECTED"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--text-secondary)] mt-0.5">
                    {githubAccount
                      ? `Connected on ${new Date(githubAccount.connectedAt).toLocaleDateString()}`
                      : "Link your GitHub account for OAuth sign-in"}
                  </p>
                </div>
              </div>

              {githubAccount ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setConfirmProvider("github");
                  }}
                  disabled={totalMethodsCount <= 1}
                  title={
                    totalMethodsCount <= 1
                      ? "Cannot disconnect your only sign-in method"
                      : "Disconnect GitHub"
                  }
                  className="h-9 px-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-rose-600 hover:border-rose-500/40 inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-start sm:self-auto"
                >
                  <Link2Off size={14} />
                  <span>Disconnect</span>
                </button>
              ) : (
                <a
                  href={getOAuthLinkUrl("github")}
                  className="h-9 px-4 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-contrast)] hover:bg-[var(--brand-hover)] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Link2 size={14} />
                  <span>Connect GitHub</span>
                </a>
              )}
            </div>

            {confirmProvider === "github" && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono text-rose-700 dark:text-rose-300">
                  Disconnect GitHub OAuth from your account?
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDisconnect("github")}
                    disabled={disconnecting}
                    className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {disconnecting && <Loader2 size={12} className="animate-spin" />}
                    <span>Confirm Disconnect</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmProvider(null)}
                    disabled={disconnecting}
                    className="h-8 px-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {totalMethodsCount <= 1 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>
            Lockout protection: At least one authentication method must remain active on your account at all times.
          </span>
        </div>
      )}
    </section>
  );
}
