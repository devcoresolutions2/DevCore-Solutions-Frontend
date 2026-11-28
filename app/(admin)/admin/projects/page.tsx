"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import { ProjectsManager } from "@/components/admin/projects/ProjectsManager";

export default function AdminProjectsPage() {
  return (
    <AdminShell>
      <ProjectsManager />
    </AdminShell>
  );
}
