"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={(resolvedTheme as "light" | "dark") || "system"}
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          borderColor: "var(--border-subtle)",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
        },
        className: "devcore-toast font-sans text-xs",
      }}
    />
  );
}
