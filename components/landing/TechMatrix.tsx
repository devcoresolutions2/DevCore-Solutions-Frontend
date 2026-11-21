"use client";

import { useState } from "react";
import { Binary } from "lucide-react";
import { ReleasePill } from "@/components/glass/ReleasePill";
import { GlassCard } from "@/components/glass/GlassCard";
import { cn } from "@/lib/utils";

const TABS = ["Frontend", "Backend", "Databases", "Cloud & DevOps", "AI & ML"] as const;
type Tab = (typeof TABS)[number];

const STACK_DATA: Record<Tab, { name: string; level: number; desc: string }[]> = {
  Frontend: [
    { name: "React 18 / 19", level: 100, desc: "Modern concurrent mode, server components, design token architecture." },
    { name: "TypeScript", level: 100, desc: "Strict typing across all interfaces, end-to-end type safety with Zod." },
    { name: "Next.js (App Router)", level: 70, desc: "High-scale hybrid rendering, edge middleware, dynamic streaming layouts." },
    { name: "Web Workers / WASM", level: 45, desc: "Offloading heavy in-browser computation and client cryptographic signing." },
  ],
  Backend: [
    { name: "Go (Golang)", level: 100, desc: "High-concurrency daemons, network routing engines, microservice nodes." },
    { name: "Node.js / Bun", level: 70, desc: "Event-driven I/O APIs, orchestration layers, webhook ingestion bridges." },
    { name: "Rust", level: 45, desc: "Zero-overhead memory safety kernels and ultra-low latency data protocols." },
    { name: "Elixir / OTP", level: 25, desc: "Fault-tolerant distributed telecommunications and stateful WebSockets." },
  ],
  Databases: [
    { name: "PostgreSQL", level: 100, desc: "Primary relational transactional backbone with pgvector and schema migrations." },
    { name: "Redis Cluster", level: 70, desc: "Sub-millisecond memory caching, session storage, distributed rate-limiting." },
    { name: "ClickHouse", level: 45, desc: "Columnar store for high-volume logs, telemetry time-series, and reporting." },
    { name: "Vector Stores (Qdrant)", level: 25, desc: "High-dimensional vector indexing and semantic retrieval workloads." },
  ],
  "Cloud & DevOps": [
    { name: "Kubernetes (EKS/GKE)", level: 100, desc: "Declarative cluster orchestration, ingress traffic routing, auto-scaling." },
    { name: "Terraform / OpenTofu", level: 70, desc: "Reproducible cloud resources with version-controlled state modules." },
    { name: "GitHub Actions / Argo", level: 45, desc: "GitOps continuous delivery with automated canary verification checks." },
    { name: "eBPF / Cilium", level: 25, desc: "Kernel-level networking observability, mTLS encryption without sidecars." },
  ],
  "AI & ML": [
    { name: "RAG & Embeddings", level: 100, desc: "Enterprise semantic search and grounded document extraction workflows." },
    { name: "LangChain / LlamaIndex", level: 70, desc: "Multi-agent orchestrations with strict deterministic tool calling schemas." },
    { name: "vLLM / Self-Hosted", level: 45, desc: "Private GPU hosting on sovereign VPC infrastructure for strict data privacy." },
    { name: "Fine-Tuning LoRA", level: 25, desc: "Domain-adapted lightweight adapter weights for proprietary syntax & tasks." },
  ],
};

const LEVEL_LABELS: Record<number, string> = { 100: "Core", 70: "Standard", 45: "Specialized", 25: "Emerging" };

export function TechMatrix() {
  const [activeTab, setActiveTab] = useState<Tab>("Frontend");

  return (
    <section
      id="tech-matrix"
      aria-labelledby="tech-heading"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <ReleasePill>
          <Binary size={13} aria-hidden="true" />
          &nbsp;CURATED STACK PROFICIENCY
        </ReleasePill>
        <h2
          id="tech-heading"
          className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] mt-3 tracking-tight"
        >
          Enterprise Technology Matrix
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Tiered by production deployment frequency: Core (100%), Standard (70%), Specialized (45%), Emerging (25%).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10" role="tablist" aria-label="Technology categories">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2.5 rounded-lg border text-xs font-semibold font-mono transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-1",
              activeTab === tab
                ? "bg-[var(--brand-primary)] text-[var(--brand-contrast)] border-[var(--brand-primary)]"
                : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Panel */}
      <GlassCard className="p-8 border border-[var(--border-subtle)] max-w-5xl mx-auto">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-[var(--border-subtle)] gap-4">
          <span className="font-mono text-xs text-[var(--text-muted)]">Stack Maturity Levels:</span>
          <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
            {Object.entries(LEVEL_LABELS).map(([level, label]) => (
              <span key={level} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: `rgba(84, 101, 113, ${Number(level) / 100})` }}
                  aria-hidden="true"
                />
                {level}% {label}
              </span>
            ))}
          </div>
        </div>

        {TABS.map((tab) => (
          <div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            hidden={activeTab !== tab}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STACK_DATA[tab].map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[var(--bg-surface)] mb-3">
                  <span className="font-bold text-[var(--text-primary)]">{item.name}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[var(--brand-contrast)] text-[10px]"
                    style={{ backgroundColor: `rgba(84, 101, 113, ${item.level / 100})` }}
                    aria-label={`${item.level}% — ${LEVEL_LABELS[item.level]}`}
                  >
                    {item.level}%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        ))}
      </GlassCard>
    </section>
  );
}
