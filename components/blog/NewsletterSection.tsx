"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { subscribeNewsletter } from "@/lib/api";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const cardRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(-350);
  const mouseY = useMotionValue(-350);
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 35 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 35 });

  const spotlightBg = useMotionTemplate`radial-gradient(560px circle at ${smoothX}px ${smoothY}px, color-mix(in oklab, var(--brand-primary) 15%, transparent), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-350);
    mouseY.set(-350);
  };

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
    <motion.section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group relative my-0 rounded-3xl border border-[var(--brand-primary)]/35 hover:border-[var(--brand-primary)]/65 bg-[var(--bg-elevated)]/95 backdrop-blur-xl p-6 sm:p-9 lg:p-10 shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Top Specular Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/85 to-transparent z-20"
      />

      {/* Ambient Corner Radial Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 w-80 h-80 rounded-full bg-[var(--brand-primary)]/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 w-72 h-72 rounded-full bg-[var(--brand-primary)]/10 blur-3xl"
      />

      {/* Interactive Cursor Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left 7 Columns: Editorial Pitch & Assurance Pills */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Reflexive Shimmer Eyebrow Badge */}
          <div className="relative overflow-hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/35 shadow-2xs mb-4">
            <motion.span
              aria-hidden="true"
              animate={{ x: ["-160%", "260%"] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-20 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            />
            <Terminal className="relative z-10 w-3.5 h-3.5 shrink-0" />
            <span className="relative z-10">Technical Dispatch</span>
          </div>

          <h3 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[var(--text-primary)] leading-[1.15] mb-3">
            Zero Bloat.{" "}
            <span className="text-liquid-gradient">
              Direct Engineering Insights.
            </span>
          </h3>

          <p className="text-xs sm:text-sm md:text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-xl mb-5">
            Subscribe to our bi-weekly architectural post-mortems, distributed
            systems benchmarks, and production engineering notes. No marketing
            fluff—unsubscribe with one click at any time.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] text-[11px] font-mono font-semibold text-[var(--text-primary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
              <span>Bi-Weekly RFCs</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] text-[11px] font-mono font-semibold text-[var(--text-primary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero Spam Guarantee</span>
            </span>
          </div>
        </div>

        {/* Right 5 Columns: Glass Subscription Console */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] p-5 sm:p-6 shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-widest text-[var(--brand-primary)] inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>Direct Inbox Delivery</span>
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                PG-Backed Feed
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  disabled={loading || status === "success"}
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-xs sm:text-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/35 focus:border-[var(--brand-primary)] font-mono disabled:opacity-50 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || status === "success"}
                className="btn-liquid-hover w-full h-11 px-5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)] text-xs sm:text-sm font-semibold shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Subscribing...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Subscribed to Dispatch</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe to Engineering Dispatch</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </form>

            {status === "success" && (
              <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {status === "error" && (
              <div className="mt-3.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs font-mono text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}