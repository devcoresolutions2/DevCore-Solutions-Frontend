/**
 * MOCK DATA — placeholder only.
 * All fake data is isolated here. Switch to real API by updating lib/api.ts.
 * Never hard-code this in components.
 */

export type ShowcaseItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: "SaaS" | "Enterprise Web" | "E-Commerce" | "AI Automation" | "Mobile" | "Other";
  badge: string; // e.g. "NEW", "FLAGSHIP"
  launchedAt: string; // ISO date string
  version: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  techStack: string[];
  liveUrl?: string;
  caseStudySlug?: string;
  isFeatured?: boolean;
  metrics?: { label: string; value: string }[];
};

export type ProjectItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: "SaaS" | "Enterprise Web" | "E-Commerce" | "AI Automation";
  coverImage?: string;
  challenge: string;
  solution: string;
  features: string[];
  impact: { label: string; value: string }[];
  techStack: string[];
  testimonial?: { quote: string; author: string; role: string };
  liveUrl?: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  serviceCode: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  rating: number;
};

export type ContactSettings = {
  whatsappNumber: string;
  phone: string;
  email: string;
  businessHoursStart: number; // 0-23
  businessHoursEnd: number;
  timezone: string;
  isOpenNow: boolean;
};

export type BentoProofItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  badge: string;
  badgeColor: "success" | "brand" | "warning";
  icon: string;
  footnote: string;
  footnoteValue: string;
  auditedAsOf: string;
};

// ─── MOCK SHOWCASE ITEMS ────────────────────────────────────────────────────
export const MOCK_SHOWCASE: ShowcaseItem[] = [
  {
    id: "1",
    slug: "dinedesk",
    name: "DineDesk",
    tagline: "Multi-Vendor Restaurant Ordering & Table Reservation SaaS Platform",
    category: "SaaS",
    badge: "FLAGSHIP",
    launchedAt: "2024-08-01",
    version: "3.1",
    description:
      "Enterprise-grade, full-stack multi-vendor restaurant ordering and table reservation SaaS platform engineered from the ground up by DevCore Solutions. Eliminates 20–35% third-party aggregator commissions by equipping cloud kitchens, franchise venues, and restaurant groups with direct-to-consumer digital storefronts, table reservation engines, and real-time kitchen dispatch workflows.",
    coverImage: "/images/dinedesk-cover.jpg",
    techStack: [
      "React SPA",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Node.js",
      "Express",
      "TypeScript REST API",
      "PostgreSQL (Neon Cloud)",
      "TanStack Query",
      "Stripe SDK & Stripe Link",
      "Firebase Google OAuth",
      "Nodemailer",
      "Cloudinary CDN",
      "Google Gemini AI",
    ],
    liveUrl: "https://dine-desk-one.vercel.app/",
    caseStudySlug: "dinedesk",
    isFeatured: true,
    metrics: [
      { label: "Commission Saved", value: "20–35%" },
      { label: "Dishes Cataloged", value: "400+" },
      { label: "Floor Capacity", value: "42 Tables" },
    ],
  },
];

