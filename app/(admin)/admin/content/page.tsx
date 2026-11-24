"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import ContentManagementHub from "@/components/admin/content/ContentManagementHub";

export default function AdminContentPage() {
  return (
    <AdminShell>
      <ContentManagementHub />
    </AdminShell>
  );
}
