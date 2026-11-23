"use client";

import { AboutHero } from "./AboutHero";
import { VisionMission } from "./VisionMission";
import { CorePhilosophy } from "./CorePhilosophy";
import { EngineeringPrinciples } from "./EngineeringPrinciples";
import { TeamSection } from "./TeamSection";
import { OperationalHubs } from "./OperationalHubs";
import { AboutCTA } from "./AboutCTA";
import type {
  AboutGeneralContent,
  EngineeringPrincipleItem,
  TeamMemberItem,
} from "@/lib/mock/data";

interface AboutClientCoordinatorProps {
  initialContent: AboutGeneralContent;
  principles: EngineeringPrincipleItem[];
  teamMembers: TeamMemberItem[];
}

export function AboutClientCoordinator({
  initialContent,
  principles,
  teamMembers,
}: AboutClientCoordinatorProps) {
  return (
    <div className="flex flex-col w-full pb-16">
      <AboutHero content={initialContent} />
      <VisionMission content={initialContent} />
      <CorePhilosophy content={initialContent} />
      <EngineeringPrinciples principles={principles} />
      <TeamSection members={teamMembers} />
      <OperationalHubs content={initialContent} />
      <AboutCTA content={initialContent} />
    </div>
  );
}
