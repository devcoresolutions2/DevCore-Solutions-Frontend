import type { Metadata } from "next";
import {
  getServices,
  getLifecycleStages,
  getEngagementTiers,
  getContactSettings,
} from "@/lib/api";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesBento } from "@/components/services/ServicesBento";
import { EngineeringLifecycle } from "@/components/services/EngineeringLifecycle";
import { EngagementMatrix } from "@/components/services/EngagementMatrix";
import { ServicesCTA } from "@/components/services/ServicesCTA";

export const metadata: Metadata = {
  title: "Engineered Services & Architectural Capabilities — DevCore Solutions",
  description:
    "Rigorous engineering squads delivering mission-critical cloud infrastructure, high-throughput distributed systems, and deterministic AI pipelines with mathematically bounded latency.",
};

export default async function ServicesPage() {
  const [services, lifecycleStages, engagementTiers, contactSettings] =
    await Promise.all([
      getServices(),
      getLifecycleStages(),
      getEngagementTiers(),
      getContactSettings(),
    ]);

  return (
    <div className="w-full flex flex-col gap-6 pb-8 animate-fadeIn">
      {/* SECTION 1: HEADER & TELEMETRY KPI BANNER */}
      <ServicesHero />

      {/* SECTION 2: THE 5 CORE ARCHITECTURAL DISCIPLINES (BENTO GRID) */}
      <ServicesBento services={services} />

      {/* SECTION 3: ENGINEERING LIFECYCLE & TELEMETRY */}
      <EngineeringLifecycle stages={lifecycleStages} />

      {/* SECTION 4: SERVICE ENGAGEMENT MATRIX TABLE */}
      <EngagementMatrix tiers={engagementTiers} />

      {/* SECTION 5: FINAL CTA BANNER */}
      <ServicesCTA settings={contactSettings} />
    </div>
  );
}
