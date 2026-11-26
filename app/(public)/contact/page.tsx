import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight, Clock, ShieldCheck, Zap } from "lucide-react";
import { getContactSettings, getServices, getShowcaseList } from "@/lib/api";
import { EstimatorForm } from "@/components/contact/EstimatorForm";
import { QuickChannelsPanel } from "@/components/contact/QuickChannelsPanel";

export const metadata: Metadata = {
  title: "Start a Project — Engineering Estimator & Technical Scoping",
  description:
    "Direct technical engagement with DevCore Solutions systems architects. Estimate your project scope, budget, and timeline with guaranteed response within 1 business hour.",
};

interface ContactPageProps {
  searchParams: Promise<{ project?: string; service?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { project, service } = await searchParams;
  const [settings, services, showcase] = await Promise.all([
    getContactSettings(),
    getServices(),
    getShowcaseList({ limit: 4 }),
  ]);

  return (
    <div className="w-full min-h-[calc(100vh-20rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-6">
        <Link href="/" className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} className="text-[var(--brand-primary)]" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">Contact</span>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">Project Estimator</span>
      </nav>

      {/* Header Region */}
      <section className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            Enterprise Ingestion &bull; Scoping
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-2">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              Initiate Engineering Discovery & Project Scoping
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Direct technical engagement with principal software architects. We analyze system architecture, database performance, and API topologies without sales intermediary delays.
            </p>
          </div>

          {/* Header KPI Stat Cards (only rendered when values exist) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {settings.callbackPromise && (
              <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    Response SLA
                  </span>
                  <span className="font-display font-bold text-sm text-[var(--text-primary)] mt-0.5 block">
                    {settings.callbackPromise}
                  </span>
                </div>
                <Zap size={20} className="text-[var(--brand-primary)]" />
              </div>
            )}

            {settings.timezone && (
              <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    Timezone
                  </span>
                  <span className="font-display font-bold text-sm text-[var(--text-primary)] mt-0.5 block">
                    {settings.timezone}
                  </span>
                </div>
                <Clock size={20} className="text-[var(--brand-primary)]" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Dual-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 of 12 cols): Multi-step Project Estimator */}
        <div className="lg:col-span-8">
          <EstimatorForm
            settings={settings}
            servicesList={services}
            relatedItems={showcase.items}
            initialProject={project}
            initialService={service}
          />
        </div>

        {/* Right Column (4 of 12 cols): Direct Channels & Fast Dispatch */}
        <div className="lg:col-span-4">
          <QuickChannelsPanel
            settings={settings}
            pageTitle="DevCore Solutions Contact Page"
          />
        </div>
      </div>
    </div>
  );
}
