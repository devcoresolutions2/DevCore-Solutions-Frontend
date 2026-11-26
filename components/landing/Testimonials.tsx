"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { type TestimonialItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  items: TestimonialItem[];
}

function EndorsementCard({
  item,
  index,
  isActive,
  onSelect,
}: {
  item: TestimonialItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(160);
  const spotY = useMotionValue(130);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 240,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 240,
    damping: 26,
  });

  const spotlightBg = useMotionTemplate`radial-gradient(320px circle at ${spotX}px ${spotY}px, color-mix(in oklab, var(--success) 13%, transparent), transparent 74%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX / rect.width - 0.5);
    mouseY.set(localY / rect.height - 0.5);
    spotX.set(localX);
    spotY.set(localY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const starCount = Math.max(1, Math.min(5, Math.round(item.rating || 5)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onClick={onSelect}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          borderColor: isActive
            ? "color-mix(in oklab, var(--success) 55%, transparent)"
            : "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
        }}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className="group relative h-full p-6 sm:p-7 rounded-2xl bg-[var(--bg-elevated)]/92 backdrop-blur-md border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none"
      >
        {/* Cursor-Tracked Optical Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* Luminous Emerald Top Rim */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--success)] to-transparent transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />

        <div className="relative z-10 space-y-4">
          {/* Top Row: Clean Star Rating + Verified Pill */}
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-1"
              aria-label={`${starCount} out of 5 stars`}
            >
              {Array.from({ length: starCount }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className="text-amber-400 fill-current shrink-0"
                  aria-hidden="true"
                />
              ))}
            </div>

            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--success)] bg-[var(--success)]/12 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              <span>Verified</span>
            </span>
          </div>

          <blockquote className="text-sm text-[var(--text-primary)] leading-relaxed">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        </div>

        <footer className="relative z-10 mt-6 pt-4 border-t border-[var(--border-subtle)]/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors",
                isActive
                  ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)]"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--brand-primary)]"
              )}
              aria-hidden="true"
            >
              {item.initials}
            </div>
            <div className="min-w-0">
              <cite className="font-display font-bold text-sm text-[var(--text-primary)] not-italic block truncate">
                {item.author}
              </cite>
              <div className="text-xs text-[var(--text-muted)] truncate">
                {item.role}, {item.company}
              </div>
            </div>
          </div>

          <span className="font-mono text-[11px] font-bold text-[var(--brand-primary)] shrink-0">
            0{index + 1}
          </span>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export function Testimonials({ items }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const safeIndex = activeIndex % items.length;
  const featured = items[safeIndex];

  const avgRating = (
    items.reduce((acc, cur) => acc + (cur.rating || 5), 0) / items.length
  ).toFixed(1);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32 px-4 sm:px-6"
    >
      {/* Seamless Atmospheric Aura Matching Page Canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        <div
          className="h-[520px] w-[520px] sm:w-[880px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-primary) 12%, transparent) 0%, color-mix(in oklab, var(--success) 5%, transparent) 48%, transparent 72%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Header + Rating Summary & Cycle Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div className="space-y-3 max-w-2xl">
            <ReleasePill>
              <ShieldCheck size={13} aria-hidden="true" />
              &nbsp;CLIENT VALIDATION
            </ReleasePill>

            <h2
              id="testimonials-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-[1.08]"
            >
              Engineering Leadership{" "}
              <span className="text-liquid-gradient">Endorsements.</span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Verified feedback from founders, CTOs, and product leaders running production systems architected by DevCore Solutions.
            </p>
          </div>

          {/* Rating Summary Pill + Previous / Next Switcher */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            <div className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-subtle)] font-mono text-xs shadow-2xs">
              <Award size={14} className="text-amber-400" />
              <span className="font-bold text-[var(--text-primary)]">{avgRating}/5.0</span>
              <span className="text-[var(--text-muted)]">Verified Score</span>
            </div>

            {items.length > 1 && (
              <div className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous endorsement"
                  className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next endorsement"
                  className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)]/90 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Featured Editorial Spotlight Quote Banner */}
        <div
          style={{
            borderColor: "color-mix(in oklab, var(--border-subtle) 85%, transparent)",
          }}
          className="relative rounded-3xl bg-[var(--bg-elevated)]/85 backdrop-blur-xl border p-6 sm:p-9 lg:p-10 mb-8 shadow-md overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/55 to-transparent"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10"
            >
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                  <Sparkles size={12} />
                  <span>SPOTLIGHT ENDORSEMENT · 0{safeIndex + 1} OF 0{items.length}</span>
                </div>

                <blockquote className="font-display font-bold text-lg sm:text-2xl text-[var(--text-primary)] leading-snug">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center gap-3.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)]/80 lg:pl-8">
                <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] flex items-center justify-center font-mono font-extrabold text-sm shadow-sm shrink-0">
                  {featured.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-base text-[var(--text-primary)]">
                    {featured.author}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {featured.role}
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-[var(--success)] mt-0.5">
                    {featured.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Endorsement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, idx) => (
            <EndorsementCard
              key={t.id}
              item={t}
              index={idx}
              isActive={idx === safeIndex}
              onSelect={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}