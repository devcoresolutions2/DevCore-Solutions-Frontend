"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import AuditLogViewer from "@/components/admin/audit/AuditLogViewer";

export default function AdminAuditLogPage() {
  return (
    <AdminShell>
      <AuditLogViewer />
    </AdminShell>
  );
}
