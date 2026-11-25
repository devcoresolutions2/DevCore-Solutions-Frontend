import { ReactNode } from "react";
import { GlassNav } from "@/components/glass/GlassNav";
import { Footer } from "@/components/shared/Footer";
import { ContactHub } from "@/components/contact/ContactHub";
import { ContactHubProvider } from "@/components/contact/ContactHubContext";
import { Toaster } from "@/components/shared/Toaster";
import { getContactSettings } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const contactSettings = await getContactSettings();

  return (
    <ContactHubProvider>
      <GlassNav
        whatsappNumber={contactSettings.whatsappNumber}
        phone={contactSettings.phone}
      />

      <main id="main-content" className="flex-1 w-full pt-24 outline-none" tabIndex={-1}>
        {children}
      </main>

      <Footer />

      <ContactHub settings={contactSettings} />
      <Toaster />
    </ContactHubProvider>
  );
}