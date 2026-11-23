"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid engineering contact email address.");
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");
      const res = await subscribeNewsletter(email, "BLOG_FOOTER");
      setStatus("success");
      setMessage(res.message);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again or reach out directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12 relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 mb-4">
          <Mail className="w-3.5 h-3.5" />
          <span>TECHNICAL DISPATCH</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-3">
          Zero Bloat. Direct Engineering Insights.
        </h3>

        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed mb-6">
          Subscribe to our bi-weekly architectural post-mortems, distributed systems benchmarks, and kernel engineering notes. No marketing fluff. Unsubscribe at any time.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@domain.com"
            disabled={loading || status === "success"}
            className="w-full px-4 py-2.5 rounded-lg text-sm bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] font-mono disabled:opacity-50"
            required
          />

          <button
            type="submit"
            disabled={loading || status === "success"}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--brand-primary)] text-white text-xs font-mono font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed</span>
              </>
            ) : (
              <>
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-emerald-500">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-rose-500">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </section>
  );
}
