import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/shared/Toaster";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute={["class", "data-theme"]}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