// ─── MOCK PROJECTS ───────────────────────────────────────────────────────────
export const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    slug: "dinedesk",
    name: "DineDesk",
    tagline: "Enterprise Multi-Vendor Restaurant Ordering & Table Reservation SaaS",
    category: "SaaS",
    coverImage: "/images/dinedesk-cover.jpg",
    challenge:
      "Restaurant owners, cloud kitchens, and franchise groups were losing 20% to 35% of every digital order to predatory third-party delivery apps. Simultaneously, independent dining venues struggled with fragmented tools: separate systems for online ordering, double-booking prone table reservations, manual phone dispatching, and disconnected customer loyalty databases.",
    solution:
      "DevCore Solutions engineered DineDesk as a decoupled, full-stack hospitality ecosystem. Built with a high-performance React SPA on the frontend, a scalable Node.js/Express TypeScript REST API on the backend, and serverless PostgreSQL on Neon Cloud. The architecture integrates TanStack Query for instantaneous search and real-time order polling, Stripe Link for friction-free encrypted payments, double-layer RBAC authentication with HTTP-only stateless JWTs, interactive 42-table floor management, automated Nodemailer seating passes, and Google Gemini AI for smart menu copywriting.",
    features: [
      "Searchable catalog of 400+ dishes with zero-reload TanStack Query caching and multi-parameter filters (cuisine, price tier, min rating, Halal Certified)",
      "Interactive Table Reservation Engine with seating area selection (Main Hall, Courtyard, Family Booth) and double-layer RBAC protection",
      "Customer Portal with stateless JWT session security in HTTP-only cookies, verified post-order diner reviews, and saved favorites",
      "Multi-fulfillment modes: Home Delivery, Curbside Pickup, and Dine-in ordering with custom rider instructions",
      "Dual payment infrastructure: Encrypted Stripe card processing with Stripe Link 1-click checkout and automated webhook settlement, plus Cash on Delivery",
      "4-Stage Live Order Stepper (Order Placed → In Kitchen → Delivery Run → Delivered) with live transit map and digital receipt summaries",
      "Executive Kitchen Operations Console: Real-time revenue telemetry, active orders, live table occupancy, and 1-click order status transitions",
      "Interactive 42-table floor management grid for host stands, automated seating queue notifications, and Digital Seating Passes",
      "Menu Engineering with Multer pipelines to Cloudinary CDN and Google Gemini AI assistance for menu descriptions and sentiment analysis",
      "Emergency storefront controls: One-click 'Kitchen Paused' toggle instantly suspends checkout during peak kitchen rushes",
    ],
    impact: [
      { label: "Aggregator Fee Savings", value: "20–35%" },
      { label: "Dishes in Catalog", value: "400+" },
      { label: "Tables Under Management", value: "42" },
      { label: "Order Stepper Latency", value: "Real-Time" },
    ],
    techStack: [
      "React SPA",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Node.js",
      "Express",
      "TypeScript",
      "PostgreSQL (Neon Cloud)",
      "TanStack Query",
      "Stripe SDK",
      "Firebase OAuth",
      "Cloudinary CDN",
      "Google Gemini AI",
      "Nodemailer",
    ],
    testimonial: {
      quote:
        "DineDesk completely freed our restaurant group from third-party delivery commissions. Our patrons love the live order tracker and table reservation flow, and our kitchen staff runs everything through the unified operations console.",
      author: "DineDesk Hospitality Partners",
      role: "Platform Operations & General Management",
    },
    liveUrl: "https://dine-desk-one.vercel.app/",
  },
];

// ─── MOCK SERVICES ───────────────────────────────────────────────────────────
export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: "1",
    title: "Custom Web & SaaS Engineering",
    description:
      "Full-lifecycle web applications built with TypeScript, React, Next.js, and Node.js. Clean domain-driven design, high modularity, and strict automated testing pipelines.",
    features: ["Multi-tenant database tenancy", "Role-based access control (RBAC & ABAC)", "State synchronization with SSR/SSG"],
    icon: "Code2",
    serviceCode: "ENG-WEB",
  },
  {
    id: "2",
    title: "Cloud & API Architecture",
    description:
      "Distributed infrastructure design across AWS and GCP using Terraform. Kubernetes orchestrations, high-concurrency gRPC & REST APIs, and automated disaster recovery.",
    features: ["Infrastructure as Code (Terraform/OpenTofu)", "Zero-downtime blue/green deployment", "Event-driven asynchronous messaging"],
    icon: "CloudCog",
    serviceCode: "ENG-CLD",
  },
  {
    id: "3",
    title: "AI & Workflow Automation",
    description:
      "Pragmatic AI integration: custom LLM agents, retrieval-augmented generation (RAG) on enterprise documents, and autonomous background pipeline orchestration.",
    features: ["Vector embeddings & semantic search", "Guardrails, hallucinations & compliance", "Autonomous asynchronous ETL pipelines"],
    icon: "Bot",
    serviceCode: "ENG-AUT",
  },
  {
    id: "4",
    title: "UI/UX Product Design",
    description:
      "Design systems crafted for complex data density and mission-critical workflows. WCAG AA accessibility, tokenized components, and pixel-precise interactive states.",
    features: ["Figma token systems linked to code", "Complex operational dashboard layouts", "High-density data tables and visualizations"],
    icon: "Layout",
    serviceCode: "ENG-DSN",
  },
  {
    id: "5",
    title: "IT Technical Consultation & Audits",
    description:
      "Comprehensive architectural audits, legacy system modernization roadmaps, security posture reviews, and fractional CTO advisory for scale-ups and enterprises.",
    features: ["Architecture Review: bottlenecks, technical debt, DB queries", "Security & Compliance: SOC2 prep, penetration testing, IAM governance"],
    icon: "Terminal",
    serviceCode: "ENG-CNS",
  },
];

