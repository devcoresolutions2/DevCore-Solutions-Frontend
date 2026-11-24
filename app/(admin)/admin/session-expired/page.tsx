"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SessionExpiredView from "@/components/admin/security/SessionExpiredView";

function SessionExpiredInner() {
  const sp = useSearchParams();
  return <SessionExpiredView nextPath={sp.get("next") || undefined} />;
}

export default function AdminSessionExpiredPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-canvas)]" />}>
      <SessionExpiredInner />
    </Suspense>
  );
}
