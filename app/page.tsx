import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Globe,
  Layers,
  Mail,
  MessageCircle,
  Sparkles,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ShowcaseItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  category: string;
  badge: "NEW" | "BETA" | "UPDATED" | null;
  techTags: string[];
  liveUrl: string;
  coverGradient: string;
  metrics: string;
}

const FEATURED_PRODUCTS: ShowcaseItem[] = [
  {
    id: "dinedesk",
    slug: "dinedesk",
    name: "DineDesk",
    tagline: "Smart Restaurant Ordering, Table Reservations & Kitchen Operations",
    shortDescription:
      "A complete multi-role restaurant management and digital ordering ecosystem built for modern hospitality businesses—featuring real-time table tracking, QR menu ordering, staff workflows, and executive analytics.",
    category: "SAAS PLATFORM",
    badge: "NEW",
    techTags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://dine-desk-one.vercel.app/",
    coverGradient:
      "linear-gradient(135deg, rgba(84,101,113,0.32) 0%, rgba(245,233,204,0.35) 50%, rgba(87,80,76,0.28) 100%)",
    metrics: "Full-Stack SaaS • Live Production",
  },
  {
    id: "devcore-omnichannel",
    slug: "devcore-omnichannel",
    name: "DevCore Pulse Studio",
    tagline: "AI-Assisted Omnichannel Publishing & Lead Intelligence Engine",
    shortDescription:
      "Centralized executive command center for scheduling cross-platform campaigns across Meta, LinkedIn, X, YouTube, and Reddit with Gemini AI copy adaptation and automated lead CRM routing.",
    category: "AI & AUTOMATION",
    badge: "BETA",
    techTags: ["Next.js 15", "Prisma 7", "Gemini AI", "Upstash Redis", "BetterAuth"],
    liveUrl: "#contact",
    coverGradient:
      "linear-gradient(135deg, rgba(123,146,163,0.28) 0%, rgba(46,43,36,0.25) 55%, rgba(84,101,113,0.35) 100%)",
    metrics: "Internal Engine • Enterprise Ready",
  },
];

const SERVICES = [
  {
    icon: Layers,
    title: "SaaS Product Engineering",
    summary:
      "End-to-end architecture from database schema and multi-tenant auth to billing, analytics, and high-converting interfaces.",
    deliverables: ["Next.js & TypeScript", "PostgreSQL & Prisma", "Stripe & Auth"],
  },
  {
    icon: Globe,
    title: "Enterprise Web Platforms",
    summary:
      "Fast, SEO-engineered corporate portals, booking engines, and custom dashboards crafted with accessible design systems.",
    deliverables: ["App Router SSR/ISR", "Role-Based Security", "99.9% Uptime Setup"],
  },
  {
    icon: Cpu,
    title: "AI & Workflow Automation",
    summary:
      "Custom Google Gemini integrations, intelligent content pipelines, and automated business operations tailored to your team.",
    deliverables: ["Gemini API Agents", "Automated Queues", "CRM Integrations"],
  },
  {
    icon: Code2,
    title: "UI/UX & Brand Systems",
    summary:
      "Cohesive light and dark mode design systems, interactive prototypes, and pixel-accurate component libraries.",
    deliverables: ["Design Tokens", "Responsive Layouts", "WCAG Contrast"],
  },
];

const TECH_ROW_ONE = [
  "Next.js 15 App Router",
  "TypeScript Strict",
  "Prisma 7 ORM",
  "NeonDB PostgreSQL",
  "BetterAuth + Argon2id",
  "Tailwind CSS v4",
  "Upstash Redis",
  "Cloudinary Media",
];

const TECH_ROW_TWO = [
  "Google Gemini AI",
  "Node.js & Express",
  "REST & Webhook APIs",
  "AES-256-GCM Security",
  "Stripe Payments",
  "Liquid Glass UI",
  "Vercel Edge",
  "Zod Validation",
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/devcoresolutions2" },
  { label: "Facebook", href: "https://www.facebook.com/devcoresolutionsofficial" },
  { label: "Instagram", href: "https://www.instagram.com/devcoresolutionsofficial/" },
  { label: "X (Twitter)", href: "https://x.com/DevCoreSolution" },
  { label: "YouTube", href: "https://www.youtube.com/@DevCoreSolutionsOfficial" },
  { label: "Reddit", href: "https://www.reddit.com/user/DevCoreSolutions2/" },
];

