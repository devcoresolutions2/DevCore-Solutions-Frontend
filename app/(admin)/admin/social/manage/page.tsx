"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import SocialManagementDashboard from "@/components/admin/social-manage/SocialManagementDashboard";

export default function AdminSocialManagePage() {
  return (
    <AdminShell>
      <SocialManagementDashboard />
    </AdminShell>
  );
}
