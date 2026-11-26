import type { Metadata } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "DevCore Solutions – Software & IT Consultation",
    template: "%s | DevCore Solutions",
  },
  description:
    "Architecting scalable SaaS platforms, enterprise web applications, and AI-powered digital products.",
  keywords: [
    "DevCore Solutions",
    "SaaS Development",
    "Enterprise Software",
    "Cloud Infrastructure",
    "AI Engineering",
    "Full-Stack Web Development",
  ],
  authors: [{ name: "DevCore Solutions" }],
  creator: "DevCore Solutions",
  openGraph: {
    type: "website",
    siteName: "DevCore Solutions",
    title: "DevCore Solutions – Software & IT Consultation",
    description:
      "Architecting scalable SaaS platforms, enterprise web applications, and AI-powered digital products.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevCoreSolution",
    creator: "@DevCoreSolution",
    title: "DevCore Solutions – Software & IT Consultation",
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
        <ThemeProvider
          attribute={["class", "data-theme"]}
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}