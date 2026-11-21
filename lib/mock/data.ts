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
    slug: "dinedesk-enterprise",
    name: "DineDesk Enterprise",
    tagline: "Real-Time Restaurant Operating System",
    category: "SaaS",
    badge: "FLAGSHIP",
    launchedAt: "2024-08-01",
    version: "3.1",
    description:
      "DevCore engineered DineDesk from PRD to production: an ultra-low-latency POS and order routing architecture running on edge-cached local nodes. If the internet drops, kitchen lines and payment registers continue operating with zero disruption across 800+ franchise locations.",
    techStack: ["React Native", "Node.js Cluster", "PostgreSQL", "Redis Pub/Sub", "ESC/POS Drivers"],
    liveUrl: "#",
    caseStudySlug: "dinedesk-enterprise",
    isFeatured: true,
    metrics: [
      { label: "Peak Orders / Sec", value: "4,820 ops" },
      { label: "Offline Sync", value: "100% Reconciled" },
      { label: "KDS Ticket Routing", value: "< 85ms" },
    ],
  },
  {
    id: "2",
    slug: "gamevault-ledger",
    name: "GameVault Ledger",
    tagline: "Cryptographic Digital Escrow Engine",
    category: "SaaS",
    badge: "FINTECH",
    launchedAt: "2024-11-01",
    version: "2.9",
    description:
      "A multi-tenant asset registry and escrow clearinghouse designed for multi-million concurrent player economies with strict deterministic ledger verification and multi-sig hardware security module integrations.",
    techStack: ["Go / Golang", "CockroachDB", "AWS KMS", "OpenTelemetry", "Docker"],
    liveUrl: "#",
    caseStudySlug: "gamevault-ledger",
    isFeatured: true,
    metrics: [
      { label: "Settlement Time", value: "210ms avg" },
      { label: "Monthly Volume", value: "$48.2M Cleared" },
      { label: "Double-Spend Protection", value: "Deterministic 0%" },
    ],
  },
  {
    id: "3",
    slug: "omnicore-distributed-mesh",
    name: "OmniCore Distributed Mesh",
    tagline: "Multi-Region Cloud Fabric for High-Frequency Logistics",
    category: "Enterprise Web",
    badge: "NEW",
    launchedAt: "2024-10-01",
    version: "4.2",
    description:
      "Architected an asynchronous, globally distributed messaging core coordinating over 3 million autonomous freight units with sub-millisecond edge synchronization and zero data loss across hostile networking topologies.",
    techStack: ["Rust", "gRPC", "Kubernetes", "ClickHouse", "Apache Kafka"],
    liveUrl: "#",
    caseStudySlug: "omnicore-distributed-mesh",
    isFeatured: false,
    metrics: [
      { label: "Global Edge Latency P99", value: "< 1.2ms" },
      { label: "Active Connected Units", value: "3.4M+" },
      { label: "Packet Loss", value: "Zero" },
    ],
  },
];

// ─── MOCK PROJECTS ───────────────────────────────────────────────────────────
export const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: "1",
    slug: "dinedesk-enterprise",
    name: "DineDesk Enterprise",
    tagline: "Real-Time Restaurant Operating System",
    category: "SaaS",
    challenge:
      "800+ franchise locations needed offline-first POS that keeps kitchen lines and payments running even when internet drops. Legacy TCP solutions introduced 4,000ms+ latency causing order chaos during peak hours.",
    solution:
      "Built a local-first edge architecture using embedded SQLite in WAL mode with deterministic sync. The system uses WebSockets for real-time kitchen display routing and ESC/POS printer drivers for zero-latency ticket printing.",
    features: [
      "Offline-first order management with 100% reconciliation",
      "Real-time kitchen display system (KDS) routing under 85ms",
      "ESC/POS thermal printer integration across 800+ venues",
      "Multi-location inventory sync with conflict resolution",
      "Real-time table occupancy and reservation management",
    ],
    impact: [
      { label: "Peak Orders / Sec", value: "4,820" },
      { label: "Offline Sync Success", value: "100%" },
      { label: "KDS Ticket Time", value: "< 85ms" },
      { label: "Franchise Locations", value: "800+" },
    ],
    techStack: ["React Native", "Node.js Cluster", "PostgreSQL Partitioning", "Redis Pub/Sub", "SQLite WAL", "ESC/POS Drivers"],
    testimonial: {
      quote: "DevCore's local-first database replication eliminated our Friday evening service slowdowns entirely.",
      author: "Arjun Kapoor",
      role: "Founder & CEO, DineDesk",
    },
    liveUrl: "#",
  },
  {
    id: "2",
    slug: "gamevault-ledger",
    name: "GameVault Ledger",
    tagline: "Cryptographic Digital Escrow Engine",
    category: "SaaS",
    challenge:
      "Gaming platform with millions of concurrent players needed micro-settlement processing with sub-second clearing, zero double-spend risk, and deterministic audit trails for regulatory compliance.",
    solution:
      "Engineered a multi-tenant cryptographic vault using Go with CockroachDB for globally distributed ACID transactions. Multi-sig HSM integrations via AWS KMS ensure no single point of compromise.",
    features: [
      "Sub-second escrow settlement at scale",
      "Multi-sig HSM key management via AWS KMS / CloudHSM",
      "Deterministic double-spend prevention",
      "Real-time audit trail with OpenTelemetry tracing",
      "Multi-tenant asset registry with RBAC",
    ],
    impact: [
      { label: "Settlement Speed", value: "210ms" },
      { label: "Monthly Volume Cleared", value: "$48.2M" },
      { label: "Double-Spend Incidents", value: "0" },
      { label: "Audit Quarters", value: "14" },
    ],
    techStack: ["Go / Golang", "CockroachDB", "AWS KMS / CloudHSM", "OpenTelemetry", "Docker Swarm"],
    testimonial: {
      quote: "Zero reconciliation anomalies across 14 consecutive quarters of heavy player trading volume.",
      author: "Head of Risk, GameVault",
      role: "Head of Risk",
    },
    liveUrl: "#",
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
