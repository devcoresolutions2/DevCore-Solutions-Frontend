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
  disciplineNumber?: string;
  category?: string;
  slaBadge?: string;
  deliverables?: string[];
  techStack?: string[];
  leadTime?: string;
  ctaLabel?: string;
  gridSpan?: "large" | "medium" | "small";
};

export type LifecycleStage = {
  stage: string;
  code: string;
  title: string;
  description: string;
  timeline: string;
  icon: string;
};

export type EngagementTier = {
  id: string;
  tier: string;
  subtitle: string;
  sla: string;
  slaDetail: string;
  composition: string;
  compositionDetail: string;
  cadence: string;
  governance: string;
  ctaText: string;
  serviceQuery: string;
};

export type JobItem = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  description: string;
  skills: string[];
  responsibilities?: string[];
  requirements?: string[];
  salary?: string;
  status: "OPEN" | "CLOSED";
  createdAt?: string;
};

export type JobApplicationPayload = {
  jobId: string;
  jobTitle?: string;
  name: string;
  email: string;
  phone?: string;
  resumeFileName?: string;
  resumeBase64?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  message?: string;
};

export type SubmittedApplicationItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  message?: string;
  status: "NEW" | "REVIEWING" | "INTERVIEW" | "REJECTED" | "HIRED";
  createdAt: string;
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
  callbackPromise?: string;
  bookingUrl?: string;
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
      "Multi-tenant distributed web platforms, offline-first client architectures, and fault-tolerant operational cockpits designed to thrive under extreme concurrent loads.",
    features: [
      "Next.js/React Enterprise Architecture",
      "Deterministic SQLite/CRDT Sync",
      "Automated SOC2 Harness Tests",
      "Multi-region CDN Edge Caching",
    ],
    deliverables: [
      "Next.js/React Enterprise Architecture",
      "Deterministic SQLite/CRDT Sync",
      "Automated SOC2 Harness Tests",
      "Multi-region CDN Edge Caching",
    ],
    techStack: ["TypeScript", "React 19", "Go", "WebSockets", "SQLite Edge"],
    icon: "Layers",
    serviceCode: "ENG-WEB",
    disciplineNumber: "01",
    category: "Frontend & State",
    slaBadge: "SLA 99.99%",
    leadTime: "Lead Time: 4-8 Sprints",
    ctaLabel: "Scope SaaS Engagement",
    gridSpan: "large",
  },
  {
    id: "2",
    title: "Cloud & API Architecture",
    description:
      "High-concurrency gRPC/REST APIs, Kubernetes mesh topologies, and zero-downtime event streaming engines built for sub-millisecond execution.",
    features: [
      "Asymmetric Multi-Region Mesh",
      "OpenTofu / Terraform IaC Repos",
      "Kafka Realtime Ingestion Pipeline",
      "mTLS Zero-Trust Gateway Rules",
    ],
    deliverables: [
      "Asymmetric Multi-Region Mesh",
      "OpenTofu / Terraform IaC Repos",
      "Kafka Realtime Ingestion Pipeline",
      "mTLS Zero-Trust Gateway Rules",
    ],
    techStack: ["Go", "gRPC", "Kubernetes", "ClickHouse", "Apache Kafka"],
    icon: "Boxes",
    serviceCode: "ENG-CLD",
    disciplineNumber: "02",
    category: "Infra & Mesh",
    leadTime: "Cluster Audit: 7 Days",
    ctaLabel: "Architect Cloud Fabric",
    gridSpan: "medium",
  },
  {
    id: "3",
    title: "AI & Workflow Automation",
    description:
      "Pragmatic enterprise LLM agents, vector semantic indexing, and low-latency autonomous workflow orchestration with mathematical prompt boundaries.",
    features: [
      "Deterministic Guardrail Layer",
      "pgvector & Hybrid Pipeline",
      "Multi-Agent Worker Queues",
      "Prompt Drift Observability",
    ],
    deliverables: [
      "Deterministic Guardrail Layer",
      "pgvector & Hybrid Pipeline",
      "Multi-Agent Worker Queues",
      "Prompt Drift Observability",
    ],
    techStack: ["Python", "LangChain", "pgvector", "PyTorch"],
    icon: "Bot",
    serviceCode: "ENG-AUT",
    disciplineNumber: "03",
    category: "ML Systems",
    ctaLabel: "Deploy Enterprise AI",
    gridSpan: "small",
  },
  {
    id: "4",
    title: "UI/UX Product Design",
    description:
      "Precision design systems engineered for extreme data density, WCAG AA accessibility compliance, and direct 1:1 engineering design tokens.",
    features: [
      "Multi-Tier Figma Token System",
      "High-Density Telemetry HUDs",
      "Micro-interaction Motion Spec",
      "Interactive Storybook Rig",
    ],
    deliverables: [
      "Multi-Tier Figma Token System",
      "High-Density Telemetry HUDs",
      "Micro-interaction Motion Spec",
      "Interactive Storybook Rig",
    ],
    techStack: ["Figma", "Tailwind", "WCAG AA", "Design Tokens"],
    icon: "Layout",
    serviceCode: "ENG-DSN",
    disciplineNumber: "04",
    category: "Ergonomics",
    ctaLabel: "Commission Design System",
    gridSpan: "small",
  },
  {
    id: "5",
    title: "IT Technical Consultation & Audits",
    description:
      "Comprehensive architectural forensics, legacy modernization roadmaps, performance profiling, and deterministic pre-audit hardening.",
    features: [
      "Kernel & DB Query Profiling",
      "Penetration Hardening Audit",
      "Monolith Strangler Blueprint",
      "24/7 Disaster Runbooks",
    ],
    deliverables: [
      "Kernel & DB Query Profiling",
      "Penetration Hardening Audit",
      "Monolith Strangler Blueprint",
      "24/7 Disaster Runbooks",
    ],
    techStack: ["OpenTelemetry", "eBPF", "Rust", "Linux Kernel"],
    icon: "Terminal",
    serviceCode: "ENG-CNS",
    disciplineNumber: "05",
    category: "Forensic Audit",
    ctaLabel: "Request Technical Audit",
    gridSpan: "small",
  },
];

