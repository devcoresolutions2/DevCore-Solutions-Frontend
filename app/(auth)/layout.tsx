import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <div className="min-h-screen flex flex-col justify-between p-6 bg-[var(--bg-canvas)]">
        <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-hover)] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Website
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12">
          {children}
        </main>

        <footer className="text-center text-xs text-[var(--text-muted)] font-mono py-4">
          &copy; {new Date().getFullYear()} DevCore Solutions Inc. Enterprise Access Control.
        </footer>
      </div>
    </ThemeProvider>
  );
}
