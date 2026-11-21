import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { GlassNav } from "@/components/glass/GlassNav";
import { Footer } from "@/components/shared/Footer";
import { ContactHub } from "@/components/contact/ContactHub";
import { getContactSettings } from "@/lib/api";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const contactSettings = await getContactSettings();

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <GlassNav
        whatsappNumber={contactSettings.whatsappNumber}
        phone={contactSettings.phone}
      />

      <main id="main-content" className="flex-1 w-full pt-24 outline-none" tabIndex={-1}>
        {children}
      </main>

      <Footer />

      <ContactHub settings={contactSettings} />
    </ThemeProvider>
  );
}
