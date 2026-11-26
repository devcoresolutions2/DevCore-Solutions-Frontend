"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import SocialBroadcastComposer from "@/components/admin/social-broadcast/SocialBroadcastComposer";

export default function AdminSocialBroadcastPage() {
  return (
    <AdminShell>
      <SocialBroadcastComposer />
    </AdminShell>
  );
}
