import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
  hover?: boolean;
}

export function GlassCard({ children, className, as: Tag = "div", hover = true }: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "devcore-glass-card",
        hover && "hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Tag>
  );
}
