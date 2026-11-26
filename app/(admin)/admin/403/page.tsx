"use client";

import React from "react";
import ForbiddenView from "@/components/admin/security/ForbiddenView";

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <ForbiddenView />
    </div>
  );
}
