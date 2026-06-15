import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { AdminShell } from "@/components/admin/layout/admin-shell";

/**
 * Guard layout for every protected admin page. The Edge middleware already
 * blocks unauthenticated requests, but we re-check here (defence in depth) and,
 * crucially, resolve the full session user so role + identity are available to
 * the shell without a client round-trip.
 *
 * The login page lives in the sibling `(auth)` group and is NOT wrapped by this
 * layout, so it stays public and shell-free.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell
      user={{
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role,
        avatar: user.image,
        permissions: user.permissions,
      }}
    >
      {children}
    </AdminShell>
  );
}
