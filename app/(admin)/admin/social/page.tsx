"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import SocialChannelsManager from "@/components/admin/social/SocialChannelsManager";

export default function AdminSocialPage() {
  return (
    <AdminShell>
      <SocialChannelsManager />
    </AdminShell>
  );
}
