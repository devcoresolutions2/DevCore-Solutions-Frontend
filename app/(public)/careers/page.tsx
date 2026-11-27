import type { Metadata } from "next";
import { getJobs } from "@/lib/api";
import { CareersHero } from "@/components/careers/CareersHero";
import { WhyBuildAtDevCore } from "@/components/careers/WhyBuildAtDevCore";
import { CareersContent } from "@/components/careers/CareersContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Open Roles — DevCore Solutions",
  description:
    "Join surgical engineering squads of systems practitioners delivering mission-critical cloud infrastructure, full-stack platforms, and autonomous AI systems.",
};

export default async function CareersPage() {
  const jobs = await getJobs({ status: "OPEN" });

  return (
    <div className="w-full flex flex-col gap-4 pb-12 animate-fadeIn">
      {/* SECTION 1: HERO & VALUE PROPOSITION */}
      <CareersHero totalJobs={jobs.length} />

      {/* SECTION 2: WHY BUILD AT DEVCORE */}
      <WhyBuildAtDevCore />

      {/* SECTION 3: OPEN ROLES, PROTOCOL, & APPLICATION FORM */}
      <CareersContent jobs={jobs} />
    </div>
  );
}
