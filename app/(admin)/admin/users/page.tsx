"use client";

import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import UsersManager from "@/components/admin/users/UsersManager";

export default function AdminUsersPage() {
  return (
    <AdminShell>
      <UsersManager />
    </AdminShell>
  );
}
