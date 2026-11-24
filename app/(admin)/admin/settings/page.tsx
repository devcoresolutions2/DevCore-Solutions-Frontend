"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminSettingsManager from "@/components/admin/settings/AdminSettingsManager";

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <AdminSettingsManager />
    </AdminShell>
  );
}
