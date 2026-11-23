import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute={["class", "data-theme"]}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <div className="min-h-screen w-full bg-[var(--bg-canvas)]">
        {children}
      </div>
    </ThemeProvider>
  );
}
