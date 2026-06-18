import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { MediaManager } from "@/components/admin/media/media-manager";

export const dynamic = "force-dynamic";

/** Admin Media Library. Requires `media:view`; uploads/edits require `media:manage`. */
export default async function MediaPage() {
  const user = await getCurrentUser();
  if (!can(user?.permissions, PERMISSIONS.MEDIA_VIEW)) notFound();

  const canManage = can(user?.permissions, PERMISSIONS.MEDIA_MANAGE);

  return <MediaManager canManage={canManage} />;
}