// ─── MOCK LIFECYCLE STAGES ────────────────────────────────────────────────────
export const MOCK_LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    stage: "01",
    code: "01 // DISCOVERY",
    title: "Domain Architecture",
    description:
      "Bounded contexts definition, schema contract specification, event storming, and SLA constraint bounding.",
    timeline: "Day 1-10",
    icon: "Network",
  },
  {
    stage: "02",
    code: "02 // PROTOTYPING",
    title: "Spike & Benchmarks",
    description:
      "Synthesizing load scenarios, isolating DB contention hotspots, and proving sub-14ms ingestion paths in sandbox.",
    timeline: "Day 11-20",
    icon: "Gauge",
  },
  {
    stage: "03",
    code: "03 // HARDENING",
    title: "SOC2 & Zero-Trust",
    description:
      "Immutable audit trails, KMS key rotation pipelines, automated eBPF monitoring, and static code compliance.",
    timeline: "Continuous",
    icon: "ShieldCheck",
  },
  {
    stage: "04",
    code: "04 // RELEASE",
    title: "Canary Rollout",
    description:
      "Blue/green traffic switching, automated rollbacks triggered by OpenTelemetry error budget depletion.",
    timeline: "Deterministic",
    icon: "Rocket",
  },
];

// ─── MOCK ENGAGEMENT TIERS ───────────────────────────────────────────────────
export const MOCK_ENGAGEMENT_TIERS: EngagementTier[] = [
  {
    id: "tier-1",
    tier: "Full-Stack Core Pod",
    subtitle: "End-to-End SaaS & Web",
    sla: "99.99% Uptime",
    slaDetail: "<15min incident dispatch",
    composition: "1 Principal + 2 Staff",
    compositionDetail: "0 Junior developers",
    cadence: "Bi-weekly Production Release",
    governance: "SOC2 Type II Harness",
    ctaText: "Configure Pod",
    serviceQuery: "Custom Web & SaaS Engineering",
  },
  {
    id: "tier-2",
    tier: "Cloud Fabric & Mesh",
    subtitle: "Multi-region Kubernetes & Kafka",
    sla: "99.995% Uptime",
    slaDetail: "<5min P1 escalation",
    composition: "2 Principal Cloud Architects",
    compositionDetail: "Kubernetes Certified (CKA)",
    cadence: "Continuous Zero-Downtime CD",
    governance: "mTLS & Zero-Drift IaC",
    ctaText: "Deploy Mesh",
    serviceQuery: "Cloud & API Architecture",
  },
  {
    id: "tier-3",
    tier: "AI Agent Engineering",
    subtitle: "pgvector & LLM Pipelines",
    sla: "<14ms Ingestion Bound",
    slaDetail: "Deterministic token jitter",
    composition: "1 Staff ML Systems + 1 Staff Data",
    compositionDetail: "Distributed inference experts",
    cadence: "Weekly Model Calibration",
    governance: "Prompt Drift & PII Guard",
    ctaText: "Initiate AI",
    serviceQuery: "AI & Workflow Automation",
  },
  {
    id: "tier-4",
    tier: "Architectural Forensics",
    subtitle: "eBPF, Kernel & Security Auditing",
    sla: "100% Finding Guarantee",
    slaDetail: "Exhaustive root-cause bound",
    composition: "Solo Principal Security Fellow",
    compositionDetail: "Direct C-Suite Reporting",
    cadence: "14-Day Delivery Sprint",
    governance: "Pen-Test Hardening Spec",
    ctaText: "Book Forensic",
    serviceQuery: "IT Technical Consultation & Audits",
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
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  phone: process.env.NEXT_PUBLIC_PHONE || "",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  businessHoursStart: 9,
  businessHoursEnd: 18,
  timezone: "Asia/Dhaka",
  callbackPromise: "We reply within 1 business hour",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
  isOpenNow: (() => {
    const now = new Date();
    const h = now.getHours();
    return h >= 9 && h < 18;
  })(),
};

// ─── MOCK JOBS (Only 3 Positions: Full Stack, UI/UX, AI Developer) ───────────
export const MOCK_JOBS: JobItem[] = [
  {
    id: "job-full-stack",
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Dhaka / Remote",
    type: "Full-time",
    workplaceType: "Remote",
    description:
      "Design, build, and deploy high-performance web platforms and full-lifecycle SaaS applications using TypeScript, React, Next.js, and Node.js. You will collaborate directly with software architects on multi-tenant backends, database models, and resilient client-side architectures.",
    skills: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    responsibilities: [
      "Develop responsive, accessible, and performant web applications using Next.js App Router and TypeScript",
      "Build modular RESTful/GraphQL APIs and optimize SQL queries using PostgreSQL and Prisma ORM",
      "Implement robust unit, integration, and end-to-end tests to guarantee high code reliability",
      "Participate actively in architectural reviews, schema design, and asynchronous peer code reviews",
    ],
    requirements: [
      "2+ years of professional full-stack software development experience",
      "Proven proficiency with TypeScript, modern React patterns, and Node.js backend services",
      "Hands-on experience designing relational database schemas and running production migrations",
      "Clear, structured technical communication and autonomous problem-solving capabilities",
    ],
    salary: "Competitive Base + Performance Bonus",
    status: "OPEN",
    createdAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "job-ui-ux",
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design & Product",
    location: "Dhaka / Remote",
    type: "Full-time",
    workplaceType: "Remote",
    description:
      "Craft comprehensive design systems, high-density data visualizations, user workflows, and pixel-precise interactive states for mission-critical software. You will bridge design and code with tokenized Figma architectures and accessible WCAG AA standards.",
    skills: ["Figma", "Design Systems", "Design Tokens", "Wireframing", "Prototyping", "WCAG AA"],
    responsibilities: [
      "Design and maintain scalable Figma design systems with strict 1:1 token alignment with Tailwind CSS",
      "Translate complex technical requirements into elegant user journeys, dashboards, and wireframes",
      "Produce interactive motion prototypes and conduct usability validation with target personas",
      "Collaborate directly with frontend engineers during handoff to ensure fidelity and accessibility",
    ],
    requirements: [
      "2+ years of UI/UX design experience for SaaS, dashboards, or developer-facing products",
      "Expert-level command of Figma, auto-layout, component variants, and interactive prototyping",
      "Solid understanding of design tokens, responsive typography, and accessibility best practices",
      "A strong portfolio demonstrating shipped web or mobile product design systems",
    ],
    salary: "Competitive Base + Performance Bonus",
    status: "OPEN",
    createdAt: "2026-02-18T00:00:00Z",
  },
  {
    id: "job-ai-dev",
    slug: "ai-developer",
    title: "AI Developer",
    department: "AI & Machine Learning",
    location: "Dhaka / Remote",
    type: "Full-time",
    workplaceType: "Remote",
    description:
      "Architect and integrate production-grade LLM applications, retrieval-augmented generation (RAG) pipelines, autonomous agent workflows, and vector embeddings. You will implement deterministic guardrails, optimize inference latency, and build scalable background orchestration.",
    skills: ["Python", "LangChain", "LLM Orchestration", "pgvector", "PyTorch", "FastAPI"],
    responsibilities: [
      "Build and maintain custom LLM agent pipelines, tool-calling systems, and RAG architectures",
      "Implement semantic indexing, hybrid vector retrieval, and prompt drift observability",
      "Establish strict guardrails to prevent hallucinations, enforce schemas, and ensure compliance",
      "Deploy scalable inference services using Python, FastAPI, Docker, and cloud infrastructure",
    ],
    requirements: [
      "2+ years of software development experience with significant focus on AI/ML or LLM systems",
      "Strong Python programming skills and practical experience with LangChain, LlamaIndex, or raw APIs",
      "Experience with vector databases (pgvector, Pinecone, Qdrant) and embedding models",
      "Solid grasp of prompt evaluation, latency benchmarks, and asynchronous pipeline design",
    ],
    salary: "Competitive Base + Performance Bonus",
    status: "OPEN",
    createdAt: "2026-02-20T00:00:00Z",
  },
];

// In-memory store for submitted applications during dev / session
export const IN_MEMORY_APPLICATIONS: SubmittedApplicationItem[] = [];

// ─── ABOUT PAGE TYPES & MOCK DATA ──────────────────────────────────────────
export type AboutGeneralContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  foundingTag: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
  philosophyTitle: string;
  philosophyText: string;
  philosophyStats: Array<{ label: string; value: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  locationEnabled: boolean;
  locationName: string;
  locationAddress: string;
  locationTimezone: string;
  locationStatus: string;
};

export type EngineeringPrincipleItem = {
  id: string;
  orderIndex: number;
  number: string;
  title: string;
  description: string;
  icon: "cpu" | "layers" | "eye" | "shield" | "terminal" | "code";
  supportingLabel: string;
  supportingText: string;
  isPublished: boolean;
};

export type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  initials: string;
  badge?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
};

