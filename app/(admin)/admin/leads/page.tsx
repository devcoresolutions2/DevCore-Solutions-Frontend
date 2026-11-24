"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import { LeadsManager } from "@/components/admin/leads/LeadsManager";

export default function AdminLeadsPage() {
  return (
    <AdminShell>
      <LeadsManager />
    </AdminShell>
  );
}
