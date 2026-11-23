import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getContactSettings, getShowcaseList } from "@/lib/api";
import { ConfirmationView } from "@/components/contact/ConfirmationView";

export const metadata: Metadata = {
  title: "Inquiry Confirmed — DevCore Solutions",
  description: "Your engineering inquiry has been received. Our team will review your scope.",
};

interface ThankYouPageProps {
  searchParams: Promise<{
    ref?: string;
    name?: string;
    email?: string;
    company?: string;
    services?: string;
    timeline?: string;
    budget?: string;
  }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { ref, name, email, company, services, timeline, budget } = await searchParams;

  // If no dynamic submission data was provided, redirect back to /contact
  if (!ref && !name && !email) {
    redirect("/contact");
  }

  const [settings, showcase] = await Promise.all([
    getContactSettings(),
    getShowcaseList({ limit: 4 }),
  ]);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ConfirmationView
        submission={{
          fullName: name || "",
          workEmail: email || "",
          company: company || "",
          services: services ? services.split(",").filter(Boolean) : [],
          timeline: timeline || "",
          budgetTier: budget || "",
          reference: ref || "",
        }}
        settings={settings}
        relatedItems={showcase.items}
      />
    </div>
  );
}
