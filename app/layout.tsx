import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#131619" },
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
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans animate-mesh-drift">
        {children}
      </body>
    </html>
  );
}