"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import MediaLibraryManager from "@/components/admin/media/MediaLibraryManager";

export default function AdminMediaPage() {
  return (
    <AdminShell>
      <MediaLibraryManager />
    </AdminShell>
  );
}
