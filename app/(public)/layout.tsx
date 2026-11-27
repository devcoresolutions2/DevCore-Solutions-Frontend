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
      <div className="min-h-screen w-full max-w-[100vw] min-w-0 overflow-x-hidden flex flex-col">
        <GlassNav
          whatsappNumber={contactSettings.whatsappNumber}
          phone={contactSettings.phone}
        />

        <main
          id="main-content"
          className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden pt-24 sm:pt-28 outline-none"
          tabIndex={-1}
        >
          {children}
        </main>

        <Footer />

        <ContactHub settings={contactSettings} />
        <Toaster />
      </div>
    </ContactHubProvider>
  );
}