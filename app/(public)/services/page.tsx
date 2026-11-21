import type { Metadata } from "next";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { getServices } from "@/lib/api";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { TalkToUsBanner } from "@/components/landing/TalkToUsBanner";
import { getContactSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Engineering Services & Architecture Consultation",
  description: "Specialized engineering disciplines for scaled software platforms, cloud infrastructure, and AI workflow automation.",
};

export default async function ServicesPage() {
  const [services, contactSettings] = await Promise.all([
    getServices(),
    getContactSettings(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] mb-8">
        <Link href="/" className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-primary)] font-medium">Services</span>
      </nav>

      {/* Services Grid */}
      <ServicesGrid services={services} />

      {/* Pre-footer talk banner */}
      <div className="mt-12">
        <TalkToUsBanner settings={contactSettings} />
      </div>
    </div>
  );
}