export const DEFAULT_ABOUT_CONTENT: AboutGeneralContent = {
  heroBadge: "ARCHITECTURAL DOSSIER",
  heroTitle: "Building the Digital Core for a Smarter Tomorrow",
  heroSubtitle:
    "DevCore Solutions is an elite software engineering and systems architecture firm. We reject software bloat and shallow wrappers in favor of rigorous, deterministic engineering and provable fault tolerance.",
  foundingTag: "FOUNDED 2019 • DISTRIBUTED CORE",
  visionTitle: "Our Vision",
  visionText:
    "To set the global benchmark for enterprise software reliability, where downtime is obsolete and system state is mathematically provable across high-throughput distributed boundaries.",
  missionTitle: "Our Mission",
  missionText:
    "To empower ambitious enterprises with custom-tailored, resilient digital platforms engineered with zero bloat, uncompromising type safety, and predictable execution.",
  philosophyTitle: "The Core Philosophy",
  philosophyText:
    "We eliminate organizational friction by embedding verified systems architects and senior engineers directly on the operational frontlines. Every line of code is held to strict verification standards.",
  philosophyStats: [
    { label: "Direct Senior Engineering", value: "100%" },
    { label: "Deterministic SLA Bound", value: "99.9%" },
  ],
  ctaTitle: "Let's Build Something Meaningful",
  ctaSubtitle:
    "Have an idea, a challenge, or a project in mind? Let's discuss how we can turn it into a reliable digital solution.",
  ctaPrimaryText: "Start System Scoping",
  ctaPrimaryUrl: "/contact",
  ctaSecondaryText: "View Open Guild Seats",
  ctaSecondaryUrl: "/careers",
  locationEnabled: true,
  locationName: "Chattogram Engineering Hub",
  locationAddress: "North Agrabad, Chattogram, Bangladesh",
  locationTimezone: "Asia/Dhaka",
  locationStatus: "ONLINE • UTC+6",
};

