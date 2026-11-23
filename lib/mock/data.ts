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
