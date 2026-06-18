import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { TeamManager } from "@/components/admin/team/team-manager";

export const dynamic = "force-dynamic";

/** Admin Team & Roles. Requires `users:view`; mutations require `users:manage`. */
export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.USERS_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.USERS_MANAGE);

  return <TeamManager currentUserId={user?.id ?? ""} canManage={canManage} />;
}