export const INITIAL_ENGINEERING_PRINCIPLES: EngineeringPrincipleItem[] = [
  {
    id: "principle-1",
    orderIndex: 1,
    number: "01",
    title: "Deterministic Execution",
    description:
      "Systems must exhibit verifiable behavior under network partitions, hardware drops, and cold reboots. No unhandled states, no silent failures.",
    icon: "cpu",
    supportingLabel: "Invariant:",
    supportingText: "state_t == replay(log)",
    isPublished: true,
  },
  {
    id: "principle-2",
    orderIndex: 2,
    number: "02",
    title: "Zero-Drift Architecture",
    description:
      "State replication and schemas must align across distributed edges via CRDTs and WAL persistence with zero manual drift reconciliation.",
    icon: "layers",
    supportingLabel: "Convergence:",
    supportingText: "delta_sync.converge()",
    isPublished: true,
  },
  {
    id: "principle-3",
    orderIndex: 3,
    number: "03",
    title: "Radical Transparency",
    description:
      "Complete client visibility into git commit histories, benchmark logs, and live telemetry. Direct architect collaboration without proxy gatekeepers.",
    icon: "eye",
    supportingLabel: "Pipeline:",
    supportingText: "git log --unredacted",
    isPublished: true,
  },
  {
    id: "principle-4",
    orderIndex: 4,
    number: "04",
    title: "Defense-in-Depth Security",
    description:
      "Cryptographic verification, rigorous input validation, continuous automated audits, and mutual TLS across all microservice boundaries.",
    icon: "shield",
    supportingLabel: "Standard:",
    supportingText: "mTLS + Zero-Trust IAM",
    isPublished: true,
  },
];

export const INITIAL_TEAM_MEMBERS: TeamMemberItem[] = [
  {
    id: "team-1",
    name: "Kazi Mahedi Hasan",
    role: "Founder & Full Stack Developer",
    bio: "Co-founder leading core distributed architecture, scalable cloud systems, and modern full-stack web platforms.",
    initials: "KM",
    badge: "FOUNDER",
    githubUrl: "https://github.com/kazisamin0173-byte",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isFeatured: true,
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: "team-2",
    name: "The Fourkan Bin Ilias",
    role: "Founder & Full Stack Developer",
    bio: "Co-founder focusing on distributed backend infrastructure, microservices reliability, and deterministic database design.",
    initials: "TF",
    badge: "FOUNDER",
    githubUrl: "https://github.com/devcoresolutions2",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isFeatured: true,
    isPublished: true,
    displayOrder: 2,
  },
  {
    id: "team-3",
    name: "Senior Systems Engineer",
    role: "Senior Systems & Cloud Architect",
    bio: "Focuses on event-driven architectures, container mesh reliability, and low-latency API performance.",
    initials: "SE",
    badge: "ENGINEERING",
    githubUrl: "https://github.com/devcoresolutions2",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isFeatured: false,
    isPublished: true,
    displayOrder: 3,
  },
  {
    id: "team-4",
    name: "Lead Product Designer",
    role: "UI/UX Design Specialist",
    bio: "Directs accessible design systems, user workflow ergonomics, and high-fidelity interactive digital experiences.",
    initials: "PD",
    badge: "PRODUCT",
    githubUrl: "https://github.com/devcoresolutions2",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isFeatured: false,
    isPublished: true,
    displayOrder: 4,
  },
  {
    id: "team-5",
    name: "Applied AI Engineer",
    role: "Applied AI & Machine Learning Specialist",
    bio: "Specializes in deterministic prompt architectures, retrieval-augmented systems, and intelligent workflow automation.",
    initials: "AI",
    badge: "AI LAB",
    githubUrl: "https://github.com/devcoresolutions2",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isFeatured: false,
    isPublished: true,
    displayOrder: 5,
  },
];

