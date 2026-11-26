import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { NewLaunches } from "@/components/landing/NewLaunches";
import { BentoProof } from "@/components/landing/BentoProof";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { FlagshipSpotlight } from "@/components/landing/FlagshipSpotlight";
import { TechMatrix } from "@/components/landing/TechMatrix";
import { ProcessTimeline } from "@/components/landing/ProcessTimeline";
import { Testimonials } from "@/components/landing/Testimonials";
import { TalkToUsBanner } from "@/components/landing/TalkToUsBanner";
import {
  getShowcaseList,
  getServices,
  getTestimonials,
  getContactSettings,
  getBentoProof,
} from "@/lib/api";
import { SloganManifestoSection } from "@/components/landing/SloganManifestoSection";
import { CuratedTechVideosSection } from "@/components/landing/CuratedTechVideosSection";
import { EcosystemMarqueeSection } from "@/components/landing/EcosystemMarqueeSection";

export const metadata: Metadata = {
  title: "DevCore Solutions — Building the Digital Core for a Smarter Tomorrow",
  description:
    "Full-stack software engineering studio. We build mission-critical SaaS platforms, cloud infrastructure, AI automation, and enterprise web applications.",
};

export default async function HomePage() {
  const [showcaseResult, services, testimonials, contactSettings, bentoProof] = await Promise.all([
    getShowcaseList({ limit: 3 }),
    getServices(),
    getTestimonials(),
    getContactSettings(),
    getBentoProof(),
  ]);

  const { items: showcaseItems } = showcaseResult;

  // Newest release for the hero pill
  const newestRelease = showcaseItems.find((s) => s.badge === "NEW") ?? showcaseItems[0] ?? null;

  // Featured items for flagship spotlight
  const flagshipItems = showcaseItems.filter((s) => s.isFeatured).slice(0, 2);

  return (
    <>
      <Hero newestRelease={newestRelease} />
      <SloganManifestoSection></SloganManifestoSection>
      <CuratedTechVideosSection></CuratedTechVideosSection>
      <EcosystemMarqueeSection></EcosystemMarqueeSection>
      <NewLaunches items={showcaseItems} />
      <BentoProof items={bentoProof} />
      <ServicesGrid services={services} />
      <FlagshipSpotlight items={flagshipItems.length > 0 ? flagshipItems : showcaseItems.slice(0, 2)} />
      <TechMatrix />
      <ProcessTimeline />
      <Testimonials items={testimonials} />
      <TalkToUsBanner settings={contactSettings} />
    </>
  );
}