export default function HomePage() {
  const whatsappHref =
    "https://wa.me/8801766140126?text=" +
    encodeURIComponent("Hello DevCore, I would like to discuss a project.");

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* =====================================================================
          1. FLOATING LIQUID GLASS NAVBAR
         ===================================================================== */}
      <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <nav
          aria-label="Primary Navigation"
          className="devcore-glass-nav flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
        >
          {/* Brand Mark */}
          <Link
            href="/"
            className="logo-hover-glint group flex items-center gap-3 rounded-xl pr-2"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-extrabold tracking-tight shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--brand-contrast)",
              }}
            >
              DC
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold leading-none tracking-tight">
                DevCore Solutions
              </span>
              <span
                className="mt-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Software & IT Studio
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div
            className="hidden items-center gap-7 text-sm font-medium md:flex"
            style={{ color: "var(--text-secondary)" }}
          >
            <a href="#showcase" className="transition-opacity hover:opacity-75">
              Products
            </a>
            <a href="#services" className="transition-opacity hover:opacity-75">
              Services
            </a>
            <a href="#stack" className="transition-opacity hover:opacity-75">
              Architecture
            </a>
            <a href="#contact" className="transition-opacity hover:opacity-75">
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/signin"
              className="hidden rounded-xl px-3.5 py-2 text-sm font-medium transition-opacity hover:opacity-80 sm:inline-flex"
              style={{ color: "var(--text-primary)" }}
            >
              Sign In
            </Link>
            <a
              href="#contact"
              className="btn-liquid-hover inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--brand-contrast)",
              }}
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ===================================================================
            2. HERO SECTION — EXECUTIVE VALUE PROPOSITION & GLASS PREVIEW
           =================================================================== */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Copy Column */}
            <div className="lg:col-span-7">
              <div className="animate-text-reveal devcore-glass-badge mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium">
                <span className="status-beacon h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-mono tracking-wide">
                  CHATTOGRAM • ACCEPTING Q4/Q1 BUILDS
                </span>
              </div>

              <h1 className="animate-text-reveal delay-100 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Building the{" "}
                <span className="text-liquid-gradient">Digital Core</span> for a
                Smarter Tomorrow.
              </h1>

              <p
                className="animate-text-reveal delay-200 mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                DevCore Solutions architects full-stack SaaS products, high-speed
                web applications, and AI-driven business platforms—engineered with
                type-safe precision, bank-grade security, and refined user
                experience.
              </p>

              {/* Hero CTAs */}
              <div className="animate-text-reveal delay-300 mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#showcase"
                  className="btn-liquid-hover inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--brand-contrast)",
                  }}
                >
                  Explore Live Products
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-liquid-hover devcore-glass-inset inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Trust Proof Strip */}
              <div
                className="animate-text-reveal delay-400 mt-10 grid grid-cols-3 gap-4 border-t pt-6 sm:max-w-lg"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div>
                  <p className="font-display text-2xl font-bold">100%</p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Type-Safe Full-Stack
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">&lt; 1 hr</p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Callback Guarantee
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">End-to-End</p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    UI/UX to Cloud Deploy
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Liquid Glass Architecture Card */}
            <div className="animate-text-reveal delay-300 lg:col-span-5">
              <div className="devcore-glass-card animate-card-float p-6 sm:p-7">
                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <div className="flex items-center gap-2">
                    <Terminal
                      className="h-4 w-4"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                      devcore.architecture.v3
                    </span>
                  </div>
                  <span className="devcore-glass-badge rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium">
                    PRODUCTION
                  </span>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="devcore-glass-inset flex items-start gap-3.5 p-3.5">
                    <ShieldCheck
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <div>
                      <p className="font-display text-sm font-semibold">
                        Zero-Trust Auth & Security
                      </p>
                      <p
                        className="mt-0.5 text-xs leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        BetterAuth, Argon2id hashing, 6-digit OTP verification &
                        Upstash rate limiting.
                      </p>
                    </div>
                  </div>

                  <div className="devcore-glass-inset flex items-start gap-3.5 p-3.5">
                    <Zap
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <div>
                      <p className="font-display text-sm font-semibold">
                        Edge-Ready Data Layer
                      </p>
                      <p
                        className="mt-0.5 text-xs leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        NeonDB serverless PostgreSQL with Prisma 7 typed ORM and
                        instant ISR caching.
                      </p>
                    </div>
                  </div>

                  <div className="devcore-glass-inset flex items-start gap-3.5 p-3.5">
                    <Sparkles
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <div>
                      <p className="font-display text-sm font-semibold">
                        Generative AI Integration
                      </p>
                      <p
                        className="mt-0.5 text-xs leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Native Google Gemini pipelines for smart automation,
                        content adaptation & analytics.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-5 flex items-center justify-between rounded-xl px-4 py-3 font-mono text-xs"
                  style={{
                    backgroundColor: "var(--accent-warm)",
                    color: "var(--accent-ink)",
                  }}
                >
                  <span>Flagship Build: DineDesk SaaS</span>
                  <a
                    href="https://dine-desk-one.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
                  >
                    Live Demo
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. KINETIC MOVING TECH STACK MARQUEE
           =================================================================== */}
        <section
          id="stack"
          aria-label="Technology Stack"
          className="border-y py-8"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="marquee-viewport space-y-3">
            {/* Row 1: Scrolls Left */}
            <div className="marquee-track-left gap-3">
              {[...TECH_ROW_ONE, ...TECH_ROW_ONE].map((item, idx) => (
                <span
                  key={`r1-${idx}`}
                  className="devcore-glass-inset mx-1.5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <CheckCircle2
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  {item}
                </span>
              ))}
            </div>

            {/* Row 2: Scrolls Right */}
            <div className="marquee-track-right gap-3">
              {[...TECH_ROW_TWO, ...TECH_ROW_TWO].map((item, idx) => (
                <span
                  key={`r2-${idx}`}
                  className="devcore-glass-inset mx-1.5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. PRODUCT SHOWCASE ("NEW LAUNCHES" BIG-IMAGE CARDS)
           =================================================================== */}
        <section
          id="showcase"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span
                className="font-mono text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--brand-primary)" }}
              >
                Product Showcase
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Built & Shipped by DevCore
              </h2>
            </div>
            <p
              className="max-w-md text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Proprietary SaaS platforms and client solutions engineered from
              zero to production deployment.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {FEATURED_PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="devcore-glass-card group flex flex-col overflow-hidden p-5 sm:p-6"
              >
                {/* Big-Image Visual Stage with Specular Hover Sweep */}
                <div
                  className="image-showcase-frame relative flex aspect-[16/10] w-full flex-col justify-between p-6"
                  style={{ background: product.coverGradient }}
                >
                  <div className="flex items-center justify-between">
                    <span className="devcore-glass-nav rounded-lg px-3 py-1 font-mono text-[11px] font-semibold tracking-wider">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span
                        className="rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-wider"
                        style={{
                          backgroundColor: "var(--brand-primary)",
                          color: "var(--brand-contrast)",
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Architectural UI Preview Frame */}
                  <div className="devcore-glass-nav mt-auto rounded-xl p-4 transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-lg font-bold">
                          {product.name}
                        </p>
                        <p
                          className="font-mono text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {product.metrics}
                        </p>
                      </div>
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: "var(--brand-primary)",
                          color: "var(--brand-contrast)",
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-6 flex flex-1 flex-col">
                  <h3 className="font-display text-xl font-bold">
                    {product.name} —{" "}
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {product.tagline}
                    </span>
                  </h3>

                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {product.shortDescription}
                  </p>

                  {/* Tech Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.techTags.map((tag) => (
                      <span
                        key={tag}
                        className="devcore-glass-inset rounded-lg px-2.5 py-1 font-mono text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Action */}
                  <div
                    className="mt-6 flex items-center justify-between border-t pt-4"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <a
                      href={product.liveUrl}
                      target={
                        product.liveUrl.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        product.liveUrl.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {product.liveUrl.startsWith("http")
                        ? "Launch Live Product"
                        : "Request Private Walkthrough"}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===================================================================
            5. ENGINEERING & CONSULTATION SERVICES GRID
           =================================================================== */}
        <section
          id="services"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
        >
          <div className="max-w-2xl">
            <span
              className="font-mono text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--brand-primary)" }}
            >
              Capabilities
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Full-Cycle Software Engineering
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              Whether launching a new SaaS venture or modernizing operations, we
              deliver clean architecture, measurable speed, and maintainable code.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="devcore-glass-card flex flex-col justify-between p-6"
                >
                  <div>
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: "var(--accent-warm)",
                        color: "var(--accent-ink)",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold">
                      {service.title}
                    </h3>
                    <p
                      className="mt-2.5 text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {service.summary}
                    </p>
                  </div>

                  <ul
                    className="mt-6 space-y-1.5 border-t pt-4 font-mono text-xs"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {service.deliverables.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================================
            6. EASY CONTACT HUB CTA BANNER
           =================================================================== */}
        <section
          id="contact"
          className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:pb-28"
        >
          <div className="devcore-glass-card relative overflow-hidden p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="devcore-glass-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-xs">
                  <span className="status-beacon h-2 w-2 rounded-full bg-emerald-500" />
                  <span>We call back within 1 business hour</span>
                </div>

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to build your next digital product?
                </h2>
                <p
                  className="mt-3 max-w-xl text-sm leading-relaxed sm:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Connect directly with our engineering founders in Chattogram.
                  Reach out on WhatsApp for an instant response or send your
                  project brief by email.
                </p>
              </div>

              <div className="flex flex-col gap-3.5 sm:flex-row lg:col-span-5 lg:flex-col">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-liquid-hover inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--brand-contrast)",
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp: +880 1766-140126
                </a>

                <a
                  href="mailto:dev.core.solution2@gmail.com?subject=Project%20Inquiry%20%E2%80%94%20DevCore%20Solutions"
                  className="btn-liquid-hover devcore-glass-inset inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Mail className="h-4 w-4" />
                  dev.core.solution2@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          7. FOOTER
         ===================================================================== */}
      <footer
        className="border-t py-10"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div>
            <p className="font-display text-sm font-bold">
              DevCore Solutions
            </p>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              North Agrabad, Chattogram, Bangladesh • Asia/Dhaka
            </p>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-75"
              >
                {social.label}
              </a>
            ))}
          </div>

          <p
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            © 2026 DevCore Solutions
          </p>
        </div>
      </footer>
    </div>
  );
}