// Global in-memory mutable stores for runtime admin mutations
export let IN_MEMORY_ABOUT_CONTENT: AboutGeneralContent = { ...DEFAULT_ABOUT_CONTENT };
export let IN_MEMORY_ENGINEERING_PRINCIPLES: EngineeringPrincipleItem[] = [...INITIAL_ENGINEERING_PRINCIPLES];
export let IN_MEMORY_TEAM_MEMBERS: TeamMemberItem[] = [...INITIAL_TEAM_MEMBERS];

// ─── BLOG TYPES & MOCK DATA ───────────────────────────────────────────────────
export type BlogArticleItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  categorySlug: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  authorInitials: string;
  readingMinutes: number;
  readTime: string;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  isFeatured: boolean;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  rfcCode?: string;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
    footnote?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogCategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  isActive: boolean;
};

export type BlogAuthorItem = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  initials: string;
  linkedinUrl?: string;
  githubUrl?: string;
  isActive: boolean;
};

export type NewsletterSubscriberItem = {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  subscribedAt: string;
};

export type BlogHeroConfig = {
  badge: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  showCustomMetrics: boolean;
  metric1Label?: string;
  metric1Value?: string;
  metric2Label?: string;
  metric2Value?: string;
};

export const DEFAULT_BLOG_HERO_CONFIG: BlogHeroConfig = {
  badge: "PEER-REVIEWED RFCS & BENCHMARKS",
  title: "Technical Engineering Blog & System Dispatches",
  description:
    "In-depth case breakdowns, distributed consensus proofs, kernel tuning notes, and zero-drift platform architectures from our engineering founders and fellows.",
  breadcrumbLabel: "Architectural Dispatches",
  showCustomMetrics: false,
};

export const INITIAL_BLOG_CATEGORIES: BlogCategoryItem[] = [
  { id: "cat-1", name: "All Articles", slug: "all", count: 5, isActive: true },
  { id: "cat-2", name: "Distributed Systems", slug: "distributed-systems", count: 2, isActive: true },
  { id: "cat-3", name: "Kernel & eBPF", slug: "kernel-ebpf", count: 1, isActive: true },
  { id: "cat-4", name: "AI & Automation", slug: "ai-automation", count: 1, isActive: true },
  { id: "cat-5", name: "Cloud & DevOps", slug: "cloud-devops", count: 1, isActive: true },
];

export const INITIAL_BLOG_AUTHORS: BlogAuthorItem[] = [
  {
    id: "auth-1",
    name: "Kazi Mahedi Hasan",
    role: "Founder & Full Stack Developer",
    bio: "Directs full-stack architecture, high-concurrency API gateways, and distributed database reliability.",
    initials: "KM",
    githubUrl: "https://github.com/kazisamin0173-byte",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isActive: true,
  },
  {
    id: "auth-2",
    name: "The Fourkan Bin Ilias",
    role: "Founder & Full Stack Developer",
    bio: "Focuses on microservices orchestration, low-latency networking, and deterministic cloud infrastructure.",
    initials: "TF",
    githubUrl: "https://github.com/devcoresolutions2",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isActive: true,
  },
  {
    id: "auth-3",
    name: "Senior Systems Engineer",
    role: "Senior Cloud & Systems Architect",
    bio: "Specializes in multi-region PostgreSQL topologies, eBPF telemetry, and container mesh reliability.",
    initials: "SE",
    githubUrl: "https://github.com/devcoresolutions2",
    linkedinUrl: "https://www.linkedin.com/company/devcoresolutions2",
    isActive: true,
  },
];

