import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { can, PERMISSIONS } from "@/lib/permissions";
import { HomepageEditor } from "@/components/admin/homepage/homepage-editor";

export const dynamic = "force-dynamic";

/**
 * Homepage Content Editor (`/admin/content/homepage`). Gated on
 * `homepage:manage`; the same permission unlocks editing, so without it the
 * page is simply not found.
 */
export default async function HomepageContentPage() {
  const user = await getCurrentUser();
  const canManage = can(user?.permissions, PERMISSIONS.HOMEPAGE_MANAGE);
  if (!canManage) notFound();

  return <HomepageEditor canManage={canManage} />;
}
