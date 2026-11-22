import { Star, ShieldCheck } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { type TestimonialItem } from "@/lib/api";

interface TestimonialsProps {
  items: TestimonialItem[];
}

export function Testimonials({ items }: TestimonialsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <ReleasePill>
            <ShieldCheck size={13} aria-hidden="true" />
            &nbsp;CLIENT VALIDATION
          </ReleasePill>
          <h2
            id="testimonials-heading"
            className="font-display font-extrabold text-3xl text-[var(--text-primary)] mt-2"
          >
            Engineering Leadership Endorsements
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((t) => (
          <GlassCard key={t.id} className="p-7 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Stars */}
              <div
                className="flex items-center gap-1"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[var(--warning)] fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-sm text-[var(--text-primary)] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
            </div>

            <footer className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center font-mono font-bold text-xs text-[var(--brand-primary)]"
                aria-hidden="true"
              >
                {t.initials}
              </div>
              <div>
                <cite className="font-display font-bold text-sm text-[var(--text-primary)] not-italic">
                  {t.author}
                </cite>
                <div className="text-xs text-[var(--text-muted)]">
                  {t.role}, {t.company}
                </div>
              </div>
            </footer>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