export const INITIAL_BLOG_ARTICLES: BlogArticleItem[] = [
  {
    id: "article-1",
    slug: "eliminating-cloud-drift-sqlite-wal-crdt",
    title: "Eliminating Cloud Drift: Implementing Offline-First SQLite WAL & CRDT Gossiping at Scale",
    subtitle: "How DevCore removed cloud uptime dependencies for local nodes with embedded Go and WAL sync.",
    excerpt:
      "How DevCore removed cloud uptime dependencies for distributed physical nodes by packaging a lightweight Go daemon with SQLite Write-Ahead Logging (WAL) and peer-to-peer state vector gossip.",
    category: "Distributed Systems",
    categorySlug: "distributed-systems",
    authorId: "auth-1",
    authorName: "Kazi Mahedi Hasan",
    authorRole: "Founder & Full Stack Developer",
    authorInitials: "KM",
    readingMinutes: 14,
    readTime: "14 min read",
    status: "PUBLISHED",
    isFeatured: true,
    publishedAt: "2026-02-15T00:00:00Z",
    tags: ["Distributed Systems", "SQLite", "CRDT", "Go", "Offline-First"],
    rfcCode: "RFC-0842-REV3",
    codeSnippet: {
      filename: "crdt_wal_mesh.go",
      language: "go",
      code: `// VectorClock deterministic state merge protocol
func (n *Node) ReconcileCRDT(remote *LogEntry) error {
    if n.VectorClock.HappenedBefore(remote.Clock) {
        return n.walWriter.ApplyDeterministic(remote.Payload)
    }
    return n.gossipPeerSync(remote)
}`,
      footnote: "Deterministic Replay: 0.18ms • Sync Drift: 0.000%",
    },
    seoTitle: "Eliminating Cloud Drift with SQLite WAL & CRDTs — DevCore",
    seoDescription:
      "A technical deep dive into deterministic offline-first synchronization using SQLite Write-Ahead Logging and CRDT vector clocks.",
    content: `## Executive Overview

Modern distributed client installations—such as hospitality Point-of-Sale (POS) systems, edge IoT controllers, and field service consoles—frequently encounter temporary network partitions. When an application assumes synchronous round-trips to a centralized cloud database, any transient network degradation causes user-visible freezes or catastrophic data drift.

At **DevCore Solutions**, we architected an offline-first data replication pipeline for high-throughput venues that ensures zero data loss and sub-millisecond local latency even during complete internet blackouts.

---

## The Architectural Challenge

Traditional cloud-dependent setups present three fatal failure modes:

1. **Synchronous Cloud Coupling**: If the uplink drops, order placement or transaction checkout halts immediately.
2. **Asymmetric State Conflicts**: When two offline registers concurrently update the same inventory item or table state, naive "last-write-wins" timestamps overwrite critical mutations.
3. **Write Amplification on Reconnect**: When network connectivity restores after a 45-minute outage, a burst of batched HTTP POST requests overwhelms the backend API gateway.

---

## The Solution: Embedded SQLite WAL + P2P Gossiping

We resolved this by deploying an embedded Go daemon alongside each local terminal. Rather than communicating directly with remote cloud APIs, every read and write operation commits locally to an embedded SQLite instance operating in **Write-Ahead Logging (WAL)** mode.

\`\`\`go
// VectorClock deterministic state merge protocol
func (n *Node) ReconcileCRDT(remote *LogEntry) error {
    if n.VectorClock.HappenedBefore(remote.Clock) {
        return n.walWriter.ApplyDeterministic(remote.Payload)
    }
    return n.gossipPeerSync(remote)
}
\`\`\`

### 1. Conflict-Free Replicated Data Types (CRDTs)
Each database row is modeled with deterministic State-based or Operation-based CRDT semantics:
- **Observed-Remove Sets (OR-Set)** for dining items, orders, and seat assignments.
- **Positive-Negative Counters (PN-Counter)** for real-time inventory balances.
- **Lamport Vector Clocks** tracking causal precedence across nodes.

### 2. Local-Area UDP Mesh Gossip
If the venue's internet uplink fails, nodes on the local Wi-Fi or Ethernet switch continue communicating directly over a peer-to-peer UDP broadcast mesh. When terminal A completes an order, terminal B and the kitchen display controller receive the mutation in under **2 milliseconds**, regardless of whether the external ISP is operational.

---

## Results & Operational Learnings

- **0% Transaction Drop Rate**: Peak hour connectivity loss no longer disrupts front-of-house operations.
- **Sub-Millisecond Execution**: Local SQLite write latency averaged **0.18ms**, delivering a fluid user interface.
- **Deterministic Reconciliation**: When cloud connectivity resumed, over 10,000 offline mutations merged without human reconciliation intervention.`,
  },
  {
    id: "article-2",
    slug: "achieving-high-throughput-ebpf-socket-filters",
    title: "Achieving High-Throughput Edge Performance with Linux Kernel eBPF Socket Filters",
    subtitle: "Bypassing standard socket buffer copies directly at the network interface layer.",
    excerpt:
      "Bypassing standard socket buffer copies directly at the network interface layer to accelerate distributed consensus messaging on commodity server clusters.",
    category: "Kernel & eBPF",
    categorySlug: "kernel-ebpf",
    authorId: "auth-2",
    authorName: "The Fourkan Bin Ilias",
    authorRole: "Founder & Full Stack Developer",
    authorInitials: "TF",
    readingMinutes: 12,
    readTime: "12 min read",
    status: "PUBLISHED",
    isFeatured: false,
    publishedAt: "2026-02-10T00:00:00Z",
    tags: ["Kernel", "eBPF", "Linux", "Networking", "Performance"],
    rfcCode: "RFC-0711-REV1",
    seoTitle: "Linux eBPF Socket Filters for High-Throughput Edge Nodes — DevCore",
    seoDescription:
      "How to use eBPF socket filters and XDP programs to bypass kernel memory overhead in high-throughput microservices.",
    content: `## Motivation: Kernel Network Stack Overhead

In high-concurrency microservice architectures, traditional socket I/O incurs significant overhead due to memory allocation, kernel-to-userspace copies, and context switches. When processing hundreds of thousands of small consensus packets per second, these overheads dominate CPU time.

---

## eBPF Socket Programs

Extended Berkeley Packet Filter (eBPF) allows verified sandboxed programs to execute directly within the Linux kernel in response to system calls and network events.

By attaching eBPF programs to **eXpress Data Path (XDP)** hooks and **sockops** hooks, we filter, inspect, and route packets before they reach the heavier layers of the TCP/IP network stack:

\`\`\`c
SEC("sockops")
int bpf_sockmap_forward(struct bpf_sock_ops *skops) {
    if (skops->op == BPF_SOCK_OPS_PASSIVE_ESTABLISHED_CB ||
        skops->op == BPF_SOCK_OPS_ACTIVE_ESTABLISHED_CB) {
        bpf_sock_ops_ipv4(skops);
    }
    return 0;
}
\`\`\`

---

## Key Benefits
1. **Zero-Copy Forwarding**: Direct kernel sockmap redirects avoid userspace socket roundtrips.
2. **Predictable Tail Latency**: Drastic reduction in P99 latency spikes during packet bursts.
3. **Safe Runtime Programmability**: The in-kernel eBPF verifier guarantees programs cannot cause kernel panics or infinite loops.`,
  },
  {
    id: "article-3",
    slug: "deterministic-guardrails-enterprise-llm-schemas",
    title: "Deterministic Guardrails for Enterprise LLMs: Mitigating Semantic Drift under Strict Schemas",
    subtitle: "Context-free grammar constraints and embedding projection fences.",
    excerpt:
      "Employing context-free grammar constraints and embedding projection fences to guarantee deterministic, zero-hallucination JSON schema output.",
    category: "AI & Automation",
    categorySlug: "ai-automation",
    authorId: "auth-1",
    authorName: "Kazi Mahedi Hasan",
    authorRole: "Founder & Full Stack Developer",
    authorInitials: "KM",
    readingMinutes: 10,
    readTime: "10 min read",
    status: "PUBLISHED",
    isFeatured: false,
    publishedAt: "2026-01-28T00:00:00Z",
    tags: ["AI", "LLM", "Prompt Engineering", "Validation", "TypeScript"],
    rfcCode: "RFC-0914-REV2",
    seoTitle: "Deterministic Guardrails for Enterprise LLMs — DevCore",
    seoDescription:
      "Technical implementation patterns to force Large Language Models into strict schemas with zero hallucinations.",
    content: `## The Enterprise Challenge of LLM Output Drift

Large Language Models (LLMs) are probabilistic token generators by design. While exceptional at synthesizing unstructured text, deploying them within enterprise operational pipelines requires **100% deterministic schema conformance**.

If an LLM produces a single missing comma, unexpected null, or invented JSON key, downstream database insertions and webhook dispatchers fail.

---

## Dual-Layer Guardrail Architecture

At DevCore, we enforce a two-stage deterministic verification pipeline:

1. **Constrained Grammar Decoding**: At the inference token sampler level, tokens that violate the target JSON schema or BNF grammar are dynamically assigned $-\\infty$ logit probability, making malformed outputs mathematically impossible.
2. **Strict Zod Runtime Validation**: Every response is piped through strict TypeScript Zod schemas with sanitization and type coercion fallbacks.

\`\`\`typescript
import { z } from "zod";

export const EnterpriseDispatchSchema = z.object({
  action: z.enum(["NOTIFY_CLIENT", "SCHEDULE_TASK", "ESCALATE_INCIDENT"]),
  targetId: z.string().cuid(),
  confidence: z.number().min(0.0).max(1.0),
  parameters: z.record(z.string(), z.any()),
});
\`\`\`

---

## Key Takeaways
- Never accept raw unstructured markdown from LLMs in enterprise production pipelines.
- Combine logit masking, schema enforcement, and strongly-typed compiler verification.`,
  },
  {
    id: "article-4",
    slug: "multi-tenant-postgres-isolation-benchmarks",
    title: "Multi-Tenant PostgreSQL Isolation: Row-Level Security vs Schema-per-Tenant Tradeoffs",
    subtitle: "Empirical memory consumption, cache hit ratios, and connection pool thresholds.",
    excerpt:
      "Empirical memory consumption, cache hit ratios, and connection pool exhaustion thresholds measured across multi-tenant database clusters.",
    category: "Distributed Systems",
    categorySlug: "distributed-systems",
    authorId: "auth-3",
    authorName: "Senior Systems Engineer",
    authorRole: "Senior Cloud & Systems Architect",
    authorInitials: "SE",
    readingMinutes: 11,
    readTime: "11 min read",
    status: "PUBLISHED",
    isFeatured: false,
    publishedAt: "2026-01-14T00:00:00Z",
    tags: ["PostgreSQL", "Multi-Tenancy", "Databases", "Performance"],
    rfcCode: "RFC-0650-REV4",
    seoTitle: "PostgreSQL Multi-Tenancy Benchmarks — DevCore",
    seoDescription:
      "Detailed architectural evaluation of Row-Level Security vs schema-per-tenant isolation in enterprise PostgreSQL.",
    content: `## Architectural Overview

When designing a modern SaaS platform, deciding how to isolate tenant data is one of the most critical structural decisions. The two primary patterns in PostgreSQL are:

1. **Row-Level Security (RLS)**: Shared tables where every row contains a \`tenant_id\` column enforced by Postgres policies.
2. **Schema-per-Tenant**: Separate PostgreSQL schemas inside a single database instance.

---

## Benchmarking Results

| Metric | Row-Level Security (RLS) | Schema-per-Tenant |
| :--- | :--- | :--- |
| **Catalog Memory Overhead** | Fixed (~24MB) | Scales with tenant count (~1.2GB at 1,000 tenants) |
| **Migration Velocity** | Fast (single migration) | Linear slowdown (iterates across $N$ schemas) |
| **Connection Pooling** | High reuse efficiency | Pool fragmentation across schemas |
| **Data Leak Isolation** | Policy-level guarantee | Schema namespace boundary |

---

## Conclusion
For most modern multi-tenant cloud platforms, **PostgreSQL Row-Level Security paired with connection pooling** delivers the optimal balance of memory efficiency, fast migration deployment, and strict cryptographic isolation.`,
  },
  {
    id: "article-5",
    slug: "zero-copy-cloud-microservices-topologies",
    title: "Zero-Copy Networking Topologies in Modern Cloud Microservices",
    subtitle: "Streamlining inter-service communication overhead using shared memory and gRPC.",
    excerpt:
      "Streamlining inter-service communication overhead using shared memory ring buffers and gRPC streaming protocols.",
    category: "Cloud & DevOps",
    categorySlug: "cloud-devops",
    authorId: "auth-2",
    authorName: "The Fourkan Bin Ilias",
    authorRole: "Founder & Full Stack Developer",
    authorInitials: "TF",
    readingMinutes: 8,
    readTime: "8 min read",
    status: "PUBLISHED",
    isFeatured: false,
    publishedAt: "2025-12-20T00:00:00Z",
    tags: ["Microservices", "gRPC", "Cloud", "Zero-Copy", "Docker"],
    rfcCode: "RFC-0544-REV1",
    seoTitle: "Zero-Copy Microservices Networking — DevCore",
    seoDescription:
      "Strategies to reduce serialization and buffer copy overhead in distributed cloud services.",
    content: `## The Microservices Serialization Tax

As enterprise architectures decompose monolithic applications into microservice meshes, services spend an increasing percentage of their CPU cycles serializing, marshaling, and deserializing JSON payloads over TCP sockets.

---

## Architectural Strategy: gRPC & FlatBuffers

By shifting high-throughput inter-service communication to **gRPC with HTTP/2 multiplexing** and binary protocol buffers, we achieve:

1. **Compact Wire Footprint**: Binary protocol encoding reduces bandwidth consumption by 60% compared to equivalent verbose JSON.
2. **Compile-Time Type Contracts**: Strict Protobuf schemas prevent breaking changes across independent engineering teams.
3. **Bidirectional Streaming**: Eliminates repeated handshake negotiation for continuous telemetry and events.`,
  },
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriberItem[] = [
  {
    id: "sub-1",
    email: "dev.core.solution2@gmail.com",
    status: "ACTIVE",
    subscribedAt: "2026-02-01T12:00:00Z",
  },
];

// Global in-memory mutable stores for Blog CMS runtime
export let IN_MEMORY_BLOG_HERO_CONFIG: BlogHeroConfig = { ...DEFAULT_BLOG_HERO_CONFIG };
export let IN_MEMORY_BLOG_CATEGORIES: BlogCategoryItem[] = [...INITIAL_BLOG_CATEGORIES];
export let IN_MEMORY_BLOG_AUTHORS: BlogAuthorItem[] = [...INITIAL_BLOG_AUTHORS];
export let IN_MEMORY_BLOG_ARTICLES: BlogArticleItem[] = [...INITIAL_BLOG_ARTICLES];
export let IN_MEMORY_SUBSCRIBERS: NewsletterSubscriberItem[] = [...INITIAL_SUBSCRIBERS];


