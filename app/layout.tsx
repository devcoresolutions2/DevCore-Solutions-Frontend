import type { Metadata, Viewport } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6F7" },
    { media: "(prefers-color-scheme: dark)", color: "#06141B" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "DevCore Solutions — Building the Digital Core for a Smarter Tomorrow",
    template: "%s | DevCore Solutions",
  },
  description:
    "Full-stack software engineering, SaaS product development, AI automation, and enterprise web consultation studio based in Chattogram, Bangladesh.",
  keywords: [
    "DevCore Solutions",
    "Software Development Company Bangladesh",
    "Full-Stack Web Development",
    "SaaS Engineering",
    "Next.js Development Agency",
    "AI Automation",
    "Chattogram Software Firm",
    "DineDesk",
  ],
  authors: [{ name: "DevCore Solutions", url: "https://github.com/Pinon1345" }],
  creator: "DevCore Solutions",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DevCore Solutions",
    title: "DevCore Solutions — Building the Digital Core for a Smarter Tomorrow",
    description:
      "Architecting scalable SaaS platforms, enterprise web applications, and AI-powered digital products.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevCoreSolution",
    creator: "@DevCoreSolution",
    title: "DevCore Solutions — Software & IT Consultation",
    description:
      "Architecting scalable SaaS platforms, enterprise web applications, and AI-powered digital products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans animate-mesh-drift">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
