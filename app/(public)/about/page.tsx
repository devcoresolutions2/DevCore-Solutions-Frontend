import type { Metadata } from "next";
import {
  getAboutContent,
  getEngineeringPrinciples,
  getTeamMembers,
} from "@/lib/api";
import { AboutClientCoordinator } from "@/components/about/AboutClientCoordinator";

export const metadata: Metadata = {
  title: "About DevCore Solutions — Engineering Craftsmanship & Principles",
  description:
    "DevCore Solutions is an elite software engineering and systems architecture firm building the digital core for a smarter tomorrow with deterministic precision.",
};

export default async function AboutPage() {
  const [content, principles, teamMembers] = await Promise.all([
    getAboutContent(),
    getEngineeringPrinciples({ publishedOnly: true }),
    getTeamMembers({ publishedOnly: true }),
  ]);

  return (
    <main className="w-full min-h-screen">
      <AboutClientCoordinator
        initialContent={content}
        principles={principles}
        teamMembers={teamMembers}
      />
    </main>
  );
}