// ─── MOCK TESTIMONIALS ────────────────────────────────────────────────────────
export const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    quote:
      "DevCore refactored our core ingestion pipeline from Python into Go and ClickHouse. Our infrastructure bill was slashed by 64% while throughput jumped 12x with zero dropped events.",
    author: "Marcus Sterling",
    role: "VP of Platform Engineering",
    company: "DataStream HQ",
    initials: "MS",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "Their adherence to clean code, deterministic contracts, and SOC2 rigor meant our auditors signed off on our Series B compliance in under 3 weeks. An indispensable engineering team.",
    author: "Elena Lindqvist",
    role: "Chief Technology Officer",
    company: "FinTech Nexus",
    initials: "EL",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "No hype, no buzzwords. DevCore delivered the DineDesk POS offline reconciliation layer right on schedule. It has operated flawlessly during our busiest peak hours for over a year.",
    author: "Arjun Kapoor",
    role: "Founder & CEO",
    company: "DineDesk",
    initials: "AK",
    rating: 5,
  },
];

// ─── MOCK BENTO PROOF ────────────────────────────────────────────────────────
export const MOCK_BENTO_PROOF: BentoProofItem[] = [
  {
    id: "1",
    value: "99.998%",
    label: "Global Fleet Availability",
    description: "Calculated across production deployments across multiple availability zones. Includes automated failover triggers.",
    badge: "SLA TIED",
    badgeColor: "success",
    icon: "Activity",
    footnote: "Unscheduled downtime",
    footnoteValue: "< 3 mins / Q",
    auditedAsOf: "November 2024",
  },
  {
    id: "2",
    value: "Zero Breach",
    label: "Continuous Security Posture",
    description: "Automated continuous posture checks with HIPAA & GDPR compliance enforcement on every deployment pipeline.",
    badge: "ZERO BREACH",
    badgeColor: "brand",
    icon: "Shield",
    footnote: "Automated CVE scans",
    footnoteValue: "0 Critical Issues",
    auditedAsOf: "November 2024",
  },
  {
    id: "3",
    value: "100% Trace",
    label: "Distributed Observability",
    description: "Full OpenTelemetry pipeline with real-time span sampling, distributed tracing, and kernel network monitoring.",
    badge: "OTel NATIVE",
    badgeColor: "brand",
    icon: "Cpu",
    footnote: "Span ingest rate",
    footnoteValue: "1.2M spans / sec",
    auditedAsOf: "November 2024",
  },
];

// ─── MOCK CONTACT SETTINGS ───────────────────────────────────────────────────
export const MOCK_CONTACT_SETTINGS: ContactSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801700000000",
  phone: process.env.NEXT_PUBLIC_PHONE || "+880 1700 000000",
  email: process.env.NEXT_PUBLIC_EMAIL || "solutions@devcoresolutions.com",
  businessHoursStart: 9,
  businessHoursEnd: 18,
  timezone: "Asia/Dhaka",
  isOpenNow: (() => {
    const now = new Date();
    const h = now.getHours();
    return h >= 9 && h < 18;
  })(),
};
