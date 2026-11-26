"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";

export function TechnicalSupportHub() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href="/contact"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--brand-primary)] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-mono font-medium border border-white/20 group cursor-pointer"
        title="Connect with DevCore Systems Engineers"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Wrench className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Technical Advisory</span>
      </Link>
    </div>
  );
}
