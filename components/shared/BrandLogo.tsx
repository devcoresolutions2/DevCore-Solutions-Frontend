"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// Cloudinary Hosted High-Resolution Logos
export const CLOUDINARY_LOGOS = {
  light: "https://res.cloudinary.com/vrbru3ro/image/upload/v1795471039/devcore/branding/logo-light.png",
  dark: "https://res.cloudinary.com/vrbru3ro/image/upload/v1795471040/devcore/branding/logo-dark.png",
};

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string | false;
}

export function BrandLogo({
  className,
  size = "md",
  href = "/",
}: BrandLogoProps) {
  const heightClass =
    size === "sm"
      ? "h-7"
      : size === "lg"
      ? "h-11"
      : size === "xl"
      ? "h-14"
      : "h-9";

  const content = (
    <span
      className={cn(
        "inline-flex items-center group select-none transition-transform duration-200 hover:opacity-95 active:scale-[0.99]",
        className
      )}
    >
      {/* Light Mode Logo (Cloudinary CDN) */}
      <img
        src={CLOUDINARY_LOGOS.light}
        alt="DevCore Solutions"
        className={cn(
          heightClass,
          "w-auto max-w-full object-contain devcore-logo-light"
        )}
      />

      {/* Dark Mode Logo (Cloudinary CDN) */}
      <img
        src={CLOUDINARY_LOGOS.dark}
        alt="DevCore Solutions"
        className={cn(
          heightClass,
          "w-auto max-w-full object-contain devcore-logo-dark"
        )}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="DevCore Solutions Home" className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
